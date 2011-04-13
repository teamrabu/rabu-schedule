// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("Rabu");
	var r;
	var config;

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
			velocity: 10,
			includedFeatures: [
				["completed", 0],
				["feature A", 70],
				["feature B", 30]
			],
			excludedFeatures: [
				["excluded 1", 20]
			]
		};
		r = new rabu.schedule.Rabu(config);
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

	Test.prototype.test_dom_projections = function() {
		/*:DOC += <span class="rabu-tenPercentDate"></span> */
		/*:DOC += <span class="rabu-fiftyPercentDate"></span> */
		/*:DOC += <span class="rabu-ninetyPercentDate"></span> */

		r.populateDom();
		assertEquals("10%", "March 12th", $(".rabu-tenPercentDate").text());
		assertEquals("50%", "May 21st", $(".rabu-fiftyPercentDate").text());
		assertEquals("90%", "October 8th", $(".rabu-ninetyPercentDate").text());
	};
}());