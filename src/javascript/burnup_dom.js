// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates, projections) {
    var raphael = Raphael;     // prevent JSLint error resulting from calling Raphael without 'new'
    var self = this; 
	var xLabelElement = $(".rabu-xLabel");
	var yLabelElement = $(".rabu-yLabel");
	var xTickLabelElement = $(".rabu-xTickLabel");
	var yTickLabelElement = $(".rabu-yTickLabel");
    var paper, metrics, xLabel, yLabel;

    this.TICK_LENGTH = 6;       //TODO: delete me
    this.AXIS_OVERHANG = 10;    //TODO: delete me

	
	function hideInteriorElements() {
		element.children().hide();
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
		self.xLabel = copyText(xLabelElement);
		self.yLabel = copyText(yLabelElement);
		self.xTickLabel = copyText(xTickLabelElement).hide();
	}

    function axisLabels() {
		self.xLabel.translate(metrics.xLabelCenter, metrics.xLabelVerticalCenter);
		self.yLabel.translate(metrics.yLabelVerticalCenter, metrics.yLabelCenter);
		self.yLabel.rotate(270, true);
	}
	
	function axisLines() {
		self.xAxis = line(metrics.left - self.AXIS_OVERHANG, metrics.bottom, metrics.right, metrics.bottom);
		self.yAxis = line(metrics.left, metrics.top, metrics.left, metrics.bottom + metrics.AXIS_OVERHANG);
	}
	
	function xAxisTicks() {
		var i;
		
		self.xTicks = [];
		for (i = 0; i < metrics.xTickCount; i++) {
			var x = metrics.xTick(i);
			self.xTicks.push(line(x, metrics.bottom - metrics.TICK_LENGTH, x, metrics.bottom + metrics.TICK_LENGTH));
		}
	}
	
	function xAxisTickLabels() {
		var i;
		
        self.xTickLabels = [];
        var previousLabelRightEdge = 0;
		for (i = 0; i < metrics.xTickCount; i++) {
			var label = self.xTickLabel.clone();
			label.translate(metrics.xTick(i), metrics.xTickLabelVerticalCenter); 
			
			var labelWidth = label.getBBox().width;
			if (metrics.shouldDrawXLabel(i, labelWidth, previousLabelRightEdge)) {
				var x = metrics.xTick(i);
				self.xTickLabels.push(label);
				previousLabelRightEdge = x + (labelWidth / 2);
			}
			else {
				label.remove();
			}
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
		    metrics = new rabu.schedule.BurnupChartMetrics(
			    paper.width, paper.height, 
				self.xLabel.getBBox().height, self.yLabel.getBBox().height,
				self.xTickLabel.getBBox().height, -10,
				projections.maxIterations()
			);
		}

		axisLabels();
		axisLines();
		xAxisTicks();
		xAxisTickLabels();
	};
	
	this.paper = function() {
		return paper;
	};
};


rabu.schedule.BurnupChartMetrics = function(paperWidth, paperHeight, xLabelHeight, yLabelHeight, xTickLabelHeight, yTickLabelHeight, iterations) {
    var self = this;
	this.TICK_LENGTH = 6;
	this.AXIS_OVERHANG = 10;
	this.LABEL_PADDING = 3;
    
    this.left = yLabelHeight + this.AXIS_OVERHANG;
    this.right = paperWidth;
    this.width = this.right - this.left;
    
    this.top = 0;
    this.bottom = paperHeight - (xLabelHeight + this.TICK_LENGTH + xTickLabelHeight);
    this.height = this.bottom - this.top;
    
    this.xLabelCenter = this.left + (this.width / 2);
    this.yLabelCenter = this.top + (this.height / 2);
    this.xLabelVerticalCenter = paperHeight - (xLabelHeight / 2);
    this.yLabelVerticalCenter = this.left - this.AXIS_OVERHANG - (yLabelHeight / 2);
	
	this.xTickLabelVerticalCenter = this.bottom + this.TICK_LENGTH + (xTickLabelHeight / 2);
	
	this.xTickCount = iterations;
	
	this.xTick = function(offset) {
		var tickDistance = self.width / (iterations - 1 + 0.5);
		return self.left + (offset * tickDistance);
	};
	
	this.shouldDrawXLabel = function(tickOffset, labelWidth, previousRightEdge) {
		var x = self.xTick(tickOffset) - (labelWidth / 2) - self.LABEL_PADDING;
		
		var tickZero = (tickOffset === 0);
		var overlapsLeftEdge = (x <= self.left);
		var overlapsRightEdge = (x + labelWidth + (self.LABEL_PADDING * 2) >= self.right);
		var overlapsPreviousLabel = (x <= previousRightEdge);
		
		return !tickZero && !overlapsLeftEdge && !overlapsRightEdge && !overlapsPreviousLabel;
	};
};
