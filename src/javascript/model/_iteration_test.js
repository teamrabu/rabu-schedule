// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("IterationTest").prototype;
	var rs = rabu.schedule;
	var config, iteration;

	Test.setUp = function() {
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

	Test.test_startDate = function() {
		assertEquals(new rs.Date("1 Jan 2011"), iteration.startDate());
	};

	Test.test_length = function() {
		assertEquals(7, iteration.length());
	};

	Test.test_riskMultipliers = function() {
		config.riskMultipliers = [1, 2, 4];
        assertEquals(1, iteration.tenPercentMultiplier());
        assertEquals(2, iteration.fiftyPercentMultiplier());
        assertEquals(4, iteration.ninetyPercentMultiplier());
	};

	Test.test_velocity = function() {
		assertEquals(10, iteration.velocity());
	};

	Test.test_includedFeatures = function() {
		var actual = iteration.includedFeatures();
		assertEquals("length", 3, actual.length);
		assertFeatureEquals("feature 0", new rs.Feature(["feature A", 10]), actual[0]);
		assertFeatureEquals("feature 1", new rs.Feature(["feature B", 20]), actual[1]);
		assertFeatureEquals("feature 2", new rs.Feature(["feature C", 70]), actual[2]);
	};

	Test.test_excludedFeatures = function() {
		config.excluded = [
			["excluded 1", 5],
			["excluded 2", 10]
		];
		iteration = new rs.Iteration(config, 0);
		var actual = iteration.excludedFeatures();
		assertEquals("length", 2, actual.length);
		assertFeatureEquals("excluded 0", new rs.Feature(["excluded 1", 5]), actual[0]);
		assertFeatureEquals("excluded 1", new rs.Feature(["excluded 2", 10]), actual[1]);
	};

	Test.test_includedFeatures_whenUndefined = function() {
		config.included = undefined;
		iteration = new rs.Iteration(config, 0);
		assertEquals(0, iteration.includedFeatures().length);
	};

	Test.test_excludedFeatures_whenUndefined = function() {
		assertEquals(0, iteration.excludedFeatures().length);
	};

	Test.test_effortRemaining_isSumOfFeatureEstimates = function() {
		assertEquals(100, iteration.effortRemaining());

		config.included = [["feature A", 10]];
		iteration = new rs.Iteration(config, 0);
		assertEquals("one feature", 10, iteration.effortRemaining());

		config.included = [];
		iteration = new rs.Iteration(config, 0);
		assertEquals("no feature", 0, iteration.effortRemaining());
	};

	Test.test_effortRemaining_doesNotIncludeExcludedFeatures = function() {
		config.excluded = [["excluded feature", 42]];
		assertEquals(100, iteration.effortRemaining());
	};

	Test.test_effortToDate = function() {
		iteration = new rs.Iteration(config, 13);
		assertEquals(13, iteration.effortToDate());
	};

	Test.test_totalEffort_isEffortRemainingPlusEffortToDate = function() {
		iteration = new rs.Iteration(config, 13);
		assertEquals(113, iteration.totalEffort());
		assertEquals("should not affect effort remaining", 100, iteration.effortRemaining());
	};

	Test.test_includedFeatures_areConstructedWithCumulativeEffortAndEffortToDate = function() {
		iteration = new rs.Iteration(config, 100);
		var features = iteration.includedFeatures();
		assertEquals("assumption: length", 3, features.length);
		assertEquals("feature 0 total effort", 110, features[0].totalEffort());
		assertEquals("feature 1 total effort", 130, features[1].totalEffort());
		assertEquals("feature 2 total effort", 200, features[2].totalEffort());
	};

	Test.test_excludedFeatures_accumulateAfterIncludedFeatures = function() {
		config.excluded = [["excluded A", 10], ["excluded B", 20]];
		iteration = new rs.Iteration(config, 100);
		var features = iteration.excludedFeatures();
		assertEquals("assumption: length", 2, features.length);
		assertEquals("feature 0 total effort", 210, features[0].totalEffort());
		assertEquals("feature 1 total effort", 230, features[1].totalEffort());
	};

	function assertFeatureListEquals(message, expectedFeatures, actualFeatures) {
		var i, fail = false;
		assertEquals(message + " length", expectedFeatures.length, actualFeatures.length);

		for (i = 0; i < expectedFeatures.length; i++) {
			assertFeatureEquals(message + " #" + i, expectedFeatures[i], actualFeatures[i]);
		}
	}

	Test.test_moveFeature_includedOnly = function() {
		var features = iteration.includedFeatures();
		var a = features[0];
		var b = features[1];
		var c = features[2];

		iteration.moveFeature(2, 0);
		assertFeatureListEquals("abc -> cab", [c, a, b], iteration.includedFeatures());

		iteration.moveFeature(1, 2);
		assertFeatureListEquals("cab -> cba", [c, b, a], iteration.includedFeatures());
	};

	Test.test_moveFeature_excludedOnly = function() {
		config.excluded = config.included;
		config.included = undefined;
		iteration = new rs.Iteration(config, 0);

		var features = iteration.excludedFeatures();
		var a = features[0];
		var b = features[1];
		var c = features[2];

		iteration.moveFeature(2, 0);
		assertFeatureListEquals("abc -> cab", [c, a, b], iteration.excludedFeatures());
		
		iteration.moveFeature(1, 2);
		assertFeatureListEquals("cab -> cba", [c, b, a], iteration.excludedFeatures());
	};

	Test.test_moveFeature_excludedOnlyWhenIncludedFeaturesAlsoPresent = function() {
		config.excluded = [
			["excluded D", 5],
			["excluded E", 10],
			["excluded F", 15]
		];
		iteration = new rs.Iteration(config, 0);
		var features = iteration.excludedFeatures();
		var d = features[0];
		var e = features[1];
		var f = features[2];

		iteration.moveFeature(3, 4);
		assertFeatureListEquals("def -> edf", [e, d, f], iteration.excludedFeatures());
	};

	Test.test_moveFeature_betweenIncludedAndExcluded = function() {
		config.excluded = [
			["excluded D", 5],
			["excluded E", 10]
		];
		iteration = new rs.Iteration(config, 0);
		var included = iteration.includedFeatures();
		var excluded = iteration.excludedFeatures();
		var a = included[0];
		var b = included[1];
		var c = included[2];
		var d = excluded[0];
		var e = excluded[1];

		iteration.moveFeature(1, 4);
		assertFeatureListEquals("abc -> ac", [a, c], iteration.includedFeatures());
		assertFeatureListEquals("de -> dbe", [d, b, e], iteration.excludedFeatures());

		iteration.moveFeature(3, 0);
		assertFeatureListEquals("ac" -> "dac", [d, a, c], iteration.includedFeatures());
		assertFeatureListEquals("dbe" -> "be", [d, b, e], iteration.excludedFeatures());
	};
}());
