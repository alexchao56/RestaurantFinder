setwd("~/Desktop/RestaurantFinder")

library(jsonlite)

business = fromJSON(txt = "data/yelp_academic_dataset_business_edit.json")
checkins = fromJSON("data/yelp_academic_dataset_checkin_edit.json")
# tips = fromJSON("data/yelp_academic_dataset_tip_edit.json")
# users = fromJSON("data/yelp_academic_dataset_user_edit.json")

#Restaurants OR Food
category_filter = c("Food", "Restaurants")

categories = business$categories
#Boolean vector
containsCategory = list()
for (i in 1:length(categories)) {
    category = categories[i]
    category = unlist(category)
    #print(category)
    a = is.element("Food", category)
    #print(a)
    b = is.element("Restaurants", category)
    #print(b)
    c = is.element("Restaurant", category)
    containsCategory[i] = (a || b || c)
    containsCategory = unlist(containsCategory)
}

#Queries

business_subset = business[containsCategory, ]

nrow(business_subset[business_subset$state == "NV",])

unique(business_subset$city)

unique(business_subset$city[business_subset$state == "NV"])

length(business_subset$city[business_subset$city == "Anthem"])

length(grep(pattern = "Las Vegas", x = business_subset$city))



## Getting Waterloo
waterloo = business_subset[business_subset$city == "Waterloo",]
waterloo_attributes = waterloo$attributes
waterloo_hours = waterloo$hours
#Removing hours
waterloo = waterloo[,-3]
#Removing attributes
waterloo = waterloo[,-13]
#Removing categories
waterloo = waterloo[,-4]
#Removing neighborhoods
waterloo = waterloo[,-7]
waterloo$reservations = waterloo_attributes$"Takes Reservations"
waterloo$wifi = waterloo_attributes$"Wi-Fi"
waterloo$takeout = waterloo_attributes$"Take-out"
waterloo$creditCards = waterloo_attributes$"Accepts Credit Cards"

# Fixing NA values for logical vectors
for (i in 1:ncol(waterloo)) {
    if ((class(waterloo[,i]) == "logical")) {
        waterloo[,i][is.na(waterloo[,i])] = FALSE
    }
}

#Fixing NA values for wifi
waterloo$wifi[is.na(waterloo$wifi)] = "no"

#Unlisting the Credit Cards
waterloo$creditCards[sapply(waterloo$creditCards, is.null)] = FALSE
waterloo$creditCards = unlist(waterloo$creditCards)
    
write.csv(waterloo, "waterlooAttributes.csv")
write.csv(waterloo_hours, "waterlooHours.csv")
