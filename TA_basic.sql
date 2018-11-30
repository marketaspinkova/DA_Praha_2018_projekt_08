-- TA_MIX_PRAHA table____________________________________________________

-- deletes error lines and errorInfo column
delete from TA_bakeries_praha
where "errorInfo" != ''
;

alter table TA_bakeries_praha drop column "errorInfo";

delete from TA_coftea_praha
where "errorInfo" != ''
;

alter table TA_coftea_praha drop column "errorInfo";

delete from TA_desserts_praha
where "errorInfo" != ''
;

alter table TA_desserts_praha drop column "errorInfo";

--- creates a new table from united tables
create table "TA_MIX_PRAHA" as 
select distinct * from TA_bakeries_praha
union
select distinct * from TA_barspubs_praha
union
select distinct * from TA_coftea_praha
union
select distinct * from TA_desserts_praha
;

--- deletes empty ID (rev_url) - no reviews for these places yet
delete from ta_mix_praha
where "rev_url" = '';

-- TA_REST_PRAHA table_____________________________________________________

--- deletes error lines and column
delete from ta_rest_praha
where "errorInfo" != '';

alter table ta_rest_praha drop column "errorInfo";

--- deletes empty ID (rev_url) - no reviews for these places yet
delete from ta_rest_praha
where "rev_url" = '';
