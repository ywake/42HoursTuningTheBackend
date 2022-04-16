all: build

build:
	docker-compose -f development/docker-compose.yaml down --rmi all
	docker-compose -f development/docker-compose.yaml build --no-cache
	docker-compose -f development/docker-compose.yaml up -d


eval:
	(cd ./scoring && bash evaluate.sh)

stress:
	(cd ./development && bash stressOnly.sh)

api:
	(cd ./development && bash apiTestOnly.sh)

restore:
	(cd ./development && bash restoreOnly.sh)

nginx-log:
	docker exec development_nginx_1 cat /var/log/nginx/nginx-access.log > access.log

ALP_CMD = alp ltsv --sort avg --reverse -m '/api/client/records/.+/comments,/api/client/records/.+/files/.+/thumbnail,/api/client/records/.+/files/.+,/api/client/records/.+'

alp: nginx-log
	echo $(ALP_CMD) > command.txt
	cat access.log | $(ALP_CMD) > result.txt
	cat command.txt result.txt | discocat
	rm access.log command.txt result.txt

.PHONY: build eval log
