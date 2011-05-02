// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("BurnupDom");
	var rs = rabu.schedule;
	var burnup, paper, metricsConfig, metrics;
	
	Test.prototype.setUp = function() {
		/*:DOC += <div class="rabu-burnup" style="height:300px; width:200px">
		              <div class="rabu-xLabel" style="font-size: 16px; font-family: serif; font-weight: 100;">X Label</div>
		              <div class="rabu-yLabel" style="font-size: 12px; font-family: sans-serif; font-weight: 200;">Y Label</div>
		              <div class="rabu-xTickLabel" style="font-size: 8px">X Tick Label</div>
		              <div class="rabu-yTickLabel" style="font-size: 4px">Y Tick Label</div>
                  </div> */
		var config = {
			riskMultipliers: [1, 2, 4],
			iterations: [{
				started: "1 Jan 2011",
				length: 7,
				velocity: 10,
				included: [
					["features", 20]
				]
			}]
		};
		var estimates = new rs.Estimates(config);
		burnup = new rs.BurnupDom($(".rabu-burnup"), estimates, new rs.Projections(estimates));
		burnup.populate();
        metricsConfig = {
            paperWidth: 500, paperHeight: 100,
            xLabelHeight: 20, yLabelHeight: 10,
            xTickLabelHeight: 10, yTickLabelHeight: 8,
            startDate: "1 Jan 2011", iterationLength: 5,
            iterationCount: 4, maxEffort: 1,
            Y_TICK_SPACING: 3
        };
		metrics = new rs.BurnupChartMetrics(metricsConfig);
        burnup.populate(metrics);
		paper = burnup.paper();
	};
	
	function path(raphaelObject) {
		assertNotNull("path", raphaelObject);
		assertEquals("expected object to be path, but was " + raphaelObject.type, "path", raphaelObject.type);
		return raphaelObject.node.attributes.d.value;
	}
	
	function line(x1, y1, x2, y2) {
		return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
	}
	
	function assertFloatEquals(message, expected, actual) {
		if (actual < expected - 0.0005 || actual > expected + 0.0005) {
			assertEquals(message, expected, actual);
		}
	}
	
	Test.prototype.test_populate_isIdempotent = function() {
	   burnup.populate();
	   burnup.populate();
	   assertEquals("should only be one drawing area", 1, $(".rabu-burnup svg").length);
	};
	
	Test.prototype.test_populate_hidesPrototypicalTickLabels = function() {
		assertEquals("prototypical X-axis tick label should be hidden", "none", burnup.xTickLabel.node.style.display);
        assertEquals("prototypical Y-axis tick label should be hidden", "none", burnup.yTickLabel.node.style.display);
	};
	
	Test.prototype.test_populate_hidesInteriorDivs = function() {
		assertFalse("X-axis label markup should be hidden", $(".rabu-xLabel").is(":visible"));
		assertFalse("Y-axis label markup should be hidden", $(".rabu-yLabel").is(":visible"));
        assertFalse("X-axis tick label markup should be hidden", $(".rabu-xTickLabel").is(":visible"));
        assertFalse("Y-axis tick label markup should be hidden", $(".rabu-yTickLabel").is(":visible"));
	};
	
	Test.prototype.test_populate_paperSizeMatchesDivSize = function() {
        assertEquals("width", 200, paper.width);
		assertEquals("height", 300, paper.height);
	};

    Test.prototype.test_populate_copiesLabelsFromHtml = function() {
        assertEquals("X Label", burnup.xLabel.attrs.text);
        assertEquals("X-axis label font-family", "serif", burnup.xLabel.attrs["font-family"]);
        assertEquals("X-axis label font-size", "16px", burnup.xLabel.attrs["font-size"]);
        assertEquals("X-axis label font-weight", "100", burnup.xLabel.attrs["font-weight"]);

        assertEquals("Y Label", burnup.yLabel.attrs.text);
        assertEquals("Y-axis label font-family", "sans-serif", burnup.yLabel.attrs["font-family"]);
        assertEquals("Y-axis label font-size", "12px", burnup.yLabel.attrs["font-size"]);
        assertEquals("Y-axis label font-weight", "200", burnup.yLabel.attrs["font-weight"]);
    };

    Test.prototype.test_populate_positionsLabels = function() {
		assertEquals("X-axis label position (x)", 260, burnup.xLabel.attrs.x);
		assertEquals("X-axis label position (y)", 90, burnup.xLabel.attrs.y);
        assertEquals("X-axis label text anchor", "middle", burnup.xLabel.attrs["text-anchor"]);

        assertEquals("Y-axis label position (x)", 5, burnup.yLabel.attrs.x);
		assertEquals("Y-axis label position (y)", 30.5, burnup.yLabel.attrs.y);
        assertEquals("Y-axis label text anchor", "middle", burnup.yLabel.attrs["text-anchor"]);
	};
		
    Test.prototype.test_populate_drawsAxes = function() {
		assertEquals("X-axis", line(10, 61, 500, 61), path(burnup.xAxis));
		assertEquals("Y-axis", line(20, 0, 20, 71), path(burnup.yAxis));
    };

    Test.prototype.test_populate_drawsMajorXAxisTickMarks = function() {
		assertEquals("# of X-axis ticks (does not render tick #0)", 3, burnup.xTicks.length);
        assertFloatEquals("X-axis tick 1", 20 + 137.14285, burnup.xTicks[0].getBBox().x);
        assertFloatEquals("X-axis tick 2", 20 + 274.28571, burnup.xTicks[1].getBBox().x);
        assertFloatEquals("X-axis tick 3", 20 + 411.42857, burnup.xTicks[2].getBBox().x);
		
		var tick = burnup.xTicks[1].getBBox();
		assertEquals("X-axis major tick width", 0, tick.width);
		assertEquals("X-axis major tick height", metrics.MAJOR_TICK_LENGTH, tick.height);
		assertEquals("X-axis major tick y", 61 - (metrics.MAJOR_TICK_LENGTH / 2), tick.y);
	};
	
	Test.prototype.test_populate_drawsMinorXAxisTickMarks_whenNoLabel = function() {
        metricsConfig.iterationCount = 40;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
        burnup.populate(metrics);
		
		assertEquals("assumption: x-axis tick 1 is minor", "Jan 11", burnup.xTickLabels[0].attrs.text);
		assertEquals("X-axis minor tick height", metrics.MINOR_TICK_LENGTH, burnup.xTicks[0].getBBox().height);
		assertEquals("X-axis minor tick y", 61 - (metrics.MINOR_TICK_LENGTH / 2), burnup.xTicks[0].getBBox().y);
	};
	
	Test.prototype.test_populate_drawsXAxisTickLabels = function() {
		assertEquals("# of X-axis tick labels", 3, burnup.xTickLabels.length);
		var label = burnup.xTickLabels[0];
		assertEquals("X-axis tick label name", "Jan 6", label.attrs.text);
		assertEquals("X-axis tick label text anchor", "middle", label.attrs["text-anchor"]);
		assertFloatEquals("X-axis tick label x position", 157.14285, label.attrs.x);
        assertEquals("X-axis tick label y position", 70, label.attrs.y);
        assertEquals("X-axis tick label font-size", "8px", label.attrs["font-size"]);
	};
	
	Test.prototype.test_populate_drawsMajorYAxisTickMarks = function() {
		assertEquals("# of Y-axis ticks (does not render tick #0)", 4, burnup.yTicks.length);
        assertFloatEquals("Y-axis tick 1", metrics.yTickPosition(1), burnup.yTicks[0].getBBox().y);
        assertFloatEquals("Y-axis tick 2", metrics.yTickPosition(2), burnup.yTicks[1].getBBox().y);
        assertFloatEquals("Y-axis tick 3", metrics.yTickPosition(3), burnup.yTicks[2].getBBox().y);
        assertFloatEquals("Y-axis tick 4", metrics.yTickPosition(4), burnup.yTicks[3].getBBox().y);
		
		var tick = burnup.yTicks[1].getBBox();
		assertEquals("Y-axis major tick width", metrics.MAJOR_TICK_LENGTH, tick.width);
		assertEquals("Y-axis major tick height", 0, tick.height);
		assertEquals("Y-axis major tick x", metrics.left - (metrics.MAJOR_TICK_LENGTH / 2), tick.x);
	};
	
	Test.prototype.test_populate_drawsMinorYAxisTickMarks = function() {
		metricsConfig.yTickLabelHeight = 500;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		burnup.populate(metrics);
		
		var tick = burnup.yTicks[1].getBBox();
		assertEquals("Y-axis minor tick width", metrics.MINOR_TICK_LENGTH, tick.width);
		assertEquals("Y-axis minor tick x", metrics.left - (metrics.MINOR_TICK_LENGTH / 2), tick.x);
	};
}());


