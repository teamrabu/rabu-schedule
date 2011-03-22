/*global TestCase, assertSame, assertEquals */

(function() {
	var Test = new TestCase("EstimateTest");
	var estimates;

	Test.prototype.setUp = function() {
		var config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
			velocity: 10,
			effortRemaining: 100
		};
		estimates = new rabu_ns.Estimates(config);
	};

	Test.prototype.test_bareData = function() {
		assertEquals("My name", estimates.name());
		assertEquals(new Date("5 Jan 2011"), estimates.updated());
		assertEquals(new Date("1 Jan 2011"), estimates.currentIterationStarted());
		assertEquals(7, estimates.iterationLength());
		assertEquals(10, estimates.velocity());
		assertEquals(100, estimates.effortRemaining());
	};

	Test.prototype.test_riskMultipliers = function() {
		assertEquals(1, estimates.tenPercentMultiplier());
		assertEquals(2, estimates.fiftyPercentMultiplier());
		assertEquals(4, estimates.ninetyPercentMultiplier());
	};
}());