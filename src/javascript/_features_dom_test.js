(function() {
	var Test = new TestCase("FeaturesDom");
	var config;
	var estimates;
	var featuresDom;
	var ul;
	var li;
	var divider;

	function populate() {
		featuresDom = new rabu_ns.FeaturesDom($(".rabu-features"), estimates);
		featuresDom.populate();
		ul = $("ul");
		li = $("li");
		divider = $(".rabu-divider");
	}

	function assertLiPositions(message, positions) {
		var joiner = "";
		var actualPositions = "[";
		li.each(function(index, element) {
			actualPositions += joiner + $(element).offset().top;
			joiner = ", ";
		});
		actualPositions += "]";

		joiner = "";
		var expectedPositions = "[";
		positions.forEach(function(element, index) {
			expectedPositions += joiner + element;
			joiner = ", ";
		});
		expectedPositions += "]";

		assertEquals(message, expectedPositions, actualPositions);
	}

	function dragDividerTo(position, cursorOffset) {
		cursorOffset = cursorOffset || 8;

		var downEvent = new jQuery.Event();
		downEvent.pageX = 0;
		downEvent.pageY = 0;
		downEvent.which = 1;
		downEvent.type = "mousedown";
		divider.trigger(downEvent);

		var moveEvent = new jQuery.Event();
		moveEvent.pageX = 0;
		moveEvent.pageY = position + cursorOffset;
		moveEvent.type = "mousemove";
		divider.trigger(moveEvent);
	}

	Test.prototype.setUp = function() {
		/*:DOC +=   <style type='text/css'>
						li { font-size: 19px }
						ul { margin: 0; }
						body { margin: 0; }
						.rabu-divider { margin-top: 34px; padding-top: 16px; }
					</style>  */
		/*:DOC +=   <ul class="rabu-features"></ul> */
		/*:DOC +=   <div class="rabu-divider"></div> */
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
		populate();

		assertEquals("assumption: li height", 20, li.first().outerHeight(true));
		assertEquals("assumption: ul height", 20 * 4, ul.outerHeight(true));
		assertEquals("assumption: ul top", 0, ul.offset().top);
		assertEquals("assumption: first li top", 0, li.first().offset().top);
		assertEquals("assumption: divider height", 50, divider.outerHeight(true));
	};

	Test.prototype.test_populate_createsFeatureList = function() {
		assertEquals("li #0 text", "completed", $(li[0]).text());
		assertEquals("li #1 text", "feature A", $(li[1]).text());
		assertEquals("li #2 text", "feature B", $(li[2]).text());
		assertEquals("li #3 text", "excluded 1", $(li[3]).text());
	};

	Test.prototype.test_populate_isIdempotent = function() {
		populate();
		populate();
		assertEquals("# of items", 4, li.length);
	};

	Test.prototype.test_populate_marksItemsDone = function() {
		assertTrue("li #0 done", $(li[0]).hasClass("rabu-done"));
		assertFalse("li #1 done", $(li[1]).hasClass("rabu-done"));
		assertFalse("li #2 done", $(li[2]).hasClass("rabu-done"));
		assertFalse("li #3 done", $(li[3]).hasClass("rabu-done"));
	};
	
	Test.prototype.test_populate_marksItemsIncludedAndExcluded = function() {
		assertTrue("li #0 included", $(li[0]).hasClass("rabu-included"));
		assertTrue("li #1 included", $(li[1]).hasClass("rabu-included"));
		assertTrue("li #2 included", $(li[2]).hasClass("rabu-included"));
		assertFalse("li #3 included", $(li[3]).hasClass("rabu-included"));

		assertFalse("li #0 excluded", $(li[0]).hasClass("rabu-excluded"));
		assertFalse("li #1 excluded", $(li[1]).hasClass("rabu-excluded"));
		assertFalse("li #2 excluded", $(li[2]).hasClass("rabu-excluded"));
		assertTrue("li #3 excluded", $(li[3]).hasClass("rabu-excluded"));
	};

	Test.prototype.test_populate_positionsDivider = function() {
		config.excludedFeatures[1] = ["excluded 2", 30];
		populate();

		assertLiPositions("excluded features should be positioned below divider", [0, 20, 40, 110, 130]);
		assertEquals("divider should use absolute positioning", "absolute", divider.css("position"));
		assertEquals("divider should be centered in gap", 94, divider.offset().top);
	};

	Test.prototype.test_populate_positionsDividerAtBottomOfListWhenNoExcludedFeatures = function() {
		config.excludedFeatures = undefined;
		populate();

		assertLiPositions("li positions", [0, 20, 40]);
		assertEquals("divider position", 94, divider.offset().top);
	};

	Test.prototype.test_populate_positionsDividerAtTopOfListWhenNoIncludedFeatures = function() {
		config.includedFeatures = undefined;
		config.excludedFeatures[1] = ["excluded 2", 30];
		populate();

		assertLiPositions("li positions", [50, 70]);
		assertEquals("divider position", 34, divider.offset().top);
	};
//
//	Test.prototype.test_makeDraggable = function() {
//		function option(key) { return divider.draggable("option", key); }
//
//		assertTrue("should be draggable", divider.hasClass("ui-draggable"));
//		assertEquals("constrained vertically", "y", option("axis"));
//		assertEquals("top", 0, option("containment")[1]);
//		assertEquals("bottom", 80, option("containment")[3]);
//		assertEquals("scroll speed", 10, option("scrollSpeed"));
//		assertEquals("cursor should be centered on divider", 8, option("cursorAt").top);
//	};
//
//	Test.prototype.test_dragging_repositionsDivider = function() {
//		assertEquals("assumption: divider starting position", 94, divider.offset().top);
//		dragDividerTo(50);
//		assertEquals("divider ending position", 50, divider.offset().top);
//	};
//
//	Test.prototype.test_dragging_shouldRepositionGapAsSoonAsElementTouched = function() {
//		assertLiPositions("assumption: starting positions", [0, 20, 40, 110]);
//		dragDividerTo(60);
//		assertLiPositions("element not yet touched", [0, 20, 40, 110]);
//		dragDividerTo(59);
//		assertLiPositions("gap should have moved", [0, 20, 90, 110]);
//	};
}());