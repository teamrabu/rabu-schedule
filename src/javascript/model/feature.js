// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Feature = function(feature, cumulativeEstimate, effortToDate) {
		this._feature = feature;
		this._cumulativeEstimate = cumulativeEstimate;
		this._effortToDate = effortToDate;
	};
	var Feature = rs.Feature.prototype = new rs.Object();

	Feature.name = function() {
		return this._feature[0];
	};

	Feature.estimate = function() {
		return this._feature[1];
	};

	Feature.totalEffort = function() {
		return this._cumulativeEstimate + this.estimate() + this._effortToDate;
	};

	Feature.isDone = function() {
		return this.estimate() === 0;
	};

	Feature.equals = function(that) {
		return (this.name() === that.name()) && (this.estimate() === that.estimate());
	};

	Feature.toString = function() {
		return "['" + this.name() + "', " + this.estimate() + "]";
	};
}());