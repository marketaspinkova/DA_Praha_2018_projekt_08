--preparing restu for union
update "RESTU_APIFY_RESTAURANTS_2-csv"
set address = 'Praha, ' || address;

update "RESTU_APIFY_RESTAURANTS_2-csv"
set address = replace(address, ', Praha');

alter table "RESTU_APIFY_RESTAURANTS_2-csv"
add column latitude varchar(50);

alter table "RESTU_APIFY_RESTAURANTS_2-csv"
add column longitude varchar(50);

--preparing TA for union

alter table ta_all_praha_restaurants
add column web varchar(50);

update ta_all_praha_restaurants
set web = 'TA';

update ta_all_praha_restaurants
set "features" = "type" || ', ' || "subtype" || ', ' || "features";

create table restaurants as
select rest_id, name, address, features, score_restaurant, web, latitude, longitude
from "RESTU_APIFY_RESTAURANTS_2-csv"
union
select rest_id, "name" name, "street" address, "features" features, score_restaurant, web, 
    "latitude" latitude, "longitude" longitude
from ta_all_praha_restaurants;

/*
Preparation for mapping restaurants
6391 rows
select distinct name from restaurants;  -- 5983
select distinct name, address from restaurants
order by address; -- 6385
*/

update restaurants
set name = replace(name, 'Restaurace ');
-- 6375

update restaurants
set name = replace(name, 'Restaurant ');
--6375

update restaurants
set name = translate(name,'áéěíýóúůžščřďťňÁÉÍÝÓÚŮŽŠČŘĎŤŇ','aeeiyouuzscrdtnAEIYOUUZSCRDTN');

update restaurants
set address = translate(address,'áéěíýóúůžščřďťňÁÉÍÝÓÚŮŽŠČŘĎŤŇ','aeeiyouuzscrdtnAEIYOUUZSCRDTN');
-- biggest effect

update restaurants
set name = initcap(name);
-- 6106

update restaurants
set address = initcap(address);
-- 6096
