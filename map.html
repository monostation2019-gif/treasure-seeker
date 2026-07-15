<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>マップ | トレジャーシーカー伊勢</title>
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600;700&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="css/style.css">
<style>
  /* Leafletのデフォルトz-indexより下部ナビ/シートを前面に出す */
  .leaflet-container{ background:var(--paper-dim); font-family:var(--font-body); }
  .leaflet-control-attribution{ font-size:9px; }
</style>
</head>
<body>

<div class="map-page-shell" id="app-shell" style="display:none;">

  <div id="map-canvas"></div>

  <div class="map-top-bar">
    <div>
      <div class="eyebrow">TREASURE SEEKER ISE</div>
      <h1>クリーンマップ</h1>
    </div>
    <div class="map-locate-btn" id="btn-locate" title="現在地に移動">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
    </div>
  </div>

  <div class="map-hint-banner" id="pick-hint">地図をタップして発見した場所を指定してください</div>

  <div class="map-legend">
    <span>少ない</span>
    <span class="bar"></span>
    <span>多い</span>
  </div>

  <button class="map-fab" id="btn-add-find">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
    発見を記録
  </button>
</div>

<div class="splash" id="loading-splash">
  <div class="spinner"></div>
  <div style="font-weight:700;">地図を読み込み中...</div>
</div>

<!-- 発見登録シート -->
<div class="modal-backdrop" id="find-modal" style="display:none;">
  <div class="modal-sheet">
    <h3 style="margin-bottom:2px;">ゴミの発見を記録</h3>
    <div class="coord-readout" id="coord-readout">位置情報を取得中...</div>

    <div class="field-label" style="margin-top:14px;">種類を選んでください</div>
    <div class="category-grid" id="category-grid"></div>

    <div class="sheet-row">
      <button class="btn btn-outline" id="btn-cancel-find">キャンセル</button>
      <button class="btn btn-primary" id="btn-submit-find" disabled>この内容で記録する</button>
    </div>
  </div>
</div>

<!-- 下部ナビゲーション -->
<nav class="bottom-nav">
  <a href="home.html" class="nav-item">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>
    ホーム<span class="nav-dot"></span>
  </a>
  <a href="map.html" class="nav-item active">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
    マップ<span class="nav-dot"></span>
  </a>
  <a href="stamp.html" class="nav-item">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5 6 22l6-3 6 3-2.5-8.5"/></svg>
    スタンプ帳<span class="nav-dot"></span>
  </a>
  <a href="ranking.html" class="nav-item">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a3 3 0 0 0 3 5"/><path d="M17 6h3a3 3 0 0 1-3 5"/></svg>
    ランキング<span class="nav-dot"></span>
  </a>
  <a href="mypage.html" class="nav-item">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>
    マイページ<span class="nav-dot"></span>
  </a>
</nav>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/util.js"></script>
<script src="js/auth-guard.js"></script>
<script>
const $ = (id) => document.getElementById(id);

/* ---- グリッド集計の解像度(約400m四方) ---- */
const GRID_RES = 0.0035;
const gridToKey = (lat, lng) => `${Math.round(lat / GRID_RES)}_${Math.round(lng / GRID_RES)}`;
const keyToCenter = (key) => {
  const [gy, gx] = key.split("_").map(Number);
  return [gy * GRID_RES, gx * GRID_RES];
};

let map, gridLayer;
const gridData = {}; // key -> { count, lastCategory }
const gridMarkers = {}; // key -> L.circleMarker

let tempMarker = null;   // 新規登録時の仮ピン
let pickedLatLng = null; // 登録確定前の座標
let selectedCategory = null;
let pickModeActive = false;

function initMap() {
  map = L.map("map-canvas", { zoomControl: false, attributionControl: true })
    .setView([34.4553, 136.7256], 14); // 伊勢神宮 内宮 付近を初期表示

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  gridLayer = L.layerGroup().addTo(map);

  map.on("click", (e) => {
    if (!pickModeActive) return;
    setPickedLocation(e.latlng.lat, e.latlng.lng);
  });
}

/* ---- 既存の発見データを読み込んでヒートマップ化 ---- */
async function loadFinds() {
  try {
    const snap = await db.collection("finds")
      .orderBy("createdAt", "desc")
      .limit(1000)
      .get();

    snap.forEach((doc) => {
      const d = doc.data();
      if (typeof d.lat !== "number" || typeof d.lng !== "number") return;
      const key = gridToKey(d.lat, d.lng);
      if (!gridData[key]) gridData[key] = { count: 0, lastCategory: d.category };
      gridData[key].count += 1;
    });

    renderGrid();
  } catch (err) {
    console.error(err);
    showToast("マップデータの取得に失敗しました");
  }
}

