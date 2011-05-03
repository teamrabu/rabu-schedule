// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.Estimates = function(configJson) {
	var rs = rabu.schedule;
	var config = configJson;

    function iterations() {
		var iterationData = config.iterations;
		if (!iterationData || iterationData.length === 0) {
			iterationData = [{}];
		}
		
		var i;
		var effortToDate = 0;
		var result = [];
        for (i = iterationData.length - 1; i >= 0; i--) {
			var iteration = new rs.Iteration(iterationData[i], effortToDate);
			result.push(iteration);
			effortToDate += iteration.velocity();
		}
		return result;
    }

	this.name = function() {
		return config.name;
	};

	this.updated = function() {
		return new Date(config.updated);
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

	this.currentIteration = function() {
		var list = iterations();
		return list[list.length - 1];
	};
	
	this.firstIteration = function() {
		return iterations()[0];
	};
	
	this.iteration = function(offsetFromOldest) {
		return iterations()[offsetFromOldest];
	};
	
    this.iterationCount = function() {
		return config.iterations.length;
	};

	this.currentIterationStarted = function() {
		return this.currentIteration().startDate();
	};

	this.iterationLength = function() {
		return this.currentIteration().length();
	};

	this.velocity = function() {
		return this.currentIteration().velocity();
	};

	this.totalEstimate = function() {
		return this.currentIteration().totalEstimate();
	};

	this.includedFeatures = function() {
		return this.currentIteration().includedFeatures();
	};

	this.excludedFeatures = function() {
		return this.currentIteration().excludedFeatures();
	};
};


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
	
	this.effortToDate = function() {
		return effortToDate;
	};
	
	this.effortRemaining = function() {
		var adder = function(sum, feature) {
			return sum + feature.estimate();
		};
		return this.includedFeatures().reduce(adder, 0);
	};
	
	this.totalEffort = function() {
		return effortToDate + self.effortRemaining();
	};
	
	function featuresFromList(featureList) {
		if (!featureList) { return []; }
		return featureList.map(function(element) {
			return new rabu.schedule.Feature(element);
		});
	}

	this.includedFeatures = function() {
		return featuresFromList(iteration.included);
	};
	
	this.excludedFeatures = function() {
		return featuresFromList(iteration.excluded);
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