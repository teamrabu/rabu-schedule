// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.Projections = function(estimates) {
	var rs = rabu.schedule;
	
	function tenPercent() {
		return new rs.Projection(estimates.currentIteration(), estimates.tenPercentMultiplier()); 
	}
	
	function fiftyPercent() {
		return new rs.Projection(estimates.currentIteration(), estimates.fiftyPercentMultiplier());
	}
	
	function ninetyPercent() {
		return new rs.Projection(estimates.currentIteration(), estimates.ninetyPercentMultiplier());
	}

	this.tenPercentDate = function() {
		return tenPercent().date();
	};

	this.fiftyPercentDate = function() {
		return fiftyPercent().date();
	};

	this.ninetyPercentDate = function() {
		return ninetyPercent().dateRoundedToIteration();
	};
	
	this.maxIterations = function() {
		return Math.ceil(ninetyPercent().iterationsRemaining());
	};
};

rabu.schedule.Projection = function(iteration, riskMultiplier) {
	var self = this;
	
	function daysToDate(days) {
		var date = iteration.startDate();
		date.setDate(date.getDate() + days);
		return date;
	}
	
	this.iterationsRemaining = function() {
		return iteration.totalEstimate() / iteration.velocity() * riskMultiplier; 
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
};
