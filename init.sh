#!/bin/bash

# ==================================
# 競技環境の初期設定を行うスクリプト。
# ==================================

if [[ -e ../cloneUrl ]]; then
  echo "既に初期化済みです。"
  exit 1
fi

host=`cat /etc/hostname`

echo -e "\nディレクトリを初期化します。\n"
mkdir ./volume
mkdir ./volume/mysql
mkdir ./volume/backend
mkdir ./volume/backend/file
mkdir ./volume/backend/file/static

echo -e "\nfrontendの宛先を初期化します。\n"
(cd ./development/frontend && cat .env.production.org | sed s/__id__/${host}/ > .env.production )

echo -e "\nfrontendをビルドします。\n"
(cd ./development/frontend && npm ci && npm run build)

echo -e "\n採点モジュールを初期化します。\n"
(cd ./scoring/tool/ && cat locust.conf.org | sed s/__id__/${host}/ > locust.conf )
(cd ./scoring/tool/nodeTool && npm ci)

echo -e "\nサービスを起動します。\n"
(cd ./development/ && docker-compose down && docker-compose build --no-cache && docker-compose up -d)

echo -e "\n\n===================================================\n\n"
echo -e "初期化終了しました。以下を確認してみてください"
echo -e "・web画面へアクセスできること(https://${host}.ftt2204.dabaas.net/)"
echo -e "・初期スコアの計算"
echo -e "\n\n===================================================\n\n"
