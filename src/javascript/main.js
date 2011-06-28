// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Main = function(config) {
		if (!config) {
			throw "Expected config";
		}
		this._estimates = new rs.Estimates(config);
		this._projections = new rs.Projections(this._estimates);
	};
	var Main = rs.Main.prototype = new rs.Object();

	Main.populateDom = function() {
        var datesDom = new rs.DatesDom(this._projections);
		var featuresDom = new rs.FeaturesDom($(".rabu-features"), this._estimates);
		var burnupDom = new rs.BurnupDom($(".rabu-burnup"), this._estimates, this._projections);
    
		$(".rabu-name").text(this._estimates.name());
		$(".rabu-updated").text(this._estimates.updated().toLongString());
        datesDom.populate();
		featuresDom.populate();
		burnupDom.populate();
	};
}());