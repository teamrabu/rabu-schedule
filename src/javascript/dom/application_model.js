// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.ApplicationModel = function(estimates, datesDom, featuresDom, burnupDom) {
		if (!estimates) { throw "Expected estimates"; }

		this._estimates = estimates;
		this._projections = new rs.Projections(this._estimates);

		this._datesDom = datesDom || new rs.DatesDom(this._projections);
		this._featuresDom = featuresDom || new rs.FeaturesDom(this);
		this._burnupDom = burnupDom || new rs.BurnupDom($(".rabu-burnup"), this._estimates, this._projections);

	};
	var Prototype = rs.ApplicationModel.prototype = new rs.Object();

	Prototype.initialize = function() {
		this._datesDom.populate();
		this._featuresDom.populate(this._estimates.currentIteration());
		this._burnupDom.populate();
	};

	Prototype.moveFeature = function(fromIndex, toIndex) {
		this._estimates.currentIteration().moveFeature(fromIndex, toIndex);
		this._datesDom.populate();
		this._burnupDom.populate();
	};
}());