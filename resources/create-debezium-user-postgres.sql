--create table to be captured
create table mytable (col1 varchar(50), col2 integer, col3 bigint, col4 timestamp, col5 date);

--create the debezium user
create role debezium with password 'debezium';
alter role debezium with replication login;
grant usage on schema public to debezium;

--grant the ownership of the table to debezium
grant debezium to postgres;
alter table mytable owner to debezium;

--pg_hba.conf
local   replication     <youruser>                          trust
host    replication     <youruser>  127.0.0.1/32            trust
host    replication     <youruser>  ::1/128                 trust

--insert into mytable
--watch the topic
insert into mytable values ('ttt', 5, 1234567890, current_timestamp, current_date);

