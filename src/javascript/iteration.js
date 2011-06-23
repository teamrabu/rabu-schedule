// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.Iteration = function(iteration, effortToDate) {
    var self = this;

	this.startDate = function() {
		return new Date(iteration.started);
	};

	this.length = function() {
		return iteration.length;
	};

	this.velocity = function() {
		return iteration.velocity;
	};

	this.tenPercentMultiplier = function() {
		return iteration.riskMultipliers[0];
	};

	this.fiftyPercentMultiplier = function() {
		return iteration.riskMultipliers[1];
	};

	this.ninetyPercentMultiplier = function() {
		return iteration.riskMultipliers[2];
	};

	this.effortToDate = function() {
		return effortToDate;
	};

	this.effortRemaining = function() {
		var adder = function(sum, feature) {
			return sum + feature.estimate();
		};
		return self.includedFeatures().reduce(adder, 0);
	};

	this.totalEffort = function() {
		return self.effortToDate() + self.effortRemaining();
	};

	function featuresFromList(featureList, effort) {
		if (!featureList) { return []; }
		var cumulativeEstimate = 0;
		return featureList.map(function(element) {
			var result = new rabu.schedule.Feature(element, cumulativeEstimate, effort);
			cumulativeEstimate += result.estimate();
			return result;
		});
	}

	this.includedFeatures = function() {
		return featuresFromList(iteration.included, self.effortToDate());
	};

	this.excludedFeatures = function() {
		return featuresFromList(iteration.excluded, self.totalEffort());
	};
};
