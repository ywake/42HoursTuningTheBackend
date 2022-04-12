#!/bin/bash

# 修正プログラム本体

if [ $# != 1 ]; then
    echo "予期せぬ引数"
    exit 1
fi

target=$1

if [[ ! -e ./init.sh ]]; then
    pwd
    echo "init.shが見つかりません。"
    exit 1
fi

echo "実行します。"
cat README.md
echo "scoreモジュールの差し替えテスト" > $1/scoring/exe.test