(function() {
    var Test = new TestCase("BurnupChartMetrics");
    var rs = rabu.schedule;
	var metricsConfig, metrics;
	var bottom;
	
	Test.prototype.setUp = function() {
        metricsConfig = {
			paperWidth: 500, paperHeight: 100,
			xLabelHeight: 20, yLabelHeight: 10,
			xTickLabelHeight: 10, yTickLabelHeight: 8,
			startDate: "1 Jan 2011", iterationLength: 5,
			iterationCount: 4,
			maxEffort: 10,
			Y_TICK_SPACING: 3
		};
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		bottom = 61;
	};

    function assertFloatEquals(message, expected, actual) {
        if (actual < expected - 0.0005 || actual > expected + 0.0005) {
            assertEquals(message, expected, actual);
        }
    }
	
	Test.prototype.test_chartArea = function() {	
		assertEquals("left", 20, metrics.left);
		assertEquals("right", 500, metrics.right);
		assertEquals("width", 480, metrics.width);
		
		assertEquals("top", 0, metrics.top);
		assertEquals("bottom", bottom, metrics.bottom);
		assertEquals("height", 61, metrics.height);
	};
	
	Test.prototype.test_labels = function() {
		assertEquals("X-axis label horizontal center", 260, metrics.xLabelCenter);
		assertEquals("X-axis label vertical center", 100 - 10, metrics.xLabelVerticalCenter);
		assertEquals("Y-axis label horizontal center", 30.5, metrics.yLabelCenter);
		assertEquals("Y-axis label vertical center", 5, metrics.yLabelVerticalCenter);

        assertFloatEquals("X-axis tick label vertical center", 70, metrics.xTickLabelVerticalCenter);
	};
	
	Test.prototype.test_xTickPosition = function() {
		assertFloatEquals("X-axis tick 0 position", 20, metrics.xTickPosition(0));
		assertFloatEquals("X-axis tick 1 position", 20 + 137.14285, metrics.xTickPosition(1));
        assertFloatEquals("X-axis tick 2 position", 20 + 274.28571, metrics.xTickPosition(2));
		assertFloatEquals("X-axis tick 3 position", 20 + 411.42857, metrics.xTickPosition(3));
	};
	
	Test.prototype.test_shouldDrawXTickLabel = function() {
        assertTrue("should draw label that doesn't overlap anything", metrics.shouldDrawXTickLabel(1, 10, 0));
		assertFalse("should never draw label on tick 0", metrics.shouldDrawXTickLabel(0, 1, 0));
		assertFalse("should not draw label when it overlaps left edge", metrics.shouldDrawXTickLabel(1, 300, 0));
		assertFalse("should not draw label when padding overlaps left edge", metrics.shouldDrawXTickLabel(1, 270, 0));
        assertFalse("should not draw label when it overlaps right edge", metrics.shouldDrawXTickLabel(3, 200, 0));
		assertFalse("should not draw label when padding overlaps right edge", metrics.shouldDrawXTickLabel(3, 137, 0));
		assertFalse("should not draw label when it overlaps previous label", metrics.shouldDrawXTickLabel(2, 20, 290));
		assertFalse("should not draw label when padding overlaps previous label", metrics.shouldDrawXTickLabel(2, 20, 282));
	};
	
	Test.prototype.test_xTickLabel = function() {
		assertEquals("X-axis tick 0 label", "Jan 1", metrics.xTickLabel(0));
        assertEquals("X-axis tick 1 label", "Jan 6", metrics.xTickLabel(1));
        assertEquals("X-axis tick 2 label", "Jan 11", metrics.xTickLabel(2));
        assertEquals("X-axis tick 3 label", "Jan 16", metrics.xTickLabel(3));
	};
    
    Test.prototype.test_roundUpEffort = function() {
        assertEquals(0.25, metrics.roundUpEffort(0.0001));
        assertEquals(0.25, metrics.roundUpEffort(0.1));
        assertEquals(0.25, metrics.roundUpEffort(0.25));
        assertEquals(0.5, metrics.roundUpEffort(0.4));
        assertEquals(0.5, metrics.roundUpEffort(0.5));
        assertEquals(1, metrics.roundUpEffort(0.6));
        assertEquals(1, metrics.roundUpEffort(1));
        assertEquals(5, metrics.roundUpEffort(2));
        assertEquals(5, metrics.roundUpEffort(5));
        assertEquals(50, metrics.roundUpEffort(20));
        assertEquals(100, metrics.roundUpEffort(70));
        assertEquals(100, metrics.roundUpEffort(100));
        assertEquals(500000, metrics.roundUpEffort(400000));
    };

	Test.prototype.test_yTicks_scaleIntelligently = function() {
		metricsConfig.xLabelHeight = 0;
		metricsConfig.xTickLabelHeight = 0;
		metricsConfig.paperHeight = 45 + 5;
		metricsConfig.MAJOR_TICK_LENGTH = 10;
        metricsConfig.Y_TICK_SPACING = 10;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		assertEquals("assumption: chart height", 45, metrics.bottom);
		
		function assertTickScale(message, maxEffort, scale, count) {
			metricsConfig.maxEffort = maxEffort;
			metrics = new rs.BurnupChartMetrics(metricsConfig);
			assertEquals("y-axis tick label @ " + scale + " scale", scale, metrics.yTickLabel(1));
			assertEquals("y-axis count @ " + scale + " scale", count, metrics.yTickCount());
		}
		
		assertTickScale("Minimum tick value is 0.25", 1, 0.25, 5);
		assertTickScale("When tick spacing exceeded, tick values go up to 0.5", 1.25, 0.5, 4);
		assertTickScale("And then to 1", 4, 1, 5);
		assertTickScale("Then 5", 5, 5, 2);
		assertTickScale("Then 10", 40, 10, 5);
		assertTickScale("And so forth", 49000, 50000, 2);
	};
	
	Test.prototype.test_yTickLabel = function() {
		 assertEquals("tick label should increase (0)", "0", metrics.yTickLabel(0));
         assertEquals("tick label should increase (1)", "0.5", metrics.yTickLabel(1));
         assertEquals("tick label should increase (2)", "1", metrics.yTickLabel(2));
	};
	
	Test.prototype.test_yTickPosition = function() {
		metricsConfig.maxEffort = 1;
		
		var tickDistance = bottom / 4.5;
		assertFloatEquals("Y-axis tick 0 position", bottom, metrics.yTickPosition(0));
		assertFloatEquals("Y-axis tick 1 position", bottom - (tickDistance), metrics.yTickPosition(1));
        assertFloatEquals("Y-axis tick 2 position", bottom - (tickDistance * 2), metrics.yTickPosition(2));
        assertFloatEquals("Y-axis tick 3 position", bottom - (tickDistance * 3), metrics.yTickPosition(3));
        assertFloatEquals("Y-axis tick 4 position", bottom - (tickDistance * 4), metrics.yTickPosition(4));
	};
	
	Test.prototype.test_shouldDrawYTickLabel = function() {
        metricsConfig.xLabelHeight = 0;
        metricsConfig.xTickLabelHeight = 0;
        metricsConfig.paperHeight = 100 + 5;
        metricsConfig.MAJOR_TICK_LENGTH = 10;
        metricsConfig.Y_TICK_SPACING = 10;
        metricsConfig.yTickLabelHeight = 10;
		metricsConfig.maxEffort = 10;
        metrics = new rs.BurnupChartMetrics(metricsConfig);
        assertEquals("assumption: chart height", 100, metrics.bottom);
		assertEquals("assumption: y-axis tick count", 11, metrics.yTickCount());
		
        assertTrue("should draw label that doesn't overlap anything", metrics.shouldDrawYTickLabel(1, 500));
		assertFalse("should never draw label on tick 0", metrics.shouldDrawYTickLabel(0, 500));
		
		metricsConfig.yTickLabelHeight = 20;
		metricsConfig.Y_TICK_LABEL_PADDING_MULTIPLIER = 1;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		assertFalse("should not draw label when it overlaps bottom edge", metrics.shouldDrawYTickLabel(1, 500));
        assertFalse("should not draw label when it overlaps top edge", metrics.shouldDrawYTickLabel(10, 500));
        assertFalse("should not draw label when it overlaps previous label", metrics.shouldDrawYTickLabel(2, 90));
		
		metricsConfig.yTickLabelHeight = 1;
		metricsConfig.Y_TICK_LABEL_PADDING_MULTIPLIER = 20;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		assertFalse("should not draw label when padding overlaps bottom edge", metrics.shouldDrawYTickLabel(1, 500));
		assertFalse("should not draw label when padding overlaps top edge", metrics.shouldDrawYTickLabel(10, 500));
		assertFalse("should not draw label when padding overlaps previous label", metrics.shouldDrawYTickLabel(3, 90));
	};
}());
