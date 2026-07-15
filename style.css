/* =========================================================
   トレジャーシーカー伊勢 - 共通スタイル
   軽量PWA / 単一責務のCSSファイル(全ページ共有・キャッシュされる)
   ========================================================= */

:root{
  /* --- カラートークン --- */
  --paper:      #F0EEE1;   /* 和紙のようなベース色 */
  --paper-dim:  #E7E3D3;   /* カードの下地 */
  --forest:     #3F6B4F;   /* 森の深緑(ブランドメイン) */
  --forest-dark:#2C4D38;
  --sea:        #4A7C93;   /* 志摩の海の青(セカンダリ) */
  --torii:      #B54A2C;   /* 鳥居の朱色(アクセント/CTA) */
  --torii-dark: #8F3A22;
  --cedar:      #B08968;   /* 杉の木肌(ボーダー/木目) */
  --cedar-dark: #7C5F45;
  --sumi:       #2B2A26;   /* 墨色(本文テキスト) */
  --sumi-soft:  #5C5A52;   /* 補助テキスト */
  --white:      #FFFFFF;
  --danger:     #B23A2E;

  /* 5段階ヒートマップカラー(少←→多) */
  --heat-1: #6FA97C; /* 少ない */
  --heat-2: #A9B76A;
  --heat-3: #D9B25C;
  --heat-4: #D98A4A;
  --heat-5: #C1442E; /* 多い */

  --radius-s: 10px;
  --radius-m: 16px;
  --radius-l: 24px;
  --shadow-card: 0 4px 16px rgba(43,42,38,0.10);
  --shadow-nav: 0 -2px 12px rgba(43,42,38,0.14);

  --font-display: "Shippori Mincho", serif;
  --font-body: "Zen Maru Gothic", "Hiragino Maru Gothic ProN", sans-serif;
}

*{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }

html,body{
  margin:0; padding:0;
  width:100%; min-height:100%;
  background:var(--paper);
  color:var(--sumi);
  font-family:var(--font-body);
  -webkit-font-smoothing:antialiased;
  overscroll-behavior-y: none;
}

body{
  padding-bottom: 84px; /* 下部ナビ分の余白 */
}

h1,h2,h3{
  font-family:var(--font-display);
  color:var(--forest-dark);
  margin:0 0 8px;
  letter-spacing:.02em;
}

a{ color:inherit; text-decoration:none; }
button{ font-family:inherit; }

img{ max-width:100%; display:block; }

/* --- レイアウト共通 --- */
.app-shell{
  max-width:480px;
  margin:0 auto;
  min-height:100vh;
  position:relative;
  background:var(--paper);
}

.page-header{
  padding:20px 20px 12px;
  background:var(--paper);
}
.page-header .eyebrow{
  font-size:12px;
  color:var(--sea);
  font-weight:700;
  letter-spacing:.08em;
}
.page-header h1{ font-size:22px; }

.section{ padding:8px 20px 20px; }

/* --- カード --- */
.card{
  background:var(--white);
  border-radius:var(--radius-m);
  box-shadow:var(--shadow-card);
  padding:16px;
  border:1px solid rgba(176,137,104,0.18);
}

.stat-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}
.stat-card{
  background:var(--white);
  border-radius:var(--radius-m);
  padding:14px 16px;
  box-shadow:var(--shadow-card);
  border:1px solid rgba(176,137,104,0.18);
}
.stat-card .label{
  font-size:12px; color:var(--sumi-soft); font-weight:700;
}
.stat-card .value{
  font-family:var(--font-display);
  font-size:26px; color:var(--forest-dark);
  margin-top:2px;
}
.stat-card .value small{ font-size:14px; font-weight:400; }

/* --- ボタン --- */
.btn{
  display:flex; align-items:center; justify-content:center;
  gap:10px;
  width:100%;
  padding:14px 18px;
  border-radius:999px;
  border:none;
  font-size:15px;
  font-weight:700;
  cursor:pointer;
  transition:transform .12s ease, filter .12s ease;
}
.btn:active{ transform:scale(0.97); }
.btn:disabled{ opacity:.55; cursor:not-allowed; transform:none; }

.btn-primary{ background:var(--torii); color:var(--white); }
.btn-primary:hover{ filter:brightness(1.05); }

.btn-outline{
  background:var(--white);
  color:var(--sumi);
  border:1.5px solid rgba(43,42,38,0.18);
}

.btn-icon{
  width:20px; height:20px; flex:0 0 auto;
}

