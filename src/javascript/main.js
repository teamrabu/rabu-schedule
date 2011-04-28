// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

var rabu = rabu || {};
rabu.schedule = {};

rabu.schedule.Main = function(config) {
	var rs = rabu.schedule;
	
	if (!config) {
		throw "Expected config";
	}
	var estimates = new rs.Estimates(config);
	var projections = new rs.Projections(estimates);
	var featuresDom = new rs.FeaturesDom($(".rabu-features"), estimates);
	var burnupDom = new rs.BurnupDom($(".rabu-burnup"), estimates, projections);

	function dateToString(date) {
		return date.toString('MMMM dS');
	}

	this.populateDom = function() {
		$(".rabu-name").text(estimates.name());
		$(".rabu-updated").text(estimates.updated().toString("MMMM dS, yyyy"));
		$(".rabu-tenPercentDate").text(dateToString(projections.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(projections.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(projections.ninetyPercentDate()));
		featuresDom.populate();
		burnupDom.populate();
	};
};