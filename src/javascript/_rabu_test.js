/*global TestCase, assertEquals, assertEquals */

(function() {
	var Test = new TestCase("Rabu");
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
			includedFeatures: [
				["completed", 0],
				["feature A", 70],
				["feature B", 30]
			],
			excludedFeatures: [
				["excluded 1", 20]
			]
		};
		rabu = new rabu_ns.Rabu(config);
	};

	Test.prototype.test_dom_title = function() {
		/*:DOC += <span class="rabu-name"></span> */
		/*:DOC += <span class="rabu-name"></span> */

		rabu.populateDom();
		assertEquals("should set name", "My name", $(".rabu-name:eq(0)").text());
		assertEquals("should work with multiple elements", "My name", $(".rabu-name:eq(1)").text());
	};

	Test.prototype.test_dom_updatedDate = function() {
		/*:DOC += <span class="rabu-updated"></span> */

		rabu.populateDom();
		assertEquals("January 5th, 2011", $(".rabu-updated").text());
	};

	Test.prototype.test_dom_projections = function() {
		/*:DOC += <span class="rabu-tenPercentDate"></span> */
		/*:DOC += <span class="rabu-fiftyPercentDate"></span> */
		/*:DOC += <span class="rabu-ninetyPercentDate"></span> */

		rabu.populateDom();
		assertEquals("10%", "March 12th", $(".rabu-tenPercentDate").text());
		assertEquals("50%", "May 21st", $(".rabu-fiftyPercentDate").text());
		assertEquals("90%", "October 8th", $(".rabu-ninetyPercentDate").text());
	};

	Test.prototype.test_dom_features = function() {
		/*:DOC += <ul class="rabu-features"></ul> */

		rabu.populateDom();
		var expected = "<li class=\"rabu-included rabu-done\">completed</li><li class=\"rabu-included\">feature A</li><li class=\"rabu-included\">feature B</li><li class=\"rabu-excluded\">excluded 1</li>";
		assertEquals("feature list", expected, $(".rabu-features").html());
	};

	Test.prototype.test_dom_featureDivider_isPositionedBetweenIncludedAndExcludedFeatures = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div style="padding-top: 50px" class="rabu-divider"></div> */

		rabu.populateDom();
		var featuresList = $(".rabu-features");
		var firstExcluded = $("li:contains('excluded 1')");
		var divider = $(".rabu-divider");

		assertEquals("gap should equal divider size", "50px", firstExcluded.css("margin-top"));
		assertEquals("divider should be centered in gap", firstExcluded.offset().top - 50, divider.offset().top);
		assertEquals("left side of divider should be aligned with list", featuresList.offset().left, divider.offset().left);
	};

	Test.prototype.test_dom_featureDivider_positioningAccountsForMargins = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div style="margin-top: 10px; margin-bottom: 20px; padding-top: 50px" class="rabu-divider"></div> */

		rabu.populateDom();
		var firstExcluded = $("li:contains('excluded 1')");
		var divider = $(".rabu-divider");

		assertEquals("gap should include top and bottom margins", "80px", firstExcluded.css("margin-top"));
		assertEquals("divider, including margins, should be centered in gap", firstExcluded.offset().top - 80 + 10, divider.offset().top);
	};

	Test.prototype.test_dom_featureDivider_isIgnoredWhenItIsNotPresentInHtml = function() {
		rabu.populateDom();
		// should not throw exception
	};

	Test.prototype.test_dom_featureDivider_isHiddenWhenThereAreNoExcludedFeatures = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div class="rabu-divider"></div> */

		config.excludedFeatures = undefined;
		rabu.populateDom();
		// should not throw exception
		assertEquals("divider should be hidden", "none", $(".rabu-divider").css("display"));
	};

}());