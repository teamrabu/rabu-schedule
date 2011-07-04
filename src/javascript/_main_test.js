// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("Main");
	var r;
	var config;

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			iterations: [{
				started: "1 Jan 2011",
				length: 7,
				velocity: 10,
				riskMultipliers: [1, 2, 4],
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
		r = new rabu.schedule.Main(config);
	};

	Test.prototype.test_dom_title = function() {
		/*:DOC += <span class="rabu-name"></span> */
		/*:DOC += <span class="rabu-name"></span> */

		r.populateDom();
		assertEquals("should set name", "My name", $(".rabu-name:eq(0)").text());
		assertEquals("should work with multiple elements", "My name", $(".rabu-name:eq(1)").text());
	};

	Test.prototype.test_dom_updatedDate = function() {
		/*:DOC += <span class="rabu-updated"></span> */

		r.populateDom();
		assertEquals("January 5th, 2011", $(".rabu-updated").text());
	};
}());