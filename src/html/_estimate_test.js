/*global TestCase, assertSame, assertEquals */

(function() {
	var Test = new TestCase("EstimateTest");
	var rabu;
	var config;

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
			velocity: 10,
			effortRemaining: 100
		};
//		rabu = new Estimates(config);
	};
}());