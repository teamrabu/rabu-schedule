// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("Projections");
	var projections;
	var config;

	Test.prototype.setUp = function() {
		config = {
			riskMultipliers: [0.25, 0.25, 0.75],
			iterations: [{
				started: "1 Jan 2011",
				length: 10,
				velocity: 1,
				included: [
					["feature", 2]
				]
			}]
		};
		projections = new rabu.schedule.Projections(new rabu.schedule.Estimates(config));
	};

	Test.prototype.test_dateProjections = function() {
		assertEquals("10% should round to next day", new Date("6 Jan 2011"), projections.tenPercentDate());
		assertEquals("50% should round to next day", new Date("6 Jan 2011"), projections.fiftyPercentDate());
		assertEquals("90% should round to next iteration", new Date("21 Jan 2011"), projections.ninetyPercentDate());
	};

	Test.prototype.test_maxIterations = function() {
		assertEquals(2, projections.maxIterations());
	};
}());


(function() {
	var Test = new TestCase("Projection");
	var rs = rabu.schedule;
	var projection, iteration, config;
	
	Test.prototype.setUp = function() {
		config = {
			started: "1 Jan 2011",
			length: 7,
			velocity: 10,
			included: [
				["feature", 100]
			]
		};
		iteration = new rs.Iteration(config);
	};
	
	Test.prototype.test_iterationsRemaining = function() {
		projection = new rs.Projection(iteration, 2);
		assertEquals("basic calculation", 20, projection.iterationsRemaining());

		projection = new rs.Projection(iteration, 0.25);		
		assertEquals("should not round", 2.5, projection.iterationsRemaining());
	};
	
	Test.prototype.test_daysRemaining = function() {
		projection = new rs.Projection(iteration, 1);
		assertEquals("basic calculation", 70, projection.daysRemaining());
		
		projection = new rs.Projection(iteration, 0.25);
		assertEquals("should round up to next day", 18, projection.daysRemaining());
	};
	
	Test.prototype.test_date = function() {
		projection = new rs.Projection(iteration, 0.1);
		assertEquals("date", new Date("8 Jan 2011"), projection.date());
	};
	
	Test.prototype.test_dateRoundedToIteration = function() {
		projection = new rs.Projection(iteration, 0.11);
		assertEquals("should round up to beginning of iteration", new Date("15 Jan 2011"), projection.dateRoundedToIteration());
		
		projection = new rs.Projection(iteration, 0.1);
		assertEquals("should not add time when no fraction", new Date("8 Jan 2011"), projection.dateRoundedToIteration());
	};
}());
