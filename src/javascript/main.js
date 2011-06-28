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

	Main.populateDom = function() {
		$(".rabu-name").text(this._estimates.name());
		$(".rabu-updated").text(this._estimates.updated().toLongString());
		$(".rabu-tenPercentDate").text(this._projections.tenPercentDate().toLongStringNoYear());
		$(".rabu-fiftyPercentDate").text(this._projections.fiftyPercentDate().toLongStringNoYear());
		$(".rabu-ninetyPercentDate").text(this._projections.ninetyPercentDate().toLongStringNoYear());
		this._featuresDom.populate();
		this._burnupDom.populate();
	};
}());