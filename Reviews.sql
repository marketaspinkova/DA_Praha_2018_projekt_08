--preparing restu for union

alter table "RESTU_APIFY_REVIEWS_2-csv"
add column title varchar;

--preparing TA for union

alter table ta_all_praha_reviews
add column web varchar(50);

update ta_all_praha_reviews
set web = 'TA';

update ta_all_praha_reviews
set "features" = "type" || ', ' || "subtype" || ', ' || "features";

create table reviews as
select rev_url, date, title, text, score_review, environment, food, staff, rest_id, name, features, score_restaurant, web
from "RESTU_APIFY_REVIEWS_2-csv"
union
select "rev_url" rev_url, "date" date, "title" title, "text" text, score_review, "rev_atmosphere" environment, 
    "rev_food" food, "rev_service" staff, rest_id, "name" name, "features" features, score_restaurant, web 
from ta_all_praha_reviews;

--adding review id from url

alter table reviews
add column rev_id varchar;

update reviews
set rev_id = split_part(rev_url, '-', 4)
where web = 'TA';

update reviews
set rev_id =  (split_part(rev_url, '/', 2) || split_part(rev_url, '/', 4))
where web = 'Restu';