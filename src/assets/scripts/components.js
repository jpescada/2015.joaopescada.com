window.JPescadaComponents = (function(app){

	'use strict';

	app.Components = {

		name: 'app.Components',

		initBookable: function(elem){ return _initBookable(elem); },

		initTestimonials: function(elem){ return _initTestimonials(elem); },

		initPrice: function(elem){ _initPrice(elem); },

		initReferrerAlert: function(referrer, queryFrom){ _initReferrerAlert(referrer, queryFrom); }
	};

	var KEYS = {
		SEEN_REFERRALS: 'jpescada-referrals'
	};

	// limits to only one element
	var _bookableElem,
		_testimonialsElem,
		_testimonialsList,
		_testimonialsListIndex = 0,
		_priceElem;

	function _initBookable(elem){

		if (!$(elem).length) {
			console.error('@ App.Components._initBookable() : Element doesn’t exist');
			return false;
		}

		if (_bookableElem) {
			console.error('@ App.Components._initBookable() : _bookableElem already inited');
		}

		_bookableElem = elem;

		app.Model.subscribe(app.Model.events.bookableMeetingsLoaded, _handleBookableMeetingsLoaded);
		app.Model.subscribe(app.Model.events.bookableMeetingsLoadError, _handleBookableMeetingsLoadError);
		app.Model.fetchBookableMeetings();
	}

	function _initTestimonials(elem){

		if (!$(elem).length) {
			console.error('@ App.Components._initTestimonials() : Element doesn’t exist');
			return false;
		}

		if (_testimonialsElem) {
			console.error('@ App.Components._initTestimonials() : _testimonialsElem already inited');
		}

		_testimonialsElem = elem;

		_testimonialsList = $(_testimonialsElem).find('.section-list-window li');

		// show 1st of the list
		_testimonialsList.first().addClass('is-active');

		// add click handlers to arrows nav
		$(_testimonialsElem).find('.section-list-nav .icon').unbind('click').bind('click', _handleTestimonialsNavArrowClick);

		// build pagination dots
		$('.section-list-pagination ul').empty();
		$(_testimonialsList).each(function(index){
			$('.section-list-pagination ul').append('<li><a href="#" data-index="'+ index +'">'+ (index+1) +'</a></li>');
		});

		$('.section-list-pagination ul li a').first().addClass('is-active');
		$('.section-list-pagination ul li a').bind('click', function(event){
			event.preventDefault();
			_showTestimonial( $(event.currentTarget).data('index') );
		});

		// mark as loaded
		$(_testimonialsElem).addClass('is-loaded');
	}

	function _initPrice(elem){
		if (!$(elem).length) {
			// console.log('@ App.Components._initPrice() : Element doesn’t exist');
			return false;
		}

		_priceElem = elem;

		app.Model.subscribe(app.Model.events.geoLocationLoaded, _handleGeoLocationLoaded);
		app.Model.fetchGeoLocation();
	}

	function _initReferrerAlert(referrer, queryFrom){

		// mark referrals page as seen for this session
		if (window.location.href.indexOf('/referrals') !== -1 ||
			window.location.href.indexOf('/agencies') !== -1 ||
			window.location.href.indexOf('/startups') !== -1) {
			window.sessionStorage.setItem(KEYS.SEEN_REFERRALS, 'true');
		}

		var domain = queryFrom ? queryFrom : referrer ? referrer.split('/')[2] : null;

		if (!domain) { return false; }

		var recruiterUrls = ['linkedin.com', 'careers.stackoverflow.com', 'onsite.io', 'yunojuno.com'],
			startupUrls = ['crew.co', 'pickcrew.co', 'freelancing.stackexchange.com', 'sortfolio.com'],
			clientUrls = ['milliaoz.com', 'miguel-praia.com', 'nelda.pt', 'neldacoelho.com', 'temppo.com', 'inflow.pt', 'ilustrique.com'],
			friendUrls = ['facebook.com', 'twitter.com', 't.co', 'ello.co', 'about.me', 'teamtreehouse.com', 'medium.com', 'last.fm', 'foursquare.com', 'quora.com', 'addegga.com'],
			designerUrls = ['behance.net', 'dribbble.com', 'instagram.com', 'flickr.com', '500px.com', 'vimeo.com'],
			developerUrls = ['stackoverflow.com', 'codepen.io', 'jsfiddle.net', 'jshell.net', 'github.com', 'github.io', 'serverfault.com', 'codebits.eu'];

		$(recruiterUrls).each(function(index, item){
			if (domain.indexOf(item) !== -1) {
				_showReferralsAlert('recruiters');
				return false;
			}
		});

		$(startupUrls).each(function(index, item){
			if (domain.indexOf(item) !== -1) {
				_showReferralsAlert('startups');
				return false;
			}
		});

		$(clientUrls).each(function(index, item){
			if (domain.indexOf(item) !== -1) {
				_showReferralsAlert('clients');
				return false;
			}
		});

		$(friendUrls).each(function(index, item){
			if (domain.indexOf(item) !== -1) {
				_showReferralsAlert('friends');
				return false;
			}
		});

		$(designerUrls).each(function(index, item){
			if (domain.indexOf(item) !== -1) {
				_showReferralsAlert('designers');
				return false;
			}
		});

		$(developerUrls).each(function(index, item){
			if (domain.indexOf(item) !== -1) {
				_showReferralsAlert('developers');
				return false;
			}
		});
	}

	function _showReferralsAlert(audience){

		// ignore if already in referrals or seen
		if (window.location.href.indexOf('/referrals') !== -1 || window.sessionStorage.getItem(KEYS.SEEN_REFERRALS) === 'true') { return false; }

		$('body').addClass('show-referrals');

		switch (audience) {
			case 'recruiters':
			case 'agencies':
				$('body').prepend('<div class="alert-referrals">Hey! Are you thinking of hiring or recommending&nbsp;me? <a href="/agencies">Find&nbsp;out&nbsp;what&nbsp;I&nbsp;have&nbsp;to&nbsp;offer</a>.<span class="icon icon-cancel"></span></div>');
				break;

			case 'startups':
				$('body').prepend('<div class="alert-referrals">Hey! Are you thinking of hiring or recommending&nbsp;me? <a href="/startups">Find&nbsp;out&nbsp;what&nbsp;I&nbsp;have&nbsp;to&nbsp;offer</a>.<span class="icon icon-cancel"></span></div>');
				break;

			case 'designers':
			case 'developers':
			case 'friends':
			case 'clients':
				$('body').prepend('<div class="alert-referrals">Hey there! Are you thinking of recommending&nbsp;me? <a href="/referrals">I’m&nbsp;offering Amazon&nbsp;vouchers to&nbsp;good&nbsp;referrals</a>.<span class="icon icon-cancel"></span></div>');
				break;
		}

		// show alert bar
		setTimeout(function(){
			$('.alert-referrals').addClass('show');
		}, 500);

		$('.alert-referrals .icon-cancel').click(function(){
			$('.alert-referrals').remove();
			$('body').removeClass('show-referrals');
			window.sessionStorage.setItem(KEYS.SEEN_REFERRALS, 'true');
		});

	}

	function _prevTestimonial(){

		if (_testimonialsListIndex > 0) {
			_testimonialsListIndex--;
		} else {
			_testimonialsListIndex = _testimonialsList.length - 1;
		}

		_showTestimonial(_testimonialsListIndex);
	}

	function _nextTestimonial(){

		if (_testimonialsListIndex < _testimonialsList.length - 1) {
			_testimonialsListIndex++;
		} else {
			_testimonialsListIndex = 0;
		}

		_showTestimonial(_testimonialsListIndex);
	}

	function _showTestimonial(id){

		_testimonialsListIndex = id;

		// hide old active
		$(_testimonialsElem).find('.section-list-window li.is-active').removeClass('is-active');
		$(_testimonialsElem).find('.section-list-pagination ul li a.is-active').removeClass('is-active');

		// show new active
		$(_testimonialsList[id]).addClass('is-active');
		$($('.section-list-pagination ul li a')[id]).addClass('is-active');

		// _testimonialsElem[]
	}


	function _renderBookable(dates){

		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			template = '<label class="radio-button">'+
							'<input id="meeting-input{index}" type="radio" name="a8" '+
								'value="{weekday}, {day-nth} {month} from {start-time-to-end-time} GMT" '+
								'class="form-input-meeting" tabindex="5">'+
							'{weekday}, <br>'+
							'<strong>{day-nth} {month}<br>'+
							'{time} GMT</strong>'+
						'</label>';

		// clear element
		$('.bookable-meetings-list').empty();

		function dayNth(day){
			var nth = 'th';
			if (day === 1) {nth = 'st'; }
			if (day === 2) {nth = 'nd'; }
			if (day === 3) {nth = 'rd'; }

			return day + nth;
		}

		function timeSplit(time, splitter){
			var arr = time.split('-');
			return arr[0] + splitter + arr[1];
		}

		$(dates).each(function(index, item){

			var date = new Date(item.date +' 00:00:00 GMT'),
				html = template.replace(/{index}/g, index)
						// .replace(/{tabindex}/g, 5+index)
						.replace(/{weekday}/g, weekdays[date.getDay()])
						.replace(/{day-nth}/g, dayNth(date.getDate()))
						.replace(/{month}/g, months[date.getMonth()])
						.replace(/{time}/g, timeSplit(item.time, ' - '))
						.replace(/{start-time-to-end-time}/g, timeSplit(item.time, ' to '));

			$('.bookable-meetings-list').append( html );
		});

		// add required attribute to first in radio group
		$('.form-input-meeting').first().prop('required', true);

		// force validators on new radio inputs
		app.Forms.updateValidators($('.form-contact-product'));
	}

	function _handleBookableMeetingsLoaded(event, data){

		var today = new Date(),
			todayPadded = today.setDate( today.getDate()+3),
			nextAvailableDates = [];

		$(data.availableDates).each(function(index, item){

			// if it's at least 3 days from now, add to list
			if (new Date(item.date) > todayPadded) {
				nextAvailableDates.push(item);
			}

			// exit loop after picking 3 available dates
			if (nextAvailableDates.length >= 3) {
				return false;
			}
		});

		_renderBookable(nextAvailableDates);
	}

	function _handleBookableMeetingsLoadError(){
		// console.log('@ App.Components._handleBookableMeetingsLoadError()', data);
		// TODO: show an error message? or alternative input maybe?
	}

	function _handleTestimonialsNavArrowClick(event){

		if ( $(event.currentTarget).hasClass('icon-arrow-left') ) { _prevTestimonial(); }
		if ( $(event.currentTarget).hasClass('icon-arrow-right') ) { _nextTestimonial(); }
	}

	function _handleGeoLocationLoaded(event,data){

		$(_priceElem).each(function(index, item){
			$(item).text( $(item).attr('data-price-'+ data.currency.toLowerCase()) );
		});

	}

})(window.JPescadaApp);