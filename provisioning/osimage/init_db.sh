#!/bin/bash

## データベースを初期化するスクリプト

# Container ID
mysql=$(docker ps -f status=running --format "{{.ID}}\t{{.Names}}" | grep mysql. | cut -f 1)
[ -z "$mysql" ] && exit 0

echo $mysql

docker cp ../../development/mysql/sql/V0.sql $mysql:/etc/mysql/

docker exec $mysql bash -c "mysql app < /etc/mysql/V0.sql"

echo -n "1" > ../../volume/mysql/next.dbm