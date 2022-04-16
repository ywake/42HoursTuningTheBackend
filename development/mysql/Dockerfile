FROM mysql:8.0

RUN mkdir -p /var/log/mysql && touch /var/log/mysql/slow.log
RUN chmod -R 777 /var/log/mysql
COPY ./custom.conf /etc/mysql/conf.d/mysql.cnf

CMD ["mysqld"]