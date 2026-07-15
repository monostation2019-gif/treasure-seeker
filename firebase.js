/* ============================================================
   Treasure Seeker - マイページ（スタンプ帳）
   ランク・バッジ・自分の発見履歴に加えて、下部ナビのバッジ数（ヘッダーの累計）も
   このファイルが一元管理します。「自分の発見数」に関する状態はここに集約する方針です。
   ============================================================ */
import { db } from './firebase.js';
import {
  collection, query, where, orderBy, limit, getDocs, getCountFromServer, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { RANKS } from './config.js';
import { ANON_ID, getRank, getNextRank, getWasteType } from './utils.js';
// map.jsは「マップ表示」に必要な重い初期化を含むため、ここでは静的importせず、
// サムネイルがタップされた瞬間だけ動的importします（マイページ表示の軽量化のため）。

let myStampCount = 0;

export function getLocalStampCount(){ return myStampCount; }
export function setLocalStampCount(n){
  myStampCount = Math.max(0, n);
  paintHeaderBadge(myStampCount);
  return myStampCount;
}
export function incrementLocalStampCount(){ return setLocalStampCount(myStampCount + 1); }
export function decrementLocalStampCount(){ return setLocalStampCount(myStampCount - 1); }

function paintHeaderBadge(count){
  const rank = getRank(count);
  const iconEl = document.getElementById('header-rank-icon');
  const countEl = document.getElementById('header-rank-count');
  if(iconEl) iconEl.textContent = rank.icon;
  if(countEl) countEl.textContent = count;
}

async function fetchMyStampCount(){
  try{
    const q = query(collection(db, 'discoveries'), where('anonId', '==', ANON_ID));
    const snap = await getCountFromServer(q);
    return snap.data().count;
  }catch(e){
    console.error('count fetch failed', e);
    return myStampCount; // 通信失敗時はローカル値を維持
  }
}

// サーバーの実際の値でヘッダーバッジを同期する（起動時・マイページを開いた時に呼ぶ）
export async function refreshHeaderRank(){
  const count = await fetchMyStampCount();
  setLocalStampCount(count);
  return { count, rank: getRank(count) };
}

function els(){
  return {
    icon: document.getElementById('stamp-modal-icon'),
    rankName: document.getElementById('stamp-modal-rank'),
    count: document.getElementById('stamp-modal-count'),
    fill: document.getElementById('rank-progress-fill'),
    label: document.getElementById('rank-progress-label'),
    badgeGrid: document.getElementById('badge-grid'),
    myGrid: document.getElementById('my-discoveries-grid'),
  };
}

function renderRankPanel(count){
  const { icon, rankName, count: countEl, fill, label, badgeGrid } = els();
  const rank = getRank(count);
  const next = getNextRank(count);

  icon.textContent = rank.icon;
  rankName.textContent = rank.name;
  countEl.textContent = count;

  if(next){
    const prevMin = rank.min;
    const pct = Math.min(100, Math.round(((count - prevMin) / (next.min - prevMin)) * 100));
    fill.style.width = pct + '%';
    label.textContent = `次の「${next.name}」まであと${next.min - count}個`;
  }else{
    fill.style.width = '100%';
    label.textContent = '最高ランクに到達しました！';
  }

  badgeGrid.innerHTML = '';
  RANKS.forEach(r=>{
    const earned = count >= r.min;
    const el = document.createElement('div');
    el.className = 'badge-item' + (earned ? ' earned' : '');
    el.innerHTML = `<span class="emoji">${r.icon}</span><span>${r.name}</span>`;
    badgeGrid.appendChild(el);
  });
}

async function loadMyDiscoveriesGrid(){
  const { myGrid } = els();
  myGrid.innerHTML = '<div class="my-disc-msg">読み込んでいます…</div>';
  try{
    const q = query(
      collection(db, 'discoveries'),
      where('anonId', '==', ANON_ID),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const snap = await getDocs(q);
    if(snap.empty){
      myGrid.innerHTML = '<div class="my-disc-msg">まだ発見記録がありません</div>';
      return;
    }
    myGrid.innerHTML = '';
    snap.docs.forEach(docSnap=>{
      const data = docSnap.data();
      const loc = data.location;
      if(!loc) return;
      const type = getWasteType(data.wasteType);

      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'my-disc-item';
      item.setAttribute('aria-label', `${type.label}を見つけた場所へ地図を移動`);
      item.innerHTML = `<span class="my-disc-emoji">${type.emoji}</span>`;
      item.addEventListener('click', async ()=>{
        closeStampModal();
        document.getElementById('nav-map-btn').click();
        const { panTo } = await import('./map.js');
        panTo(loc.latitude, loc.longitude, 17);
      });
      myGrid.appendChild(item);

      // サムネイルは個別取得（一覧取得自体を軽く保つため）
      getDoc(doc(db, 'discoveryPhotos', docSnap.id)).then(photoSnap=>{
        if(photoSnap.exists()){
          item.innerHTML = `<img class="my-disc-thumb" src="${photoSnap.data().imageDataUrl}" alt="">`;
        }
      }).catch(()=>{ /* サムネイルが取れなくても絵文字のままでよい */ });
    });
  }catch(err){
    console.error('my discoveries fetch failed', err);
    myGrid.innerHTML = '<div class="my-disc-msg">読み込みに失敗しました</div>';
  }
}

export function closeStampModal(){
  document.getElementById('stamp-modal').classList.add('hidden');
}

export async function openStampModal(){
  document.getElementById('stamp-modal').classList.remove('hidden');
  const count = await fetchMyStampCount();
  setLocalStampCount(count);
  renderRankPanel(count);
  loadMyDiscoveriesGrid();
}

export function initStampNav(){
  document.getElementById('rank-badge-btn').addEventListener('click', ()=>{
    document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
    document.getElementById('rank-badge-btn').classList.add('active');
    openStampModal();
  });
  document.getElementById('stamp-close').addEventListener('click', ()=>{
    closeStampModal();
    document.getElementById('nav-map-btn').classList.add('active');
    document.getElementById('rank-badge-btn').classList.remove('active');
  });
}
