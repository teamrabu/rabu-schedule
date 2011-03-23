/*global TestCase, assertSame, assertEquals */

(function() {
	var Test = new TestCase("EstimateTest");
	var estimates;
	var config;

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
			velocity: 10,
			features: [
				["feature A", 10],
				["feature B", 20],
				["feature C", 70]
			]
		};
		estimates = new rabu_ns.Estimates(config);
	};

	Test.prototype.test_bareData = function() {
		assertEquals("My name", estimates.name());
		assertEquals(new Date("5 Jan 2011"), estimates.updated());
		assertEquals(new Date("1 Jan 2011"), estimates.currentIterationStarted());
		assertEquals(7, estimates.iterationLength());
		assertEquals(10, estimates.velocity());
	};

	Test.prototype.test_riskMultipliers = function() {
		assertEquals(1, estimates.tenPercentMultiplier());
		assertEquals(2, estimates.fiftyPercentMultiplier());
		assertEquals(4, estimates.ninetyPercentMultiplier());
	};

	Test.prototype.test_effortRemaining_isSumOfFeatureEstimates = function() {
		assertEquals(100, estimates.effortRemaining());

		config.features = [["feature A", 10]];
		assertEquals("one feature", 10, estimates.effortRemaining());

		config.features = [];
		assertEquals("no feature", 0, estimates.effortRemaining());
	};

	Test.prototype.test_featureNames = function() {
		assertEquals(["feature A", "feature B", "feature C"], estimates.featureNames());
	};
}());