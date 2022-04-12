# API設計書
クライアント向けにbackendが提供しているアプリの仕様です。

## 共通仕様
### ベースURI
https://{環境ID}.ftt2204.dabaas.net/api/client

### リクエストおよびレスポンス
JSON形式

### 認証
すべてのAPIは、リクエスト時に認証済みであることを示すためにヘッダーに```x-app-key: {keyValue}```を付ける必要があります。
keyValueが登録済みでなかった場合、認証エラーとしてbackendはHTTPステータスコード401で応答しなければなりません。

### HTTPステータスコード
クライアントの誤動作を防ぐため、リクエストが成功した場合のみ200系応答で返却できます。

サーバ内で予期せぬ問題が起きた場合、500系の応答を返すことができます。

400系の応答は、401及び各APIで定められているものを除き、使用することができます。

## 各APIの仕様
###  申請新規登録 POST records/
文書を新規登録するAPI。
#### リクエスト
```
{
    title: "文書のタイトル",
    dateil: "文書詳細",
    categoryId: 1,
    fileIdList: [
        fileId: "添付ファイルのファイルID",
        thumbFileId: "添付ファイルサムネイルのファイルID"
    ]
}
```

フィールド名 | 型 | 必須 | 説明
-- | -- | -- |--
title |string|true|文書のタイトル。  
detail |string|true|文書の詳細  
categoryId |number|true|申請カテゴリのID。
fileIdList |添付ファイル申請情報配列|true|添付ファイル情報。

添付ファイル申請情報:

フィールド名 | 型 | 必須 | 説明
-- | -- | -- |--
fileId |string|true|添付ファイルのファイルID  
thumFileId |string|true|添付ファイルのサムネイルのファイルID

#### レスポンス 200応答
```
{
  recordId: "recordID"
}
```

フィールド名 | 型 | 必須 | 説明
-- | -- | -- | -- 
recordId |string|true|登録された文書の文書ID。  

### 申請詳細取得　GET records/{recordId}
文書の詳細を取得します。

#### レスポンス 200応答
```
{
    recordId: "recordId",
    status: "open",
    title: "title",
    detail: "文書の詳細",
    categoryId: 7,
    categoryName: "カテゴリー名",
    applicationGroup: 1,
    applicationGroupName: "申請部署名",
    createdBy: 7,
    createdByName: "申請者名",
    createdByPrimaryGroupName: "申請者プライマリ所属組織名",
    createdAt: "2000-01-01T12:34:56Z",
    updatedAt: "2000-01-01T12:34:56Z",
    files: [
        {
            itemId: 1203,
            name: "ファイル名",
        }
    ]
}
```

フィールド名 |型|必須|説明
-- | -- | -- | --
recordId|strring|true|文書ID  
status|string|true|文書状態。現在の仕様ではopen or closed  
title|string|true|文書タイトル  
detail|string|true|文書詳細  
categoryId|number|true|申請カテゴリーID  
categoryName|string|true|申請カテゴリー名  
applicationGroup|number|true|申請組織ID  
applicationGroupName|string/null|true|申請組織名  
createdBy|number|true|申請者ユーザID  
createdByName|string/null|true|申請者名  
createdByPrimaryGroupName|string/null|true|申請者が所属するプライマリ組織の名前。 
createdAt|string|true|申請日。ISO8601形式。
updatedAt|string|true|更新日。ISO8601形式。コメントが投稿されるたびに更新させる。
files|添付ファイル情報配列|true|文書の添付ファイル情報。要素の順番は申請時の登録順番に依存する。  

添付ファイル情報:

フィールド名 | 型 | 必須 | 説明
-- | -- | -- |-- 
itemId|number|true|添付ファイル部品ID  
name|string|true|添付ファイル名

### 申請一覧取得 GET record-views/{viewId}
文書一覧を配列で取得します。順序は文書更新日時降順+文書ID昇順です。

対象文書は、以下のviewIdで異なります。
- tomeActive:自身が所属する部署宛の文書のうち、statusがopenであるもの
- allActive:statusがopenであるもの
- allClosed:statusがclosedであるもの
- mineActive:自身が申請したもののうち、statusがopenであるもの

#### リクエスト
```
GET record-view/tomeActive?offset=10&limit10
```

フィールド名 | 必須 |説明
-- | -- | --
offset |false|文書一覧配列のoffset。指定された文書数以降の結果を返却する。
limit|false|1リクエスト当たりに返却する文書数。

#### レスポンス200応答
```
{
    count: 1
    items:[
        {
            recordId: "recordId",
            title: "title",
            applicationGroup: 1,
            applicationGroupName: "申請部署名",
            createdBy: 7,
            createdAt: "2000-01-01T12:34:56Z",
            commentCount: 3,
            isUnConfirmed: true,
            thumbnailItemId: 138,
            updatedAt: "2000-01-01T12:34:56Z"
        }
    ]
}
```

