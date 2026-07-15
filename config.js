/* ============================================================
   Treasure Seeker - 共通処理
   どの画面からも呼ばれる「小さな道具」だけを置く場所。
   Firestoreへの読み書きはここには書かない（各機能ファイル側の責任にする）。
   ============================================================ */
import { DUP_RADIUS_DEG, RANKS, WASTE_TYPES } from './config.js';

// ---------- 匿名ID ----------
// 端末ごとに1つ、ランキングや自分の発見履歴を紐づけるためのID。
export function getAnonId(){
  let id = localStorage.getItem('ts_anon_id');
  if(!id){
    id = (crypto.randomUUID ? crypto.randomUUID() : 'ts-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    localStorage.setItem('ts_anon_id', id);
  }
  return id;
}
export const ANON_ID = getAnonId();

// ---------- 表示名（ランキングに出す名前） ----------
const DEFAULT_NAMES = ['エコキッド', '浄化ボランティア', 'グリーンサム', '海辺のシーカー', '町のお宝ハンター'];
export function getDisplayName(){
  let name = localStorage.getItem('ts_display_name');
  if(!name){
    name = DEFAULT_NAMES[Math.floor(Math.random()*DEFAULT_NAMES.length)];
    localStorage.setItem('ts_display_name', name);
  }
  return name;
}
export function setDisplayName(name){
  const trimmed = (name || '').trim().slice(0, 14);
  if(!trimmed) return getDisplayName();
  localStorage.setItem('ts_display_name', trimmed);
  return trimmed;
}

// ---------- トースト ----------
let toastTimer = null;
export function showToast(msg, ms = 2400){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.add('hidden'), ms);
}

// ---------- グリッドID（ヒートマップ・集計での座標丸め用） ----------
export function toGridId(lat, lng){
  return lat.toFixed(DUP_RADIUS_DEG) + '_' + lng.toFixed(DUP_RADIUS_DEG);
}

// ---------- ゴミ種別の参照 ----------
export function getWasteType(id){
  return WASTE_TYPES.find(t => t.id === id) || WASTE_TYPES[WASTE_TYPES.length - 1];
}

// ---------- ランク ----------
export function getRank(count){
  let cur = RANKS[0];
  for(const r of RANKS){ if(count >= r.min) cur = r; }
  return cur;
}
export function getNextRank(count){
  return RANKS.find(r => r.min > count) || null;
}

// ---------- 日付 ----------
// 「今日の0時」のDateを返す（今日の状況・今日のランキング集計の起点に使う）
export function getTodayStart(){
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---------- 外部スクリプトの遅延読み込み ----------
// Leaflet本体・confettiなどの重いライブラリを、実際に必要になった機能（map.js／discover.js）
// が読み込まれた時に初めて<script>タグを差し込む。index.htmlには書かない＝起動時の重さを削る。
const loadedScripts = new Map();
export function loadScriptOnce(src){
  if(loadedScripts.has(src)) return loadedScripts.get(src);
  const p = new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('script load failed: ' + src));
    document.head.appendChild(s);
  });
  loadedScripts.set(src, p);
  return p;
}
export function loadStyleOnce(href){
  if(document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

// ---------- 位置情報 ----------
export function getPositionPromise(options = {}){
  return new Promise((resolve, reject)=>{
    if(!navigator.geolocation){ reject(new Error('no geolocation')); return; }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat:pos.coords.latitude, lng:pos.coords.longitude, accuracy:pos.coords.accuracy }),
      err => reject(err),
      { enableHighAccuracy:true, timeout:15000, maximumAge:5000, ...options }
    );
  });
}

// ---------- 画像圧縮（撮影写真 → Base64 DataURL） ----------
function loadImageFromFile(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('file read error'));
    reader.onload = (e)=>{
      const img = new Image();
      img.onerror = () => reject(new Error('image decode error'));
      img.onload = () => resolve(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
function canvasToBlob(canvas, quality){
  return new Promise((resolve, reject)=>{
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/jpeg', quality);
  });
}
function blobToDataUrl(blob){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('blob read error'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
// Firestoreの1ドキュメント1MB制限に収まるよう、画質→解像度の順に段階的に下げて再試行します。
export async function compressImageToDataUrl(file, maxWidth = 1000, startQuality = 0.68, maxBytes = 700000){
  const img = await loadImageFromFile(file);
  const attempts = [
    { width: maxWidth,                  quality: startQuality },
    { width: maxWidth,                  quality: 0.5 },
    { width: Math.round(maxWidth*0.75), quality: 0.5 },
    { width: Math.round(maxWidth*0.6),  quality: 0.4 },
  ];
  let lastBlob = null;
  for(const attempt of attempts){
    let w = img.width, h = img.height;
    if(w > attempt.width){ h = Math.round(h * (attempt.width / w)); w = attempt.width; }
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    const blob = await canvasToBlob(canvas, attempt.quality);
    lastBlob = blob;
    if(blob.size <= maxBytes) break;
  }
  return await blobToDataUrl(lastBlob); // "data:image/jpeg;base64,...."
}

export function roundRectPath(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}
