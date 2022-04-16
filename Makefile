all: build

build:
	docker-compose -f development/docker-compose.yaml down --rmi all
	docker-compose -f development/docker-compose.yaml build --no-cache
	docker-compose -f development/docker-compose.yaml up -d

down:
	docker-compose -f development/docker-compose.yaml down

build-%: force
	docker-compose -f development/docker-compose.yaml build $*
	docker-compose -f development/docker-compose.yaml up -d

connect-%: force
	docker exec -it development_$*_1 bash

eval:
	(cd ./scoring && bash evaluate.sh)

stress:
	(cd ./development && bash stressOnly.sh)

api:
	(cd ./development && bash apiTestOnly.sh)

restore:
	(cd ./development && bash restoreOnly.sh)

log-nginx:
	docker exec development_nginx_1 cat /var/log/nginx/nginx-access.log > access.log

log-mysql:
	docker exec development_mysql_1 cat /var/log/mysql/slow.log > slow.log

digest: log-mysql
	pt-query-digest slow.log > result.txt
	cat result.txt | discocat
	rm slow.log result.txt


ALP_CMD = alp ltsv --sort avg --reverse -m '/api/client/records/.+/comments,/api/client/records/.+/files/.+/thumbnail,/api/client/records/.+/files/.+,/api/client/records/.+'

alp: log-nginx
	echo $(ALP_CMD) > command.txt
	cat access.log | $(ALP_CMD) > result.txt
	cat command.txt result.txt | discocat
	rm access.log command.txt result.txt

.PHONY: build down eval stress api restore nginx log-nginx log-mysql digest alp force

# force:
