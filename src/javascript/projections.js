// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu_ns.Projections = function(estimates) {

	function iterations() {
		return estimates.totalEstimate() / estimates.velocity();
	}

	function calcProjection(multiplier) {
		return iterations() * multiplier;
	}

	function convertToDate(iterationsRemaining) {
		var days = Math.ceil(iterationsRemaining * estimates.iterationLength());
		var date = estimates.currentIterationStarted();
		date.setDate(date.getDate() + days);
		return date;
	}

	this.tenPercentDate = function() {
		return convertToDate(this.tenPercentIterationsRemaining());
	};

	this.fiftyPercentDate = function() {
		return convertToDate(this.fiftyPercentIterationsRemaining());
	};

	this.ninetyPercentDate = function() {
		return convertToDate(this.ninetyPercentIterationsRemaining());
	};

	this.tenPercentIterationsRemaining = function() {
		return calcProjection(estimates.tenPercentMultiplier());
	};

	this.fiftyPercentIterationsRemaining = function() {
		return calcProjection(estimates.fiftyPercentMultiplier());
	};

	this.ninetyPercentIterationsRemaining = function() {
		return calcProjection(estimates.ninetyPercentMultiplier());
	};
};