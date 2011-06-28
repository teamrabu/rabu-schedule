// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	var Test = new TestCase("DatesDom").prototype;

    var datesDom;

	Test.setUp = function() {
		var config = {
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
		var projections = new rs.Projections(new rs.Estimates(config));
		datesDom = new rs.DatesDom(projections);
	};

	Test.test_dates = function() {
		/*:DOC += <span class="rabu-tenPercentDate"></span> */
		/*:DOC += <span class="rabu-fiftyPercentDate"></span> */
		/*:DOC += <span class="rabu-ninetyPercentDate"></span> */

		datesDom.populate();
		assertEquals("10%", "March 12th", $(".rabu-tenPercentDate").text());
		assertEquals("50%", "May 21st", $(".rabu-fiftyPercentDate").text());
		assertEquals("90%", "October 8th", $(".rabu-ninetyPercentDate").text());
	};
}());