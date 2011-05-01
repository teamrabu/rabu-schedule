// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates, projections) {
    var raphael = Raphael;     // prevent JSLint error resulting from calling Raphael without 'new'
    var self = this; 
	var xLabelElement = $(".rabu-xLabel");
	var yLabelElement = $(".rabu-yLabel");
    var paper, metrics, xLabel, yLabel;

    this.TICK_LENGTH = 6;       //TODO: delete me
    this.AXIS_OVERHANG = 10;    //TODO: delete me

	
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

    function copyTextElements() {
		xLabel = copyText(xLabelElement);
		yLabel = copyText(yLabelElement);
	}

    function axisLabels() {
		xLabel.translate(metrics.xLabelCenter, metrics.xLabelVerticalCenter);
		yLabel.translate(metrics.yLabelVerticalCenter, metrics.yLabelCenter);
		yLabel.rotate(270, true);
	}
	
	function axisLines() {
		line(metrics.left - self.AXIS_OVERHANG, metrics.bottom, metrics.right, metrics.bottom);
		line(metrics.left, metrics.top, metrics.left, metrics.bottom + metrics.AXIS_OVERHANG);
	}
	
	function xAxisTicks(iterationCount) {
		var i;
		for (i = 0; i < iterationCount; i++) {
			var x = metrics.xTick(i);
			line(x, metrics.bottom - metrics.TICK_LENGTH, x, metrics.bottom + metrics.TICK_LENGTH);
		}
	}
	
	this.populate = function(optionalMetricsForTesting) {
		hideInteriorElements();
		if (paper) {
			paper.remove();
		}
        paper = raphael(element[0], element.width(), element.height());
		copyTextElements();
		if (optionalMetricsForTesting) {
			metrics = optionalMetricsForTesting;
		}
		else {
            metrics = new rabu.schedule.BurnupChartMetrics(paper.width, paper.height, xLabel.getBBox().height, yLabel.getBBox().height, projections.maxIterations());
		}

		axisLabels();
		axisLines();
		xAxisTicks(projections.maxIterations());
	};
	
	this.paper = function() {
		return paper;
	};
};


rabu.schedule.BurnupChartMetrics = function(paperWidth, paperHeight, xLabelHeight, yLabelHeight, iterations) {
    var self = this;
	this.TICK_LENGTH = 6;
	this.AXIS_OVERHANG = 10;
    
    this.left = yLabelHeight + this.AXIS_OVERHANG;
    this.right = paperWidth;
    this.width = this.right - this.left;
    
    this.top = 0;
    this.bottom = paperHeight - (xLabelHeight + this.AXIS_OVERHANG);
    this.height = this.bottom - this.top;
    
    this.xLabelCenter = this.left + (this.width / 2);
    this.yLabelCenter = this.top + (this.height / 2);
    this.xLabelVerticalCenter = this.bottom + this.AXIS_OVERHANG + (xLabelHeight / 2);
    this.yLabelVerticalCenter = this.left - this.AXIS_OVERHANG - (yLabelHeight / 2);
	
	this.xTick = function(offset) {
		var tickDistance = self.width / (iterations - 1 + 0.5);
		return self.left + (offset * tickDistance);
	};
};
