// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates, projections) {
	var rs = rabu.schedule;
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
        var roundUpEffort = rs.BurnupChartMetrics.roundUpEffort;
		
		self.xLabel = copyOneTextElement(xLabelElement);
		self.yLabel = copyOneTextElement(yLabelElement);
		self.xTickLabel = copyOneTextElement(xTickLabelElement).hide();
		self.yTickLabel = copyOneTextElement(yTickLabelElement, roundUpEffort(projections.maxEffort()).toString()).hide();
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
		self.yTickLabels = [];
		var previousLabelTopEdge = metrics.bottom;
		for (i = 1; i < metrics.yTickCount(); i++) {
			var x = metrics.left;
			var y = metrics.yTickPosition(i);
			var tickOffset = metrics.MINOR_TICK_LENGTH / 2;
			if (metrics.shouldDrawYTickLabel(i, previousLabelTopEdge)) {
				tickOffset = metrics.MAJOR_TICK_LENGTH / 2;
				previousLabelTopEdge = y - (metrics.yTickLabelHeight / 2);
				var label = copyOneTextElement(yTickLabelElement, metrics.yTickLabel(i));
				label.attr("text-anchor", "end");
				label.translate(metrics.yTickLabelRightEdge, metrics.yTickPosition(i));
				self.yTickLabels.push(label);
			}
			self.yTicks.push(line(x - tickOffset, y, x + tickOffset, y));
		}
	}

//	function stackFeatures(y, fromIter, toIter, fromX, toX) {
//		// TODO: delete and redo with TDD
//		var fromFeatures = fromIter.includedFeatures();
//        var toFeatures = toIter.includedFeatures();
//		var i;
//		for (i = toFeatures.length - 1; i >= 0; i--) {
////			if (i >= fromFeatures.length) { continue; }
////			var from = fromFeatures[i].totalEffort();
//            var from = (i >= fromFeatures.length ? 0 : fromFeatures[i].totalEffort());
//			var to = toFeatures[i].totalEffort();
//			var fromY = metrics.yForEffort(from);
//			var toY = metrics.yForEffort(to);
//			var path = moveTo(fromX, fromY) + lineTo(toX, toY) + lineTo(toX, metrics.bottom) + lineTo(fromX, metrics.bottom) + " Z";
//			var text = i + ". " + path;
//			var polygon = paper.path(path);
////			var info = paper.text(110, y + (10 * (i + 1)), text);
////			info.attr("text-anchor", "begin");
//            var whiteness = 200 * (i + 1) / toFeatures.length;
//			var color = rgb(255, whiteness, whiteness);
//			polygon.attr("stroke", "white");
//			polygon.attr("stroke-width", 0.5);
//			polygon.attr("fill", color);
//			polygon.attr("title", toFeatures[i].name());
//			var line = paper.path(moveTo(fromX, fromY) + lineTo(toX, toY));
//			line.attr("stroke", rgb(100, 0, 0));
//			line.attr("stroke-width", 3);
//			line.attr("stroke-linecap", "round")
//		}
//	}
	
