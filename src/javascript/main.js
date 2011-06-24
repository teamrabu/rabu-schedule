// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Main = function(config) {
		if (!config) {
			throw "Expected config";
		}
		this._estimates = new rs.Estimates(config);
		this._projections = new rs.Projections(this._estimates);
		this._featuresDom = new rs.FeaturesDom($(".rabu-features"), this._estimates);
		this._burnupDom = new rs.BurnupDom($(".rabu-burnup"), this._estimates, this._projections);
	};
	var Main = rs.Main.prototype = new rs.Object();

	function dateToString(date) {
		return new rs.Date(date).toLongStringNoYear();
	}

	Main.populateDom = function() {
		$(".rabu-name").text(this._estimates.name());
		$(".rabu-updated").text(new rs.Date(this._estimates.updated()).toLongString());
		$(".rabu-tenPercentDate").text(dateToString(this._projections.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(this._projections.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(this._projections.ninetyPercentDate()));
		this._featuresDom.populate();
		this._burnupDom.populate();
	};
}());