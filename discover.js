/* ============================================================
   Treasure Seeker - シェア機能
   発見完了画面から「シェアする」を押した時だけ動的importされる想定。
   Canvasで画像を作る処理はやや重いので、使う瞬間まで読み込まないのが軽量化のポイント。
   ============================================================ */
import { showToast, roundRectPath } from './utils.js';

const SHARE_TAGS = '#TreasureSeeker #伊勢のお宝探し #伊勢志摩 #海ごみゼロ #環境保全';
let lastShareDataUrl = null;
let wired = false;

function loadImageEl(src){
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateShareCard(photoDataUrl, stampCount, wasteLabel){
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#F3EEDF');
  grad.addColorStop(1, '#E9E0C8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  try{
    const img = await loadImageEl(photoDataUrl);
    const size = W - 160;
    const sx = 80, sy = 260;
    const minSide = Math.min(img.width, img.height);
    const cropX = (img.width - minSide) / 2;
    const cropY = (img.height - minSide) / 2;

    ctx.save();
    roundRectPath(ctx, sx, sy, size, size, 40);
    ctx.clip();
    ctx.drawImage(img, cropX, cropY, minSide, minSide, sx, sy, size, size);
    ctx.restore();

    ctx.strokeStyle = '#FFFDF7';
    ctx.lineWidth = 10;
    roundRectPath(ctx, sx, sy, size, size, 40);
    ctx.stroke();
  }catch(e){ console.warn('image draw failed', e); }

  ctx.fillStyle = '#4E6B4A';
  ctx.font = '64px "Yusei Magic"';
  ctx.textAlign = 'center';
  ctx.fillText('宝物、発見！', W/2, 170);

  ctx.save();
  ctx.translate(W - 150, 1230);
  ctx.rotate(-0.18);
  ctx.strokeStyle = '#C97B4A';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI*2);
  ctx.stroke();
  ctx.fillStyle = '#C97B4A';
  ctx.font = '38px "Yusei Magic"';
  ctx.fillText('発見', 0, 15);
  ctx.restore();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#4A3B2E';
  ctx.font = '44px "Zen Maru Gothic"';
  ctx.fillText(`種別： ${wasteLabel}`, 80, 1370);
  ctx.fillStyle = '#C97B4A';
  ctx.font = '700 44px "Zen Maru Gothic"';
  ctx.fillText(`累計スタンプ ${stampCount} 個`, 80, 1440);

  ctx.fillStyle = '#8A7B68';
  ctx.font = '32px "Zen Maru Gothic"';
  ctx.fillText('Treasure Seeker — 伊勢のお宝探し', 80, 1800);

  return canvas.toDataURL('image/jpeg', 0.92);
}

function wireButtonsOnce(){
  if(wired) return;
  wired = true;

  document.getElementById('share-close').addEventListener('click', ()=>{
    document.getElementById('share-modal').classList.add('hidden');
  });

  document.getElementById('btn-copy-tags').addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(SHARE_TAGS);
      showToast('タグをコピーしました');
    }catch(e){
      showToast('コピーに失敗しました。長押しで選択してコピーしてください。');
    }
  });

  document.getElementById('btn-do-share').addEventListener('click', async ()=>{
    if(!lastShareDataUrl) return;
    try{
      const blob = await (await fetch(lastShareDataUrl)).blob();
      const file = new File([blob], 'treasure-seeker.jpg', { type:'image/jpeg' });
      if(navigator.canShare && navigator.canShare({ files:[file] })){
        await navigator.share({ files:[file], title:'Treasure Seeker', text:'宝物を発見しました！ ' + SHARE_TAGS });
        return;
      }
    }catch(e){
      console.warn('share failed, falling back to download', e);
    }
    const a = document.createElement('a');
    a.href = lastShareDataUrl;
    a.download = 'treasure-seeker.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('画像を保存しました');
  });
}

export async function openShareModal({ photoDataUrl, stampCount, wasteLabel }){
  wireButtonsOnce();
  try{
    await document.fonts.load('60px "Yusei Magic"');
    await document.fonts.load('36px "Zen Maru Gothic"');
  }catch(e){ /* フォント未ロードでも続行 */ }

  const dataUrl = await generateShareCard(photoDataUrl, stampCount, wasteLabel);
  lastShareDataUrl = dataUrl;

  document.getElementById('share-preview-img').src = dataUrl;
  document.getElementById('share-tags').textContent = SHARE_TAGS;
  document.getElementById('share-modal').classList.remove('hidden');
}
