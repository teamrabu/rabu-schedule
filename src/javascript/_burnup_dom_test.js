// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("BurnupDom");
	var rs = rabu.schedule;
	var burnup;
	
	Test.prototype.setUp = function() {
		/*:DOC += <div class="rabu-burnup" style="height:300px; width:200px"></div> */
		var config = {
			included: [
				["features", 100]
			]
		};
		var estimates = new rabu.schedule.Estimates({iterations: [config]});
		burnup = new rs.BurnupDom($(".rabu-burnup"), estimates);
		burnup.populate();
	};
	
	Test.prototype.test_populate_paperSizeMatchesDomSize = function() {
		var paper = burnup.paper();
        assertEquals("width", 200, paper.width);
		assertEquals("height", 300, paper.height);
	};
	
}());
