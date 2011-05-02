// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates, projections) {
    var raphael = Raphael;     // prevent JSLint error resulting from calling Raphael without 'new'
    var self = this; 
	var xLabelElement = $(".rabu-xLabel");
	var yLabelElement = $(".rabu-yLabel");
	var xTickLabelElement = $(".rabu-xTickLabel");
	var yTickLabelElement = $(".rabu-yTickLabel");
    var paper, metrics, xLabel, yLabel;

	function hideInteriorElements() {
		element.children().hide();
	}
	
	function line(x1, y1, x2, y2) {
		return paper.path("M" + x1 + "," + y1 + " L" + x2 + "," + y2);
	}
	
	function copyOneTextElement(textElement, optionalText) {
		var text = optionalText || textElement.text();
		var result = paper.text(0, 0, text);
		result.attr({
            "font-family": textElement.css("font-family"),
            "font-size": textElement.css("font-size"),
            "font-weight": textElement.css("font-weight")
		});
		return result;
	}

    function copyTextElements() {
		self.xLabel = copyOneTextElement(xLabelElement);
		self.yLabel = copyOneTextElement(yLabelElement);
		self.xTickLabel = copyOneTextElement(xTickLabelElement).hide();
		self.yTickLabel = copyOneTextElement(yTickLabelElement).hide();
	}

    function axisLabels() {
		self.xLabel.translate(metrics.xLabelCenter, metrics.xLabelVerticalCenter);
		self.yLabel.translate(metrics.yLabelVerticalCenter, metrics.yLabelCenter);
		self.yLabel.rotate(270, true);
	}
	
	function axisLines() {
		self.xAxis = line(metrics.left - metrics.AXIS_OVERHANG, metrics.bottom, metrics.right, metrics.bottom);
		self.yAxis = line(metrics.left, metrics.top, metrics.left, metrics.bottom + metrics.AXIS_OVERHANG);
	}
	
	function xAxisTicks() {
		var i, label;

        // figure out maximum tick label width
		var maxWidth = 0;
		for (i = 0; i < metrics.xTickCount; i++) {
            label = copyOneTextElement(xTickLabelElement, metrics.xTickLabel(i));
			var width = label.getBBox().width;
			if (width > maxWidth) {
				maxWidth = width;
			}
			label.remove();
		}

        self.xTicks = [];		
        self.xTickLabels = [];
        var previousLabelRightEdge = 0;
		for (i = 0; i < metrics.xTickCount; i++) {
            var x = metrics.xTickPosition(i);

			if (metrics.shouldDrawXTickLabel(i, maxWidth, previousLabelRightEdge)) {
                self.xTicks.push(line(x, metrics.bottom - (metrics.MAJOR_TICK_LENGTH / 2), x, metrics.bottom + (metrics.MAJOR_TICK_LENGTH / 2)));
                label = copyOneTextElement(xTickLabelElement, metrics.xTickLabel(i));
                label.translate(metrics.xTickPosition(i), metrics.xTickLabelVerticalCenter); 
				self.xTickLabels.push(label);
				previousLabelRightEdge = x + (maxWidth / 2);
			}
			else {
				self.xTicks.push(line(x, metrics.bottom - (metrics.MINOR_TICK_LENGTH / 2), x, metrics.bottom + (metrics.MINOR_TICK_LENGTH / 2)));
			}
		}
	}
	
	function yAxisTicks() {
		var i;
		for (i = 0; i < metrics.yTickCount(); i++) {
			var x = metrics.left;
			var xOffset = metrics.MINOR_TICK_LENGTH / 2;
			var y = metrics.yTickPosition(i);
			line(x - xOffset, y, x + xOffset, y);
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
		    metrics = new rabu.schedule.BurnupChartMetrics({
	            paperWidth: paper.width, 
				paperHeight: paper.height,
	            xLabelHeight: self.xLabel.getBBox().height,
				yLabelHeight: self.yLabel.getBBox().height,
	            xTickLabelHeight: self.xTickLabel.getBBox().height,
				yTickLabelHeight: -10,
				startDate: estimates.firstIteration().startDate(),
				iterationLength: estimates.firstIteration().length(),
	            iterationCount: projections.maxIterations(),
				maxEffort: paper.width / 10  // TODO: replace me!
			});
		}

		axisLabels();
		axisLines();
		xAxisTicks();
		yAxisTicks(); //TODO: reimplement with tests
	};
	
	this.paper = function() {
		return paper;
	};
};


rabu.schedule.BurnupChartMetrics = function(data) {
    var self = this;
	this.MAJOR_TICK_LENGTH = 8;
	this.MINOR_TICK_LENGTH = 4;
	this.AXIS_OVERHANG = 10;
	this.LABEL_PADDING = 10;
	this.Y_TICK_SPACING = data.Y_TICK_SPACING || 5;
    
    this.left = data.yLabelHeight + this.AXIS_OVERHANG;
    this.right = data.paperWidth;
    this.width = this.right - this.left;
    
    this.top = 0;
    this.bottom = data.paperHeight - ((data.xLabelHeight * 1.25) + (this.MAJOR_TICK_LENGTH / 2) + data.xTickLabelHeight);
    this.height = this.bottom - this.top;
    
    this.xLabelCenter = this.left + (this.width / 2);
    this.yLabelCenter = this.top + (this.height / 2);
    this.xLabelVerticalCenter = data.paperHeight - (data.xLabelHeight / 2);
    this.yLabelVerticalCenter = this.left - this.AXIS_OVERHANG - (data.yLabelHeight / 2);
	
	this.xTickLabelVerticalCenter = this.bottom + (this.MAJOR_TICK_LENGTH / 2) + (data.xTickLabelHeight / 2);
	
	this.xTickCount = data.iterationCount;
	
	this.xTickPosition = function(offset) {
		var tickDistance = self.width / (data.iterationCount - 1 + 0.5);
		return self.left + (offset * tickDistance);
	};
	
	this.shouldDrawXTickLabel = function(tickOffset, labelWidth, previousRightEdge) {
		var x = self.xTickPosition(tickOffset) - (labelWidth / 2) - self.LABEL_PADDING;
		
		var tickZero = (tickOffset === 0);
		var overlapsLeftEdge = (x <= self.left);
		var overlapsRightEdge = (x + labelWidth + (self.LABEL_PADDING * 2) >= self.right);
		var overlapsPreviousLabel = (x <= previousRightEdge);
		
		return !tickZero && !overlapsLeftEdge && !overlapsRightEdge && !overlapsPreviousLabel;
	};
	
	this.xTickLabel = function(tickOffset) {
		var date = new Date(data.startDate);
		date.setDate(date.getDate() + (data.iterationLength * tickOffset));
		return date.toString('MMM d');
	};
	
	this.yTickCount = function() {
		if (data.maxEffort <= 10) {
			return 1 + data.maxEffort / 0.25;
		}
		else if (data.maxEffort <= 20) {
		    return 1 + data.maxEffort / 0.5;
		}
		else {
			return 1 + data.maxEffort;
		}
	};
	
	this.yTickPosition = function(tickOffset) {
		var tickDistance = self.height / (self.yTickCount() - 1 + 0.5);
		return self.bottom - (tickDistance * tickOffset);
	};
};
