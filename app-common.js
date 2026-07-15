/**
 * app-common.js
 * 各ページで共通に使うユーティリティ群。
 * firebase-config.js の後に読み込むこと。
 */

// ---------------------------------------------------------------
// カテゴリ定義（新Firestore構造: finds コレクションの category フィールド）
// ---------------------------------------------------------------
const CATEGORIES = [
  { id: "pet_bottle", label: "ペットボトル", icon: "🧴", color: "#6FA8C7" },
  { id: "cigarette", label: "たばこ吸い殻", icon: "🚬", color: "#8B5E34" },
  { id: "can", label: "空き缶", icon: "🥫", color: "#C79A3C" },
  { id: "plastic", label: "プラスチック", icon: "🛍️", color: "#4C7A5B" },
  { id: "hazard", label: "危険物", icon: "⚠️", color: "#C0392B" },
  { id: "other", label: "その他", icon: "🗑️", color: "#9AA5B1" },
];

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

// ---------------------------------------------------------------
// 伊勢市の町名フォールバックリスト（GSI逆ジオコーディングが失敗した場合用）
// ---------------------------------------------------------------
const ISE_TOWNS = [
  "宇治館町", "宇治今在家町", "宇治浦田", "宇治中之切町", "宇治今在家",
  "御薗町", "神久", "小俣町", "常磐", "岩淵", "本町", "河崎", "曽祢",
  "八日市場町", "浦口", "船江", "吹上", "藤里町", "村松町", "二見町",
  "小俣町元町", "朝熊町", "楠部町", "中村町", "大湊町", "大世古",
];

// ---------------------------------------------------------------
// GSI（国土地理院）逆ジオコーディング。Promise.raceで古いリクエストを破棄する
// トークン方式（既存アプリの実装パターンを踏襲）
// ---------------------------------------------------------------
let __geocodeToken = 0;

async function reverseGeocodeTown(lat, lng) {
  const myToken = ++__geocodeToken;
  try {
    const res = await Promise.race([
      fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lng}`),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]);
    if (myToken !== __geocodeToken) return null; // 古いリクエストは破棄
    const data = await res.json();
    const muniCd = data?.results?.muniCd;
    const lv01 = data?.results?.lv01Nm;
    if (lv01) return lv01.replace(/^伊勢市/, "");
    return null;
  } catch (e) {
    if (myToken !== __geocodeToken) return null;
    // フォールバック: 最寄りのISE_TOWNSからランダム選択はしない。不明として扱う
    console.warn("GSI逆ジオコーディング失敗:", e.message);
    return null;
  }
}

// ---------------------------------------------------------------
// 認証ガード
// ---------------------------------------------------------------
function requireAuth(onReady) {
  showLoading("読み込み中…");
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    hideLoading();
    onReady(user);
  });
}

function showLoading(msg) {
  let el = document.getElementById("ts-loading");
  if (!el) {
    el = document.createElement("div");
    el.id = "ts-loading";
    el.className = "loading-screen";
    el.innerHTML = `<div class="spinner"></div><div class="msg">${msg || "読み込み中…"}</div>`;
    document.body.appendChild(el);
  } else {
    el.querySelector(".msg").textContent = msg || "読み込み中…";
    el.style.display = "flex";
  }
}

function hideLoading() {
  const el = document.getElementById("ts-loading");
  if (el) el.style.display = "none";
}

async function logout() {
  await auth.signOut();
  window.location.href = "login.html";
}

// ---------------------------------------------------------------
// ボトムナビ描画
// ---------------------------------------------------------------
const NAV_ITEMS = [
  { key: "home", href: "home.html", icon: "🏠", label: "ホーム" },
  { key: "map", href: "map.html", icon: "🗺️", label: "マップ" },
  { key: "ranking", href: "ranking.html", icon: "🏆", label: "ランキング" },
  { key: "mypage", href: "mypage.html", icon: "👤", label: "マイページ" },
];

function renderBottomNav(activeKey) {
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.innerHTML = NAV_ITEMS.map(
    (item) => `
    <a class="nav-item ${item.key === activeKey ? "active" : ""}" href="${item.href}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`
  ).join("");
  document.body.appendChild(nav);
}

// ---------------------------------------------------------------
// トースト通知
// ---------------------------------------------------------------
let __toastTimer = null;
function showToast(msg) {
  let el = document.getElementById("ts-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "ts-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

// ---------------------------------------------------------------
// 日付ユーティリティ
// ---------------------------------------------------------------
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return firebase.firestore.Timestamp.fromDate(d);
}

function formatDateTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

// ---------------------------------------------------------------
// 画像圧縮（base64、既存アプリの軽量化パターンを踏襲）
// 長辺 900px・JPEG品質0.6程度まで縮小してからbase64化する
// ---------------------------------------------------------------
function compressImageToBase64(file, maxSize = 900, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
