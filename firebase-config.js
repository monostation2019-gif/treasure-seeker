/* =========================================================
   Firebase 設定 (treasure-seeker-ise プロジェクト)
   ========================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyB7f8QThoqYc-iDuMhKqp3MGBRAhln9ZhI",
  authDomain: "treasure-seeker-ise.firebaseapp.com",
  projectId: "treasure-seeker-ise",
  storageBucket: "treasure-seeker-ise.firebasestorage.app",
  messagingSenderId: "278199675502",
  appId: "1:278199675502:web:295dfa975a03707f27947f"
};

// compat SDK は読み込み済み前提(各HTMLの<head>でCDN読み込み)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// オフライン時の白画面/固まりを防ぐための軽い永続化設定
db.enablePersistence({ synchronizeTabs: true }).catch(() => {
  /* 複数タブ等で失敗しても致命的ではないため握りつぶす */
});
