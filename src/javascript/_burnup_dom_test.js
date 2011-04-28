// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var Test = new TestCase("BurnupDom");
	var rs = rabu.schedule;
	var burnup, paper;
	var xAxis, yAxis, xLabel, yLabel;
	var xLabelBounds, yLabelBounds;
	
	function loadNodeVars() {
		xLabel = paper.bottom;
		yLabel = xLabel.next;
		xAxis= yLabel.next;
		yAxis = xAxis.next;
		
		xLabelBounds = xLabel.getBBox();
		yLabelBounds = yLabel.getBBox();
	}
	
	Test.prototype.setUp = function() {
		/*:DOC += <div class="rabu-burnup" style="height:300px; width:200px">
		              <div class="rabu-xLabel" style="font-size: 16px; font-family: serif; font-weight: 100;">X Label</div>
		              <div class="rabu-yLabel" style="font-size: 12px; font-family: sans-serif; font-weight: 200;">Y Label</div>
                  </div> */
		var config = {
			riskModifiers: [1, 2, 4],
			iterations: [{
				started: "1 Jan 2011",
				length: 7,
				velocity: 10,
				included: [
					["features", 20]
				]
			}]
		};
		var estimates = new rabu.schedule.Estimates(config);
		burnup = new rs.BurnupDom($(".rabu-burnup"), estimates);
		burnup.populate();
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
		
	Test.prototype.test_populate_drawsAxisLabels = function() {
		assertEquals("X Label", xLabel.attrs.text);
        assertEquals("X Label font-family", "serif", xLabel.attrs["font-family"]);
		assertEquals("X Label font-size", "16px", xLabel.attrs["font-size"]);
		assertEquals("X Label font-weight", "100", xLabel.attrs["font-weight"]);
        assertEquals("X Label should be centered", (200 + yLabelBounds.height) / 2, xLabel.attrs.x);
        assertEquals("X Label text anchor", "middle", xLabel.attrs["text-anchor"]);
        assertEquals("X Label should be on bottom", 300 - (xLabelBounds.height / 2), xLabel.attrs.y);

        assertEquals("Y Label", yLabel.attrs.text);
        assertEquals("Y Label font-family", "sans-serif", yLabel.attrs["font-family"]);
		assertEquals("Y Label font-size", "12px", yLabel.attrs["font-size"]);
		assertEquals("Y Label font-weight", "200", yLabel.attrs["font-weight"]);
		var yExpectedXPos = yLabelBounds.height / 2;
		var yExpectedYPos = (300 - xLabelBounds.height) / 2;
        assertEquals("Y Label rotation and position", "rotate(270 " + yExpectedXPos + " " + yExpectedYPos + ")", yLabel.transformations[0]);
		assertEquals("Y Label text anchor", "middle", yLabel.attrs["text-anchor"]);
	};
	
    Test.prototype.test_populate_drawsAxes = function() {
        var expectedX = burnup.TICK_LENGTH + yLabelBounds.height;
        var expectedY = 300 - burnup.TICK_LENGTH - xLabelBounds.height;
        assertEquals("x axis", line(yLabelBounds.height, expectedY, 200, expectedY), path(xAxis));
        assertEquals("y axis", line(expectedX, 0, expectedX, 300 - xLabelBounds.height), path(yAxis));
    };

    Test.prototype.test_populate_drawsAxisTickMarks = function() {
		
	};
}());
