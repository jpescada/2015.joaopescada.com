(function(){

	'use strict';

	var INFLOW_ID = 'inflow-id';
	var INFLOW_BACK = 'inflow-back';
	var INFLOW_REF = 'inflow-ref';
	var INFLOW_PATH = 'inflow-path';

	function start(){
		// start session

		if ( !ssRead(INFLOW_ID) ) {
			// if no SS id exists, check LS
			// aka: new session (maybe new visitor)

			// store referrer
			ssWrite(INFLOW_REF, document.referrer);

			if ( !lsRead(INFLOW_ID) ) {
				// if no LS id exists
				// aka: new visitor

				// create new id in LS and SS
				var id = uuid();
				lsWrite(INFLOW_ID, id);
				ssWrite(INFLOW_ID, id);
			}
			else
			{
				// if LS id exists
				// aka: returning visitor

				// copy from LS to SS
				ssWrite(INFLOW_ID, lsRead(INFLOW_ID));

				// update visit count
				var count = parseInt(lsRead(INFLOW_BACK)) || 1;
				lsWrite(INFLOW_BACK, count + 1);
			}
		}
	}

	function update(){
		//only the folder or filename without extension
		var href = document.location.href.split('/');
		var hrefLast = href[href.length - 1];
		var page = hrefLast ? hrefLast.split('.')[0] : 'home';
		var path = ssRead(INFLOW_PATH);

		if (path) path += ','+ page;
		else path = page;

		ssWrite(INFLOW_PATH, path);
	}

	function main(){

		start();

		update();
	}


	// read / write to storage
	function lsRead(key){
		return window.localStorage.getItem(key);
	}

	function lsWrite(key, value){
		return window.localStorage.setItem(key, value);
	}

	function ssRead(key){
		return window.sessionStorage.getItem(key);
	}

	function ssWrite(key, value){
		return window.sessionStorage.setItem(key, value);
	}

	// helpers
	function uuid(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);}


	// boot up
	main();

})();