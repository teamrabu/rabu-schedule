"use strict";

var Rabu = function(config) {
	if (!config) {
		throw "Expected config";
	}
	this.config = config;
};

Rabu.prototype.populateDom = function() {
    $("#title").text(this.config.title);
};
