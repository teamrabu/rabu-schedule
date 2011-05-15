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


rabu.schedule.Feature = function(feature, cumulativeEstimate, effortToDate) {
    var self = this;

	this.name = function() {
		return feature[0];
	};

	this.estimate = function() {
		return feature[1];
	};
	
	this.totalEffort = function() {
		return cumulativeEstimate + self.estimate() + effortToDate;
	};

	this.isDone = function() {
		return self.estimate() === 0;
	};

	this.equals = function(that) {
		return (self.name() === that.name()) && (self.estimate() === that.estimate());
	};

	this.toString = function() {
		return "['" + self.name() + "', " + self.estimate() + "]";
	};
};