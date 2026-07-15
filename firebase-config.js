/**
 * firebase-config.js
 * ------------------------------------------------------------
 * 「トレジャーシーカー伊勢」用 Firebase 初期化ファイル
 *
 * ★ここを書き換えてください★
 * 既存の「伊勢まちみっけ」Firebaseプロジェクトに上書きする場合:
 *   Firebase Console → プロジェクトの設定(歯車) → 全般 → 「マイアプリ」
 *   → 該当のWebアプリの「SDK の設定と構成」→ firebaseConfig の値をコピーして
 *   下の YOUR_XXXX 部分を置き換えてください。
 *
 * 新規プロジェクトを使う場合は、Firebase Consoleで新規プロジェクトを作成し、
 * Authentication で Google / Apple / 匿名(ゲスト) を有効化、
 * Firestore Database を「本番環境モード」で作成してから、
 * このファイルの値を設定してください。
 * ------------------------------------------------------------
 */

const firebaseConfig = {
  apiKey: "AIzaSyB7f8QThoqYc-iDuMhKqp3MGBRAhln9ZhI",
  authDomain: "treasure-seeker-ise.firebaseapp.com",
  projectId: "treasure-seeker-ise",
  storageBucket: "treasure-seeker-ise.firebasestorage.app",
  messagingSenderId: "278199675502",
  appId: "1:278199675502:web:295dfa975a03707f27947f",
};

// ------------------------------------------------------------
// 設定がまだ書き換えられていない場合は、エラーで無限ローディングに
// ならないよう、画面上にはっきり分かるバナーを出して止める。
// ------------------------------------------------------------
function isPlaceholderConfig(cfg) {
  return Object.values(cfg).some((v) => typeof v === "string" && v.startsWith("YOUR_"));
}

function showConfigMissingBanner() {
  const render = () => {
    const banner = document.createElement("div");
    banner.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:9999;background:#C0392B;color:#fff;" +
      "padding:14px 16px;font-size:13px;line-height:1.6;font-family:sans-serif;text-align:left;";
    banner.innerHTML =
      "⚠️ Firebaseの設定が未入力です。<br>" +
      "shared/firebase-config.js の firebaseConfig の値を、Firebaseコンソールの実際の値に書き換えてください。" +
      "（現在は YOUR_API_KEY などの仮の値のままです）";
    document.body.prepend(banner);
  };
  if (document.body) render();
  else document.addEventListener("DOMContentLoaded", render);
}

window.__TS_ISE_CONFIG_OK__ = !isPlaceholderConfig(firebaseConfig);

if (!window.__TS_ISE_CONFIG_OK__) {
  showConfigMissingBanner();
}

// 二重初期化を防ぐ（複数ページから読み込まれるため）
if (!window.__TS_ISE_FIREBASE_INITIALIZED__) {
  firebase.initializeApp(firebaseConfig);
  window.__TS_ISE_FIREBASE_INITIALIZED__ = true;
}

const auth = firebase.auth();
const db = firebase.firestore();

// Firestoreのオフラインキャッシュを有効化（軽量化・オフライン耐性のため）
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  console.warn("Firestore persistence not enabled:", err.code);
});

// Apple / Google プロバイダ
const googleProvider = new firebase.auth.GoogleAuthProvider();
const appleProvider = new firebase.auth.OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");
