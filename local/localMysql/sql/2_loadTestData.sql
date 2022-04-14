load data local infile '/docker-entrypoint-initdb.d/user.csv' into table user fields terminated by ',' lines terminated by '\n' IGNORE 1 LINES;
load data local infile '/docker-entrypoint-initdb.d/session.csv' into table session fields terminated by ',' lines terminated by '\n' IGNORE 1 LINES;
load data local infile '/docker-entrypoint-initdb.d/category.csv' into table category fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/docker-entrypoint-initdb.d/group.csv' into table group_info fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/docker-entrypoint-initdb.d/category_group.csv' into table category_group fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/docker-entrypoint-initdb.d/group_member.csv' into table group_member fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
