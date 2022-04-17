alter table session add index session_value_index(value);
alter table record_comment add index record_comment_index(linked_record_id);
alter table group_member add index group_member_index(user_id);
alter table record_item_file add index record_item_file_index(linked_record_id);
alter table record_last_access ADD index record_last_access_index(user_id, record_id);
alter table group_info add index group_info_index(group_id);
alter table record add index record_index(record_id, status);
-- for allClose
alter table record add index record_sorted_index(status, updated_at desc, record_id);
-- alter table record_item_file add index allclose_index(linked_record_id, item_id);
