load data local infile '/etc/mysql/user.csv' into table user fields terminated by ',' lines terminated by '\n' IGNORE 1 LINES;
load data local infile '/etc/mysql/session.csv' into table session fields terminated by ',' lines terminated by '\n' IGNORE 1 LINES;
load data local infile '/etc/mysql/category.csv' into table category fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/etc/mysql/group.csv' into table group_info fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/etc/mysql/category_group.csv' into table category_group fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/etc/mysql/group_member.csv' into table group_member fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/etc/mysql/record.csv' into table record fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES
(record_id,status,title,category_id,application_group,created_by,created_at,updated_at,detail);
load data local infile '/etc/mysql/record_item_file.csv' into table record_item_file fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/etc/mysql/file.csv' into table file fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;
load data local infile '/etc/mysql/record_comment.csv' into table record_comment fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES
(comment_id,linked_record_id,created_by,created_at,value);
load data local infile '/etc/mysql/record_last_access.csv' into table record_last_access fields terminated by ',' lines terminated by '\n'IGNORE 1 LINES;