import pandas
rest = pandas.read_csv('in/tables/RESTAURANTS_2.csv', encoding='utf-8')

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Platba kartou", "Accepts Credit Cards") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Accepts Mastercard", "Accepts Credit Cards") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Accepts Visa", "Accepts Credit Cards") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Obchodni obed", "Business meetings") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Business jednani", "Business meetings") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("V blizkosti mhd", "Close to public transport") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Rozvoz jidla", "Delivery") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Pejsci vitani", "Dog friendly") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Wi-fi", "Free Wifi") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Do 300 kc", "Up to 300 CZK") for x in range(len(rest["FEATURES"]))]	

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Od 300 do 600 kc", "300-600 CZK") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Nad 600 kc", "More than 600 CZK") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Bezlepkove menu", "Gluten Free Options") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Skupinove akce", "Large groups") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Stravenky", "Meal vouchers") for x in range(len(rest["FEATURES"]))]
	
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Zahradka", "Outdoor Seating") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Takeout", "Take away") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Vodovoda", "Tap water") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Vegetarianske menu", "Vegetarian Friendly") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Svatba", "Weddings") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Bezbarierove restaurace", "Wheelchair Accessible") for x in range(len(rest["FEATURES"]))]			
	
rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Detske hriste", "Children friendly") for x in range(len(rest["FEATURES"]))]

rest["FEATURES"] = [str(rest["FEATURES"][x]).replace("Detsky koutek", "Children friendly") for x in range(len(rest["FEATURES"]))]

rest.to_csv(path_or_buf='out/tables/RESTAURANTS_3.csv', encoding='utf-8', index=False)
