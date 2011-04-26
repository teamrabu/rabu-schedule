// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("Estimates");
	var estimates;
	var config;

	function assertFeatureEquals(name, expected, actual) {
		var message = name + " expected <" + expected + "> but was <" + actual + ">";
		assertTrue(message, expected.equals(actual));
	}

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4]
		};
		estimates = new rabu.schedule.Estimates(config);
	};

	Test.prototype.test_name = function() {
		assertEquals("My name", estimates.name());
	};
	
	Test.prototype.test_updated = function() {
		assertEquals(new Date("5 Jan 2011"), estimates.updated());
	};

	Test.prototype.test_riskMultipliers = function() {
		assertEquals(1, estimates.tenPercentMultiplier());
		assertEquals(2, estimates.fiftyPercentMultiplier());
		assertEquals(4, estimates.ninetyPercentMultiplier());
	};
	
	Test.prototype.test_currentIteration = function() {
		config.iterations = undefined;
		assertEquals("undefined iterations", undefined, estimates.currentIteration().velocity());
		
		config.iterations = [];
		assertEquals("no iterations", undefined, estimates.currentIteration().velocity());
		
		config.iterations = [ { velocity: 10 }];
		assertEquals("one iteration", 10, estimates.currentIteration().velocity());
		
		config.iterations = [ { velocity: 1}, { velocity: 2}, { velocity: 3}];
		assertEquals("multiple iterations--should use first", 1, estimates.currentIteration().velocity());
	};
}());


(function() {
	var Test = new TestCase("IterationTest");
	var rs = rabu.schedule;
	var config, iteration;

	Test.prototype.setUp = function() {
		config = {
			started: "1 Jan 2011",
			length: 7,
			velocity: 10,
			included: [
				["feature A", 10],
				["feature B", 20],
				["feature C", 70]
			]
		};
		iteration = new rabu.schedule.Iteration(config);
	};

	function assertFeatureEquals(name, expected, actual) {
		var message = name + " expected <" + expected + "> but was <" + actual + ">";
		assertTrue(message, expected.equals(actual));
	}

	Test.prototype.test_startDate = function() {
		assertEquals(new Date("1 Jan 2011"), iteration.startDate());
	};
	
	Test.prototype.test_length = function() {
		assertEquals(7, iteration.length());
	};
	
	Test.prototype.test_velocity = function() {
		assertEquals(10, iteration.velocity());
	};

	Test.prototype.test_includedFeatures = function() {
		var actual = iteration.includedFeatures();
		assertEquals("length", 3, actual.length);
		assertFeatureEquals("feature 1", new rs.Feature(["feature A", 10]), actual[0]);
		assertFeatureEquals("feature 2", new rs.Feature(["feature B", 20]), actual[1]);
		assertFeatureEquals("feature 3", new rs.Feature(["feature C", 70]), actual[2]);
	};

	Test.prototype.test_excludedFeatures = function() {
		config.excluded = [
			["excluded 1", 5],
			["excluded 2", 10]
		];
		var actual = iteration.excludedFeatures();
		assertEquals("length", 2, actual.length);
		assertFeatureEquals("excluded 1", new rs.Feature(["excluded 1", 5]), actual[0]);
		assertFeatureEquals("excluded 2", new rs.Feature(["excluded 2", 10]), actual[1]);
	};

	Test.prototype.test_includedFeatures_whenUndefined = function() {
		config.included = undefined;
		assertEquals(0, iteration.includedFeatures().length);
	};

	Test.prototype.test_excludedFeatures_whenUndefined = function() {
		assertEquals(0, iteration.excludedFeatures().length);
	};

	Test.prototype.test_effortRemaining_isSumOfFeatureEstimates = function() {
		assertEquals(100, iteration.totalEstimate());

		config.included = [["feature A", 10]];
		assertEquals("one feature", 10, iteration.totalEstimate());

		config.included = [];
		assertEquals("no feature", 0, iteration.totalEstimate());
	};

	Test.prototype.test_effortRemaining_doesNotIncludeExcludedFeatures = function() {
		config.excluded = [["excluded feature", 42]];
		assertEquals(100, iteration.totalEstimate());
	};
}());


(function() {
	var Test = new TestCase("FeatureTest");

	Test.prototype.test_equals = function() {
		var a1 = new rabu.schedule.Feature(["feature A", 10]);
		var a2 = new rabu.schedule.Feature(["feature A", 10]);
		var b = new rabu.schedule.Feature(["feature B", 10]);
		var b2 = new rabu.schedule.Feature(["feature B", 20]);

		assertTrue(a1.equals(a2));
		assertFalse(a1.equals(b));
		assertFalse(b.equals(b2));
	};

	Test.prototype.test_toString = function() {
		assertEquals("['feature', 10]", new rabu.schedule.Feature(["feature", 10]).toString());
	};

	Test.prototype.test_bareData = function() {
		var feature = new rabu.schedule.Feature(["feature name", 33]);
		assertEquals("name", "feature name", feature.name());
		assertEquals("estimate", 33, feature.estimate());
	};

	Test.prototype.test_done = function() {
		assertTrue("done", new rabu.schedule.Feature(["done", 0]).isDone());
		assertFalse("not done", new rabu.schedule.Feature(["not done", 10]).isDone());
	};
}());