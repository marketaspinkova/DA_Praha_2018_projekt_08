-- id (part of url)

alter table restu_apify_all
add column rest_id varchar(200);

update restu_apify_all
set rest_id = split_part(url, '/', 4);

-- source (column web)

alter table restu_apify_all
add column web varchar(10);

update restu_apify_all
set web = 'Restu';

-- removing diacritcs for further work with features - regex function "separate_camel", which we would be using in the next step, 
-- does not work with czech diacritics
update restu_apify_all
set features = translate(features,'áéěíýóúůžščřďťňÁÉÍÝÓÚŮŽŠČŘĎŤŇ','aeeiyouuzscrdtnAEIYOUUZSCRDTN');

-- reviews
create table restu_apify_reviews as
select distinct rest_ID, name, score_restaurant, rev_url, "DATE", "TEXT", score_review, environment, food, staff, username, features, web 
from restu_apify_all -- 67255 texts
where text != '';

-- restaurants
create table restu_apify_restaurants as
select distinct rest_ID, name, address, features, score_restaurant, web
from restu_apify_all
where text != '';
