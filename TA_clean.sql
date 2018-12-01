-- table all reviews TA
create table ta_all_praha as 
select distinct * from ta_rest_praha_lang
UNION
SELECT distinct * from ta_mix_praha_lang
;

-- id added - from restaurant url

alter table ta_all_praha
add column rest_id varchar (1000);

update ta_all_praha
set rest_id = left("restaurant_url", 62);

update ta_all_praha
set rest_id = right(rest_id, 8);

-- update address - for geocoding - 
-- in most cases geocoding apps need a city in the address to determine correct coordinates 
update ta_all_praha
set "street" = 'Praha, ' || "street";

-- correcting longitude and latitude
-- here we found out that longitude and latitude values are swapped in apify crawler

alter table ta_all_praha
rename column "latitude" to "longitud";

alter table ta_all_praha
rename column "longitude" to "latitud";

alter table ta_all_praha
rename column "latitud" to "latitude";

alter table ta_all_praha
rename column "longitud" to "longitude";

-- not distinct for restaurants, no info about reviews
/* TripAdvisor platform has several ways of ranking restaurants. 
One restaurant can appear in more than one ranking, which causes duplicities. 
As ranking does not bring any important information, we can remove this column. */

alter table ta_all_praha
drop column "ranking";

-- deleteing reviews + restaurants with no text reviews
-- We decided to work only with text reviews (and restaurants with text reviews).
delete from ta_all_praha
where "text" = '';

-- table reviews and restaurants
create table ta_all_praha_rec as
select distinct * from ta_all_praha;

-- removing duplicities 
/* Some restaurants have identical url = rest_id. We found out that these webpages were probably 
created by mistake - someone created a new restaurant, which already had a different webpage. 
All of them had just one review and neither was in English or Czech so we deleted them. */

create table duplicity as
select rest_id, count(1) pocet from
    (select distinct rest_id, "name", "street", "postal", "features", 
    "subtype", "type", "longitude", "latitude"
from ta_all_praha_rec)
group by rest_id
order by pocet desc
;

delete from duplicity
where pocet != 1;

-- counting score for each restaurant - mean from reviews score
/* In TA dataset we did not have an overall score of the restaurant, so we counted it: sum(review score) / sum(reviews) */

create table score_y as
select rest_id, try_to_number("score") "score"
from ta_all_praha_rec
where "score" != ''
;

create table score as
select rest_id, (sum("score") / count(1)) score_restaurant
from score_y
group by rest_id
;

-- review table
create table ta_all_praha_reviews as  --156324
select d.rest_id, r."name", s.score_restaurant, r."street", r."postal", r."features", r."subtype", r."type", 
    r."longitude", r."latitude", r."rev_url", r."title", r."text", r."date", r."response", r."rev_atmosphere", r."rev_food", 
    r."rev_service", r."rev_value", r."score" score_review,  r."language", r."author"
from ta_all_praha_rec r
left join duplicity d
on d.rest_id = r.rest_id
left join score s
on r.rest_id = s.rest_id
;

--restaurants table
create table ta_all_praha_restaurants as  --4765
select distinct d.rest_id, r."name", s.score_restaurant, r."street", r."postal", 
    r."features", r."subtype", r."type", r."longitude", r."latitude"
from duplicity d
left join ta_all_praha_rec r
on d.rest_id = r.rest_id
left join score s
on r.rest_id = s.rest_id
;
