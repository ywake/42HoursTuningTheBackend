ROOT = ../
CONTAINER_SUFIX = _container

all: build

build: force
	docker-compose down --rmi all
	docker-compose build --no-cache
	docker-compose up -d

down: force
	docker-compose down

build-%: force
	docker-compose build $*
	docker-compose up -d

connect-%: force
	docker exec -it $*$(CONTAINER_SUFIX) bash

eval: force
	(cd $(ROOT)/scoring && bash evaluate.sh)

stress: force
	(cd $(ROOT)/development && bash stressOnly.sh)

api: force
	(cd $(ROOT)/development && bash apiTestOnly.sh)

restore: force
	(cd $(ROOT)/development && bash restoreOnly.sh)

log-nginx:
	docker exec nginx$(CONTAINER_SUFIX) cat /var/log/nginx/nginx-access.log > access.log

log-mysql: force
	docker exec mysql$(CONTAINER_SUFIX) cat /var/log/mysql/slow.log > slow.log

digest: log-mysql
	pt-query-digest slow.log > result.txt
	cat result.txt | discocat
	rm slow.log result.txt

log-backend: force
	docker exec backend$(CONTAINER_SUFIX) cat /backend/wall.pb.gz > wall.pb.gz

ALP_CMD = alp ltsv --sort avg --reverse -m '/api/client/records/.+/comments,/api/client/records/.+/files/.+/thumbnail,/api/client/records/.+/files/.+,/api/client/records/.+'

alp: log-nginx
	echo $(ALP_CMD) > command.txt
	cat access.log | $(ALP_CMD) > result.txt
	cat command.txt result.txt | discocat
	rm access.log command.txt result.txt

# go install github.com/google/pprof@latest
# brew install brew install graphviz
pprof: log-backend
	pprof -http=: wall.pb.gz

.PHONY: force
force:
