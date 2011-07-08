// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("BurnupDom");
	var rs = rabu.schedule;
	var config, estimates, projections, burnup, paper, metricsConfig, metrics;

	function populate() {
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		estimates = new rs.Estimates(config);
		projections = new rs.Projections(estimates);
		burnup = new rs.BurnupDom($(".rabu-burnup"), estimates, projections);
        burnup.populate(metrics);
		paper = burnup.paper();
	}

	Test.prototype.setUp = function() {
		/*:DOC += <div class="rabu-burnup" style="height:300px; width:200px">
		              <div class="rabu-xLabel" style="font-size: 16px; font-family: serif; font-weight: 100;">X Label</div>
		              <div class="rabu-yLabel" style="font-size: 12px; font-family: sans-serif; font-weight: 200;">Y Label</div>
		              <div class="rabu-xTickLabel" style="font-size: 8px">X Tick Label</div>
		              <div class="rabu-yTickLabel" style="font-size: 4px">Y Tick Label</div>
                  </div> */
		config = {
			iterations: [{
				started: "1 Jan 2011",
				length: 5,
				velocity: 10,
				riskMultipliers: [1, 2, 4],
				included: [
					["features", 20]
				]
			}]
		};
        metricsConfig = {
            paperWidth: 500, paperHeight: 100,
            xLabelHeight: 20, yLabelHeight: 10,
            xTickLabelHeight: 10, 
			yTickLabelWidth: 0, yTickLabelHeight: 8,
            startDate: "1 Jan 2011", iterationLength: 5,
            iterationCount: 3, maxEffort: 1,
            Y_TICK_SPACING: 3
        };
		populate();
	};
	
	function path(raphaelObject) {
		assertNotNull("path", raphaelObject);
		assertEquals("expected object to be path, but was " + raphaelObject.type, "path", raphaelObject.type);
		return raphaelObject.node.attributes.d.value;
	}
	
	function moveTo(x, y) {
		return "M" + x + "," + y;
	}
	
	function lineTo(x, y) {
		return "L" + x + "," + y;
	}
	
	function line(x1, y1, x2, y2) {
		return moveTo(x1, y1) + lineTo(x2, y2);
	}
	
	function rgb(r, g, b) {
		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
	
	function assertFloatEquals(message, expected, actual) {
		if (typeof(expected) !== "number" || typeof(actual) !== "number" || actual < expected - 0.0005 || actual > expected + 0.0005) {
			assertEquals(message, expected, actual);
		}
	}
	
	Test.prototype.test_populate_isIdempotent = function() {
	   burnup.populate();
	   burnup.populate();
	   assertEquals("should only be one drawing area", 1, $(".rabu-burnup svg").length);
	};

	Test.prototype.test_repopulate_performance = function() {
		var EXPECTED = 100;

		burnup.populate();
		var start = Date.now();
		burnup.populate();
		var actual = Date.now() - start;

		var message = "repopulate performance expected <" + EXPECTED + " ms, was " + actual + " ms";
		assertTrue(message, actual < EXPECTED);
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
	
    Test.prototype.test_populate_rendersDayAndMonthForXAxisTickLabels = function() {
        assertEquals("X-axis label", "Jan 6", burnup.xTickLabels[0].attrs.text);
    };

	Test.prototype.test_populate_drawsMinorXAxisTickMarks_whenNoLabel = function() {
        metricsConfig.iterationCount = 40;
		populate();
		
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
		metricsConfig.yTickLabelHeight = 50;
		populate();
		
		var tick = burnup.yTicks[0].getBBox();
		assertEquals("Y-axis minor tick width", metrics.MINOR_TICK_LENGTH, tick.width);
		assertEquals("Y-axis minor tick x", metrics.left - (metrics.MINOR_TICK_LENGTH / 2), tick.x);
		
		assertEquals("Y-axis tick rendering should track top edge", metrics.MINOR_TICK_LENGTH, burnup.yTicks[1].getBBox().width);
	};
	
	Test.prototype.test_populate_drawsYAxisTickLabels = function() {
		assertEquals("# of Y-axis tick labels", 4, burnup.yTickLabels.length);
		var label = burnup.yTickLabels[0];
		assertEquals("Y-axis tick label name", metrics.yTickLabel(1), label.attrs.text);
		assertEquals("Y-axis tick label text anchor", "end", label.attrs["text-anchor"]);
        assertEquals("Y-axis tick label x position", metrics.yTickLabelRightEdge, label.attrs.x);
		assertEquals("Y-axis tick label y position", metrics.yTickPosition(1), label.attrs.y);
	};
	
	function setupIterationTest(iterationCount) {
		if (!(iterationCount === 1 || iterationCount === 3)) {
			fail("unknown iterationCount: " + iterationCount);
		}
		
		config.iterations = [];
		config.iterations.push({
           "started": "15 Jan 2011",
           "length": 7,
			velocity: 6,
			riskMultipliers: [1, 2, 4],
			included: [["feature A", 1], ["feature B", 2], ["feature C", 3]]
		});
		if (iterationCount === 3) {
            config.iterations.push({
               "started": "8 Jan 2011",
               "length": 7,
				velocity: 7,
				included: [["feature A", 10], ["feature B", 20], ["feature C", 30]]
			});
            config.iterations.push({
	           "started": "1 Jan 2011",
	           "length": 7,
                velocity: 8,
				included: [["feature A", 100], ["feature B", 200], ["feature C", 300]]
			});
		}
		metricsConfig.maxEffort = 1000;
	}

	Test.prototype.test_populate_drawsIterations = function() {
        // zero iterations are (or will be) illegal

		setupIterationTest(1);
		populate();
		assertEquals("when one iteration", 0, burnup.iterations.length);
		
		setupIterationTest(3);
		populate();
		assertEquals("when three iterations", 2, burnup.iterations.length);
	};
	
	function setupFeatureTest(featureCount) {
		if (!(featureCount === 0 || featureCount === 1 || featureCount === 3)) {
			fail("unknown featureCount: " + featureCount);
		}
		
		setupIterationTest(3);
		config.iterations.forEach(function(iteration) {
			var i;
			for (i = 3; i > featureCount; i--) {
				iteration.included.pop();
			}
		});
	}
	
    function assertHistoryPolygonEquals(message, fromIteration, fromEffort, toEffort, lineColor, fillColor, title, historyPolygon) {
		assertNotUndefined(message, historyPolygon);
		
        var width = "3";
        var linecap = "round";

        var fromX = metrics.xForIteration(fromIteration);
        var fromY = metrics.yForEffort(fromEffort);
        var toX = metrics.xForIteration(fromIteration + 1);
        var toY = metrics.yForEffort(toEffort);
        
        var bottom = metrics.bottom;
        var polygonPath = moveTo(fromX, fromY) + lineTo(toX, toY) + lineTo(toX, bottom) + lineTo(fromX, bottom) + "Z";
        
        var polygon = historyPolygon[0];
		assertNotUndefined(message + " polygon", polygon);
        assertEquals(message + " polygon path", polygonPath, path(polygon));
        assertEquals(message + " polygon title", title, polygon.attrs.title);
        assertEquals(message + " polygon outline color", "white", polygon.attrs.stroke);
        assertEquals(message + " polygon outline width", "0.5", polygon.attrs["stroke-width"]);
        assertEquals(message + " polygon fill color", fillColor, polygon.attrs.fill);
    
        var myLine = historyPolygon[1];
		assertNotUndefined(message + " line", myLine);
        assertEquals(message + " line path", line(fromX, fromY, toX, toY), path(myLine));
        assertEquals(message + " line title", title, myLine.attrs.title);
        assertEquals(message + " line color", lineColor, myLine.attrs.stroke);
        assertEquals(message + " line width", width, myLine.attrs["stroke-width"]);
        assertEquals(message + " line linecap", linecap, myLine.attrs["stroke-linecap"]);
    }

	Test.prototype.test_populate_drawsOnePolygonForAllFeatures = function() {
		setupFeatureTest(3);
		populate();

		assertHistoryPolygonEquals("feature polygon", 0, 600, 68, burnup.FEATURE_STROKE, burnup.FEATURE_FILL, "Work remaining", burnup.iterations[0]);
	};
	
    Test.prototype.test_populate_drawsVelocity = function() {
        setupIterationTest(1);
	    populate();
        assertEquals("when one iteration", 0, burnup.velocity.length);
        
        setupIterationTest(3);
	    populate();
        assertEquals("when three iterations", 2, burnup.velocity.length);
		
        var lineColor = burnup.VELOCITY_STROKE;
		var fillColor = burnup.VELOCITY_FILL;
		
		assertHistoryPolygonEquals("velocity, iteration 0-1", 0, 0, 8, lineColor, fillColor, "Work completed", burnup.velocity[0]);
        assertHistoryPolygonEquals("velocity, iteration 1-2", 1, 8, 15, lineColor, fillColor, "Work completed", burnup.velocity[1]);
    };
	
	Test.prototype.test_populate_clipsHistory = function() {
		setupIterationTest(3);
		populate();
		
		var width = metrics.xForIteration(2) - metrics.xForIteration(0) - 0.5;
		var clip = metrics.left + "," + metrics.top + "," + width + "," + metrics.height;
		assertEquals("features", clip, burnup.iterations[0][0].attrs["clip-rect"]);
        assertEquals("velocity", clip, burnup.velocity[0][0].attrs["clip-rect"]);
	};

    Test.prototype.test_populate_drawsProjectionCones = function() {
        setupIterationTest(3);
	    populate();

        var iterationX = metrics.xForIteration(estimates.iterationCount() - 1);
        var effortY = metrics.yForEffort(estimates.currentIteration().totalEffort());
		var velocityY = metrics.yForEffort(estimates.effortToDate());

        var p10 = projections.tenPercentProjection();
        var p50 = projections.fiftyPercentProjection();
        var p90 = projections.ninetyPercentProjection();
        
        var iterationNumber = estimates.iterationCount() - 1;
        var x10 = metrics.xForIteration(iterationNumber + p10.iterationsRemaining());
        var x50 = metrics.xForIteration(iterationNumber + p50.iterationsRemaining());
        var x90 = metrics.xForIteration(iterationNumber + p90.iterationsRemaining());
        var y10 = metrics.yForEffort(p10.totalEffort());
        var y50 = metrics.yForEffort(p50.totalEffort());
        var y90 = metrics.yForEffort(p90.totalEffort());
    
	    function assertProjectionConeEquals(message, startX, startY, color, title, cone, theLine) {
	        assertNotUndefined(message + " cone", cone);
	        var conePath = moveTo(startX, startY) + lineTo(x10, y10) + lineTo(x50, y50) + lineTo(x90, y90) + "Z";
	        assertEquals(message + " cone title", title, cone.attrs.title);
	        assertEquals(message + " cone path", conePath, path(cone));
	        assertEquals(message + " cone outline", "none", cone.attrs.stroke);
	        assertEquals(message + " cone fill color", "0-" + color + "-#fff", cone.attrs.gradient);
	        
	        assertNotUndefined(message + " line", theLine);
	        assertEquals(message + " line title", title, theLine.attrs.title);
	        assertEquals(message + " line path", line(startX, startY, x50, y50), path(theLine));
	        assertEquals(message + " line stroke", color, theLine.attrs.stroke);
	        assertEquals(message + " line width", 3, theLine.attrs["stroke-width"]);
	        assertEquals(message + " line linecap", "round", theLine.attrs["stroke-linecap"]);
	    }

        function assertProjectionTraceEquals(message, startX, startY, endX, endY, trace) {
			assertNotUndefined(message, trace);
			assertEquals(message + " path", line(startX, startY, endX, endY), path(trace));
			assertEquals(message + " stroke", "black", trace.attrs.stroke);
			assertEquals(message + " width", "0.5", trace.attrs["stroke-width"]);
			assertEquals(message + " dasharray", "- ", trace.attrs["stroke-dasharray"]);
		}

		assertNotUndefined("effort projection", burnup.projection);
        assertProjectionConeEquals("effort projection", iterationX, effortY, burnup.FEATURE_STROKE, "Projection of work remaining", burnup.projection[2], burnup.projection[0]);
        assertProjectionConeEquals("velocity projection", iterationX, velocityY, burnup.VELOCITY_STROKE, "Projection of work completed", burnup.projection[3], burnup.projection[1]);
		
		assertProjectionTraceEquals("upper projection trace (10%)", iterationX, effortY, x10, y10, burnup.projection[4]);
		assertProjectionTraceEquals("lower projection trace (10%)", x10, y10, x10, metrics.bottom, burnup.projection[5]);
		assertProjectionTraceEquals("upper projection trace (50%)", iterationX, effortY, x50, y50, burnup.projection[6]);
		assertProjectionTraceEquals("lower projection trace (50%)", x50, y50, x50, metrics.bottom, burnup.projection[7]);
		assertProjectionTraceEquals("upper projection trace (90%)", iterationX, effortY, x90, y90, burnup.projection[8]);
		assertProjectionTraceEquals("lower projection trace (90%)", x90, y90, x90, metrics.bottom, burnup.projection[9]);
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
			xTickLabelHeight: 10,
			yTickLabelHeight: 8, yTickLabelWidth: 0,
			startDate: "1 Jan 2011", iterationLength: 5,
			iterationCount: 3,
			maxEffort: 10,
			MAJOR_TICK_LENGTH: 8,
			Y_TICK_SPACING: 3,
			Y_TICK_LABEL_RIGHT_PADDING: 5
		};
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		bottom = 61;
	};

    function assertFloatEquals(message, expected, actual) {
        if (actual < expected - 0.0005 || actual > expected + 0.0005) {
            assertEquals(message, expected, actual);
        }
    }
	
	Test.prototype.test_dimensions = function() {
		metricsConfig.yTickLabelWidth = 3.5;
		metricsConfig.Y_LABEL_PADDING_MULTIPLIER = 2;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		
		assertEquals("left", 27, metrics.left);
		assertEquals("right", 500, metrics.right);
		assertEquals("width", 473, metrics.width);
		
		assertEquals("top", 0, metrics.top);
		assertEquals("bottom", bottom, metrics.bottom);
		assertEquals("height", 61, metrics.height);

		assertEquals("X-axis label horizontal center", 263.5, metrics.xLabelCenter);
		assertEquals("X-axis label vertical center", 90, metrics.xLabelVerticalCenter);
		assertEquals("Y-axis label horizontal center", 30.5, metrics.yLabelCenter);
		assertEquals("Y-axis label vertical center", 5, metrics.yLabelVerticalCenter);

        assertFloatEquals("X-axis tick label vertical center", 70, metrics.xTickLabelVerticalCenter);
		assertFloatEquals("Y-axis tick label right edge", 18, metrics.yTickLabelRightEdge);
	};
	
	Test.prototype.test_dimensions = function() {
		metricsConfig.iterationCount = 10;
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		
		assertEquals("should be extra tick for end of last iteration", 11, metrics.xTickCount);
	};
    
    Test.prototype.test_xForIteration = function() {
        assertFloatEquals("whole iteration", 20 + 274.28571, metrics.xForIteration(2));
        assertFloatEquals("fractional iteration", 20 + 205.71428, metrics.xTickPosition(1.5));
    };
	
	Test.prototype.test_yForEffort = function() {
        metricsConfig.maxEffort = 1;
        metrics = new rs.BurnupChartMetrics(metricsConfig);
		// height = 61, bottom = 61, effort per tick = 0.25, number of ticks = 4.
		// pixels per tick = height / (# of ticks + 0.5) = 61 / 4.5 = 13.555...
		// pixels per effort = pixels per tick /  effort per tick = 13.555... / 0.25 = 54.222...
		// pixels for 0.6 effort = 0.6 * 54.222... = 32.5333...
		// x value = bottom - pixels = 61 - 32.5333... = 28.4666...
		assertFloatEquals("", 28.46666, metrics.yForEffort(0.6));
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
	
    Test.prototype.test_roundUpEffort = function() {
		var roundUpEffort = rs.BurnupChartMetrics.roundUpEffort;
		
        assertEquals(0.25, roundUpEffort(0.0001));
        assertEquals(0.25, roundUpEffort(0.1));
        assertEquals(0.25, roundUpEffort(0.25));
        assertEquals(0.5, roundUpEffort(0.4));
        assertEquals(0.5, roundUpEffort(0.5));
        assertEquals(1, roundUpEffort(0.6));
        assertEquals(1, roundUpEffort(1));
        assertEquals(5, roundUpEffort(2));
        assertEquals(5, roundUpEffort(5));
        assertEquals(50, roundUpEffort(20));
        assertEquals(100, roundUpEffort(70));
        assertEquals(100, roundUpEffort(100));
        assertEquals(500000, roundUpEffort(400000));
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
		metrics = new rs.BurnupChartMetrics(metricsConfig);
		
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
