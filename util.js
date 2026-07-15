/* =========================================================
   共通ユーティリティ
   ========================================================= */

/** 発見件数(密度)から5段階のヒートマップ色を返す */
function getHeatColor(count) {
  if (count <= 2) return "var(--heat-1)";
  if (count <= 5) return "var(--heat-2)";
  if (count <= 10) return "var(--heat-3)";
  if (count <= 20) return "var(--heat-4)";
  return "var(--heat-5)";
}

/** 画面下にトーストを一瞬表示する */
function showToast(message, duration = 2200) {
  let el = document.getElementById("app-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => el.classList.remove("show"), duration);
}

/** ユーザー名の形式チェック(2〜12文字・英数字/かな/カナ/漢字/アンダースコア) */
function isValidUsername(name) {
  return /^[a-zA-Z0-9_ぁ-んァ-ヶ一-龠ー]{2,12}$/.test(name);
}

/** ゴミ分類 統一リスト(18種) - 発見登録・マップ・ランキング共通で使う */
const GOMI_TYPES = [
  { id: "pet",        label: "ペットボトル",   icon: "🧴" },
  { id: "can_alumi",  label: "空き缶(アルミ)", icon: "🥫" },
  { id: "can_steel",  label: "空き缶(スチール)", icon: "🥫" },
  { id: "bottle",     label: "ビン",           icon: "🍾" },
  { id: "plastic",    label: "プラスチック容器", icon: "🥡" },
  { id: "bag",        label: "レジ袋・ポリ袋", icon: "🛍️" },
  { id: "cigarette",  label: "たばこの吸い殻", icon: "🚬" },
  { id: "paper",      label: "紙くず・チラシ", icon: "📄" },
  { id: "cardboard",  label: "段ボール",       icon: "📦" },
  { id: "styrofoam",  label: "発泡スチロール", icon: "🧊" },
  { id: "fishing",    label: "漁具・ロープ",   icon: "🎣" },
  { id: "wood",       label: "木材・流木",     icon: "🪵" },
  { id: "metal",      label: "金属くず",       icon: "🔩" },
  { id: "rubber",     label: "ゴム製品",       icon: "⚙️" },
  { id: "cloth",      label: "布・衣類",       icon: "👕" },
  { id: "diaper",     label: "おむつ",         icon: "🍼" },
  { id: "hazardous",  label: "危険物",         icon: "⚠️" },
  { id: "other",      label: "その他",         icon: "❔" },
];

function getGomiLabel(id) {
  const t = GOMI_TYPES.find(g => g.id === id);
  return t ? t.label : "その他";
}
function getGomiIcon(id) {
  const t = GOMI_TYPES.find(g => g.id === id);
  return t ? t.icon : "❔";
}
