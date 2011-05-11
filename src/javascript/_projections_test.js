// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("Projections");
	var projections;
	var config;

	Test.prototype.setUp = function() {
		config = {
			riskMultipliers: [1, 2, 4],
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
		config.riskMultipliers = [0.25, 0.25, 0.75];
		
		assertEquals("10% should round to next day", new Date("6 Jan 2011"), projections.tenPercentDate());
		assertEquals("50% should round to next day", new Date("6 Jan 2011"), projections.fiftyPercentDate());
		assertEquals("90% should round to next iteration", new Date("21 Jan 2011"), projections.ninetyPercentDate());
	};

	Test.prototype.test_totalIterations = function() {
		config.riskMultipliers = [1, 2, 4.3];
		assertEquals("should round up to whole number", 9, projections.totalIterations());
				
		config.iterations.push({});
		config.iterations.push({});
		assertEquals("should include historical iterations", 11, projections.totalIterations());
	};
	
	Test.prototype.test_maxEffort = function() {
		assertEquals(projections.ninetyPercentProjection().totalEffort(), projections.maxEffort());
	};
	
	Test.prototype.test_maxEffort_includesEffortToDate = function() {
		var effortWithNoHistory = projections.ninetyPercentProjection().totalEffort();
		config.iterations.push({
			started: "25 Dec 2010",
			length: 7,
			velocity: 10,
			included: [["whatever", 3]]
		});
		assertEquals(effortWithNoHistory + 10, projections.maxEffort());
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
		projection = new rs.Projection(iteration, 2, 0);
		assertEquals("basic calculation", 20, projection.iterationsRemaining());

		projection = new rs.Projection(iteration, 0.25, 0);		
		assertEquals("should not round", 2.5, projection.iterationsRemaining());
	};
	
	Test.prototype.test_daysRemaining = function() {
		projection = new rs.Projection(iteration, 1, 0);
		assertEquals("basic calculation", 70, projection.daysRemaining());
		
		projection = new rs.Projection(iteration, 0.25, 0);
		assertEquals("should round up to next day", 18, projection.daysRemaining());
	};
	
	Test.prototype.test_date = function() {
		projection = new rs.Projection(iteration, 0.1, 0);
		assertEquals("date", new Date("8 Jan 2011"), projection.date());
	};
	
	Test.prototype.test_dateRoundedToIteration = function() {
		projection = new rs.Projection(iteration, 0.11, 0);
		assertEquals("should round up to beginning of iteration", new Date("15 Jan 2011"), projection.dateRoundedToIteration());
		
		projection = new rs.Projection(iteration, 0.1, 0);
		assertEquals("should not add time when no fraction", new Date("8 Jan 2011"), projection.dateRoundedToIteration());
	};
	
	Test.prototype.test_totalEffort_and_velocity = function() {
		projection = new rs.Projection(iteration, 4, 0);
		// original scope = 100; multiplied by risk factor = 400; increase = (400 - 100) = 300.
		// 80% of increase = 300 * .8 = 240
		// projected increase = original + 80% increase = 100 + 240 = 340
		assertEquals("80% of increase in projection should be due to increased scope", 340, projection.totalEffort());
		// projected iterations = 40; projected scope = 340; projected velocity = 340 / 40 = 8.5
		assertEquals("20% of increase in projection should be due to reduced velocity", 8.5, projection.velocity());

        projection = new rs.Projection(iteration, 2, 0);
		assertEquals("2x risk factor scope", 180, projection.totalEffort());
		assertEquals("2x risk factor velocity", 9, projection.velocity());
		
		projection = new rs.Projection(iteration, 1, 0);
		assertEquals("1x risk factor scope", 100, projection.totalEffort());
		assertEquals("1x risk factor velocity", 10, projection.velocity());
		
		projection = new rs.Projection(iteration, 0.8, 0);
		assertEquals("0.8x risk factor scope", 84, projection.totalEffort());
		assertEquals("0.8x risk factor velocity", 10.5, projection.velocity());
		
		projection = new rs.Projection(iteration, 1, 10);
		assertEquals("includes effort to date", 110, projection.totalEffort());
	};
}());
