// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Estimates = function(config) {
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

		this._config = config;
		this._iterations = iterations();
	};
	var Estimates = rs.Estimates.prototype = new rs.Object();

	Estimates.name = function() {
		return this._config.name;
	};

	Estimates.updated = function() {
		return new rs.Date(this._config.updated);
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
		var list = this._iterations;
		return list[list.length - 1];
	};

	Estimates.firstIteration = function() {
		return this._iterations[0];
	};

	Estimates.iteration = function(offsetFromOldest) {
		return this._iterations[offsetFromOldest];
	};

    Estimates.iterationCount = function() {
		return this._iterations.length;
	};

	Estimates.velocity = function() {
		return this.currentIteration().velocity();
	};

	Estimates.effortToDate = function() {
		return this.currentIteration().effortToDate();
	};

	Estimates.peakEffortEstimate = function() {
        return this._iterations.reduce(function(previousValue, iteration) {
			var currentValue = iteration.totalEffort();
			return currentValue > previousValue ? currentValue : previousValue;
		}, 0);
	};

	Estimates.totalEstimate = function() {
		return this.currentIteration().totalEstimate();
	};

	Estimates.dateForIteration = function(iterationNumber) {
		var self = this;
		function calcFutureDate(futureOffset){
			var days = futureOffset * self.currentIteration().length();
			return self.currentIteration().startDate().incrementDays(days);
		}

		var offsetFromCurrent = iterationNumber - (this.iterationCount() - 1);
		if (offsetFromCurrent >= 0) {
			return calcFutureDate(offsetFromCurrent);
		}
		else {
			return this.iteration(iterationNumber).startDate();
		}
	};

}());
