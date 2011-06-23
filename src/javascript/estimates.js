// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Estimates = function(config) {
		this._config = config;
	};
	rs.Estimates.prototype = new rs.Object();
	var Estimates = rs.Estimates.prototype;

	Estimates.name = function() {
		return this._config.name;
	};

	Estimates.updated = function() {
		return new Date(this._config.updated);
	};

	Estimates.tenPercentMultiplier = function() {
		return this.currentIteration().tenPercentMultiplier();
	};

	Estimates.fiftyPercentMultiplier = function() {
        return this.currentIteration().fiftyPercentMultiplier();
	};

	Estimates.ninetyPercentMultiplier = function() {
        return this.currentIteration().ninetyPercentMultiplier();
	};

	Estimates.currentIteration = function() {
		var list = this._iterations();
		return list[list.length - 1];
	};

	Estimates.firstIteration = function() {
		return this._iterations()[0];
	};

	Estimates.iteration = function(offsetFromOldest) {
		return this._iterations()[offsetFromOldest];
	};

    Estimates.iterationCount = function() {
		return this._config.iterations.length;
	};

	Estimates.currentIterationStarted = function() {
		return this.currentIteration().startDate();
	};

	Estimates.iterationLength = function() {
		return this.currentIteration().length();
	};

	Estimates.velocity = function() {
		return this.currentIteration().velocity();
	};

	Estimates.effortToDate = function() {
		return this.currentIteration().effortToDate();
	};

	Estimates.peakEffortEstimate = function() {
        return this._iterations().reduce(function(previousValue, iteration) {
			var currentValue = iteration.totalEffort();
			return currentValue > previousValue ? currentValue : previousValue;
		}, 0);
	};

	Estimates.totalEstimate = function() {
		return this.currentIteration().totalEstimate();
	};

	Estimates.includedFeatures = function() {
		return this.currentIteration().includedFeatures();
	};

	Estimates.excludedFeatures = function() {
		return this.currentIteration().excludedFeatures();
	};

	Estimates.dateForIteration = function(iterationNumber) {
		var self = this;
		function calcFutureDate(futureOffset){
			var days = futureOffset * self.currentIteration().length();

			var result = self.currentIteration().startDate();
			result.setDate(result.getDate() + days);
			return result;
		}

		var offsetFromCurrent = iterationNumber - (this.iterationCount() - 1);
		if (offsetFromCurrent >= 0) {
			return calcFutureDate(offsetFromCurrent);
		}
		else {
			return this.iteration(iterationNumber).startDate();
		}
	};

	Estimates._iterations = function() {
		var iterationData = this._config.iterations;
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
	};
}());
