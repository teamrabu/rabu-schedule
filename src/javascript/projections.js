// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Projections = function(estimates) {
		this._estimates = estimates;
	};
	var Projections = rs.Projections.prototype = new rs.Object();

	Projections.tenPercentProjection = function() {
		return new rs.Projection(this._estimates.currentIteration(), this._estimates.tenPercentMultiplier(), this._estimates.effortToDate());
	};
	
	Projections.fiftyPercentProjection = function() {
		return new rs.Projection(this._estimates.currentIteration(), this._estimates.fiftyPercentMultiplier(), this._estimates.effortToDate());
	};
	
	Projections.ninetyPercentProjection = function() {
		return new rs.Projection(this._estimates.currentIteration(), this._estimates.ninetyPercentMultiplier(), this._estimates.effortToDate());
	};

	Projections.tenPercentDate = function() {
		return this.tenPercentProjection().date();
	};

	Projections.fiftyPercentDate = function() {
		return this.fiftyPercentProjection().date();
	};

	Projections.ninetyPercentDate = function() {
		return this.ninetyPercentProjection().dateRoundedToIteration();
	};
	
	Projections.totalIterations = function() {
		var projected = Math.ceil(this.ninetyPercentProjection().iterationsRemaining());
		var historical = this._estimates.iterationCount() - 1;  // don't include current iteration
		return projected + historical;
	};
	
	Projections.maxEffort = function() {
		var projectedMax = this.ninetyPercentProjection().totalEffort();
		var historicalMax = this._estimates.peakEffortEstimate();
		return historicalMax > projectedMax ? historicalMax : projectedMax;
	};
}());

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
