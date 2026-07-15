/* =========================================================
   認証ガード
   home / map / stamp / ranking / mypage の各ページで読み込む。
   ・未ログイン → login.html へ即リダイレクト
   ・ログイン済 → window.currentUser にセットし、
     'auth-ready' イベントを発火(各ページはこれを待って描画する)
   リスナーは1つだけ・1回だけ処理して即解除することで
   「まちみっけ」で起きたような多重初期化の重さを避ける。
   ========================================================= */
window.currentUser = null;

(function () {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    unsubscribe(); // 初回の状態確定だけを見る。以後の変化は各ページで個別対応。
    if (!user) {
      location.replace("login.html");
      return;
    }
    window.currentUser = user;
    document.dispatchEvent(new CustomEvent("auth-ready", { detail: { user } }));
  });
})();
