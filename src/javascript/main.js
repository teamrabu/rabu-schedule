// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

var rabu = rabu || {};
rabu.schedule = {};

rabu.schedule.Main = function(config) {
	var estimates;
	var projections;
	var features;

	if (!config) {
		throw "Expected config";
	}
	estimates = new rabu.schedule.Estimates(config);
	projections = new rabu.schedule.Projections(estimates);
	features = new rabu.schedule.FeaturesDom($(".rabu-features"), estimates);

	function dateToString(date) {
		return date.toString('MMMM dS');
	}

	this.populateDom = function() {
		$(".rabu-name").text(estimates.name());
		$(".rabu-updated").text(estimates.updated().toString("MMMM dS, yyyy"));
		$(".rabu-tenPercentDate").text(dateToString(projections.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(projections.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(projections.ninetyPercentDate()));
		features.populate();
	};
};