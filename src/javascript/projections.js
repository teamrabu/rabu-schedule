// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.Projections = function(estimates) {
	var rs = rabu.schedule;
	var self = this;
	
	this.tenPercentProjection = function() {
		return new rs.Projection(estimates.currentIteration(), estimates.tenPercentMultiplier(), estimates.effortToDate()); 
	};
	
	this.fiftyPercentProjection = function() {
		return new rs.Projection(estimates.currentIteration(), estimates.fiftyPercentMultiplier(), estimates.effortToDate());
	};
	
	this.ninetyPercentProjection = function() {
		return new rs.Projection(estimates.currentIteration(), estimates.ninetyPercentMultiplier(), estimates.effortToDate());
	};

	this.tenPercentDate = function() {
		return self.tenPercentProjection().date();
	};

	this.fiftyPercentDate = function() {
		return self.fiftyPercentProjection().date();
	};

	this.ninetyPercentDate = function() {
		return self.ninetyPercentProjection().dateRoundedToIteration();
	};
	
	this.totalIterations = function() {
		var projected = Math.ceil(self.ninetyPercentProjection().iterationsRemaining());
		var historical = estimates.iterationCount() - 1;  // don't include current iteration
		return projected + historical;
	};
	
	this.maxEffort = function() {
		var projectedMax = self.ninetyPercentProjection().totalEffort();
		var historicalMax = estimates.peakEffortEstimate();
		return historicalMax > projectedMax ? historicalMax : projectedMax;
	};
};

rabu.schedule.Projection = function(iteration, riskMultiplier, effortToDate) {
	var self = this;
	self.SCOPE_CHANGE_PERCENTAGE = 0.8;
	
	function daysToDate(days) {
		var date = iteration.startDate();
		date.setDate(date.getDate() + days);
		return date;
	}
	
	this.iterationsRemaining = function() {
		return iteration.effortRemaining() / iteration.velocity() * riskMultiplier; 
	};
	
	this.daysRemaining = function() {
		return Math.ceil(self.iterationsRemaining() * iteration.length()); 
	};
	
	this.date = function() {
		return daysToDate(self.daysRemaining());
	};
	
	this.dateRoundedToIteration = function() {
		var days = Math.ceil(self.iterationsRemaining()) * iteration.length();
		return daysToDate(days);
	};
	
	this.totalEffort = function() {
		var original = iteration.effortRemaining();
		var increase = (original * riskMultiplier) - original;
		return effortToDate + original + (increase * self.SCOPE_CHANGE_PERCENTAGE);		
	};
	
	this.velocity = function() {
		return self.totalEffort() / self.iterationsRemaining();
	};
};
