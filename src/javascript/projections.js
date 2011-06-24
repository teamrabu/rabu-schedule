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

(function() {
	var rs = rabu.schedule;
	rs.Projection = function(iteration, riskMultiplier, effortToDate) {
		this.SCOPE_CHANGE_PERCENTAGE = 0.8;
		this._iteration = iteration;
		this._riskMultiplier = riskMultiplier;
		this._effortToDate = effortToDate;
	};
	var Projection = rs.Projection.prototype = new rs.Object();
	
	Projection._daysToDate = function(days) {
		var date = new rs.Date(this._iteration.startDate()._date);
		return date.incrementDays(days);
	};
	
	Projection.iterationsRemaining = function() {
		return this._iteration.effortRemaining() / this._iteration.velocity() * this._riskMultiplier;
	};
	
	Projection.daysRemaining = function() {
		return Math.ceil(this.iterationsRemaining() * this._iteration.length());
	};
	
	Projection.date = function() {
		return this._daysToDate(this.daysRemaining());
	};
	
	Projection.dateRoundedToIteration = function() {
		var days = Math.ceil(this.iterationsRemaining()) * this._iteration.length();
		return this._daysToDate(days);
	};
	
	Projection.totalEffort = function() {
		var original = this._iteration.effortRemaining();
		var increase = (original * this._riskMultiplier) - original;
		return this._effortToDate + original + (increase * this.SCOPE_CHANGE_PERCENTAGE);
	};
	
	Projection.velocity = function() {
		return this.totalEffort() / this.iterationsRemaining();
	};
}());
