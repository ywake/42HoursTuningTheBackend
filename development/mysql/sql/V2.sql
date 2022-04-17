-- コメント数用のカラムを追加
alter table record add comment_num bigint NOT NULL DEFAULT 0;
-- コメント数用のカラムを初期化
update record set comment_num = (select count(*) from record_comment where linked_record_id = record_id);
