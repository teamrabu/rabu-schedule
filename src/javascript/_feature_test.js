// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

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
	
	Test.prototype.test_totalEffort = function() {
		var feature = new rs.Feature(["feature", 10], 20, 30);
		assertEquals(60, feature.totalEffort());
	};
}());