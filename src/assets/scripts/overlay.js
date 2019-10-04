window.JPescadaOverlay = (function(app){

	'use strict';

	var OVERLAYS = {
		Availability: 'JPescadaOverlay__Availability',
		ContactSent: 'JPescadaOverlay__Contact_Sent',
		Signup: 'JPescadaOverlay_Signup'
	};

	app.Overlay = {

		name: 'app.Overlay',

		overlays: OVERLAYS,

		openAvailability: function(){ return _open( OVERLAYS.Availability ); },

		openSignup: function(){ return _open( OVERLAYS.Signup ); },

		openContactSent: function(success){ return _open( OVERLAYS.ContactSent, success ); },

		open: function(overlayName){ return _open(overlayName); },

		close: function(){ return _close(); },

		init: function(){ return _init(); }
	};

	function _init(){
		// add overlay divs
		if (!$('.overlay-backdrop').length) {
			$('body').append( $('<div class="overlay-backdrop"/><div class="overlay-modal"/>') );
		}
	}
	function _open(overlayName, option){

		// show overlay divs
		$('body').addClass('overlay-active');

		switch (overlayName) {

			case OVERLAYS.Availability:

				$('.overlay-modal').load('/overlays/availability.html', function(){

					$('.overlay-modal').addClass('modal-availability');

					_bindUIActions(true);

					app.Model.subscribe(app.Model.events.availabilityLoaded, _handleAvailabilityLoaded);
					app.Model.fetchAvailability();

				});

				if (window.ga) { window.ga('send', 'pageview', '/availability'); }

			break;

			case OVERLAYS.ContactSent:

				var file = option ? 'contact-sent' : 'contact-sent-error';

				$('.overlay-modal').load('/overlays/'+ file +'.html', function(){

					$('.overlay-modal').addClass('modal-contact-sent modal-contact-sent-error');

					setTimeout(function(){
						$('.modal-content').addClass('is-ready');
					}, 200);

					_bindUIActions(true);

				});

				if (window.ga) { window.ga('send', 'pageview', '/'+ file); }
				if (window.fbq && option === 'contact-sent'){ window.fbq('track', 'Lead'); }

			break;
		}
	}

	function _close(e){
		e.preventDefault();
		_unbindUIActions();
		$('body').removeClass('overlay-active');

		$('.overlay-modal').attr('class','overlay-modal').empty();
	}

	function _bindUIActions(backdropCloses){
		$('.overlay-modal .close-button').unbind('click').bind('click', _close);
		$('.overlay-modal .ok-button').unbind('click').bind('click', _close);

		if (backdropCloses) {
			$('.overlay-backdrop').unbind('click').bind('click', _close);
		}
	}

	function _unbindUIActions(){
		$('.overlay-modal .close-button').unbind('click');
		$('.overlay-modal .ok-button').unbind('click');
		$('.overlay-backdrop').unbind('click');
	}

	function _handleAvailabilityLoaded(event, data){
		app.Model.unsubscribe(event.type);

		// add status class for busy months in calendar
		$(data.busyMonths).each(function(index, item){
			$('.modal-availability .calendar li[data-month-id="'+ item.date +'"] .month-status').addClass( item.status );
		});

		setTimeout(function(){
			$('.modal-content').addClass('is-ready');
		}, 100);

	}

	return app.Overlay;


})(window.JPescadaApp);