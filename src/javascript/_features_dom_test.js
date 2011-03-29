/*global TestCase, assertEquals, assertEquals */

(function() {
	var Test = new TestCase("FeaturesDom");
	var config;
	var estimates;
	var featuresDom;

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
		estimates = new rabu_ns.Estimates(config);
	};

	function populate() {
		featuresDom = new rabu_ns.FeaturesDom($(".rabu-features"), estimates);
		featuresDom.populate();
	}

	Test.prototype.test_dom_features = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		populate();

		var expected = "<li class=\"rabu-included rabu-done\">completed</li><li class=\"rabu-included\">feature A</li><li class=\"rabu-included\">feature B</li><li class=\"rabu-excluded\">excluded 1</li>";
		assertEquals("feature list", expected, $(".rabu-features").html());
	};

	Test.prototype.test_dom_featureDivider_isPositionedBetweenIncludedAndExcludedFeatures = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div style="padding-top: 50px" class="rabu-divider"></div> */
		populate();

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
		populate();

		var firstExcluded = $("li:contains('excluded 1')");
		var divider = $(".rabu-divider");

		assertEquals("gap should include top and bottom margins", "80px", firstExcluded.css("margin-top"));
		assertEquals("divider, including margins, should be centered in gap", firstExcluded.offset().top - 80 + 10, divider.offset().top);
	};

	Test.prototype.test_dom_featureDivider_isIgnoredWhenItIsNotPresentInHtml = function() {
		populate();
		// should not throw exception
	};

	Test.prototype.test_dom_featureDivider_isHiddenWhenThereAreNoExcludedFeatures = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div class="rabu-divider"></div> */
		config.excludedFeatures = undefined;
		populate();

		// should not throw exception
		assertEquals("divider should be hidden", "none", $(".rabu-divider").css("display"));
	};

}());