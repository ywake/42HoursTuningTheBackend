#!/bin/bash

## 画像をセットするスクリプト

resourceNum=20
copyNum=1000

path="/da/file/static/"

for i in `seq 1 $copyNum`; do
    selectImg=$((($i % $resourceNum) + 1))
    cp "./img/i${selectImg}.jpg" "/da/file/static/f${i}.jpg"
    cp "./img/thumb_i${selectImg}.jpg" "/da/file/static/thumb_f${i}.jpg"
done