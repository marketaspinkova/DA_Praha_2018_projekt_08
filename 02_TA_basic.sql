-- TA_MIX_PRAHA table____________________________________________________

-- deletes error lines and errorInfo column
/* While scraping data, several times errors occured and data for a certain review were not downloaded. 
In this case column errorInfo. Solution: first remove rows where errorInfo is not empty, then remove column errorInfo */

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

create table ta_rest_praha_cleaned as
select ta.*
from ta_rest_praha ta;

-- from Geneea app in Keboola I got files with language detection - analysis-result-documents

create table ta_mix_praha_lang as
select ta.*, an."language"
from ta_mix_praha ta
join "analysis-result-documents" an
on ta."rev_url" = an."rev_url";

create table TA_rest_praha_lang as
select c.*,
an."language"
from ta_rest_praha_cleaned c
join "analysis-result-documents" an
on c."rev_url" = an."rev_url";
