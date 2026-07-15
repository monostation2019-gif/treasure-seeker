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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

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