/* --- ログインページ専用 --- */
.login-screen{
  min-height:100vh;
  position:relative;
  display:flex; flex-direction:column; justify-content:flex-end;
  background-image:
    linear-gradient(to bottom, rgba(20,30,22,0.05) 0%, rgba(20,25,20,0.15) 55%, rgba(18,22,18,0.72) 100%),
    url("../img/login-bg.jpg");
  background-size:cover;
  background-position:center;
  max-width:480px;
  margin:0 auto;
  padding-bottom:0;
}

.login-brand{
  padding:56px 24px 0;
  text-align:center;
  color:var(--white);
}
.login-brand .torii-mark{ width:34px; height:34px; margin:0 auto 10px; opacity:.95; }
.login-brand h1{
  color:var(--white);
  font-size:28px;
  text-shadow:0 2px 10px rgba(0,0,0,0.35);
}
.login-brand p{
  color:rgba(255,255,255,0.88);
  font-size:13px;
  margin-top:6px;
  text-shadow:0 1px 6px rgba(0,0,0,0.3);
}

.login-panel{
  background:linear-gradient(180deg, rgba(240,238,225,0.0) 0%, var(--paper) 22%);
  padding:28px 24px calc(28px + env(safe-area-inset-bottom));
}

.login-panel .panel-inner{
  background:rgba(255,255,255,0.92);
  border:1px solid rgba(176,137,104,0.25);
  border-radius:var(--radius-l);
  padding:22px 20px;
  box-shadow:0 10px 30px rgba(0,0,0,0.18);
}

.login-panel .panel-title{
  font-size:13px;
  font-weight:700;
  color:var(--sumi-soft);
  text-align:center;
  margin-bottom:14px;
}

.login-buttons{ display:flex; flex-direction:column; gap:10px; }

.btn-google{ background:var(--white); color:var(--sumi); border:1.5px solid rgba(43,42,38,0.14); }
.btn-apple{ background:var(--sumi); color:var(--white); }
.btn-guest{ background:transparent; color:var(--sumi-soft); border:1.5px dashed var(--cedar); }

.login-note{
  font-size:11px;
  color:var(--sumi-soft);
  text-align:center;
  margin-top:14px;
  line-height:1.6;
}

/* --- ユーザー名設定モーダル --- */
.modal-backdrop{
  position:fixed; inset:0;
  background:rgba(20,20,16,0.55);
  display:flex; align-items:flex-end;
  z-index:100;
}
.modal-sheet{
  width:100%; max-width:480px; margin:0 auto;
  background:var(--paper);
  border-radius:var(--radius-l) var(--radius-l) 0 0;
  padding:24px 20px calc(24px + env(safe-area-inset-bottom));
  animation:sheet-up .22s ease-out;
}
@keyframes sheet-up{ from{ transform:translateY(24px); opacity:0; } to{ transform:translateY(0); opacity:1; } }

.field-label{ font-size:13px; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block; }
.text-input{
  width:100%;
  padding:13px 14px;
  border-radius:var(--radius-s);
  border:1.5px solid rgba(176,137,104,0.35);
  background:var(--white);
  font-size:15px;
  color:var(--sumi);
  font-family:inherit;
}
.text-input:focus{ outline:2px solid var(--sea); outline-offset:1px; }
.field-hint{ font-size:12px; color:var(--sumi-soft); margin-top:6px; min-height:16px; }
.field-hint.error{ color:var(--danger); font-weight:700; }
.field-hint.ok{ color:var(--forest); font-weight:700; }

/* --- 下部ナビゲーション(木製看板風) --- */
.bottom-nav{
  position:fixed;
  left:0; right:0; bottom:0;
  max-width:480px;
  margin:0 auto;
  display:flex;
  background:linear-gradient(180deg, var(--cedar) 0%, var(--cedar-dark) 100%);
  border-top:3px solid rgba(43,42,38,0.25);
  box-shadow:var(--shadow-nav);
  padding:8px 4px calc(8px + env(safe-area-inset-bottom));
  z-index:50;
}
.nav-item{
  flex:1;
  display:flex; flex-direction:column; align-items:center; gap:3px;
  padding:6px 2px;
  color:rgba(255,255,255,0.72);
  font-size:10px;
  font-weight:700;
  border-radius:var(--radius-s);
}
.nav-item svg{ width:22px; height:22px; }
.nav-item.active{
  color:var(--white);
  background:rgba(255,255,255,0.14);
}
.nav-item.active .nav-dot{
  display:block;
}
.nav-dot{
  display:none;
  width:4px; height:4px;
  border-radius:50%;
  background:var(--torii);
  margin-top:-2px;
}

/* --- 準備中プレースホルダ --- */
.coming-soon{
  display:flex; flex-direction:column; align-items:center;
  text-align:center;
  padding:80px 30px;
  color:var(--sumi-soft);
}
.coming-soon svg{ width:48px; height:48px; margin-bottom:14px; color:var(--cedar); }
.coming-soon h2{ color:var(--forest-dark); font-size:18px; }
.coming-soon p{ font-size:13px; line-height:1.7; margin-top:6px; }

