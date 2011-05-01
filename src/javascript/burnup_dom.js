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
	
	function chart() {
		var area = {};
		
		area.xLabelHeight = xLabel.getBBox().height;
		area.yLabelHeight = yLabel.getBBox().height;
		
		area.left = area.yLabelHeight + self.AXIS_OVERHANG;
		area.right = paper.width;
		area.width = area.right - area.left;
		
		area.top = 0;
		area.bottom = paper.height - (area.xLabelHeight + self.AXIS_OVERHANG);
		area.height = area.bottom - area.top;
        
        area.xLabelCenter = area.left + (area.width / 2);
		area.yLabelCenter = area.top + (area.height / 2);
		area.xLabelVerticalCenter = area.bottom + self.AXIS_OVERHANG + (area.xLabelHeight / 2);
		area.yLabelVerticalCenter = area.left - self.AXIS_OVERHANG - (area.yLabelHeight / 2);
		
		return area;
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

    function axisLabels() {
		xLabel = copyText(xLabelElement);
		yLabel = copyText(yLabelElement);
		
		xLabel.translate(chart().xLabelCenter, chart().xLabelVerticalCenter);
		yLabel.translate(chart().yLabelVerticalCenter, chart().yLabelCenter);
		yLabel.rotate(270, true);
	}
	
	function axisLines() {
		xAxis = line(chart().left - self.AXIS_OVERHANG, chart().bottom, chart().right, chart().bottom);
		yAxis = line(chart().left, chart().top, chart().left, chart().bottom + self.AXIS_OVERHANG);
	}
	
	function xAxisTicks(iterationCount) {
		var i, x;
		var tickDistance = chart().width / (iterationCount + 0.5);
		for (i = 1; i <= iterationCount; i++) {
			x = chart().left + (tickDistance * i);
			line(x, chart().bottom - self.TICK_LENGTH, x, chart().bottom + self.TICK_LENGTH);
		}
	}
	
	this.populate = function() {
		hideInteriorElements();
		if (paper) {
			paper.remove();
		}
        paper = raphael(element[0], element.width(), element.height());
		axisLabels();
		axisLines();
		xAxisTicks(projections.maxIterations());
	};
	
	this.paper = function(){
		return paper;
	};
};
