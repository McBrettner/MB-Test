// Polyfills
// (these modules are what are in 'angular2/bundles/angular2-polyfills' so don't use that here)

// import 'ie-shim'; // Internet Explorer
// import 'es6-shim';
// import 'es6-promise';
// import 'es7-reflect-metadata';

// Prefer CoreJS over the polyfills above
import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

// Typescript emit helpers polyfill
import 'ts-helpers';

if ('production' === ENV) {
  // Production


} else {
	// Development

	Error.stackTraceLimit = Infinity;

	require('zone.js/dist/long-stack-trace-zone');

}

// Polyfill for IE9 to support CustomEvent
declare var window: any;
(function () {


	if ( typeof window.CustomEvent === 'function' ) {
		return false;
	}

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		let evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();

if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun/*, thisArg*/) {
		'use strict';

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		let t = Object(this);
		let len = t.length >>> 0;
		if (typeof fun !== 'function') {
			throw new TypeError();
		}

		let res = [];
		let thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (let i = 0; i < len; i++) {
			if (i in t) {
				let val = t[i];

				// NOTE: Technically this should Object.defineProperty at
				//       the next index, as push can be affected by
				//       properties on Object.prototype and Array.prototype.
				//       But that method's new, and collisions should be
				//       rare, so use the more-compatible alternative.
				if (fun.call(thisArg, val, i, t)) {
					res.push(val);
				}
			}
		}

		return res;
	};
}
