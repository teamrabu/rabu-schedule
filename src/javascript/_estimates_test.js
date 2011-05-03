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
	
    Test.prototype.test_iterationCount = function() {
        config.iterations = [ { velocity: 1 }, { velocity: 2 }, { velocity: 3 }];
        assertEquals(3, estimates.iterationCount());
    };
	
	Test.prototype.test_iterationAccessors = function() {
		config.iterations = undefined;
		assertEquals("undefined iterations (current)", undefined, estimates.currentIteration().velocity());
        assertEquals("undefined iterations (first)", undefined, estimates.firstIteration().velocity());
		assertEquals("undefined iterations (nth)", undefined, estimates.iteration(0).velocity());
		
		config.iterations = [];
		assertEquals("no iterations (current)", undefined, estimates.currentIteration().velocity());
        assertEquals("no iterations (first)", undefined, estimates.firstIteration().velocity());
		assertEquals("no iterations (nth)", undefined, estimates.iteration(0).velocity());
		
		config.iterations = [ { velocity: 10 }];
		assertEquals("one iteration (current)", 10, estimates.currentIteration().velocity());
        assertEquals("one iteration (first)", 10, estimates.firstIteration().velocity());
		assertEquals("one iteration (nth)", 10, estimates.iteration(0).velocity());
		
		config.iterations = [ { velocity: 1 }, { velocity: 2 }, { velocity: 3 } ];
		assertEquals("multiple iterations (current)", 1, estimates.currentIteration().velocity());
		assertEquals("multiple iterations (first)", 3, estimates.firstIteration().velocity());
		assertEquals("multiple iterations (nth)", 2, estimates.iteration(1).velocity());
	};
	
	Test.prototype.test_iterationsAreConstructedWithEffortToDate = function() {
		config.iterations = [ 
            { velocity: 1, included: [["feature", 10]]},
            { velocity: 2, included: [["feature", 20]]},
			{ velocity: 3, included: [["feature", 30]]}
		];
		
		assertEquals("iteration 0", 30, estimates.iteration(0).totalEffort());
		assertEquals("iteration 1", 23, estimates.iteration(1).totalEffort());
		assertEquals("iteration 2", 15, estimates.iteration(2).totalEffort());
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
		iteration = new rs.Iteration(config, 0);
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
		assertFeatureEquals("feature 0", new rs.Feature(["feature A", 10]), actual[0]);
		assertFeatureEquals("feature 1", new rs.Feature(["feature B", 20]), actual[1]);
		assertFeatureEquals("feature 2", new rs.Feature(["feature C", 70]), actual[2]);
	};

	Test.prototype.test_excludedFeatures = function() {
		config.excluded = [
			["excluded 1", 5],
			["excluded 2", 10]
		];
		var actual = iteration.excludedFeatures();
		assertEquals("length", 2, actual.length);
		assertFeatureEquals("excluded 0", new rs.Feature(["excluded 1", 5]), actual[0]);
		assertFeatureEquals("excluded 1", new rs.Feature(["excluded 2", 10]), actual[1]);
	};

	Test.prototype.test_includedFeatures_whenUndefined = function() {
		config.included = undefined;
		assertEquals(0, iteration.includedFeatures().length);
	};

	Test.prototype.test_excludedFeatures_whenUndefined = function() {
		assertEquals(0, iteration.excludedFeatures().length);
	};

	Test.prototype.test_effortRemaining_isSumOfFeatureEstimates = function() {
		assertEquals(100, iteration.effortRemaining());

		config.included = [["feature A", 10]];
		assertEquals("one feature", 10, iteration.effortRemaining());

		config.included = [];
		assertEquals("no feature", 0, iteration.effortRemaining());
	};

	Test.prototype.test_effortRemaining_doesNotIncludeExcludedFeatures = function() {
		config.excluded = [["excluded feature", 42]];
		assertEquals(100, iteration.effortRemaining());
	};
	
	Test.prototype.test_effortToDate = function() {
		iteration = new rs.Iteration(config, 13);
		assertEquals(13, iteration.effortToDate());
	};
	
	Test.prototype.test_totalEffort_isEffortRemainingPlusEffortToDate = function() {
		iteration = new rs.Iteration(config, 13);
		assertEquals(113, iteration.totalEffort());
		assertEquals("should not affect effort remaining", 100, iteration.effortRemaining());
	};
	
	Test.prototype.test_includedFeatures_areConstructedWithCumulativeEffortAndEffortToDate = function() {
		iteration = new rs.Iteration(config, 100);
		var features = iteration.includedFeatures();
		assertEquals("assumption: length", 3, features.length);
		assertEquals("feature 0 total effort", 110, features[0].totalEffort());
		assertEquals("feature 1 total effort", 130, features[1].totalEffort());
		assertEquals("feature 2 total effort", 200, features[2].totalEffort());
	};
	
	Test.prototype.test_excludedFeatures_accumulateAfterIncludedFeatures = function() {
		config.excluded = [["excluded A", 10], ["excluded B", 20]];
		iteration = new rs.Iteration(config, 100);
		var features = iteration.excludedFeatures();
		assertEquals("assumption: length", 2, features.length);
		assertEquals("feature 0 total effort", 210, features[0].totalEffort());
		assertEquals("feature 1 total effort", 230, features[1].totalEffort());
	};
}());


(function() {
	var Test = new TestCase("FeatureTest");
	var rs = rabu.schedule;

	Test.prototype.test_equals = function() {
		var a1 = new rs.Feature(["feature A", 10], 0, 0);
		var a2 = new rs.Feature(["feature A", 10], 0, 0);
		var b = new rs.Feature(["feature B", 10], 0, 0);
		var b2 = new rs.Feature(["feature B", 20], 0, 0);

		assertTrue(a1.equals(a2));
		assertFalse(a1.equals(b));
		assertFalse(b.equals(b2));
	};

	Test.prototype.test_toString = function() {
		assertEquals("['feature', 10]", new rs.Feature(["feature", 10], 0, 0).toString());
	};

	Test.prototype.test_bareData = function() {
		var feature = new rs.Feature(["feature name", 33], 20, 30);
		assertEquals("name", "feature name", feature.name());
		assertEquals("estimate", 33, feature.estimate());
	};

	Test.prototype.test_done = function() {
		assertTrue("done", new rs.Feature(["done", 0], 20, 30).isDone());
		assertFalse("not done", new rs.Feature(["not done", 10], 20, 30).isDone());
	};
	
	Test.prototype.test_cumulativeEstimate = function() {
		var feature = new rs.Feature(["feature", 10], 20, 30);
		assertEquals(30, feature.cumulativeEstimate());
	};
	
	Test.prototype.test_totalEffort = function() {
		var feature = new rs.Feature(["feature", 10], 20, 30);
		assertEquals(60, feature.totalEffort());
	};
}());