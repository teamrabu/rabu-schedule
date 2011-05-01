// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("BurnupDom");
	var rs = rabu.schedule;
	var burnup, paper;
	var xAxis, yAxis, xLabel, yLabel, xTicks;
	var xLabelBounds, yLabelBounds;
	
	function loadNodeVars() {
		xLabel = paper.bottom;
		yLabel = xLabel.next;
		xAxis = yLabel.next;
		yAxis = xAxis.next;
		xTicks = [ yAxis.next ];
		var i;
		for (i = 1; i < 8; i++) {
			xTicks[i] = xTicks[i-1].next;
		}
		assertNull("should not be any more Raphael nodes", xTicks[7].next);
		
		xLabelBounds = xLabel.getBBox();
		yLabelBounds = yLabel.getBBox();
	}
	
	Test.prototype.setUp = function() {
		/*:DOC += <div class="rabu-burnup" style="height:300px; width:200px">
		              <div class="rabu-xLabel" style="font-size: 16px; font-family: serif; font-weight: 100;">X Label</div>
		              <div class="rabu-yLabel" style="font-size: 12px; font-family: sans-serif; font-weight: 200;">Y Label</div>
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
        var metrics = new rs.BurnupChartMetrics(500, 100, 20, 10);
        burnup.populate(metrics);
		paper = burnup.paper();
		loadNodeVars();
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
	
	Test.prototype.test_populate_hidesInteriorDivs = function() {
		assertFalse("X-axis label markup should be hidden", $(".rabu-xLabel").is(":visible"));
		assertFalse("Y-axis label markup should be hidden", $(".rabu-yLabel").is(":visible"));
	};
	
	Test.prototype.test_populate_paperSizeMatchesDivSize = function() {
        assertEquals("width", 200, paper.width);
		assertEquals("height", 300, paper.height);
	};

    Test.prototype.test_populate_copiesLabelsFromHtml = function() {
        assertEquals("X Label", xLabel.attrs.text);
        assertEquals("X-axis label font-family", "serif", xLabel.attrs["font-family"]);
        assertEquals("X-axis label font-size", "16px", xLabel.attrs["font-size"]);
        assertEquals("X-axis label font-weight", "100", xLabel.attrs["font-weight"]);

        assertEquals("Y Label", yLabel.attrs.text);
        assertEquals("Y-axis label font-family", "sans-serif", yLabel.attrs["font-family"]);
        assertEquals("Y-axis label font-size", "12px", yLabel.attrs["font-size"]);
        assertEquals("Y-axis label font-weight", "200", yLabel.attrs["font-weight"]);
    };

    Test.prototype.test_populate_positionsLabels = function() {
		assertEquals("X-axis label position (x)", 260, xLabel.attrs.x);
		assertEquals("X-axis label position (y)", 90, xLabel.attrs.y);
        assertEquals("X-axis label text anchor", "middle", xLabel.attrs["text-anchor"]);

        assertEquals("Y-axis label position (x)", 5, yLabel.attrs.x);
		assertEquals("Y-axis label position (y)", 35, yLabel.attrs.y);
        assertEquals("Y-axis label text anchor", "middle", yLabel.attrs["text-anchor"]);
	};
		
    Test.prototype.test_populate_drawsAxes = function() {
		assertEquals("X-axis", line(10, 70, 500, 70), path(xAxis));
		assertEquals("Y-axis", line(20, 0, 20, 80), path(yAxis));
    };

    Test.prototype.test_populate_drawsXAxisTickMarks = function() {
		var xAxisBounds = xAxis.getBBox();
		var xAxisLength = xAxisBounds.width - burnup.AXIS_OVERHANG;
		var xAxisOrigin = xAxisBounds.x + burnup.AXIS_OVERHANG;
		var tickDistance = xAxisLength / 8.5;
		assertFloatEquals("tick 1", xAxisOrigin + (tickDistance), xTicks[0].getBBox().x); 
        assertFloatEquals("tick 2", xAxisOrigin + (tickDistance * 2), xTicks[1].getBBox().x); 
        assertFloatEquals("tick 3", xAxisOrigin + (tickDistance * 3), xTicks[2].getBBox().x); 
        assertFloatEquals("tick 4", xAxisOrigin + (tickDistance * 4), xTicks[3].getBBox().x); 
        assertFloatEquals("tick 5", xAxisOrigin + (tickDistance * 5), xTicks[4].getBBox().x); 
        assertFloatEquals("tick 6", xAxisOrigin + (tickDistance * 6), xTicks[5].getBBox().x); 
        assertFloatEquals("tick 7", xAxisOrigin + (tickDistance * 7), xTicks[6].getBBox().x); 
        assertFloatEquals("tick 8", xAxisOrigin + (tickDistance * 8), xTicks[7].getBBox().x); 
		
		// TODO: add tick marks when there's historical data
	};
}());


(function() {
    var Test = new TestCase("BurnupChartMetrics");
    var rs = rabu.schedule;
	var metrics, left, bottom;
	
	Test.prototype.setUp = function() {
        metrics = new rs.BurnupChartMetrics(500, 100, 20, 10);
		left = 10 + metrics.AXIS_OVERHANG;
		bottom = 80 - metrics.AXIS_OVERHANG;
	};
	
	Test.prototype.testChartArea = function() {	
		assertEquals("left", left, metrics.left);
		assertEquals("right", 500, metrics.right);
		assertEquals("width", 500 - left, metrics.width);
		
		assertEquals("top", 0, metrics.top);
		assertEquals("bottom", bottom, metrics.bottom);
		assertEquals("height", bottom, metrics.height);
	};
	
	Test.prototype.testLabels = function() {
		assertEquals("X-axis label horizontal center", left + ((500 - left) / 2), metrics.xLabelCenter);
		assertEquals("X-axis label vertical center", 90, metrics.xLabelVerticalCenter);
		assertEquals("Y-axis label horizontal center", 35, metrics.yLabelCenter);
		assertEquals("Y-axis label vertical center", 5, metrics.yLabelVerticalCenter);
	};
}());
