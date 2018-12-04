// created by https://www.apify.com/, https://www.apify.com/yonny/iNuqo-api-tripadvisor-com,
// just a bit modified by me

/*When writing a review, people can score food, service, atmosphere and value. In the script atmosphere was missing so we had to add it.
TripAdvisor diferentiates "Establishment type" and Apify crawler was set to download only places with label "Restaurants". Therefore we created several crawlers, each of them downloading one of the other labels - Dessert, Coffee & Tea, Bakeries and Bars & Pubs. With our current knowledge we would be able to download all the data by expanding the original crawler, unfortunately, that was not the case at that time. */

/*
APIFY CRAWLER SETUP:

START URLs:
https://www.example.com/

PRESUDO-URLs:
https://www.tripadvisor.com/Search?q=[.*]
https://www.tripadvisor.com/[.*Review(.*)]
https://www.tripadvisor.com/[.*-oa(\d+)-(.*)]
https://www.tripadvisor.com/[.*-g(\d+)(.*)]

CLICKABLE ELEMENTS:
.ui_pagination.is-centered > a:last-of-type

CUSTOM DATA
{"mode": "normal","locations": ["https://www.tripadvisor.com/Restaurants-g274707-zfg9901-Prague_Bohemia.html"] }
*/

function pageFunction(context){
    
	// if customData is object
	if (typeof(context.customData) === 'object'){
			context.customData = JSON.stringify(context.customData);
	}
	
	
	var $ = context.jQuery;
	$.ajaxSetup({async:false});
	var _ = context.underscoreJs;
	context.saveCookies();
	var months ={
			'January' : 1,
			'February' : 2,
			'March' : 3,
			'April' : 4,
			'May' : 5,
			'June' : 6,
			'July' : 7,
			'August' :8,
			'September' :9,
			'October' :10,
			'November' :11,
			'December' :12
	};
	
	function normalize_url(url){
			
			if (typeof(url) !== 'undefined'){
					if (url.indexOf('//') === 0){
							url = url.replace('//', 'http://');
					} else if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0 ){
							url = window.location.origin + url;
					}
			}
			return url;
	}
	
	function pad(d) {
			d=parseFloat(d);
			return (d < 10) ? '0' + d.toString() : d.toString();
	}
	//
	//for YYYY-MM-DD
	function reorder_date( date, reorder ){
			if ( date !== '' ){
					return date.split('-')[reorder[0]]+'-'+pad(date.split('-')[reorder[1]])+'-'+pad(date.split('-')[reorder[2]]);
			} else { return '0000-00-00'; }
	}
	
	var getValue = function (storeId, key, callback) {
			var url = 'https://api.apify.com/v2/key-value-stores/' + storeId + '/records/' + key;
			console.log(url);
			$.ajax({
					url: url,
					method: 'GET',
					async: true,
					success: function (resp) {
							try {
									if (callback) console.log(resp); callback(resp);
							} catch (e) {
									console.log('Error in callback');
									console.log(e);
									context.finish(e);
							}
					},
					error: function (xhr, e1, e2) {
							console.log('getValue, ' + e1 + ': ' + e2);
							if (callback) {
									callback(null);
							}
					}
			});
	};
	
	// utility function for waiting until an element is loaded
	function waitForCond(condition, callback, i){
			if(condition()){callback(true);}
			else if(i > 20){callback(null);}
			else{setTimeout(function(){waitForCond(condition, callback, i ? i+1 : 1);}, 500);}
	}
	
	var startedAt = Date.now();
	
	function get_expanded_reviews(res1){
			//var res = JSON.res2;
			//widgetEvCall('handlers.clickExpand',$('.taLnk.ulBlueLinks').click(),$('.taLnk.ulBlueLinks')); //script from webpage
			//$('.taLnk.ulBlueLinks:contains("More")').focus().mouseenter().click();
			//$('.partial_entry span').focus().mouseenter().click();
			var id_list = [];
			$('div[id^="review_"]').each(function(){
					id_list.push( $(this).attr('id').split('review_')[1] );
			});
			
			var postData = 'reviews=' + id_list.join('%2C') + '&widgetChoice=EXPANDED_HOTEL_REVIEW_HSX&haveJses=global_error%2Camdearly%2Ctaevents%2Cjquery%2Cmootools%2Ctripadvisor%2Ceatery-detail-2col%2Cdesktop-calendar-templates-dust-en_US%2Clong_lived_global_legacy%2Cshort_lived_global_legacy&haveCsses=long_lived_global_legacy%2Clocation_detail_rebrand&Action=install';
			
			var src2 = '';
			$.post( 'https://www.tripadvisor.com/OverlayWidgetAjax?Mode=EXPANDED_HOTEL_REVIEWS&metaReferer=Restaurant_Review', postData ).done(function(data){
					src2 = data;
			});
			
			setTimeout(function(){enter_full_reviews(res1, src2);},2000);
	}
	
	function enter_full_reviews(res1,src2){
			var result1 = res1;
			
			var result_rev ={};
							
			result_rev.author = null;
			result_rev.score = null;
			result_rev.date = null;
			result_rev.title = null;
			result_rev.text = null;
			result_rev.response = null;
			result_rev.rev_value = null;
			result_rev.rev_service = null;
			result_rev.rev_food = null;
			result_rev.rev_atmosphere = null;
			result_rev.rev_url = null;
			
			result_rev.rev_value = null;
			result_rev.rev_service = null;
			result_rev.rev_food = null;
			result_rev.rev_atmosphere = null;

			var result = [];
			var to_the_next_page = true;
			
			if ($('div[id^="review_"]').length > 0 && to_the_next_page === true){
					console.log($('div.prv_map.clickable img').attr('src'));
					
					var date_old = context.request.interceptRequestData.DATE !== null ? context.request.interceptRequestData.DATE : '0000-00-00';
					
					$('div[id^="review_"]').each(function(){
							console.log('CYCLE');
							var date_ = $(this).find('.ratingDate').attr('title').split(', ')[1].trim()+'-'+pad(months[$(this).find('.ratingDate').attr('title').match(/\D+/)[0].trim()])+'-'+pad($(this).find('.ratingDate').attr('title').split(', ')[0].match(/\d+/)[0]);
							console.log(date_);
							
							if (context.request.interceptRequestData.mode === 'recheck'){
									console.log(JSON.stringify(context.request.interceptRequestData));
									console.log(Date.parse(context.request.interceptRequestData.DATE));
									console.log(Date.parse(date_));
									
									if ( Date.parse(date_old) >= Date.parse(date_) ){
											
											to_the_next_page = false;
											return false;
									}
							}
							console.log($(this).find('.partial_entry').length);
							if (to_the_next_page === true){
									var result_rev ={};

									result_rev.author = $(this).find('span.expand_inline.scrname').text().trim();
									result_rev.score = parseFloat($(this).find('span[class^="ui_bubble_rating bubble_"]').attr('class').split(' bubble_')[1]) / 10 ;
									
									result_rev.date = date_;
									
									result_rev.title = $(this).find('.noQuotes').text();
									result_rev.text = $(this).find('.partial_entry').eq(0).html( $(this).find('.partial_entry').eq(0).html().replace(/<br>/g,'\n\n') ).text().trim();
									result_rev.response = $(this).find('.partial_entry').length >1 ? $(this).find('.partial_entry').eq(1).html( $(this).find('.partial_entry').eq(1).html().replace(/<br>/g,'\n\n') ).text().trim() : null;
									result_rev.rev_value = null;
									result_rev.rev_service = null;
									result_rev.rev_food = null;
									result_rev.rev_atmosphere = null;
									result_rev.rev_url = window.location.origin + $(this).find('.noQuotes').parent().attr('href');
							
									//console.log();
									
									if ( $(this).find('.recommend').length > 0 ){
											console.log('//////////////////////////////// more review scores');
											if ( $(this).find('.recommend .recommend-description:contains("Value")').length > 0){
													result_rev.rev_value = parseFloat($(this).find('.recommend .recommend-description:contains("Value")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											if ( $(this).find('.recommend .recommend-description:contains("Service")').length > 0){
													result_rev.rev_service = parseFloat($(this).find('.recommend .recommend-description:contains("Service")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											if ( $(this).find('.recommend .recommend-description:contains("Food")').length > 0){
													result_rev.rev_food = parseFloat($(this).find('.recommend .recommend-description:contains("Food")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											if ( $(this).find('.recommend .recommend-description:contains("Atmosphere")').length > 0){
													result_rev.rev_atmosphere = parseFloat($(this).find('.recommend .recommend-description:contains("Atmosphere")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											
											
									}
									
									//checking presentation of expanded view for concrete review
									var expanded = $('div[id^="' + $(this).attr('id') + '"]', src2);
									if ( expanded.length === 1 ){
											//extraction from expanded view gotten from XHR
											if ( expanded.find('.recommend .recommend-description:contains("Value")').length > 0){
													result_rev.rev_value = parseFloat(expanded.find('.recommend .recommend-description:contains("Value")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											if ( expanded.find('.recommend .recommend-description:contains("Service")').length > 0){
													result_rev.rev_service = parseFloat(expanded.find('.recommend .recommend-description:contains("Service")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											if ( expanded.find('.recommend .recommend-description:contains("Food")').length > 0){
													result_rev.rev_food = parseFloat(expanded.find('.recommend .recommend-description:contains("Food")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											if ( expanded.find('.recommend .recommend-description:contains("Atmosphere")').length > 0){
													result_rev.rev_atmosphere = parseFloat(expanded.find('.recommend .recommend-description:contains("Atmosphere")').prev('div').attr('class').split(' bubble_')[1]) / 10;
											}
											result_rev.text = expanded.find('.partial_entry').eq(0).html( expanded.find('.partial_entry').eq(0).html().replace(/<br>/g,'\n\n') ).text().trim();
											result_rev.response = expanded.find('.partial_entry').length >1 ? expanded.find('.partial_entry').eq(1).html( expanded.find('.partial_entry').eq(1).html().replace(/<br>/g,'\n\n') ).text().trim() : null;
									}
									
									console.log('################################ RUN');
									//if ()
									result.push( JSON.parse( JSON.stringify( _.extend(result_rev, result1) ) ) );
							}
							
					});
			} else {
					if (context.request.interceptRequestData.mode !== 'recheck'){
							
							result.push( JSON.parse( JSON.stringify( _.extend(result_rev, result1) ) ) );
					}
			}
			console.log('################################ END');
			if (context.request.interceptRequestData.mode === 'recheck'){
					if (result.length===0){
							if (context.request.url.replace(/-or\d+-/,'-') !== context.request.url){
									context.skipOutput();
							} else {
									result.push( JSON.parse( JSON.stringify( _.extend(result_rev, result1) ) ) );
							}
					} else {
							if (to_the_next_page === true && $('.nav.next.taLnk').length===1 && JSON.parse(context.customData).pagination !== false ){
									context.enqueuePage({
											url: context.request.url.replace(/-Reviews(-or\d+)?-?/,'-Reviews-or'+$('.nav.next.taLnk').data('offset')+'-'),
											label: 'detail',
											interceptRequestData: context.request.interceptRequestData,
											queuePosition: 'FIRST'
									});
							}
					}
			} else {
					if (to_the_next_page === true && $('.nav.next.taLnk').length===1 && JSON.parse(context.customData).pagination !== false ){
							context.enqueuePage({
									url: context.request.url.replace(/-Reviews(-or\d+)?-?/,'-Reviews-or'+$('.nav.next.taLnk').data('offset')+'-'),
									label: 'detail',
									interceptRequestData: context.request.interceptRequestData,
									queuePosition: 'FIRST'
							});
					}
			}
			context.finish(result);
	
	}
	
	function pageEnqueuer(){
			//enqueue all places and next pages
			if (['get_urls_only','normal'].indexOf(context.request.interceptRequestData.mode)!==-1){
					$('.pageNumbers a, .geo_name a, .geoList a, .pagination a').each(function(){
							context.enqueuePage({
									url: normalize_url( $(this).attr('href') ),
									label: 'page',
									queuePosition: 'FIRST',
									interceptRequestData: context.request.interceptRequestData
							});
					});
					/*$('.result .result_wrap').each(function(){
							if ((window.location.origin +'/'+ $(this).attr('onclick').split("'/")[1].split("'")[0]).indexOf('arluccio') !==-1){
									context.enqueuePage({
											url: window.location.origin +'/'+ $(this).attr('onclick').split("'/")[1].split("'")[0],
											label: 'detail',
											interceptRequestData: context.request.interceptRequestData
									});
							}
					});*/
					
			}
			
			if (context.request.interceptRequestData.mode === 'get_urls_only'){
					context.willFinishLater();
					var results = [];
					$('a.property_title').each(function(){
							results.push({restaurant_url: normalize_url( $(this).attr('href') )});
					});
					context.finish(results);
			}else{
					context.skipOutput();
					$('a.property_title').each(function(){
							context.enqueuePage({
									url: window.location.origin + $(this).attr('href'),
									label: 'detail',
									interceptRequestData: context.request.interceptRequestData
							});
					});
					
			}
			//context.saveSnapshot();
			
	}
	
	//place detail page
	if (context.request.label === 'test'){
			context.enqueuePage({
					url: context.request.url,
					label: 'detail',
					interceptRequestData: {mode: 'normal'},
					uniqueKey: Math.random()
			});
			context.skipOutput();
			
	} else if(context.request.label === 'detail'){
			console.log(context.request.url);
			console.log(context.request.loadedUrl);
			
			//e-mail regex
			var mReg = /(([^<>()\[\]\\.,;:\s@'"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
			
			//JSON-LD schema
			var schema = JSON.parse($('script[type="application/ld+json"]').text());
			
			//function for loading e-mail
			var getEmail = function(){
					var mail = $('.ui_icon.email').next('a[target]');
					
					if ( mail.length !== 0 ){
							mail = mail.attr('href');
					} else {
							mail = '';
					}
					
					mail = mail ? mail.split(':') : null;
					
					return mail ? mail[mail.length - 1] : 1;
			}
			
			//function for loading website link
			var getWebLink = function(){
					
					return $('.blEntry.website');
			}
			
			//wait for e-mail and website link to appear
			context.willFinishLater();
			
			waitForCond(function(){return getEmail() && getWebLink();}, function(){
					
					//get basic info
					var features = $('div.title:contains(Restaurant features)').next('.content').text().trim();
					var result1 = {
							name: schema.name,
							type: $('.header_popularity a').text().split(/–|(in)/)[0].trim(),
							subtype: $('.header_links.rating_and_popularity').text().trim(),
							street: schema.address.streetAddress,
							postal: schema.address.postalCode,
							city: schema.address.addressLocality,
							country: schema.address.addressCountry.name,
							telephone: $('.ui_icon.phone').next('span:not([class])').text().trim(),
							email: getEmail(), 
							features: features,
							restaurant_url: context.request.url.replace(/-or\d+-/,'-'),
							ranking: $('.header_popularity.popIndexValidation').text().trim(),
							ext_id: context.request.interceptRequestData.EXT_ID
							
					};
					//console.log(lazyImgs);
					result1.latitude=null;
					
					if ( typeof(lazyImgs) !== 'undefined' ){
							lazyImgs.forEach(function(e){
									if (e.data.indexOf('&center=')!==-1){
											if (result1.latitude === null){
													result1.latitude = e['data'].split('center=')[1].split('&')[0].split(',')[1];
													result1.longitude = e['data'].split('center=')[1].split('&')[0].split(',')[0];
											}
									}
							});
					}
					//get encoded website redirect link
					var websiteLink = getWebLink();
					
					get_expanded_reviews(result1);
			});
	} else if (context.request.label === 'start'){
			context.skipOutput();
			console.log(context.customData);
			var custom_json = JSON.parse(context.customData);
			
			if (['get_urls_only','normal'].indexOf(custom_json.mode)!==-1){
					custom_json.locations.forEach(function(item){
							context.enqueuePage({
									url: item,
									label: 'page',
									interceptRequestData: custom_json
							});
					});
					
			} else if (custom_json.mode === "recheck") {
					
					if ( typeof(custom_json.url_list) !== 'undefined' ) {
							custom_json.url_list.forEach(function(item){
									context.enqueuePage({
											url: item.URL.replace(/-or\d+-/,'-'),
											label: 'detail',
											interceptRequestData: {mode: custom_json.mode, DATE: typeof(item.cutoff_date) !== 'undefined' ? reorder_date(item.cutoff_date, '012') : null , EXT_ID: item.id }
									});
							});
					}
					
					if ( typeof(custom_json.storeId) !== 'undefined' && typeof(custom_json.key) !== 'undefined') {
							console.log('#################################################');
							context.willFinishLater();
							// context.customData is JSON when we run it from UI, otherwise it is Object
							var customData = (context.customData) ? (typeof context.customData === 'string') ? JSON.parse(context.customData) : context.customData : {};
							console.log(customData.storeId, customData.key);
							getValue(customData.storeId, customData.key, function (data) {
									data.split('\n').forEach(function (line, index) {
											line =line.replace(/\"/g,'');
											console.log(line);
											if (index === 0) return; // header line
											var id = line.split(",")[0];
											var url = line.split(",")[1];
											var cutoff_date = line.split(",")[2];
											if (url) {
													context.enqueuePage({
															url: url,
															interceptRequestData: {mode: custom_json.mode, DATE: typeof(cutoff_date) !== 'undefined' ? reorder_date(cutoff_date, '012')  : null , EXT_ID: id },
															label: 'detail'
													});
													console.log( reorder_date(cutoff_date, '012') );
											}
									});
									context.finish();
							});
					
					}
			}
	}
	
	
	else if (context.request.label === 'page_x'){
			
			function wait4next(){
					if (Date.now() - startedAt > 30000){
							context.enqueuePage({
									url: context.request.url,
									interceptRequestData: context.request.interceptRequestData,
									label: context.request.label,
									uniqueKey: Math.random()
							});
							context.skipOutput();
							context.finish();
							return;
					}
					if ($('.pagination-link.is-current').data('page') === 1){
							setTimeout(wait4next,500);
							return;
					}
					pageEnqueuer();
					context.finish();
			}
			setTimeout(wait4next,500);
			context.willFinishLater();
	} else {
			pageEnqueuer();
	}
	
}