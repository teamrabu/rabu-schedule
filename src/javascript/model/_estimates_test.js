// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
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
			updated: "5 Jan 2011"
		};
		estimates = new rabu.schedule.Estimates(config);
	};

	Test.prototype.test_name = function() {
		assertEquals("My name", estimates.name());
	};
	
	Test.prototype.test_updated = function() {
		assertEquals(new rs.Date("5 Jan 2011"), estimates.updated());
	};

	Test.prototype.test_riskMultipliers_areBasedOnCurrentIteration = function() {
		config.iterations = [
		    { riskMultipliers: [1, 2, 4] },
			{ riskMultipliers: [0.25, 0.5, 0.75] }
		];		
		
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
	
	Test.prototype.test_effortToDate = function() {
        config.iterations = [ 
            { velocity: 1, included: [["feature", 10]]},
            { velocity: 2, included: [["feature", 20]]},
            { velocity: 3, included: [["feature", 30]]}
        ];

		assertEquals(5, estimates.effortToDate());
	};
	
	Test.prototype.test_dateForIteration = function() {
        config.iterations = [ 
            { started: "15 Jan 2011", length: 7 },
            { started: "6 Jan 2011", length: 3 },
            { started: "9 Jan 2011", length: 2 },
            { started: "1 Jan 2011", length: 1 }
        ];
		
		assertEquals("current iteration", new rs.Date("15 Jan 2011"), estimates.dateForIteration(3));
		assertEquals("future iteration", new rs.Date("29 Jan 2011"), estimates.dateForIteration(5));
		assertEquals("historical iteration", new rs.Date("6 Jan 2011"), estimates.dateForIteration(2));
		assertEquals("first iteration", new rs.Date("1 Jan 2011"), estimates.dateForIteration(0));
	};
	
	Test.prototype.test_peakEffortEstimate = function() {
		config.iterations = [
            { velocity: 1, included: [["feature", 10]]},
            { velocity: 2, included: [["feature", 20]]},
            { velocity: 3, included: [["feature", 30]]}
		];
		assertEquals("peak estimate", 30, estimates.peakEffortEstimate());
	};
	
	Test.prototype.test_peakEffortEstimate_includesCompletedWork = function() {
        config.iterations = [
            { velocity: 1, included: [["feature", 10]]},
            { velocity: 200, included: [["feature", 20]]},
            { velocity: 3, included: [["feature", 30]]}
        ];
        assertEquals("peak estimate", 213, estimates.peakEffortEstimate());
	};
}());
