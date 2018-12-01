-- cleaning data

delete from restu_apify
where "errorInfo" !='';

alter table restu_apify
drop column "errorInfo";

delete from restu_apify
where "restaurantData_restaurantName" ='';

--reorganizing table

create table restu_apify_0 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features,
    "individualReviews_0_rev_url" rev_url, "individualReviews_0_date" "DATE",
    "individualReviews_0_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_0_totalRating" score_review, "individualReviews_0_totalRating" environment, 
    "individualReviews_0_foodRating" food, "individualReviews_0_staffRating" staff, "individualReviews_0_username" username
from restu_apify;

create table restu_apify_1 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_1_rev_url" rev_url, "individualReviews_1_date" "DATE",
    "individualReviews_1_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_1_totalRating" score_review, "individualReviews_1_totalRating" environment, 
    "individualReviews_1_foodRating" food, "individualReviews_1_staffRating" staff, "individualReviews_1_username" username
from restu_apify;

create table restu_apify_2 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_2_rev_url" rev_url, "individualReviews_2_date" "DATE",
    "individualReviews_2_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_2_totalRating" score_review, "individualReviews_2_totalRating" environment, 
    "individualReviews_2_foodRating" food, "individualReviews_2_staffRating" staff, "individualReviews_2_username" username
from restu_apify;

create table restu_apify_3 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_3_rev_url" rev_url, "individualReviews_3_date" "DATE",
    "individualReviews_3_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_3_totalRating" score_review, "individualReviews_3_totalRating" environment, 
    "individualReviews_3_foodRating" food, "individualReviews_3_staffRating" staff, "individualReviews_3_username" username
from restu_apify;

create table restu_apify_4 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_4_rev_url" rev_url, "individualReviews_4_date" "DATE",
    "individualReviews_4_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_4_totalRating" score_review, "individualReviews_4_totalRating" environment, 
    "individualReviews_4_foodRating" food, "individualReviews_4_staffRating" staff, "individualReviews_4_username" username
from restu_apify;

create table restu_apify_5 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_5_rev_url" rev_url, "individualReviews_5_date" "DATE",
    "individualReviews_5_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_5_totalRating" score_review, "individualReviews_5_totalRating" environment, 
    "individualReviews_5_foodRating" food, "individualReviews_5_staffRating" staff, "individualReviews_5_username" username
from restu_apify;

create table restu_apify_6 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_6_rev_url" rev_url, "individualReviews_6_date" "DATE",
    "individualReviews_6_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_6_totalRating" score_review, "individualReviews_6_totalRating" environment, 
    "individualReviews_6_foodRating" food, "individualReviews_6_staffRating" staff, "individualReviews_6_username" username
from restu_apify;

create table restu_apify_7 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_7_rev_url" rev_url, "individualReviews_7_date" "DATE",
    "individualReviews_7_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_7_totalRating" score_review, "individualReviews_7_totalRating" environment, 
    "individualReviews_7_foodRating" food, "individualReviews_7_staffRating" staff, "individualReviews_7_username" username
from restu_apify;

create table restu_apify_8 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_8_rev_url" rev_url, "individualReviews_8_date" "DATE",
    "individualReviews_8_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_8_totalRating" score_review, "individualReviews_8_totalRating" environment, 
    "individualReviews_8_foodRating" food, "individualReviews_8_staffRating" staff, "individualReviews_8_username" username
from restu_apify;

create table restu_apify_9 as
select url, "restaurantData_restaurantName" name, "restaurantData_address" address, "restaurantData_features" features, 
    "individualReviews_9_rev_url" rev_url, "individualReviews_9_date" "DATE",
    "individualReviews_9_text" "TEXT", "restaurantData_review" score_restaurant, 
    "individualReviews_9_totalRating" score_review, "individualReviews_9_totalRating" environment, 
    "individualReviews_9_foodRating" food, "individualReviews_9_staffRating" staff, "individualReviews_9_username" username
from restu_apify;

create table restu_apify_all as
select distinct * from restu_apify_0
union
select distinct * from restu_apify_1
union
select distinct * from restu_apify_2
union
select distinct * from restu_apify_3
union
select distinct * from restu_apify_4
union
select distinct * from restu_apify_5
union
select distinct * from restu_apify_6
union
select distinct * from restu_apify_7
union
select distinct * from restu_apify_8
union
select distinct * from restu_apify_9
;