フィールド名 | 型 | 必須 |説明
-- | -- | -- | --
count |number|true|条件に一致する文書の全件数  
items |一覧用文書情報配列|true|一覧画面に表示するための文書情報の配列。|

一覧用文書情報:

フィールド名 |型|必須|説明
-- | -- | -- | --
recordId|string|true|文書ID  
title|string|true|文書タイトル  
applicationGroup|number|true|申請組織ID  
applicationGroupName|string/null|true|申請組織名  
createdBy|number|true|申請者ユーザID  
createdByName|string/null|true|申請者名  
createdAt|string|true|申請日。ISO8601形式。
commentCount|number|true|文書に紐づいたコメント数|
isUnConfirmed|boolean|true|文書が未読、あるいは文書内のコメントが未読。|
thumbnailItemId|number/null|false|1番目に添付されたファイルのファイル部品ID
updatedAt|string|true|更新日。ISO8601形式。コメントが投稿されるたびに更新させる。


### 申請更新　PUT records/{recordId}
文書情報を更新する。現在の仕様では、申請クローズ時に使用する。

#### リクエスト
```
{
    status: "closed"
}
```

フィールド名 |型|必須|説明
-- | -- | -- | --
status|string|true|文書状態。

#### レスポンス 200応答
```
{}
```

### コメント取得 GET records/{recordId}/comments
文書に紐づいたコメントを投稿日降順で返却。

#### レスポンス 200応答
```
{
    items:[{
        commentId: 12,
        value: "コメント内容",
        createdBy: 76,
        createdByName: "コメントした人の名前",
        createdByPrimaryGroupName: "申請者組織名",
        createdAt: "2000-01-01T12:34:56Z",
    }]
}
```
フィールド名 | 型 | 必須|説明
-- | -- | -- | --
items | コメント情報配列|true|コメント配列。  


コメント情報配列:

フィールド名 |型|必須|説明
-- | -- | -- | --
commentId|string|true|コメントID  
value|string|true|コメント内容  
createdBy|number|true|申請者ユーザID  
createdByName|string/null|true|申請者名  
createdByPrimaryGroupName|string/null|true|申請者が所属するプライマリ組織の名前。 
createdAt|string|true|申請日。ISO8601形式。

### コメント投稿 POST records/{recordId}/comments
文書に対し、コメントします。

#### リクエスト
```
{
    value: "コメント内容"
}
```

フィールド名 | 型 | 必須 |説明
-- | -- | -- | --
value |string|true|コメント本文。

#### レスポンス 200応答
```
{}  
```

### カテゴリ取得 GET categories/
申請カテゴリー一覧を取得する。
#### レスポンス 200応答
```
{
    items: {
        "1": {
            name: "カテゴリー名1",
        },
        "2": {
            name: "カテゴリー名2",
        }
    }
}
```

フィールド名 | 型 | 説明
-- | -- | --
items.(categoryId) |string|カテゴリーIDを文字列にしたもの。|  
items.(categoryId).name|string|カテゴリーIDに対応したカテゴリー名|  

### ファイルアップロード POST files/
添付ファイルを以前にアップロードし、ファイルIDを取得する。

#### リクエスト
```
{
  name: "filename"
  data: "01190eu01ue10e"
}
```

フィールド名 | 型 | 必須 |説明
-- | -- | -- | --
name|string|true|画像ファイル名
data|string|true|画像ファイルをbase64でエンコードした文字列

#### レスポンス 200応答
```
{
  fileId: "xxxxxxxxxxx",
  thumbFileId: "yyyyyyyyyyyy",
}
```

フィールド名 | 型 | 必須 |説明
-- | -- | -- | --
fileId|string|true|アップロードしたファイルのID
thumbFileId|string|true|アップロードしたファイルののサムネイルのファイルID

### 添付ファイル取得 GET records/{recordId}/files/{itemId}
文書の指定の添付ファイル部品IDに結びついたファイルを取得する。
#### レスポンス 200応答
```
{
  name: "filename"
  data: "01190eu01ue10e"
}
```
フィールド名 | 型 | 必須 |説明
-- | -- | -- | --
name|string|true|画像ファイル名
data|string|true|画像ファイルをbase64でエンコードした文字列


### 添付ファイルサムネイル取得 GET records/{recordId}/files/{itemId}/thumbNail
文書の指定の添付ファイル部品IDに結びついたファイルのサムネイルを取得する。
#### レスポンス 200応答
(添付ファイルと同様のため省略)