/* --- ローディング / スプラッシュ --- */
.splash{
  min-height:100vh;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:var(--paper);
  color:var(--forest-dark);
}
.splash .spinner{
  width:34px; height:34px;
  border:3px solid rgba(63,107,79,0.2);
  border-top-color:var(--forest);
  border-radius:50%;
  animation:spin .8s linear infinite;
  margin-bottom:14px;
}
@keyframes spin{ to{ transform:rotate(360deg); } }

.toast{
  position:fixed;
  left:50%; bottom:96px;
  transform:translateX(-50%);
  background:var(--sumi);
  color:var(--white);
  padding:10px 18px;
  border-radius:999px;
  font-size:13px;
  box-shadow:0 6px 20px rgba(0,0,0,0.25);
  z-index:200;
  opacity:0;
  pointer-events:none;
  transition:opacity .2s ease;
}
.toast.show{ opacity:1; }

/* --- マップページ --- */
.map-page-shell{
  max-width:480px; margin:0 auto;
  height:100vh; position:relative;
  padding-bottom:0;
}
#map-canvas{
  position:absolute; inset:0;
  bottom:76px; /* 下部ナビの高さ分 */
}
.map-top-bar{
  position:absolute; top:0; left:0; right:0;
  z-index:40;
  padding:14px 16px;
  display:flex; align-items:center; justify-content:space-between;
  background:linear-gradient(to bottom, rgba(240,238,225,0.95), rgba(240,238,225,0));
  pointer-events:none;
}
.map-top-bar h1{ font-size:17px; margin:0; pointer-events:auto; }
.map-top-bar .eyebrow{ font-size:11px; }

.map-locate-btn{
  pointer-events:auto;
  width:40px; height:40px;
  border-radius:50%;
  background:var(--white);
  border:1px solid rgba(43,42,38,0.12);
  box-shadow:var(--shadow-card);
  display:flex; align-items:center; justify-content:center;
  color:var(--forest-dark);
  cursor:pointer;
}

.map-legend{
  position:absolute;
  left:14px; bottom:calc(76px + 14px);
  z-index:40;
  background:rgba(255,255,255,0.94);
  border-radius:var(--radius-s);
  padding:8px 12px;
  box-shadow:var(--shadow-card);
  font-size:11px;
  color:var(--sumi-soft);
  display:flex; align-items:center; gap:6px;
}
.map-legend .bar{
  width:64px; height:7px; border-radius:999px;
  background:linear-gradient(to right,var(--heat-1),var(--heat-2),var(--heat-3),var(--heat-4),var(--heat-5));
}

.map-fab{
  position:absolute;
  right:16px; bottom:calc(76px + 14px);
  z-index:40;
  display:flex; align-items:center; gap:8px;
  padding:13px 18px;
  border-radius:999px;
  background:var(--torii);
  color:var(--white);
  border:none;
  font-weight:700; font-size:14px;
  box-shadow:0 8px 22px rgba(181,74,44,0.4);
  cursor:pointer;
}
.map-fab:active{ transform:scale(0.96); }
.map-fab svg{ width:18px; height:18px; }

.map-hint-banner{
  position:absolute; top:64px; left:16px; right:16px;
  z-index:41;
  background:var(--forest-dark);
  color:#fff;
  font-size:12.5px;
  padding:10px 14px;
  border-radius:var(--radius-s);
  text-align:center;
  box-shadow:var(--shadow-card);
  display:none;
}
.map-hint-banner.show{ display:block; }

/* カテゴリ選択グリッド */
.category-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:8px;
  max-height:44vh;
  overflow-y:auto;
  margin:14px 0;
}
.category-chip{
  display:flex; flex-direction:column; align-items:center; gap:4px;
  padding:10px 4px;
  border-radius:var(--radius-s);
  border:1.5px solid rgba(176,137,104,0.3);
  background:var(--white);
  font-size:11px;
  color:var(--sumi);
  cursor:pointer;
}
.category-chip .emoji{ font-size:20px; }
.category-chip.selected{
  border-color:var(--torii);
  background:rgba(181,74,44,0.08);
  color:var(--torii-dark);
  font-weight:700;
}

.sheet-row{ display:flex; gap:10px; }
.sheet-row .btn{ flex:1; }

.coord-readout{
  font-size:12px; color:var(--sumi-soft);
  background:var(--paper-dim);
  border-radius:var(--radius-s);
  padding:8px 10px;
  margin-top:2px;
}
