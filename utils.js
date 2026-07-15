/* ============================================================
   Treasure Seeker - 全体管理
   起動時に読み込むのはこのファイル＋firebase.js／utils.js／stamp.jsの軽量な部分だけ。
   map.js（Leaflet初期化）／home.js／discover.js／share.jsは、
   実際にそのタブ・機能が使われた瞬間に動的importします。
   これが「起動時ホワイトスクリーン」対策の中心です。
   ============================================================ */
import './firebase.js';
import { showToast } from './utils.js';
import { initStampNav, refreshHeaderRank } from './stamp.js';

const screens = {
  home: document.getElementById('screen-home'),
  map:  document.getElementById('screen-map'),
};
const navButtons = {
  home: document.getElementById('nav-home-btn'),
  map:  document.getElementById('nav-map-btn'),
};

let mapModulePromise = null;
function loadMapModule(){
  if(!mapModulePromise) mapModulePromise = import('./map.js');
  return mapModulePromise;
}

let homeModulePromise = null;
function loadHomeModule(){
  if(!homeModulePromise) homeModulePromise = import('./home.js');
  return homeModulePromise;
}

function setActiveNav(which){
  Object.values(navButtons).forEach(b => b && b.classList.remove('active'));
  document.getElementById('discover-cta').classList.remove('active');
  document.getElementById('rank-badge-btn').classList.remove('active');
  if(navButtons[which]) navButtons[which].classList.add('active');
}

async function showScreen(name){
  Object.entries(screens).forEach(([key, el])=>{
    el.classList.toggle('hidden', key !== name);
  });
  setActiveNav(name);

  if(name === 'home'){
    const { initHome } = await loadHomeModule();
    initHome();
  }
  if(name === 'map'){
    const { initMap, invalidateMapSize } = await loadMapModule();
    await initMap();
    invalidateMapSize();
  }
}

navButtons.home.addEventListener('click', ()=>{
  document.getElementById('stamp-modal').classList.add('hidden');
  showScreen('home');
});
navButtons.map.addEventListener('click', ()=>{
  document.getElementById('stamp-modal').classList.add('hidden');
  showScreen('map');
});

// ---------- 発見する（中央CTA） ----------
document.getElementById('discover-cta').addEventListener('click', ()=>{
  document.getElementById('camera-input').click();
});
document.getElementById('camera-input').addEventListener('change', async (e)=>{
  const file = e.target.files[0];
  e.target.value = ''; // 同じ写真を選び直せるようリセット
  if(!file) return;

  setActiveNav('discover');
  document.getElementById('discover-cta').classList.add('active');

  // 発見フローはmap.js（現在地取得）に依存するため、両方をここで初めて読み込みます。
  await loadMapModule();
  const { startDiscoverFlow } = await import('./discover.js');
  startDiscoverFlow(file);
});

// ---------- マイページ（スタンプ帳） ----------
initStampNav();

// ---------- 初期表示 ----------
// ホーム画面を最初に表示（体感速度を優先し、地図の初期化は裏で先読みしておく）
showScreen('home');
refreshHeaderRank();

// アイドル時にマップモジュールを先読みしておくと、マップタブに切り替えた瞬間の待ちが減ります。
// （Leafletの初期化自体は、実際にタブが表示されるまで行いません＝ゼロサイズ描画バグの回避）
const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1500));
idle(()=> loadMapModule());

// ---------- Service Worker登録＆更新バナー（強制リロードループを避ける設計） ----------
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').then(reg=>{
      reg.addEventListener('updatefound', ()=>{
        const newWorker = reg.installing;
        if(!newWorker) return;
        newWorker.addEventListener('statechange', ()=>{
          if(newWorker.state === 'installed' && navigator.serviceWorker.controller){
            document.getElementById('update-banner').classList.remove('hidden');
            document.getElementById('update-btn').onclick = ()=>{
              newWorker.postMessage('SKIP_WAITING');
            };
          }
        });
      });
    }).catch(e => console.warn('SW registration failed', e));

    // controllerchangeでのリロードは「更新ボタンを押した後」の一度きりに限定する
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', ()=>{
      if(reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  });
}

window.showToastFromApp = showToast; // デバッグ用（コンソールから動作確認したい時に）
