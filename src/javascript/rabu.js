// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

var rabu_ns = {};

rabu_ns.Rabu = function(config) {
	var estimates;
	var projections;
	var features;

	if (!config) {
		throw "Expected config";
	}
	estimates = new rabu_ns.Estimates(config);
	projections = new rabu_ns.Projections(estimates);
	features = new rabu_ns.FeaturesDom($(".rabu-features"), estimates);

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