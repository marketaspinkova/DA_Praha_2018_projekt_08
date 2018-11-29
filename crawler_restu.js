/*
APIFY CRAWLER SETUP:

START URLs:
https://www.restu.cz/[.+]/

PRESUDO-URLs:
https://www.restu.cz/[.+]/
https://www.restu.cz/[.+]/hodnoceni/#tabs
https://www.restu.cz/[.+]/hodnoceni/?page=[\d+]#restaurant-review-list-anchor
https://www.restu.cz/praha/?page=[\d+]

CLICKABLE ELEMENTS:
a.card-item-link, li#review a, p.restaurant-review-item__summary, ul.pagination li a
*/

function pageFunction(context) {

	var $ = context.jQuery;
    
    if ((! window.location.href.endsWith('/hodnoceni/#tabs')) && (! window.location.href.endsWith('#restaurant-review-list-anchor')))
        return;
    var overallData = {
        restaurantName: $(".restaurant-detail-heading-container h2").text(),
        review: $('figure.rating-chart figcaption').text(),
        address: $("address#restaurant-address").text(),
        features: $("ul.restaurant-desc-list a").text()
    };
    
    var reviews = []
    
    $('article.restaurant-review-item').each(function() {
        
            var food =  $(this).find(".review-item__rating-star-number:eq(0)").text();
            var staff = $(this).find(".review-item__rating-star-number:eq(1)").text();
            var env =   $(this).find(".review-item__rating-star-number:eq(2)").text();
        
        reviews.push({
            rev_url: $(this).find("a.restaurant-review-item-link").attr("href"),
            username: $(this).find("li.review-item__guest").text(),
            date: $(this).find("li.review-item__reservation span").attr("content"),
            text: $(this).find("p.restaurant-review-item__summary:eq(0)").text(),
            foodRating: food,
            staffRating: staff,
            environmentRating: env,
            totalRating: (parseInt(food, 10) + parseInt(staff, 10) + parseInt(env, 10)) / 3
        })
        
    });
    
    var result = {
        restaurantData: overallData,
        individualReviews: reviews
    }
    
    return result;
}
