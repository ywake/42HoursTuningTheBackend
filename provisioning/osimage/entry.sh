#!/bin/bash

ng="https://github.com/DreamArts/42HoursTuningTheBackend.git"
repoName="42HoursTuningTheBackend"

if [[ -e ./cloneUrl ]]; then
  echo "既に初期化済みです。"
  exit 1
fi

echo -n "forkしたリポジトリのURLを入力ください: "
read repoUrl

git clone $repoUrl && (cd ./${repoName} && bash init.sh ) && echo -n $repoUrl > ./cloneUrl \
|| echo "初期化に失敗しました。リポジトリURLをご確認ください"
