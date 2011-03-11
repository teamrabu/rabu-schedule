/*global load, readFile, print, JSLINT */

(function JsLintRunner() {
"use strict";

// Summary of options at http://www.jslint.com/#JSLINT_OPTIONS
// Details at http://www.jslint.com/lint.html
var options = {
	undef: true,        // Disallow undefined variables
	newcap: true,       // Require Initial Caps for constructors
	nomen: true,        // Disallow dangling _ in identifiers
	regexp: true,       // Disallow . and [^...] in /RegExp/
	bitwise: true,      // Disallow bitwise operators
	strict: true,       // Require 'use strict'
	"continue": true,     // Tolerate 'continue'
	browser: true,      // Assume a browser
	maxerr: 10          // Max number of errors
};

// This trim function by Steven Levithan
// http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim(str) {
	str = str.replace(/^\s\s*/, '');
	var ws = /\s/;
	var i = str.length - 1;
	
	while (ws.test(str.charAt(i))) {
		i -= 1;
	}
	var result = str.slice(0, i + 1);
	return result;
}

function checkFile(filename) {
	var source = readFile(filename);
	var pass = JSLINT(source, options);
	var i;

	if (pass) {
		print(filename + " ok");
	}
	else {
		print(filename + " fail!");
		for (i = 0; i < JSLINT.errors.length; i++) {
			var error = JSLINT.errors[i];
			if (!error) { continue; }

			if (error.evidence) { print(error.line + ": " + trim(error.evidence)); }
			print("   " + error.reason);
		}
	}
}

load("fulljslint.js");
checkFile("jslintrunner.js");

}());