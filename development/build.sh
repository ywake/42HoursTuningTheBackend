#!/bin/bash

# ==================================
# ビルドスクリプト。
# ==================================

# web画面の変更を反映したい場合、コメントアウトを外す。
# (cd ./frontend && npm run build)

docker-compose down --rmi all
docker-compose build --no-cache
docker-compose up -d
