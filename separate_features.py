# The goal is to separate values in column FEATURES. There are 83 possible values in different combinations.
# The values always start with a capital letter. However there is no separator. We are going to use a self-made function
# which looks for places where lower case precedes upper case and places a separator (comma) between them.
# For it to work properly we first need to change some values so that the function applies only to desired places.

# function
def separate_camel(text):
   import re
   text = re.findall('^[a-z]+|[A-Z][^A-Z]*', text)
   text = (", ").join(text)
   return(text)

import pandas

# restaurants table

rest = pandas.read_csv('in/tables/RESTU_APIFY_RESTAURANTS.csv', encoding='utf-8')

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Snez, co muzes", "Snez co muzes") for x in range(len(rest["FEATURES"]))]
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("300 - 600 Kc", "Od 300 do 600 kc") for x in range(len(rest["FEATURES"]))]
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Do 300 Kc", "Do 300 kc") for x in range(len(rest["FEATURES"]))]
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Nad 600 Kc", "Nad 600 kc") for x in range(len(rest["FEATURES"]))]
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Wi-Fi", "Wi-fi") for x in range(len(rest["FEATURES"]))]
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("V blizkosti MHD", "V blizkosti mhd") for x in range(len(rest["FEATURES"]))]
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("AMEX", "Amex") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [separate_camel(rest["FEATURES"][x]) for x in range(len(rest["FEATURES"]))]

rest.to_csv(path_or_buf='out/tables/RESTU_APIFY_RESTAURANTS_2.csv', encoding='utf-8', index=False)

# reviews table

rev = pandas.read_csv('in/tables/RESTU_APIFY_REVIEWS.csv', encoding='utf-8')

rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("Snez, co muzes", "Snez co muzes") for x in range(len(rev["FEATURES"]))]
rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("300 - 600 Kc", "Od 300 do 600 kc") for x in range(len(rev["FEATURES"]))]
rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("Do 300 Kc", "Do 300 kc") for x in range(len(rev["FEATURES"]))]
rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("Nad 600 Kc", "Nad 600 kc") for x in range(len(rev["FEATURES"]))]
rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("Wi-Fi", "Wi-fi") for x in range(len(rev["FEATURES"]))]
rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("V blizkosti MHD", "V blizkosti mhd") for x in range(len(rev["FEATURES"]))]
rev["FEATURES"] = [str(rev["FEATURES"][x]).replace("AMEX", "Amex") for x in range(len(rev["FEATURES"]))]

rev["FEATURES"] = [separate_camel(rev["FEATURES"][x]) for x in range(len(rev["FEATURES"]))]

rev.to_csv(path_or_buf='out/tables/RESTU_APIFY_REVIEWS_2.csv', encoding='utf-8', index=False)
