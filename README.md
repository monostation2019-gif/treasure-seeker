# トレジャーシーカー伊勢

「伊勢の未来をピカピカに」をコンセプトにした、伊勢市のゴミ拾い・資源回収・地域ランキングPWAです。
既存の「伊勢まちみっけ」の反省点（単一ファイル構成によるSafariクラッシュ）を踏まえ、
**ページごとにファイルを分割**した構成にしています。

## ファイル構成

```
treasure-seeker-ise/
├── index.html          # エントリーポイント（ログイン状態で振り分けのみ／重い処理なし）
├── login.html          # ログイン（Google / Apple / ゲスト）
├── home.html           # ホーム（今日の状況・トップユーザー・機能一覧）
├── map.html            # さんぽ＆クリーンマップ（Leaflet地図・発見登録）
├── ranking.html        # 地域別環境ランキング（今日／累計）
├── mypage.html         # マイページ（プロフィール・資源回収履歴・ログアウト）
├── manifest.webmanifest
├── firestore.rules     # Firestoreセキュリティルール（新コレクション構造用）
└── shared/
    ├── firebase-config.js  # ★ここにFirebase設定値を入れてください
    ├── style.css           # 共通デザイントークン・UI
    └── app-common.js       # 認証ガード・ボトムナビ・カテゴリ定義・GSI逆ジオコーディング等
```

各ページは自己完結していて、共通処理だけ `shared/` から読み込む構成です。
1ページが重くなってもSafariが他ページごとクラッシュすることがなくなります。

## 1. Firebaseの設定（既存プロジェクトへ上書きする場合）

「トレジャーシーカー伊勢」用に新規作成したプロジェクトがうまく動かなかったとのことなので、
**既存の「伊勢まちみっけ」Firebaseプロジェクトを使う**手順で説明します。

1. [Firebase Console](https://console.firebase.google.com/) → 既存プロジェクトを開く
2. 左メニュー「Authentication」→「Sign-in method」で以下を有効化
   - **Google**（ワンクリックで有効化可）
   - **Apple**（Apple Developer Programの有効な契約と、Services ID／Key設定が必要。詳細は [Firebase公式Apple連携ガイド](https://firebase.google.com/docs/auth/web/apple) を参照）
   - **匿名（Anonymous）**（ゲストログイン用）
3. 「Authentication」→「Settings」→「承認済みドメイン」に、Vercelのデプロイ先ドメイン（例: `your-app.vercel.app`）を追加
4. 「プロジェクトの設定」（歯車アイコン）→「全般」→「マイアプリ」→ 既存のWebアプリの設定値をコピー
5. `shared/firebase-config.js` の `firebaseConfig` オブジェクトに貼り付け

```js
const firebaseConfig = {
  apiKey: "実際の値",
  authDomain: "実際の値",
  projectId: "実際の値",
  storageBucket: "実際の値",
  messagingSenderId: "実際の値",
  appId: "実際の値",
};
```

## 2. Firestoreのコレクション構造（新規）

ご相談のとおり、コレクション構造は一新しています。

| コレクション | 内容 |
|---|---|
| `users/{uid}` | プロフィール、累計発見数、環境貢献度スコア |
| `finds/{id}` | 1件の発見記録（カテゴリ・座標・町名・サイズ・作成日時）。写真は含まない |
| `findPhotos/{id}` | `finds` と同じIDで紐づく写真（base64、遅延読み込み用に分離） |

写真を`finds`本体に含めず`findPhotos`に分離しているのは、既存アプリで効果のあった
「一覧表示時は写真を読み込まず、詳細を開いたときだけ取得する」軽量化パターンを踏襲しているためです。

### Firestoreの初期設定手順
1. 「Firestore Database」→ 既存のデータベースがあればそのまま利用可（コレクションは自動作成されます）
2. 「ルール」タブに `firestore.rules` の内容を貼り付けて公開
3. 一覧表示のクエリ（`orderBy("createdAt")` と `where` の組み合わせ）でインデックス要求のエラーが出た場合、
   Firebaseがコンソールに表示するリンクをクリックすれば自動でインデックスが作成されます

## 3. カテゴリ

`shared/app-common.js` の `CATEGORIES` で一元管理しています。表示名・アイコン・色を変えたい場合はここだけ編集すれば全ページに反映されます。

現在の設定：ペットボトル／たばこ吸い殻／空き缶／プラスチック／危険物／その他

## 4. デプロイ（Vercel）

このプロジェクトは静的ファイルのみなので、`treasure-seeker-ise` フォルダをそのままVercelにデプロイできます。
ビルドコマンドは不要（Static/Other プロジェクトとして認識されます）。

## 5. 今後の拡張ポイント

- **アイコン画像**: `manifest.webmanifest` が参照する `icons/icon-192.png` `icons/icon-512.png` はまだ用意していません。添付画像のロゴ（鳥居＋虫眼鏡＋葉）を元にアイコン画像を作成し `icons/` フォルダに配置してください。
- **admin.html**: 既存アプリと同様の管理画面が必要であれば、`finds`/`users` コレクションを一覧・編集できるページを追加できます。
- **Service Worker**: オフライン対応やプッシュ通知が必要になったら `sw.js` を追加してください（現状はFirestoreのオフラインキャッシュのみ有効）。
- **町別ランキングの累計表示**: 現状は「累計」タブで町別ランキングを省略しています（`finds`全件走査を避けるため）。必要であれば `towns/{townName}` に集計ドキュメントを持たせ、発見登録時にインクリメントする設計に拡張できます。

## 動作確認の仕方（Firebase未設定でもUIだけ確認したい場合）

`shared/firebase-config.js` にプレースホルダーの値が入ったままだと、`firebase.initializeApp` の時点でエラーになりログイン画面より先に進めません。
まずは実際のFirebase設定値を入れてから動作確認してください。
