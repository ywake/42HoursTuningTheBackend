#!/bin/bash

## 初期データDBファイルの作成のため、DBにCSVを投入するスクリプト


(cd ../../development && docker-compose down && rm -r ../volume/mysql ; docker-compose up -d mysql)

mysql=""

while :
do
    mysql=$(docker ps -f status=running --format "{{.ID}}\t{{.Names}}" | grep mysql. | cut -f 1)

    if [ -n "$mysql" ]; then
        break;
    fi
    echo "mysqlコンテナの作成を待機しています..."
    sleep 1
done

while :
do
    docker exec -it $mysql bash -c "echo -n 'select 1;' | mysql app" &> /dev/null && break
    echo "mysqlコンテナの起動を待機しています..."
    sleep 1
done

bash init_db.sh

echo $mysql
# ダミーデータの投入
echo "input dummy data"
docker cp ./loadData.sql $mysql:/etc/mysql/
docker cp ./baseCSV/user.csv $mysql:/etc/mysql/
docker cp ./baseCSV/session.csv $mysql:/etc/mysql/
docker cp ./baseCSV/category.csv $mysql:/etc/mysql/
docker cp ./baseCSV/group.csv $mysql:/etc/mysql/
docker cp ./baseCSV/category_group.csv $mysql:/etc/mysql/
docker cp ./baseCSV/group_member.csv $mysql:/etc/mysql/
docker cp ./baseCSV/record.csv $mysql:/etc/mysql/
docker cp ./baseCSV/record_item_file.csv $mysql:/etc/mysql/
docker cp ./baseCSV/file.csv $mysql:/etc/mysql/
docker cp ./baseCSV/record_comment.csv $mysql:/etc/mysql/
docker cp ./baseCSV/record_last_access.csv $mysql:/etc/mysql/
docker exec $mysql bash -c "mysql app --local-infile=1 < /etc/mysql/loadData.sql"

(cd ../../development && docker-compose down)

echo "保存のために、次を実行してください。rm -rf /da/mysql; cp -rv ../../volume/mysql /da/ "
