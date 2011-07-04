// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.ApplicationModel = function(estimates, datesDom, featuresDom, burnupDom) {
		this._estimates = estimates;
		this._datesDom = datesDom;
		this._featuresDom = featuresDom;
		this._burnupDom = burnupDom;
	};
	var Prototype = rs.ApplicationModel.prototype = new rs.Object();

	Prototype.initialize = function() {
		this._datesDom.populate();
		this._featuresDom.populate();
		this._burnupDom.populate();
	};

	Prototype.moveFeature = function(fromIndex, toIndex) {
		this._estimates.currentIteration().moveFeature(fromIndex, toIndex);
		this._datesDom.populate();
	};
}());