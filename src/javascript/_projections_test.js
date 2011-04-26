// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("Projections");
	var projections;
	var config;

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4],
			iterations: [{
				started: "1 Jan 2011",
				length: 7,
				velocity: 10,
				included: [
					["completed", 0],
					["feature A", 70],
					["feature B", 30]
				],
				excluded: [
					["excluded 1", 20]
				]
			}]
		};
		projections = new rabu.schedule.Projections(new rabu.schedule.Estimates(config));
	};

	Test.prototype.test_iterationProjections = function() {
		assertEquals("10%", 10, projections.tenPercentIterationsRemaining());
		assertEquals("50%", 20, projections.fiftyPercentIterationsRemaining());
		assertEquals("90%", 40, projections.ninetyPercentIterationsRemaining());
	};

	Test.prototype.test_dateProjections = function() {
		assertEquals("10%", new Date("12 Mar 2011"), projections.tenPercentDate());
		assertEquals("50%", new Date("21 May 2011"), projections.fiftyPercentDate());
		assertEquals("90%", new Date("8 Oct 2011"), projections.ninetyPercentDate());
	};

	Test.prototype.test_iterationProjectionsShouldNotRound = function() {
		config.riskMultipliers = [0.6, 1.4, 1.6];
		config.iterations[0].velocity = 9.5;
		config.iterations[0].included = [["A", 73]];

		assertEquals("10%", 4.610526315789474, projections.tenPercentIterationsRemaining());
		assertEquals("50%", 10.757894736842104, projections.fiftyPercentIterationsRemaining());
		assertEquals("90%", 12.294736842105264, projections.ninetyPercentIterationsRemaining());
	};

	Test.prototype.test_dateProjectionsShouldRoundUpToNextDay = function() {
		config.iterations[0].included = [["A", 14]];
		config.iterations[0].length = 1;

		assertEquals("10%", 1.4, projections.tenPercentIterationsRemaining());
		assertEquals("50%", 2.8, projections.fiftyPercentIterationsRemaining());
		assertEquals("90%", 5.6, projections.ninetyPercentIterationsRemaining());
		assertEquals("10%", new Date("3 Jan 2011"), projections.tenPercentDate());
		assertEquals("50%", new Date("4 Jan 2011"), projections.fiftyPercentDate());
		assertEquals("90%", new Date("7 Jan 2011"), projections.ninetyPercentDate());
	};
}());