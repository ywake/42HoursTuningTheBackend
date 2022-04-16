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

ALP_CMD = alp ltsv --sort avg --reverse

alp: nginx-log
	echo $(ALP_CMD) > _tmp.txt
	cat _tmp.txt access.log | $(ALP_CMD) > _tmp2.txt
	cat _tmp.txt _tmp2.txt | discocat
	rm access.log _tmp.txt _tmp2.txt

.PHONY: build eval log