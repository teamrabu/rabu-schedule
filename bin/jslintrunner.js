/*global load, readFile, print, JSLINT, java */

(function JsLintRunner() {
"use strict";

load("bin/fulljslint.js");

var DIRS_TO_CHECK = ["src"];

// Summary of JsLint options at http://www.jslint.com/#JSLINT_OPTIONS
// Details at http://www.jslint.com/lint.html
var OPTIONS = {
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

// This function by Steven Levithan
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
	var pass = JSLINT(source, OPTIONS);
	var i;

	if (pass) {
		print(filename + " ok");
		return true;
	}
	else {
		print(filename + " failed lint");
		for (i = 0; i < JSLINT.errors.length; i++) {
			var error = JSLINT.errors[i];
			if (!error) { continue; }

			if (error.evidence) { print(error.line + ": " + trim(error.evidence)); }
			print("   " + error.reason);
		}
		return false;
	}
}

function getFiles(javaFile, javaList, filter) {
	var files = javaFile.listFiles();
	var i;
	for (i = 0; i < files.length; i++) {
		if (files[i].isDirectory()) {
			getFiles(files[i], javaList);
		}
		else {
			var file = files[i].toString();
			if (filter(file)) { javaList.add(file); }
		}
	}
}

function recursivelyListFilesIn(path, filter) {
//	var f = new java.io.File(path);
//	var jlist = f.list(); // a java String[]
//	return jlist;

	var file = new java.io.File(path);
	if (!file.exists() || !file.isDirectory()) {
		print("Directory not found: " + file);
		java.lang.System.exit(1);
	}

	var list = new java.util.ArrayList();
	getFiles(file, list, filter);
	return list.toArray();
}

function checkDir(dir) {
	var okay = true;
	var files = recursivelyListFilesIn(dir, function(file) {
		return (/\.js$/).test(file);
	});
	files.map(function(file) {
		okay = checkFile(file) && okay;
	});
	return okay;
}

var okay = true;
DIRS_TO_CHECK.map(function(dir) { okay = checkDir(dir) && okay});
java.lang.System.exit(okay ? 0 : 1);

}());