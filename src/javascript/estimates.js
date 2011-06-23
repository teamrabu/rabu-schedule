// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.Estimates = function(config) {
	var rs = rabu.schedule;
	var self = this;

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
		return self.currentIteration().tenPercentMultiplier();
	};

	this.fiftyPercentMultiplier = function() {
        return self.currentIteration().fiftyPercentMultiplier();
	};

	this.ninetyPercentMultiplier = function() {
        return self.currentIteration().ninetyPercentMultiplier();
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
		return self.currentIteration().startDate();
	};

	this.iterationLength = function() {
		return self.currentIteration().length();
	};

	this.velocity = function() {
		return self.currentIteration().velocity();
	};
	
	this.effortToDate = function() {
		return self.currentIteration().effortToDate();
	};
	
	this.peakEffortEstimate = function() {
        return iterations().reduce(function(previousValue, iteration) {
			var currentValue = iteration.totalEffort();
			return currentValue > previousValue ? currentValue : previousValue;
		}, 0);
	};

	this.totalEstimate = function() {
		return self.currentIteration().totalEstimate();
	};

	this.includedFeatures = function() {
		return self.currentIteration().includedFeatures();
	};

	this.excludedFeatures = function() {
		return self.currentIteration().excludedFeatures();
	};
	
	this.dateForIteration = function(iterationNumber) {
		function calcFutureDate(futureOffset){
			var days = futureOffset * self.currentIteration().length();
			
			var result = self.currentIteration().startDate();
			result.setDate(result.getDate() + days);
			return result;
		}

		var offsetFromCurrent = iterationNumber - (self.iterationCount() - 1);
		if (offsetFromCurrent >= 0) {
			return calcFutureDate(offsetFromCurrent);
		}
		else {
			return self.iteration(iterationNumber).startDate();
		}
	};
};
