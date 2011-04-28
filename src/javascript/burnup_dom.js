// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates, projections) {
    this.TICK_LENGTH = 6;
	this.AXIS_OVERHANG = 10;

    var raphael = Raphael;     // prevent JSLint error resulting from calling Raphael without 'new'
    var self = this; 
	var xLabelElement = $(".rabu-xLabel");
	var yLabelElement = $(".rabu-yLabel");
    var paper, xLabel, yLabel, xAxis, yAxis;
	
	function hideInteriorElements() {
		xLabelElement.hide();
		yLabelElement.hide();
	}
	
	function line(x1, y1, x2, y2) {
		return paper.path("M" + x1 + "," + y1 + " L" + x2 + "," + y2);
	}
    
	function copyText(textElement) {
		var result = paper.text(0, 0, textElement.text());
		result.attr({
            "font-family": textElement.css("font-family"),
            "font-size": textElement.css("font-size"),
            "font-weight": textElement.css("font-weight")
		});
		return result;
	}

    function axes() {
		// axis labels
        xLabel = copyText(xLabelElement);        
        yLabel = copyText(yLabelElement);
        var xLabelHeight = xLabel.getBBox().height;
        var yLabelWidth = yLabel.getBBox().height;    // the width of the label is its height because it's rotated 270 degrees
        
        xLabel.translate((paper.width + yLabelWidth) / 2, paper.height - (xLabelHeight / 2));
        yLabel.translate(yLabelWidth / 2, (paper.height - xLabelHeight) / 2);
        yLabel.rotate(270, true);

        // axis lines
		var x = self.AXIS_OVERHANG + yLabelWidth;
		var y = paper.height - self.AXIS_OVERHANG - xLabelHeight;
		xAxis = line(yLabelWidth, y, paper.width, y);
		yAxis = line(x, 0, x, paper.height - xLabelHeight);
		
		// x-axis tick marks
		var iterations = projections.maxIterations();
		var xAxisBounds = xAxis.getBBox();
		var startX = xAxisBounds.x + self.AXIS_OVERHANG;
		var startY = xAxisBounds.y;
		var tickDistance = (xAxisBounds.width - self.AXIS_OVERHANG) / (iterations + 0.5);
		var i;
        for (i = 0; i < iterations; i++) {
			startX += tickDistance;
			line(startX, startY - self.TICK_LENGTH, startX, startY + self.TICK_LENGTH);
		}

	}
	
	this.populate = function() {
		hideInteriorElements();
		if (paper) {
			paper.remove();
		}
        paper = raphael(element[0], element.width(), element.height());
        axes();
	};
	
	this.paper = function(){
		return paper;
	};
};
