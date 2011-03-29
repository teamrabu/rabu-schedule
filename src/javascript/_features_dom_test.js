(function() {
	var Test = new TestCase("FeaturesDom");
	var config;
	var estimates;
	var featuresDom;

	Test.prototype.setUp = function() {
		config = {
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

	Test.prototype.test_populate_createsFeatureListHtml = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		populate();

		var expected = "<li class=\"rabu-included rabu-done\">completed</li><li class=\"rabu-included\">feature A</li><li class=\"rabu-included\">feature B</li><li class=\"rabu-excluded\">excluded 1</li>";
		assertEquals("feature list", expected, $(".rabu-features").html());

		populate();
		assertEquals("list should be idempotent", expected, $(".rabu-features").html());
	};

	Test.prototype.test_populate_ignoresDivider_whenItDoesNotExist = function() {
		populate();
		// should not throw exception
	};

	Test.prototype.test_populate_ignoresDivider_whenNoExcludedFeatures = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div class="rabu-divider"></div> */
		config.excludedFeatures = undefined;
		populate();

		// should not throw exception
		assertEquals("divider should be hidden", "none", $(".rabu-divider").css("display"));
	};

	Test.prototype.test_positionDivider = function() {
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

	Test.prototype.test_positionDivider_accountsForDividerMargins = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div style="margin-top: 10px; margin-bottom: 20px; padding-top: 50px" class="rabu-divider"></div> */
		populate();

		var firstExcluded = $("li:contains('excluded 1')");
		var divider = $(".rabu-divider");

		assertEquals("gap should include top and bottom margins", "80px", firstExcluded.css("margin-top"));
		assertEquals("divider, including margins, should be centered in gap", firstExcluded.offset().top - 80 + 10, divider.offset().top);
	};

	Test.prototype.test_makeDraggable = function() {
		/*:DOC += <ul class="rabu-features"></ul> */
		/*:DOC += <div class="rabu-divider" style="margin-top: 50px; padding-top: 10px"></div> */
		populate();
		var list = $(".rabu-features");
		var divider = $(".rabu-divider");

		function option(key) { return divider.draggable("option", key); }

		assertTrue("should be draggable", divider.hasClass("ui-draggable"));
		assertEquals("constrained vertically", "y", option("axis"));
		assertEquals("top", list.offset().top, option("containment")[1]);
		assertEquals("bottom", list.offset().top + 137, option("containment")[3]);
		assertEquals("scroll speed", 10, option("scrollSpeed"));
		assertEquals("cursor should be centered on divider", 5, option("cursorAt").top);
	};
}());