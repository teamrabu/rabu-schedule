// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.DatesDom = function(projections) {
		this._projections = projections;
	};
	var DatesDom = rs.DatesDom.prototype = new rs.Object();

	DatesDom.populate = function() {
		$(".rabu-tenPercentDate").text(this._projections.tenPercentDate().toLongStringNoYear());
		$(".rabu-fiftyPercentDate").text(this._projections.fiftyPercentDate().toLongStringNoYear());
		$(".rabu-ninetyPercentDate").text(this._projections.ninetyPercentDate().toLongStringNoYear());
	};
}());