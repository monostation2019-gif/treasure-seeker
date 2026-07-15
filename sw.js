/* ============================================================
   Treasure Seeker - ホーム画面
   画像の「今日の状況」カード＋「今日の発見数ランキング」に対応。
   タブが開かれた時だけ動的importされるので、マップ表示の初速には影響しません。
   ============================================================ */
import { db } from './firebase.js';
import {
  collection, query, where, orderBy, limit, getDocs, getCountFromServer, doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { RANKING_FETCH_LIMIT, RANK_MEDALS } from './config.js';
import { ANON_ID, getDisplayName, getTodayStart, showToast } from './utils.js';

let initialized = false;
let elCache = null;

function els(){
  if(elCache) return elCache;
  elCache = {
    screen: document.getElementById('screen-home'),
    todayFound: document.getElementById('home-today-found'),
    todayCollected: document.getElementById('home-today-collected'),
    rankingList: document.getElementById('home-ranking-list'),
    nickBtn: document.getElementById('home-nickname-btn'),
  };
  return elCache;
}

// 自分の表示名をusersコレクションに反映（ランキングで他の人に名前が見えるようにする）
async function ensureUserDoc(){
  try{
    await setDoc(doc(db, 'users', ANON_ID), { displayName: getDisplayName() }, { merge:true });
  }catch(e){
    console.warn('ensureUserDoc failed', e);
  }
}

async function loadTodayStats(){
  const { todayFound, todayCollected } = els();
  const todayStart = getTodayStart();

  try{
    const foundQ = query(collection(db, 'discoveries'), where('createdAt', '>=', todayStart));
    const foundSnap = await getCountFromServer(foundQ);
    todayFound.textContent = foundSnap.data().count;
  }catch(e){
    console.error('today found count failed', e);
    todayFound.textContent = '-';
  }

  try{
    // collected(回収済み)は範囲検索(createdAt)＋等価検索(collected)の複合条件のため、
    // 初回実行時にFirestoreコンソールへの複合インデックス作成を促されることがあります。
    // エラーメッセージ内のリンクをクリックすればワンタップで作成できます。
    const collectedQ = query(
      collection(db, 'discoveries'),
      where('createdAt', '>=', todayStart),
      where('collected', '==', true)
    );
    const collectedSnap = await getCountFromServer(collectedQ);
    todayCollected.textContent = collectedSnap.data().count;
  }catch(e){
    console.error('today collected count failed', e);
    todayCollected.textContent = '-';
  }
}

async function loadTodayRanking(){
  const { rankingList } = els();
  rankingList.innerHTML = '<div class="home-ranking-msg">読み込んでいます…</div>';

  try{
    const todayStart = getTodayStart();
    const q = query(
      collection(db, 'discoveries'),
      where('createdAt', '>=', todayStart),
      orderBy('createdAt', 'desc'),
      limit(RANKING_FETCH_LIMIT)
    );
    const snap = await getDocs(q);

    if(snap.empty){
      rankingList.innerHTML = '<div class="home-ranking-msg">今日はまだ発見報告がありません</div>';
      return;
    }

    // anonIdごとに件数を集計
    const counts = new Map();
    snap.forEach(d=>{
      const anonId = d.data().anonId;
      if(!anonId) return;
      counts.set(anonId, (counts.get(anonId) || 0) + 1);
    });

    const sorted = [...counts.entries()].sort((a,b)=> b[1]-a[1]).slice(0, 5);

    // 表示名をusersコレクションから取得（自分の分はローカルにあるので通信を省く）
    const rows = await Promise.all(sorted.map(async ([anonId, count])=>{
      let name = '匿名シーカー';
      if(anonId === ANON_ID){
        name = getDisplayName();
      }else{
        try{
          const uSnap = await getDoc(doc(db, 'users', anonId));
          if(uSnap.exists() && uSnap.data().displayName) name = uSnap.data().displayName;
        }catch(e){ /* 取得できなくても匿名表示のままでよい */ }
      }
      return { name, count, isMe: anonId === ANON_ID };
    }));

    rankingList.innerHTML = '';
    rows.forEach((row, i)=>{
      const medal = RANK_MEDALS[i] || `${i+1}`;
      const item = document.createElement('div');
      item.className = 'home-rank-row' + (row.isMe ? ' is-me' : '');
      item.innerHTML = `
        <span class="home-rank-medal">${medal}</span>
        <span class="home-rank-avatar">🧑</span>
        <span class="home-rank-name">${row.name}${row.isMe ? '（あなた）' : ''}</span>
        <span class="home-rank-count">${row.count}<small>個</small></span>
      `;
      rankingList.appendChild(item);
    });
  }catch(err){
    console.error('today ranking failed', err);
    rankingList.innerHTML = '<div class="home-ranking-msg">読み込みに失敗しました</div>';
  }
}

function wireNicknameEdit(){
  const { nickBtn } = els();
  if(!nickBtn || nickBtn.dataset.wired) return;
  nickBtn.dataset.wired = '1';
  nickBtn.addEventListener('click', async ()=>{
    const current = getDisplayName();
    const next = prompt('ランキングに表示する名前を入力してください（14文字まで）', current);
    if(next === null) return;
    const { setDisplayName } = await import('./utils.js');
    const saved = setDisplayName(next);
    nickBtn.textContent = `👤 ${saved}`;
    await ensureUserDoc();
    showToast('名前を更新しました');
    loadTodayRanking();
  });
}

export async function initHome(){
  const { nickBtn } = els();
  if(nickBtn) nickBtn.textContent = `👤 ${getDisplayName()}`;
  wireNicknameEdit();
  if(!initialized){
    initialized = true;
    await ensureUserDoc();
  }
  await Promise.all([loadTodayStats(), loadTodayRanking()]);
}

// 発見報告直後にホームの数字も更新したい場合に呼べるように公開しておく
export function refreshHomeStats(){
  if(!elCache) return; // ホーム画面がまだ一度も開かれていなければ何もしない
  loadTodayStats();
  loadTodayRanking();
}
