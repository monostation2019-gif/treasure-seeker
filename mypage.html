# トレジャーシーカー伊勢 - セットアップメモ

## 今回作った範囲
- `login.html` → `index.html` → `home.html` の導線一式
- `map.html` / `stamp.html` / `ranking.html` / `mypage.html` は
  下部ナビと枠だけ用意した「準備中」スタブ（次のステップで中身を実装）
- 各ページはHTMLファイルを分割し、共通の `css/style.css` と
  `js/` 内のスクリプトをキャッシュさせることで、
  「まちみっけ」で起きた起動時の白画面・重さを避ける設計にしています。

## 1. Firebaseプロジェクトの設定
`js/firebase-config.js` の中身を、ご自身のFirebaseプロジェクトの値に書き換えてください。

Firebaseコンソール → Authentication → Sign-in method で、以下を有効化してください。
- Google
- Apple（Apple Developer側での設定も必要です）
- 匿名（ゲストログイン用）

## 2. Firestoreのコレクション構成

```
usernames/{username}      … { uid }                     ← 重複防止用
users/{uid}                … {
                                username, provider, createdAt,
                                level, totalFinds, totalCollected
                              }
finds/{autoId}              … {
                                uid, username, lat, lng,
                                category,                 ← js/util.js の GOMI_TYPES(18種)のid
                                createdAt
                              }
```

`finds` は map.html のヒートマップ表示に使います。読み込みは
`orderBy("createdAt","desc").limit(1000)` に絞っているので、
件数が増えても起動時の読み込みが重くなりすぎないようにしています。
（さらに件数が増えてきたら「まちみっけ」と同様に期間ウィンドウで絞る対応がおすすめです）

ユーザー名の重複防止は `runTransaction` で
「usernamesに同名ドキュメントが無ければ作成」を1トランザクションで行っています。

## 3. Firestoreセキュリティルール（参考）
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usernames/{name} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
    match /users/{uid} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid;
    }
    match /finds/{findId} {
      allow read: if true; // マップはログインユーザー全員が見られる想定
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

## 4. 動作確認
Firebaseの設定を入れたあと、フォルダごとVercelにデプロイするか、
ローカルで簡易サーバーを立てて `login.html` を開いてください
（`file://` だとFirebase Authのポップアップが動かないことがあります）。

```
npx serve .
```

## 今後の実装ステップ（ご要望の順）
1. ~~**map.html** — Leaflet.js + Firestoreの位置情報で、5段階ヒートマップ表示~~ ✅ 実装済み
2. **stamp.html** — スタンプラリー機能（GPS取得とFirestoreの競合対策は
   これまでの知見（`lastKnownLatLng` パターン）を流用予定）
3. **ranking.html** — 地域別・学区別ランキング（`count()` 集計を使用）
4. **mypage.html** — レベル・バッジ・調査履歴
5. インスタシェア機能／地図の衛星写真切り替え機能

## map.html の仕組み(実装メモ)
- 約400m四方のグリッド(`GRID_RES = 0.0035`)に発見件数を集計し、
  `getHeatColor()` で5段階に色分けした円マーカーとして表示
- 「発見を記録」ボタン → GPS取得 → ドラッグで微調整できるピンを表示
  → 種類(18種)を選んで記録、という流れにして、GPSの誤差はピンの
  ドラッグ調整でユーザー自身が直せるようにしています
- GPS取得に失敗した場合は自動的に「地図をタップして指定」モードに
  切り替わるので、位置情報が使えない環境でもエラーで止まりません
- 地図タイルは現在 OpenStreetMap(無料・APIキー不要)。衛星写真への
  切り替えは、今後 `L.tileLayer` を切り替えるトグルボタンを
  追加する形で実装予定です

## デザインの意図
- 背景・カード色は「和紙」をイメージした生成り色 `#F0EEE1`
- アクセントは鳥居の朱色 `#B54A2C`、下部ナビは杉の木肌色の
  「木製看板」風にして、レーザー彫刻グッズのブランド世界観と揃えています
- 見出しは筆致のある明朝体「Shippori Mincho」、本文は丸みのある
  「Zen Maru Gothic」で、親方キャラの温かみに合わせています
