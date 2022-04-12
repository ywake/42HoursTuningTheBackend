#!/bin/bash

# 採点内部スクリプト

nowU=`date +%s`

host=`cat /etc/hostname`

echo -n "採点前" > ./result/score.dat
echo -n "採点前" > ./result/check.dat
echo -n "採点前" > ./result/check_warn.dat
rm ./result/*.csv

(bash restore.sh && node ./nodeTool/check.js && locust ; node ./nodeTool/score.js) || exit 1

score=`cat ./result/score.dat`
echo "${nowU},${score}" >> ./result/local.history

echo -e "\n\n===============================================\n\n"
echo "スコアは ${score} 点"
echo -e "\n\n===============================================\n\n"

key=`cat /da/funcKey`
repo=`cat ../../../cloneUrl`
commit=`git show|head -1`
version=`cat version`
warn=`cat ./result/check_warn.dat`

curl -X POST -d "{\"hostname\": \"${host}\", \"score\": ${score}, \"repo\": \"${repo}\", \"commit\": \"${commit}\", \"version\": \"${version}\", \"warn\": \"${warn}\" }" \
  "https://ftt2204.azurewebsites.net/api/HttpTrigger1?code=${key}"