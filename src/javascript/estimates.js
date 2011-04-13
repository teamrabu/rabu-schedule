// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.Estimates = function(configJson) {
	var config = configJson;

	this.name = function() {
		return config.name;
	};

	this.updated = function() {
		return new Date(config.updated);
	};

	this.currentIterationStarted = function() {
		return new Date(config.currentIterationStarted);
	};

	this.iterationLength = function() {
		return config.iterationLength;
	};

	this.velocity = function() {
		return config.velocity;
	};

	this.tenPercentMultiplier = function() {
		return config.riskMultipliers[0];
	};

	this.fiftyPercentMultiplier = function() {
		return config.riskMultipliers[1];
	};

	this.ninetyPercentMultiplier = function() {
		return config.riskMultipliers[2];
	};

	this.totalEstimate = function() {
		var adder = function(sum, feature) {
			return sum + feature.estimate();
		};
		return this.includedFeatures().reduce(adder, 0);
	};

	function featuresFromList(featureList) {
		if (!featureList) { return []; }
		return featureList.map(function(element) {
			return new rabu.schedule.Feature(element);
		});
	}

	this.includedFeatures = function() {
		return featuresFromList(config.includedFeatures);
	};

	this.excludedFeatures = function() {
		return featuresFromList(config.excludedFeatures);
	};
};

rabu.schedule.Feature = function(featureJson) {
	var feature = featureJson;

	this.name = function() {
		return feature[0];
	};

	this.estimate = function() {
		return feature[1];
	};

	this.isDone = function() {
		return this.estimate() === 0;
	};

	this.equals = function(that) {
		return (this.name() === that.name()) && (this.estimate() === that.estimate());
	};

	this.toString = function() {
		return "['" + this.name() + "', " + this.estimate() + "]";
	};
};