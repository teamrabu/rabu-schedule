/*global TestCase, assertSame, assertEquals, assertTrue, assertFalse */

(function() {
	var Test = new TestCase("ProjectionTest");
	var projection;

	Test.prototype.setUp = function() {
		projection = new rabu_ns.Projection();
	};
}());