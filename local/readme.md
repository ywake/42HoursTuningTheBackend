## ローカル開発用環境
主にbackendの開発やその他の検証を、ローカル環境で実施できます。

- docker-composeコマンドでビルド、起動できます。
- backendコンテナ以外は、このディレクトリ内の内容を使って起動することに注意してください
  - 詳細は```docker-compose-local.yaml```を参照のこと
- UIは付属していません。画面の確認をしたい場合、書き換えが必要です。
- docker-compose等、必要なライブラリはあらかじめ利用できるようにしておく必要があります。
- リポジトリにはSSL証明書および顧客データは含まれません。```development/```や```scoring/```に配置されたスクリプトは使用できません。
  - [これら](../document/md/99_manual.md#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%81%AE%E7%B4%B9%E4%BB%8B)は使用できません。
  - 上記らのスクリプトは削除操作が含まれるため、ローカル環境では実行しないでください。

### 始め方
local用のmysqlのために、development/mysqlから設定ファイル、およびテーブル作成SQLファイルをコピーします  
```
$ bash cpMysqlFile.sh
```

docker-composeコマンドを使ってサービスの起動ができます。　　

例:
```
$ docker-compose -f docker-compose-local.yaml up
```
*mysqlコンテナは初期化のため、利用可能になるまでしばらく時間がかかります。ログを確認してみてください。


イメージやキャッシュの削除等は適宜行ってください。  
(```development/build.sh```が参考になるかもしれません。)

### ローカルAPIテスト
ローカルで実行中の環境に対し、APIテストを実施できます。内容は```development/apiTestOnly.sh```と[同様](https://github.com/DreamArts/42Tokyo-hackathon-2204/blob/main/document/md/99_manual.md#api%E3%83%86%E3%82%B9%E3%83%88)です。

スクリプトと同じディレクトリで実行してください。
```
$ bash localApiTestOnly.sh
```

