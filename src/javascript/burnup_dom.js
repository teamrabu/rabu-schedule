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
		for (i = 1; i < metrics.xTickCount; i++) {
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
		for (i = 1; i < metrics.xTickCount; i++) {
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
		
		self.yTicks = [];
		for (i = 1; i < metrics.yTickCount(); i++) {
			var x = metrics.left;
			var y = metrics.yTickPosition(i);
			var tickOffset = metrics.MINOR_TICK_LENGTH / 2;
			if (metrics.shouldDrawYTickLabel(i, metrics.bottom)) {
				tickOffset = metrics.MAJOR_TICK_LENGTH / 2;
			}
			self.yTicks.push(line(x - tickOffset, y, x + tickOffset, y));
		}
//		var i;
//		var previousLabelTopEdge = metrics.bottom;
//		for (i = 0; i < metrics.yTickCount(); i++) {
//			var x = metrics.left;
//            var y = metrics.yTickPosition(i);
//            var label = paper.text(x - 15, y, metrics.yTickLabel(i));
//			var xOffset = metrics.MINOR_TICK_LENGTH / 2;
//			if (metrics.shouldDrawYTickLabel(i, previousLabelTopEdge)) {
//				xOffset = metrics.MAJOR_TICK_LENGTH / 2;
//				previousLabelTopEdge = y - (self.yTickLabel.getBBox().height / 2);
//			}
//			else {
//				label.remove();
//			}
//			line(x - xOffset, y, x + xOffset, y);
//		}
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
				yTickLabelHeight: 10,   // TODO: replace me!
				startDate: estimates.firstIteration().startDate(),
				iterationLength: estimates.firstIteration().length(),
	            iterationCount: projections.maxIterations(),
				maxEffort: paper.width  // TODO: replace me!
			});
		}

		axisLabels();
		axisLines();
		xAxisTicks();
		yAxisTicks();
	};
	
	this.paper = function() {
		return paper;
	};
};


rabu.schedule.BurnupChartMetrics = function(data) {
    var self = this;
	this.MAJOR_TICK_LENGTH = data.MAJOR_TICK_LENGTH || 8;
	this.MINOR_TICK_LENGTH = data.MINOR_TICK_LENGTH || 4;
	this.AXIS_OVERHANG = data.AXIS_OVERHANG || 10;
	this.X_TICK_LABEL_PADDING = data.X_TICK_LABEL_PADDING || 10;
	this.Y_TICK_SPACING = data.Y_TICK_SPACING || 10;
	this.Y_TICK_LABEL_PADDING_MULTIPLIER = data.Y_TICK_LABEL_PADDING_MULTIPLIER || 1.1;
    
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
		var tickDistance = self.width / (this.xTickCount - 1 + 0.5);
		return self.left + (offset * tickDistance);
	};
	
	this.shouldDrawXTickLabel = function(tickOffset, labelWidth, previousRightEdge) {
		var labelLeft = self.xTickPosition(tickOffset) - (labelWidth / 2) - self.X_TICK_LABEL_PADDING;
		var labelRight = self.xTickPosition(tickOffset) + (labelWidth / 2) + self.X_TICK_LABEL_PADDING;
		
		var tickZero = (tickOffset === 0);
		var overlapsLeftEdge = (labelLeft <= self.left);
		var overlapsRightEdge = (labelRight >= self.right);
		var overlapsPreviousLabel = (labelLeft <= previousRightEdge);
		
		return !tickZero && !overlapsLeftEdge && !overlapsRightEdge && !overlapsPreviousLabel;
	};
	
	this.xTickLabel = function(tickOffset) {
		var date = new Date(data.startDate);
		date.setDate(date.getDate() + (data.iterationLength * tickOffset));
		return date.toString('MMM d');
	};
       
	this.roundUpEffort = function(effort) {
        if (effort <= 0.25) {
            return 0.25;
        }
        if (effort <= 0.5) {
            return 0.5;
        }
        
        var result = 1;
        var adjusted = effort;
        while (adjusted >= 10) {
            result *= 10;
            adjusted /= 10;
        }
        if (result < effort) {
            result *= 5;
        }
        if (result < effort) {
            result *= 2;
        }
        return result;
    };
		
	function yTickScale() {
		var pixels = self.height;
		var effortPerPixel = data.maxEffort / pixels;
		var effortPerTick = effortPerPixel * self.Y_TICK_SPACING;
		return self.roundUpEffort(effortPerTick);
	}
	
	this.yTickCount = function() {
		var count = 1 + data.maxEffort / yTickScale();
		return Math.ceil(count);
	};
	
	this.yTickPosition = function(tickOffset) {
		var tickDistance = self.height / (self.yTickCount() - 1 + 0.5);
		return self.bottom - (tickDistance * tickOffset);
	};
	
	this.yTickLabel = function(tickOffset) {
		return (yTickScale() * tickOffset).toString();
	};
	
	this.shouldDrawYTickLabel = function(tickOffset, previousTopEdge) {
		var padding = data.yTickLabelHeight * (self.Y_TICK_LABEL_PADDING_MULTIPLIER - 1);
		var labelBottom = self.yTickPosition(tickOffset) + (data.yTickLabelHeight / 2) + padding;
		var labelTop = self.yTickPosition(tickOffset) - (data.yTickLabelHeight / 2) - padding;
		
		var tickZero = (tickOffset === 0);
		var overlapsBottomEdge = (labelBottom >= self.bottom);
		var overlapsTopEdge = (labelTop <= self.top);
		var overlapsPreviousLabel = (labelBottom >= previousTopEdge);
		
		return !tickZero && !overlapsBottomEdge && !overlapsTopEdge && !overlapsPreviousLabel;
	};
};
