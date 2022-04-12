#!/bin/bash

# 修正プログラム実行用
repoName="42HoursTuningTheBackend"

if [[ ! -e ./init.sh ]]; then
    pwd
    echo "スクリプトが配置されているディレクトリで実行してください。"
    exit 1
fi

if [[ -e ./.lock ]]; then
    echo "lockファイルがあるため処理を終了しました。"
    exit 1
fi

rm -rf /da/repo/*

echo -n "リポジトリのURLを入力ください: "
read repoUrl


current=`pwd`

(cd /da/repo && git clone $repoUrl && cd ./${repoName} && bash .exe.sh $current) && echo "修正プログラムが完了しました。" && \
echo -n "locked" > .lock

