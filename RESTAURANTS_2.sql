-- correcting queries with errors in geocoding
-- manually checking on google maps and updating or deleting rows

-- error column in the extractor

select * from restaurants_geodone
where "exceptionMessage" != '' 
; 

select * from restaurants -- Pizza House Praha Borislavka
where address = 'Praha, Evropska'
; 

update restaurants
set address = 'Praha, Evropska 599/69'
where address = 'Praha, Evropska'
;

select * from restaurants --Amato Gelateria & Caffe
where address = 'Praha, Hermanova 597/61 Entrance From Kamenicka Street'
; 

update restaurants
set address = 'Praha, Hermanova 597/30'
where address = 'Praha, Hermanova 597/61 Entrance From Kamenicka Street' 
;

-- Checking restaurants with missing addresses

select *
from restaurants
where address = 'Praha, '
; 

-- Gustus with no address - 1 review and in Russian
delete from restaurants
where rest_id = 'd1410146'
;

-- Starbucks with no address - 1 review in Chinese
delete from restaurants
where rest_id = 'd1518746'
;

-- correcting queries where country is not CZ

select *
from restaurants_geodone
where "countryCode" != 'CZ'
;

select * from restaurants -- Nola & Cafe
where address = 'Praha, Na Strzi 1683/40 Next To The Post Office'
;

update restaurants
set address = 'Praha, Na Strzi 1683/40'
where address = 'Praha, Na Strzi 1683/40 Next To The Post Office'
;

select * from restaurants -- Sousto
where address = 'Praha, Ujezd 421/16 Close To The Bridge To The National Tneatre'
;

update restaurants
set address = 'Praha, Ujezd 421/16'
where address = 'Praha, Ujezd 421/16 Close To The Bridge To The National Tneatre'
;

/* With addresses corrected we sent th list of the four corrected addresses to Geocoding Augmentation in Keboola 
and then added the data to the resulting table. It would be more convenient to just correct the table RESTAURANTS 
and send it to Geocoding Augmentation again, however, Google geocoding is a paid service and the limit 
for free queries is quite low. Therefore we try to limit the amount of queries we send there. */

-- a new table with geodata from google maps
-- to have the scores comprehensively distributed, we rounded them

create table restaurants_2 as
select distinct r.rest_id, r.name, r.address, r.features, try_to_number(r.score_restaurant) score_restaurant, 
  r.web, g."latitude" latitude, g."longitude" longitude
from restaurants r
left join restaurants_geodone g
on r.address = g."query"
;

-- corrected latitude and longitude

update restaurants_2
set latitude = '50.1003257'
where address = 'Praha, Hermanova 597/30'
;

update restaurants_2
set longitude = '14.4274943'
where address = 'Praha, Hermanova 597/30'
;

update restaurants_2
set latitude = '50.0981157'
where address = 'Praha, Evropska 599/69'
;

update restaurants_2
set longitude = '14.3621006'
where address = 'Praha, Evropska 599/69'
;

update restaurants_2
set latitude = '50.0486294'
where address = 'Praha, Na Strzi 1683/40'
;

update restaurants_2
set longitude = '14.4408091'
where address = 'Praha, Na Strzi 1683/40'
;


update restaurants_2
set latitude = '50.0815094'
where address = 'Praha, Ujezd 421/16'
;

update restaurants_2
set longitude = '14.4047888'
where address = 'Praha, Ujezd 421/16'
;



