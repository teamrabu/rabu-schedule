// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Main = function(config) {
		if (!config) {
			throw "Expected config";
		}
		this._estimates = new rs.Estimates(config);
		this._applicationModel = new rs.ApplicationModel(this._estimates);
	};
	var Prototype = rs.Main.prototype = new rs.Object();

	Prototype.populateDom = function() {
		$(".rabu-name").text(this._estimates.name());
		$(".rabu-updated").text(this._estimates.updated().toLongString());

		this._applicationModel.initialize();
	};
}());