function renderGrid() {
  gridLayer.clearLayers();
  Object.keys(gridMarkers).forEach(k => delete gridMarkers[k]);

  Object.entries(gridData).forEach(([key, info]) => {
    const [lat, lng] = keyToCenter(key);
    const radius = Math.min(10 + info.count * 2.2, 34);
    const marker = L.circleMarker([lat, lng], {
      radius,
      color: "rgba(43,42,38,0.25)",
      weight: 1,
      fillColor: resolveHeatColor(info.count),
      fillOpacity: 0.62
    }).addTo(gridLayer);

    marker.bindPopup(
      `<div style="font-family:sans-serif;font-size:12px;">` +
      `<b>${info.count}件</b>の発見<br>直近の種類: ${getGomiIcon(info.lastCategory)} ${getGomiLabel(info.lastCategory)}` +
      `</div>`
    );
    gridMarkers[key] = marker;
  });
}

/* getHeatColor() はCSS変数文字列を返すため、Leaflet用に実色へ変換 */
function resolveHeatColor(count) {
  const varName = getHeatColor(count).match(/--[\w-]+/)[0];
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/* ---- 現在地ボタン ---- */
$("btn-locate").addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("この端末では位置情報を利用できません");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => map.flyTo([pos.coords.latitude, pos.coords.longitude], 16),
    () => showToast("現在地を取得できませんでした"),
    { enableHighAccuracy: true, timeout: 8000 }
  );
});

/* ---- 発見を記録するフロー ---- */
$("btn-add-find").addEventListener("click", () => {
  if (!navigator.geolocation) {
    enterPickMode();
    return;
  }
  showToast("現在地を取得しています...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setPickedLocation(pos.coords.latitude, pos.coords.longitude);
      map.flyTo([pos.coords.latitude, pos.coords.longitude], 17);
    },
    () => {
      showToast("現在地を取得できませんでした。地図をタップして場所を指定してください。");
      enterPickMode();
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
});

function enterPickMode() {
  pickModeActive = true;
  $("pick-hint").classList.add("show");
}

function setPickedLocation(lat, lng) {
  pickModeActive = false;
  $("pick-hint").classList.remove("show");
  pickedLatLng = { lat, lng };

  if (tempMarker) map.removeLayer(tempMarker);
  tempMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
  tempMarker.on("dragend", () => {
    const p = tempMarker.getLatLng();
    pickedLatLng = { lat: p.lat, lng: p.lng };
    updateCoordReadout();
  });

  updateCoordReadout();
  openFindModal();
}

function updateCoordReadout() {
  if (!pickedLatLng) return;
  $("coord-readout").textContent =
    `緯度 ${pickedLatLng.lat.toFixed(5)} / 経度 ${pickedLatLng.lng.toFixed(5)}（ピンをドラッグして位置を調整できます）`;
}

function buildCategoryGrid() {
  const grid = $("category-grid");
  grid.innerHTML = "";
  GOMI_TYPES.forEach((t) => {
    const chip = document.createElement("div");
    chip.className = "category-chip";
    chip.dataset.id = t.id;
    chip.innerHTML = `<span class="emoji">${t.icon}</span><span>${t.label}</span>`;
    chip.addEventListener("click", () => {
      selectedCategory = t.id;
      [...grid.children].forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      $("btn-submit-find").disabled = false;
    });
    grid.appendChild(chip);
  });
}

function openFindModal() {
  selectedCategory = null;
  $("btn-submit-find").disabled = true;
  $("find-modal").style.display = "flex";
}

function closeFindModal() {
  $("find-modal").style.display = "none";
  if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
  pickedLatLng = null;
}

$("btn-cancel-find").addEventListener("click", closeFindModal);

$("btn-submit-find").addEventListener("click", async () => {
  if (!pickedLatLng || !selectedCategory || !window.currentUser) return;

  const btn = $("btn-submit-find");
  btn.disabled = true;
  btn.textContent = "記録中...";

  try {
    const userRef = db.collection("users").doc(window.currentUser.uid);
    const userDoc = await userRef.get();
    const username = userDoc.exists ? (userDoc.data().username || "冒険者") : "冒険者";

    await db.collection("finds").add({
      uid: window.currentUser.uid,
      username,
      lat: pickedLatLng.lat,
      lng: pickedLatLng.lng,
      category: selectedCategory,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    await userRef.update({
      totalFinds: firebase.firestore.FieldValue.increment(1)
    });

    // 画面上のヒートマップにその場で反映(再取得はしない)
    const key = gridToKey(pickedLatLng.lat, pickedLatLng.lng);
    if (!gridData[key]) gridData[key] = { count: 0, lastCategory: selectedCategory };
    gridData[key].count += 1;
    gridData[key].lastCategory = selectedCategory;
    renderGrid();

    showToast("記録しました！ありがとうございます");
    closeFindModal();
  } catch (err) {
    console.error(err);
    showToast("記録に失敗しました。もう一度お試しください。");
  } finally {
    btn.disabled = false;
    btn.textContent = "この内容で記録する";
  }
});

/* ---- 起動処理 ---- */
document.addEventListener("auth-ready", async () => {
  initMap();
  buildCategoryGrid();
  await loadFinds();
  $("loading-splash").style.display = "none";
  $("app-shell").style.display = "block";
  setTimeout(() => map.invalidateSize(), 50);
});
</script>
</body>
</html>