//	function history() {
//		// TODO: delete and redo with TDD
//		var i;
//		var skip = -10;
//		for (i = 1; i < estimates.iterationCount(); i++) {
//			var from = estimates.iteration(i - 1);
//			var to = estimates.iteration(i);
//			var text = "#" + i + ": " + from.totalEffort() + " - " + to.totalEffort();
////			var drawn = paper.text(100, skip + 10 * (i+ 1), text);
////			drawn.attr("text-anchor", "begin");
//			var fromX = metrics.xTickPosition(i - 1);
//			var toX = metrics.xTickPosition(i);
//			stackFeatures(skip + (10 * (i + 1)), from, to, fromX, toX);
//			skip += to.includedFeatures().length * 10;
//		}
//	}

    function moveTo(x, y) {
       return " M" + x + "," + y;
    }
    
    function lineTo(x, y) {
        return " L" + x + "," + y;
    }
    
    function rgb(r, g, b) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    
    function feature(fromX, toX, fromFeature, toFeature) {
		var fromY = metrics.yForEffort(fromFeature.totalEffort());
		var toY = metrics.yForEffort(toFeature.totalEffort());
		var bottom = metrics.bottom;
		
		var result = paper.set();
		var path = moveTo(fromX, fromY) + lineTo(toX, toY) + lineTo(toX, bottom) + lineTo(fromX, bottom) + "Z";
		var polygon = paper.path(path);
		result.push(polygon);
		return result;
	}

    function iteration(iterationNumber) {
        var fromIteration = estimates.iteration(iterationNumber - 1);
		var toIteration = estimates.iteration(iterationNumber);
		var fromFeatures = fromIteration.includedFeatures();
		var toFeatures = toIteration.includedFeatures();
		var fromX = metrics.xForIteration(iterationNumber - 1);
		var toX = metrics.xForIteration(iterationNumber);
		
		var result = paper.set();
		var i;
		for (i = toFeatures.length - 1; i >= 0; i--) {
			result.push(feature(fromX, toX, fromFeatures[i], toFeatures[i]));
		}
		return result;
	}

    function history() {
		self.iterations = [];
		var i;
		for (i = 1; i < estimates.iterationCount(); i++) {
			self.iterations.push(iteration(i));
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
				yTickLabelWidth: self.yTickLabel.getBBox().width,
				yTickLabelHeight: self.yTickLabel.getBBox().height,
				startDate: estimates.firstIteration().startDate(),
				iterationLength: estimates.firstIteration().length(),
	            iterationCount: projections.totalIterations(),
				maxEffort: projections.maxEffort()
			});
		}

        history();
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
	var rs = rabu.schedule;
    var self = this;
	this.MAJOR_TICK_LENGTH = data.MAJOR_TICK_LENGTH || 8;
	this.MINOR_TICK_LENGTH = data.MINOR_TICK_LENGTH || 4;
	this.AXIS_OVERHANG = data.AXIS_OVERHANG || 10;
	this.X_LABEL_PADDING_MULTIPLIER = data.X_LABEL_PADDING_MULTIPLIER || 1.25;
	this.Y_LABEL_PADDING_MULTIPLIER = data.Y_LABEL_PADDING_MULTIPLIER || 1.25;
	this.X_TICK_LABEL_PADDING = data.X_TICK_LABEL_PADDING || 10;
	this.Y_TICK_SPACING = data.Y_TICK_SPACING || 10;
	this.Y_TICK_LABEL_PADDING_MULTIPLIER = data.Y_TICK_LABEL_PADDING_MULTIPLIER || 1.1;
	this.Y_TICK_LABEL_RIGHT_PADDING = data.Y_TICK_LABEL_RIGHT_PADDING || 3;
    
    this.left = data.yLabelHeight + this.AXIS_OVERHANG + (data.yTickLabelWidth * self.Y_LABEL_PADDING_MULTIPLIER);
    this.right = data.paperWidth;
    this.width = this.right - this.left;
    
    this.top = 0;
    this.bottom = data.paperHeight - ((data.xLabelHeight * self.X_LABEL_PADDING_MULTIPLIER) + (this.MAJOR_TICK_LENGTH / 2) + data.xTickLabelHeight);
    this.height = this.bottom - this.top;
	
	this.yTickLabelHeight = data.yTickLabelHeight;
    
    this.xLabelCenter = this.left + (this.width / 2);
    this.yLabelCenter = this.top + (this.height / 2);
    this.xLabelVerticalCenter = data.paperHeight - (data.xLabelHeight / 2);
    this.yLabelVerticalCenter = data.yLabelHeight / 2;
	
	this.xTickLabelVerticalCenter = this.bottom + (this.MAJOR_TICK_LENGTH / 2) + (data.xTickLabelHeight / 2);
	this.yTickLabelRightEdge = this.left - (this.MAJOR_TICK_LENGTH / 2) - this.Y_TICK_LABEL_RIGHT_PADDING;
	
	this.xTickCount = data.iterationCount + 1;
	
	this.xForIteration = function(iteration) {
        var tickDistance = self.width / (this.xTickCount - 1 + 0.5);
        return self.left + (iteration * tickDistance);
	};
	
    function yTickScale() {
        var pixels = self.height;
        var effortPerPixel = data.maxEffort / pixels;
        var effortPerTick = effortPerPixel * self.Y_TICK_SPACING;
        return rs.BurnupChartMetrics.roundUpEffort(effortPerTick);
    }
	
	this.yForEffort = function(effort) {
        var pixelsPerTick = self.height / (self.yTickCount() - 1 + 0.5);
		var effortPerTick = yTickScale();
		var pixelsPerEffort = pixelsPerTick / effortPerTick;
		var pixels = effort * pixelsPerEffort;
        return self.bottom - pixels;
	};
	
	this.xTickPosition = function(offset) {
		return self.xForIteration(offset);
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
	
	this.yTickCount = function() {
		var count = 1 + data.maxEffort / yTickScale();
		return Math.ceil(count);
	};
	
	this.yTickPosition = function(tickOffset) {
		return self.yForEffort(tickOffset * yTickScale());
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

       
rabu.schedule.BurnupChartMetrics.roundUpEffort = function(effort) {
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