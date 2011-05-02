// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("BurnupDom");
	var rs = rabu.schedule;
	var burnup, paper, metrics;
	
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
        metrics = new rs.BurnupChartMetrics({
            paperWidth: 500, paperHeight: 100,
            xLabelHeight: 20, yLabelHeight: 10,
            xTickLabelHeight: 10, yTickLabelHeight: 8,
            startDate: "1 Jan 2011", iterationLength: 5,
            iterationCount: 4
        });
        burnup.populate(metrics);
		paper = burnup.paper();
//		loadNodeVars();
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
		assertEquals("# of X-axis ticks", 4, burnup.xTicks.length);
		assertFloatEquals("X-axis tick 0", 20, burnup.xTicks[0].getBBox().x);
        assertFloatEquals("X-axis tick 1", 20 + 137.14285, burnup.xTicks[1].getBBox().x);
        assertFloatEquals("X-axis tick 2", 20 + 274.28571, burnup.xTicks[2].getBBox().x);
        assertFloatEquals("X-axis tick 3", 20 + 411.42857, burnup.xTicks[3].getBBox().x);
		
		var tick = burnup.xTicks[1].getBBox();
		assertEquals("X-axis tick width", 0, tick.width);
		assertEquals("X-axis tick height", metrics.MAJOR_TICK_LENGTH, tick.height);
		assertEquals("X-axis tick y", 61 - (metrics.MAJOR_TICK_LENGTH / 2), tick.y);
	};
	
	Test.prototype.test_populate_drawsMinorXAxisTickMarks_whenNoLabel = function() {
        var metrics = new rs.BurnupChartMetrics({
            paperWidth: 500, paperHeight: 100,
            xLabelHeight: 20, yLabelHeight: 10,
            xTickLabelHeight: 10, yTickLabelHeight: 8,
            startDate: "1 Jan 2011", iterationLength: 5,
            iterationCount: 40
        });
        burnup.populate(metrics);
		assertEquals("assumption: x-axis tick 1 has no label", "Jan 11", burnup.xTickLabels[0].attrs.text);
		assertEquals("X-axis minor tick height", metrics.MINOR_TICK_LENGTH, burnup.xTicks[1].getBBox().height);
		assertEquals("X-axis minor tick y", 61 - (metrics.MINOR_TICK_LENGTH / 2), burnup.xTicks[1].getBBox().y);
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
}());


(function() {
    var Test = new TestCase("BurnupChartMetrics");
    var rs = rabu.schedule;
	var metricsConfig, metrics;
	
	Test.prototype.setUp = function() {
        metricsConfig = {
			paperWidth: 500, paperHeight: 100,
			xLabelHeight: 20, yLabelHeight: 10,
			xTickLabelHeight: 10, yTickLabelHeight: 8,
			startDate: "1 Jan 2011", iterationLength: 5,
			iterationCount: 4,
			maxEffort: 10
		};
		metrics = new rs.BurnupChartMetrics(metricsConfig);
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
		assertEquals("bottom", 61, metrics.bottom);
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
	
	Test.prototype.test_yTickCount = function() {
		metricsConfig.maxEffort = 10;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		assertEquals("y-axis ticks represent 0.25 points", 41, metrics.yTickCount());
		
		metricsConfig.maxEffort = 1;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		assertEquals("y-axis ticks never get smaller than 0.25 points", 5, metrics.yTickCount());

        metricsConfig.maxEffort = 11;
		assertEquals("when effort greater than 10, y-axis ticks represent 0.5 points", 23, metrics.yTickCount());
		metricsConfig.maxEffort = 20;
		assertEquals("20 effort", 41, metrics.yTickCount());
		
		metricsConfig.maxEffort = 21;
		assertEquals("when effort greater than 20, y-axis ticks represent 1 point", 22, metrics.yTickCount());
		
		//TODO: finish
	};
	
	Test.prototype.test_yTickPosition = function() {
		metricsConfig.maxEffort = 1;
		
//		assertEquals("")
	};
}());
