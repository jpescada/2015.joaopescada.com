window.JPescadaModel = (function(app){

	'use strict';

	var EVENTS = {
		availabilityLoaded: 'JPescadaModel_events__availabilityLoaded',
		availabilityLoadError: 'JPescadaModel_events__availabilityLoadError',
		contactSentLoaded: 'JPescadaModel_events__contactSentLoaded',
		contactSentLoadError: 'JPescadaModel_events__contactSentLoadError',
		bookableMeetingsLoaded: 'JPescadaModel_events__bookableMeetingsLoaded',
		bookableMeetingsLoadError: 'JPescadaModel_events__bookableMeetingsLoadError',
		geoLocationLoaded: 'JPescadaModel_events__geoLocationLoaded',
		geoLocationLoadError: 'JPescadaModel_events__geoLocationLoadError'
	};

	var KEYS = {
		IP_INFO: 'jpescada-ipinfo'
	};

	app.Model = {

		name: 'app.Model',

		events: EVENTS,

		fetchAvailability: function(){ return _fetchAvailability(); },

		fetchBookableMeetings: function(){ return _fetchBookableMeetings(); },

		fetchGeoLocation: function(){ return _fetchGeoLocation(); },

		sendContact: function(data){ return _sendContact(data); },

		subscribe: function(event, callback){
			app.Model.unsubscribe(event);
			return $(app.Model).bind(event, callback);
		},

		unsubscribe: function(event){
			return $(app.Model).unbind(event);
		}
	};

	function _fetchAvailability(){

		$.getJSON('/api/calendar').done(function(data){
			$(app.Model).trigger(EVENTS.availabilityLoaded, data );
		}).fail(function(jqXHR, status, error){
			console.error('@ app.Model._fetchAvailability() | Error loading calendar:', status, error);
			$(app.Model).trigger(EVENTS.availabilityLoadError, {result:'error', message:'Error loading calendar', status:status, error:error});
		});
	}

	function _fetchBookableMeetings(){

		$.getJSON('/api/meetings').done(function(data){
			$(app.Model).trigger(EVENTS.bookableMeetingsLoaded, data );
		}).fail(function(jqXHR, status, error){
			console.error('@ app.Model._fetchBookableMeetings() | Error loading meetings', status, error);
			$(app.Model).trigger(EVENTS.bookableMeetingsLoadError, {result:'error', message:'Error loading meetings', status:status, error:error});
		});
	}

	function _fetchGeoLocation(){

		var _storedGeoLocation = _getStoredGeoLocation();

		if (_storedGeoLocation) {

			$(app.Model).trigger(EVENTS.geoLocationLoaded, _storedGeoLocation );

		} else {

			$.getJSON('/api/location', function (data) {
				_setStoredGeoLocation(data);
				_getCurrency();
				// $(app.Model).trigger(EVENTS.geoLocationLoaded, data );
			});
		}

	}

	function _setStoredGeoLocation(data){

		// set default currency
		if (data.currency) {

			// replace CAD and AUD by USD
			if (data.currency === 'CAD' || data.currency === 'AUD') {
				data.currency = 'USD';
			}

			// if not one of the 3 supported, override it
			if (data.currency !== 'GBP' && data.currency !== 'EUR' && data.currency !== 'USD') {
				data.currency = 'GBP';
			}

		} else {
			data.currency = 'GBP';
		}

		window.sessionStorage.setItem( KEYS.IP_INFO, JSON.stringify(data) );
	}

	function _getStoredGeoLocation(){

		var storedGeoLocation = window.sessionStorage.getItem( KEYS.IP_INFO );

		if (storedGeoLocation) {
			return JSON.parse( storedGeoLocation );
		} else {
			return null;
		}
	}

	function _getCurrency(){

		$.getJSON('/api/currency').done(function(data){

			var storedGeoLocation = _getStoredGeoLocation();
			storedGeoLocation.currency = data[storedGeoLocation.country];
			_setStoredGeoLocation( storedGeoLocation );

			$(app.Model).trigger(EVENTS.geoLocationLoaded, storedGeoLocation );

		}).fail(function(jqXHR, status, error){
			console.error('@ app.Model._getCurrency() | Error loading currency', status, error);
			// $(app.Model).trigger(EVENTS.geoLocationLoadError, {result:'error', message:'Error loading currency', status:status, error:error});
		});
	}

	function _sendContact(formData){

		// post data to /api/inflow
		$.ajax({
			url: '/inflow/api/start',
			type: 'POST',
			data: formData
		}).done(function(data){

			// console.log('-- form submited. result:', JSON.parse(data), status, jqXHR);
			$(app.Model).trigger(EVENTS.contactSentLoaded, JSON.parse(data) );

		}).fail(function(jqXHR, status, error){

			console.error('@ app.Model._sendContact() | Error posting to Inflow API', status, error);
			$(app.Model).trigger(EVENTS.contactSentLoadError, {result:'error', message:'Error posting to Inflow API', status:status, error:error});
		});
	}

	return app.Model;


})(window.JPescadaApp);