window.JPescadaApp = (function() {

	'use strict';

	var App = {

		name: 'com.joaopescada.www',

		init: function(){ return _init(); }
	};

	function _init(){

		_bindUIActions();

		_checkPageRequirements();

		_checkUrl();

		_checkReferrer();
	}

	function _bindUIActions(){

		// add click handlers
		$('a[href^="/availability"]').on('click', _handleAvailabilityClick);
		$('.link-live-chat').on('click', _handleLiveChatLink);

		// add form handlers
		if ($('.form-inflow').length) {
			App.Forms.delegate( $('.form-inflow') );
		}

		if ($('html.touch').length){
			$('.header .icon-mobile-menu').on('click', _handleMobileMenuClick);
			$('.header .header-nav').on('click', _handleMobileNavClick);
			$('html').on('click', _handleHtmlClick);
		}

		// control Drift app
		window.drift.on('ready', function(api){
			// only show Drift automatically on Contact and About pages
			if (!$('.page').hasClass('contact') && !$('.page').hasClass('about')) {
				// hide the widget when it first loads
				// api.widget.hide();
			}

			// open when user receives a message
			window.drift.on('message', function(event){
				if(!event.data.sidebarOpen){
					api.widget.show();
				}
			});
		});

		// Define only easing functions required
	  jQuery.extend( jQuery.easing,
	  {
	    easeOutQuart: function (x, t, b, c, d) {
	      return -c * ((t=t/d-1)*t*t*t - 1) + b;
	    }
	  });

	  // Smooth scroll into anchors
	  // source: https://css-tricks.com/snippets/jquery/smooth-scrolling/
	  $('a[href*="#"]:not([href="#"])').click(function() {
	    if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html, body').animate({
	          scrollTop: target.offset().top
	        }, 1000, 'easeOutQuart');
	        return false;
	      }
	    }
	  });

		// DEBUG ONLY
		// $('form .button').on('click', function(e){
		// 	e.preventDefault();
		// 	e.stopPropagation();

		// 	App.Overlay.openContactSent(true);
		// });
	}

	function _checkUrl(){

		// if url contains /availability -> open overlay
		if (window.location.href.indexOf('/availability') !== -1) {
			App.Overlay.openAvailability();
		}
	}

	function _getQueryString(field, url) {
		var href = url ? url : window.location.href;
		var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
		var string = reg.exec(href);
		return string ? string[1] : null;
	}


	// function _getQueryString(field){
	// 	var query = window.location.search.substring(1);
	// 	var vars = query.split('&');
	// 	for (var i=0;i<vars.length;i++) {
	// 		var pair = vars[i].split('=');
	// 		if(pair[0] === field){ return pair[1]; }
	// 	}
	// 	return(false);
	// }

	function _checkReferrer(){
		var referrerParam = _getQueryString('utm_source') || _getQueryString('from');
		if (referrerParam) {
			App.Components.initReferrerAlert(document.referrer, referrerParam);
		}
	}

	function _checkPageRequirements(){

		if ($('.page').hasClass('home')) {
			App.Components.initTestimonials( $('.component-testimonials-rotator') );
		}

		if ($('.page').hasClass('product-discovery-start')) {
			App.Components.initBookable( $('.component-bookable-meetings') );
		}

		App.Components.initPrice( $('.price') );

		// prepare render
		App.Overlay.init();
	}

	function _handleAvailabilityClick(e){
		e.preventDefault();
		App.Overlay.openAvailability();
	}

	function _handleMobileMenuClick(e){
		e.preventDefault();
		e.stopPropagation();
		$('.header-nav').toggleClass('is-active');
	}

	function _handleMobileNavClick(e){
		e.stopPropagation();
	}

	function _handleHtmlClick(){
		$('.header-nav').removeClass('is-active');
	}

	function _handleLiveChatLink(e){
		e.preventDefault();
		if (window.drift) {
			window.drift.api.goToNewConversation();
		}
	}

	return App;

})();

// boot up app
$(function(){
	'use strict';

	window.JPescadaApp.init();

	// fade in content
	$('.container').addClass('page-is-ready');
	// window.console.log('normal page-is-ready');
});

(function(){
	'use strict';

	// force fade in content
	window.setTimeout( function(){
		$('.container').addClass('page-is-ready');
		// window.console.log('forced page-is-ready');
	}, 100);

})();
