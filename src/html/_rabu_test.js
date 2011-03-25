/*global TestCase, assertEquals, assertEquals */

(function() {
	var Test = new TestCase("RabuTest");
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

	Test.prototype.test_dom_featureDivider_isIgnoredWhenItIsNotPresentInHtml = function() {
		rabu.populateDom();
		// no exception thrown
	};

	Test.prototype.test_dom_featureDivider_isHiddenWhenThereAreNoExcludedFeatures = function() {
		//TODO
	};

	Test.prototype.test_dom_featureDivider_worksWhenThereAreMultipleDividers = function() {
		//TODO
	};

	Test.prototype.test_iterationProjections = function() {
		assertEquals("10%", 10, rabu.tenPercentIterationsRemaining());
		assertEquals("50%", 20, rabu.fiftyPercentIterationsRemaining());
		assertEquals("90%", 40, rabu.ninetyPercentIterationsRemaining());
	};

	Test.prototype.test_dateProjections = function() {
		assertEquals("10%", new Date("12 Mar 2011"), rabu.tenPercentDate());
		assertEquals("50%", new Date("21 May 2011"), rabu.fiftyPercentDate());
		assertEquals("90%", new Date("8 Oct 2011"), rabu.ninetyPercentDate());
	};

	Test.prototype.test_iterationProjectionsShouldNotRound = function() {
		config.riskMultipliers = [0.6, 1.4, 1.6];
		config.velocity = 9.5;
		config.includedFeatures = [["A", 73]];

		assertEquals("10%", 4.610526315789474, rabu.tenPercentIterationsRemaining());
		assertEquals("50%", 10.757894736842104, rabu.fiftyPercentIterationsRemaining());
		assertEquals("90%", 12.294736842105264, rabu.ninetyPercentIterationsRemaining());
	};

	Test.prototype.test_dateProjectionsShouldRoundUpToNextDay = function() {
		config.includedFeatures = [["A", 14]];
		config.iterationLength = 1;

		assertEquals("10%", 1.4, rabu.tenPercentIterationsRemaining());
		assertEquals("50%", 2.8, rabu.fiftyPercentIterationsRemaining());
		assertEquals("90%", 5.6, rabu.ninetyPercentIterationsRemaining());
		assertEquals("10%", new Date("3 Jan 2011"), rabu.tenPercentDate());
		assertEquals("50%", new Date("4 Jan 2011"), rabu.fiftyPercentDate());
		assertEquals("90%", new Date("7 Jan 2011"), rabu.ninetyPercentDate());
	};
}());