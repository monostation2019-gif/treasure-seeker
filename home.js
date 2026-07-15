/* ============================================================
   Treasure Seeker - さんぽ＆クリーンマップ
   画像のマップ画面（ヒートマップ・ホットスポット件数・カテゴリ別集計）に対応。
   Leaflet本体はindex.htmlで先に<script>読み込み済みという前提（window.Lを使う）。
   ============================================================ */
import { db } from './firebase.js';
import { collection, query, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { DEFAULT_CENTER, MAP_FETCH_LIMIT, QUICK_STAT_TYPE_IDS } from './config.js';
import { getWasteType, toGridId, showToast, getPositionPromise, loadScriptOnce, loadStyleOnce } from './utils.js';

// Leaflet本体はindex.htmlでは読み込まず、マップタブが初めて開かれた時にここで読み込みます。
async function ensureLeafletLoaded(){
  loadStyleOnce('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  if(window.L && window.L.heatLayer) return;
  await loadScriptOnce('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  await loadScriptOnce('https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js');
}

let map = null;
let meMarker = null;
let markerLayer = null;
let heatLayer = null;
let currentPos = null;
let lastFetchedAt = 0;
let initialized = false;

export function getCurrentPos(){ return currentPos; }

// 発見報告時に「直近取得済みの位置」を待たせずに使い回すためのヘルパー
export function getCurrentLocationFast(){
  if(currentPos && (Date.now() - currentPos.ts) < 20000){
    return Promise.resolve(currentPos);
  }
  return getPositionPromise();
}

function updateMeMarker(lat, lng){
  if(meMarker){ meMarker.setLatLng([lat, lng]); return; }
  const icon = L.divIcon({
    className:'', html:'<div class="ts-pin me"><span>🧭</span></div>',
    iconSize:[34,34], iconAnchor:[17,34]
  });
  meMarker = L.marker([lat, lng], { icon, zIndexOffset:1000 }).addTo(map);
}

export function locateMe(recenter = true){
  if(!navigator.geolocation){ showToast('この端末では位置情報が使えません'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      currentPos = { lat:pos.coords.latitude, lng:pos.coords.longitude, accuracy:pos.coords.accuracy, ts:Date.now() };
      updateMeMarker(currentPos.lat, currentPos.lng);
      if(recenter && map) map.setView([currentPos.lat, currentPos.lng], Math.max(map.getZoom(), 16));
    },
    (err)=> console.warn('geolocation error', err),
    { enableHighAccuracy:true, timeout:12000, maximumAge:15000 }
  );
}

function updateQuickStats(discoveries){
  // 画像下部の「ペットボトル／たばこ吸い殻／空き缶」集計チップ
  const counts = {};
  QUICK_STAT_TYPE_IDS.forEach(id => counts[id] = 0);
  discoveries.forEach(d => { if(counts[d.wasteType] !== undefined) counts[d.wasteType]++; });

  QUICK_STAT_TYPE_IDS.forEach(id=>{
    const el = document.getElementById(`quickstat-${id}`);
    if(el) el.textContent = counts[id];
  });
}

function updateHotspotBadge(discoveries){
  // グリッドIDごとに件数を数え、最も多いエリアの件数を「ホットスポット」として表示
  const gridCounts = new Map();
  discoveries.forEach(d=>{
    if(!d.location) return;
    const gid = toGridId(d.location.latitude, d.location.longitude);
    gridCounts.set(gid, (gridCounts.get(gid) || 0) + 1);
  });
  const max = gridCounts.size ? Math.max(...gridCounts.values()) : 0;
  const el = document.getElementById('map-hotspot-count');
  if(el) el.textContent = max;
}

export async function loadNearbyDiscoveries(force = false){
  const now = Date.now();
  if(!force && now - lastFetchedAt < 8000) return; // moveend連打対策
  lastFetchedAt = now;

  try{
    // MVPでは「直近作成順に上限件数」で取得し、無料枠を保護します。
    const q = query(collection(db, 'discoveries'), limit(MAP_FETCH_LIMIT));
    const snap = await getDocs(q);

    markerLayer.clearLayers();
    const heatPoints = [];
    const discoveries = [];

    snap.forEach(docSnap=>{
      const d = docSnap.data();
      if(!d.location) return;
      discoveries.push(d);

      const lat = d.location.latitude, lng = d.location.longitude;
      const type = getWasteType(d.wasteType);
      const icon = L.divIcon({
        className:'', html:`<div class="ts-pin"><span>${type.emoji}</span></div>`,
        iconSize:[34,34], iconAnchor:[17,34]
      });
      L.marker([lat, lng], { icon }).addTo(markerLayer)
        .bindPopup(`<b>${type.label}</b><br><span style="font-size:12px;color:#8A7B68;">${d.collected ? '回収済み' : '未回収の可能性あり'}</span>`);

      heatPoints.push([lat, lng, 0.6]);
    });

    if(heatLayer) map.removeLayer(heatLayer);
    if(heatPoints.length){
      heatLayer = L.heatLayer(heatPoints, { radius:28, blur:22, maxZoom:17, minOpacity:0.25 }).addTo(map);
    }

    updateQuickStats(discoveries);
    updateHotspotBadge(discoveries);
  }catch(e){
    console.error('loadNearbyDiscoveries failed', e);
    // Firebase未設定時などはここで静かに失敗させる（地図の基本表示は継続させる）
  }
}

export async function initMap(){
  if(initialized) return; // 2回目以降のタブ切替では地図を作り直さない（軽量化の要）
  initialized = true;

  await ensureLeafletLoaded();

  map = L.map('map', { zoomControl:false, attributionControl:true }).setView(DEFAULT_CENTER, 15);
  L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: '地図: <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
    maxZoom: 18
  }).addTo(map);
  L.control.zoom({ position:'bottomright' }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  document.getElementById('locate-btn').addEventListener('click', ()=> locateMe(true));
  map.on('moveend', ()=> loadNearbyDiscoveries());

  locateMe(true);
  loadNearbyDiscoveries(true);
}

// タブが再表示された時にLeafletのタイルが崩れる問題への対処
export function invalidateMapSize(){
  if(map) setTimeout(()=> map.invalidateSize(), 80);
}

export function panTo(lat, lng, zoom = 17){
  if(map) map.setView([lat, lng], zoom);
}
