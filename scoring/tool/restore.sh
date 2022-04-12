#!/bin/bash

(cd ../../development && docker-compose down)
(cd ../../volume && rm -r ./mysql && rm -r ./backend/file)

echo "データベースをリストアします..."
cp -rv /da/mysql ../../volume/
echo "ファイルをリストアします..."
cp -r /da/file ../../volume/backend/

# docker-composeを起動。
(cd ../../development && docker-compose up -d)


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

next="0"

status=""
while :
do
  if [[ -e ../../volume/mysql/next.dbm ]]; then
    next=`cat ../../volume/mysql/next.dbm`
  fi

  if [[ ! -e ../../development/mysql/sql/V${next}.sql ]]; then
    echo "V${next}.sqlはありません。"
    break
  fi

  echo "V${next}.sqlを適用します..."
  (docker cp ../../development/mysql/sql/V${next}.sql $mysql:/etc/mysql/temp.sql \
    && docker exec $mysql bash -c "mysql app < /etc/mysql/temp.sql" && next=$(($next + 1)) \
    && echo -n "$next" > ../../volume/mysql/next.dbm) || (echo "適用に失敗しました"; exit 1) || break;
done
