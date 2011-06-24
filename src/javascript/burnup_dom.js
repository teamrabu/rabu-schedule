// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var raphael = Raphael;     // prevent JSLint error resulting from calling Raphael without 'new'

	function moveTo(x, y) {
		return " M" + x + "," + y;
	}

	function lineTo(x, y) {
		return " L" + x + "," + y;
	}

	function rgb(r, g, b) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

	var rs = rabu.schedule;
	rs.BurnupDom = function(element, estimates, projections) {
		this._element = element;
		this._estimates = estimates;
		this._projections = projections;
		this._xLabelElement = $(".rabu-xLabel");
		this._yLabelElement = $(".rabu-yLabel");
		this._xTickLabelElement = $(".rabu-xTickLabel");
		this._yTickLabelElement = $(".rabu-yTickLabel");
//		var paper, metrics, xLabel, yLabel;
		this.VELOCITY_STROKE = rgb(0, 112, 0);
		this.VELOCITY_FILL = rgb(60, 170, 60);
		this.FEATURE_STROKE = rgb(112, 0, 0);
		this.FEATURE_FILL = rgb(255, 125, 125);
		this.HISTORY_POLYGON_OUTLINE = 0.5;
	};
	rs.BurnupDom.prototype = new rs.Object();
	var BurnupDom = rs.BurnupDom.prototype;

	BurnupDom._line = function(x1, y1, x2, y2) {
		return this._paper.path("M" + x1 + "," + y1 + " L" + x2 + "," + y2);
	};

	BurnupDom._hideInteriorElements = function() {
		this._element.children().hide();
	};

	BurnupDom._copyOneTextElement = function(textElement, optionalText) {
		var text = optionalText || textElement.text();
		var result = this._paper.text(0, 0, text);
		result.attr({
            "font-family": textElement.css("font-family"),
            "font-size": textElement.css("font-size"),
            "font-weight": textElement.css("font-weight")
		});
		return result;
	};

    BurnupDom._copyTextElements = function() {
        var roundUpEffort = rs.BurnupChartMetrics.roundUpEffort;

		this.xLabel = this._copyOneTextElement(this._xLabelElement);
		this.yLabel = this._copyOneTextElement(this._yLabelElement);
		this.xTickLabel = this._copyOneTextElement(this._xTickLabelElement).hide();
		this.yTickLabel = this._copyOneTextElement(this._yTickLabelElement, roundUpEffort(this._projections.maxEffort()).toString()).hide();
	};

    BurnupDom._axisLabels = function() {
		this.xLabel.translate(this._metrics.xLabelCenter, this._metrics.xLabelVerticalCenter);
		this.yLabel.translate(this._metrics.yLabelVerticalCenter, this._metrics.yLabelCenter);
		this.yLabel.rotate(270, true);
	};
	
	BurnupDom._axisLines = function() {
		this.xAxis = this._line(this._metrics.left - this._metrics.AXIS_OVERHANG, this._metrics.bottom, this._metrics.right, this._metrics.bottom);
		this.yAxis = this._line(this._metrics.left, this._metrics.top, this._metrics.left, this._metrics.bottom + this._metrics.AXIS_OVERHANG);
	};
	
	BurnupDom._xAxisTick = function(xPosition, length) {
		return this._line(xPosition, this._metrics.bottom - (length / 2), xPosition, this._metrics.bottom + (length / 2));
	};
	
	BurnupDom._xAxisTickLabelText = function(tickNumber) {
		var date = this._estimates.dateForIteration(tickNumber)._date;
        return new rs.Date(date).toShortStringNoYear();
	};
	
	BurnupDom._xAxisTickLabel = function(tickNumber, xPosition) {
        var label = this._copyOneTextElement(this._xTickLabelElement, this._xAxisTickLabelText(tickNumber));
        label.translate(xPosition, this._metrics.xTickLabelVerticalCenter);
		return label; 
	};
	
	BurnupDom._xAxisTicks = function() {
		var i;

        // figure out maximum tick label width
		var maxWidth = 0;
		for (i = 1; i < this._metrics.xTickCount; i++) {
            var label = this._copyOneTextElement(this._xTickLabelElement, this._xAxisTickLabelText(i));
			var width = label.getBBox().width;
			if (width > maxWidth) {
				maxWidth = width;
			}
			label.remove();
		}

        this.xTicks = [];
        this.xTickLabels = [];
        var previousLabelRightEdge = 0;
		for (i = 1; i < this._metrics.xTickCount; i++) {
            var x = this._metrics.xTickPosition(i);

			if (this._metrics.shouldDrawXTickLabel(i, maxWidth, previousLabelRightEdge)) {
                this.xTicks.push(this._xAxisTick(x, this._metrics.MAJOR_TICK_LENGTH));
				this.xTickLabels.push(this._xAxisTickLabel(i, x));
				previousLabelRightEdge = x + (maxWidth / 2);
			}
			else {
				this.xTicks.push(this._xAxisTick(x, this._metrics.MINOR_TICK_LENGTH));
			}
		}
	};
	
	BurnupDom._yAxisTicks = function() {
		var i;
		
		this.yTicks = [];
		this.yTickLabels = [];
		var previousLabelTopEdge = this._metrics.bottom;
		for (i = 1; i < this._metrics.yTickCount(); i++) {
			var x = this._metrics.left;
			var y = this._metrics.yTickPosition(i);
			var tickOffset = this._metrics.MINOR_TICK_LENGTH / 2;
			if (this._metrics.shouldDrawYTickLabel(i, previousLabelTopEdge)) {
				tickOffset = this._metrics.MAJOR_TICK_LENGTH / 2;
				previousLabelTopEdge = y - (this._metrics.yTickLabelHeight / 2);
				var label = this._copyOneTextElement(this._yTickLabelElement, this._metrics.yTickLabel(i));
				label.attr("text-anchor", "end");
				label.translate(this._metrics.yTickLabelRightEdge, this._metrics.yTickPosition(i));
				this.yTickLabels.push(label);
			}
			this.yTicks.push(this._line(x - tickOffset, y, x + tickOffset, y));
		}
	};

	BurnupDom._historyPolygon = function(fromX, fromY, toX, toY, lineColor, fillColor, title) {
		var bottom = this._metrics.bottom;
		
		var polygon = this._paper.path(moveTo(fromX, fromY) + lineTo(toX, toY) + lineTo(toX, bottom) + lineTo(fromX, bottom) + "Z");
		polygon.attr("title", title);
		polygon.attr("stroke", "white");
		polygon.attr("stroke-width", this.HISTORY_POLYGON_OUTLINE);
		polygon.attr("fill", fillColor);
		
		var stroke = this._line(fromX, fromY, toX, toY);
		stroke.attr("title", title); 
		stroke.attr("stroke", lineColor);
		stroke.attr("stroke-width", 3);
		stroke.attr("stroke-linecap", "round");
		
		return this._paper.set(polygon, stroke);
	};
	
    BurnupDom._iteration = function(iterationNumber) {
        var fromIteration = this._estimates.iteration(iterationNumber - 1);
		var fromX = this._metrics.xForIteration(iterationNumber - 1);
		var fromY = this._metrics.yForEffort(fromIteration.totalEffort());

		var toIteration = this._estimates.iteration(iterationNumber);
		var toX = this._metrics.xForIteration(iterationNumber);
		var toY = this._metrics.yForEffort(toIteration.totalEffort());

        return this._historyPolygon(fromX, fromY, toX, toY, this.FEATURE_STROKE, this.FEATURE_FILL, "Work remaining");
	};
	
	BurnupDom._velocity = function(iterationNumber) {
		var fromX = this._metrics.xForIteration(iterationNumber - 1);
		var toX = this._metrics.xForIteration(iterationNumber);
		var fromY = this._metrics.yForEffort(this._estimates.iteration(iterationNumber - 1).effortToDate());
		var toY = this._metrics.yForEffort(this._estimates.iteration(iterationNumber).effortToDate());
		return this._historyPolygon(fromX, fromY, toX, toY, this.VELOCITY_STROKE, this.VELOCITY_FILL, "Work completed");
	};

    BurnupDom._history = function() {
		this.iterations = this._paper.set();
		this.velocity = this._paper.set();
		var i;
		for (i = 1; i < this._estimates.iterationCount(); i++) {
			this.iterations.push(this._iteration(i));
			this.velocity.push(this._velocity(i));
		}
		var width = this._metrics.xForIteration(this._estimates.iterationCount() - 1) - this._metrics.left - this.HISTORY_POLYGON_OUTLINE;
		var clip = this._metrics.left + "," + this._metrics.top + "," + width + "," + this._metrics.height;
        this._paper.set(this.iterations, this.velocity).attr("clip-rect", clip);
	};
	
	BurnupDom._projection = function() {
		var self = this;
		var effortToDate = this._estimates.effortToDate();
	    function calcProjection(projection){
            return {
                x: self._metrics.xForIteration(self._estimates.iterationCount() - 1 + projection.iterationsRemaining()),
                y: self._metrics.yForEffort(projection.totalEffort())
            };
        }

		var startX = this._metrics.xForIteration(this._estimates.iterationCount() - 1);
		var effortY = this._metrics.yForEffort(this._estimates.currentIteration().totalEffort());
		var velocityY = this._metrics.yForEffort(this._estimates.effortToDate());
        var p10 = calcProjection(this._projections.tenPercentProjection());
		var p50 = calcProjection(this._projections.fiftyPercentProjection());
		var p90 = calcProjection(this._projections.ninetyPercentProjection());

        function projectionLine(startY, title, color) {
			return self._line(startX, startY, p50.x, p50.y)
			    .attr("title", title)
				.attr("stroke", color)
				.attr("stroke-width", 3)
				.attr("stroke-linecap", "round");
		}
		
		function projectionCone(startY, title, color) {
			return self._paper.path(moveTo(startX, startY) + lineTo(p10.x, p10.y) + lineTo(p50.x, p50.y) + lineTo(p90.x, p90.y) + "Z")
			    .attr("title", title)
				.attr("stroke", "none")
				.attr("fill", "0-" + color + "-#fff");
		}
							
		function projectionTrace(startX, startY, endX, endY) {
			return self._line(startX, startY, endX, endY)
			    .attr("stroke", "black")
				.attr("stroke-width", 0.5)
				.attr("stroke-dasharray", "- ");
		}
								
        this.projection = this._paper.set(
	        projectionLine(effortY, "Projection of work remaining", self.FEATURE_STROKE),
			projectionLine(velocityY, "Projection of work completed", self.VELOCITY_STROKE),
			projectionCone(effortY, "Projection of work remaining", self.FEATURE_STROKE),
			projectionCone(velocityY, "Projection of work completed", self.VELOCITY_STROKE),
			projectionTrace(startX, effortY, p10.x, p10.y),
			projectionTrace(p10.x, p10.y, p10.x, this._metrics.bottom),
			projectionTrace(startX, effortY, p50.x, p50.y),
			projectionTrace(p50.x, p50.y, p50.x, this._metrics.bottom),
			projectionTrace(startX, effortY, p90.x, p90.y),
			projectionTrace(p90.x, p90.y, p90.x, this._metrics.bottom)
		);
	};
	
	BurnupDom.populate = function(optionalMetricsForTesting) {
		this._hideInteriorElements();
		if (this._paper) {
			this._paper.remove();
		}
        this._paper = raphael(this._element[0], this._element.width(), this._element.height());
		this._copyTextElements();
		if (optionalMetricsForTesting) {
			this._metrics = optionalMetricsForTesting;
		}
		else {
		    this._metrics = new rs.BurnupChartMetrics({
	            paperWidth: this._element.width(),
				paperHeight: this._element.height(),
	            xLabelHeight: this.xLabel.getBBox().height,
				yLabelHeight: this.yLabel.getBBox().height,
	            xTickLabelHeight: this.xTickLabel.getBBox().height,
				yTickLabelWidth: this.yTickLabel.getBBox().width,
				yTickLabelHeight: this.yTickLabel.getBBox().height,
				startDate: this._estimates.firstIteration().startDate(),
				iterationLength: this._estimates.firstIteration().length(),
	            iterationCount: this._projections.totalIterations(),
				maxEffort: this._projections.maxEffort()
			});
		}

        this._history();
        this._projection();
		this._axisLabels();
		this._axisLines();
		this._xAxisTicks();
		this._yAxisTicks();
	};
	
	BurnupDom.paper = function() {
		return this._paper;
	};
}());

(function() {
	var rs = rabu.schedule;

	rs.BurnupChartMetrics = function(data) {
		this._data = data;
		this.MAJOR_TICK_LENGTH = data.MAJOR_TICK_LENGTH || 8;
		this.MINOR_TICK_LENGTH = data.MINOR_TICK_LENGTH || 4;
		this.AXIS_OVERHANG = data.AXIS_OVERHANG || 10;
		this.X_LABEL_PADDING_MULTIPLIER = data.X_LABEL_PADDING_MULTIPLIER || 1.25;
		this.Y_LABEL_PADDING_MULTIPLIER = data.Y_LABEL_PADDING_MULTIPLIER || 1.25;
		this.X_TICK_LABEL_PADDING = data.X_TICK_LABEL_PADDING || 10;
		this.Y_TICK_SPACING = data.Y_TICK_SPACING || 10;
		this.Y_TICK_LABEL_PADDING_MULTIPLIER = data.Y_TICK_LABEL_PADDING_MULTIPLIER || 1.1;
		this.Y_TICK_LABEL_RIGHT_PADDING = data.Y_TICK_LABEL_RIGHT_PADDING || 3;

		this.left = data.yLabelHeight + this.AXIS_OVERHANG + (data.yTickLabelWidth * this.Y_LABEL_PADDING_MULTIPLIER);
		this.right = data.paperWidth;
		this.width = this.right - this.left;

		this.top = 0;
		this.bottom = data.paperHeight - ((data.xLabelHeight * this.X_LABEL_PADDING_MULTIPLIER) + (this.MAJOR_TICK_LENGTH / 2) + data.xTickLabelHeight);
		this.height = this.bottom - this.top;

		this.yTickLabelHeight = data.yTickLabelHeight;

		this.xLabelCenter = this.left + (this.width / 2);
		this.yLabelCenter = this.top + (this.height / 2);
		this.xLabelVerticalCenter = data.paperHeight - (data.xLabelHeight / 2);
		this.yLabelVerticalCenter = data.yLabelHeight / 2;

		this.xTickLabelVerticalCenter = this.bottom + (this.MAJOR_TICK_LENGTH / 2) + (data.xTickLabelHeight / 2);
		this.yTickLabelRightEdge = this.left - (this.MAJOR_TICK_LENGTH / 2) - this.Y_TICK_LABEL_RIGHT_PADDING;

		this.xTickCount = data.iterationCount + 1;
	};
	rs.BurnupChartMetrics.prototype = new rs.Object();
	var BurnupChartMetrics = rs.BurnupChartMetrics.prototype;

	BurnupChartMetrics.xForIteration = function(iteration) {
        var tickDistance = this.width / (this.xTickCount - 1 + 0.5);
        return this.left + (iteration * tickDistance);
	};
	
    BurnupChartMetrics._yTickScale = function() {
        var pixels = this.height;
        var effortPerPixel = this._data.maxEffort / pixels;
        var effortPerTick = effortPerPixel * this.Y_TICK_SPACING;
        return rs.BurnupChartMetrics.roundUpEffort(effortPerTick);
    };
	
	BurnupChartMetrics.yForEffort = function(effort) {
        var pixelsPerTick = this.height / (this.yTickCount() - 1 + 0.5);
		var effortPerTick = this._yTickScale();
		var pixelsPerEffort = pixelsPerTick / effortPerTick;
		var pixels = effort * pixelsPerEffort;
        return this.bottom - pixels;
	};
	
	BurnupChartMetrics.xTickPosition = function(offset) {
		return this.xForIteration(offset);
	};
	
	BurnupChartMetrics.shouldDrawXTickLabel = function(tickOffset, labelWidth, previousRightEdge) {
		var labelLeft = this.xTickPosition(tickOffset) - (labelWidth / 2) - this.X_TICK_LABEL_PADDING;
		var labelRight = this.xTickPosition(tickOffset) + (labelWidth / 2) + this.X_TICK_LABEL_PADDING;
		
		var tickZero = (tickOffset === 0);
		var overlapsLeftEdge = (labelLeft <= this.left);
		var overlapsRightEdge = (labelRight >= this.right);
		var overlapsPreviousLabel = (labelLeft <= previousRightEdge);
		
		return !tickZero && !overlapsLeftEdge && !overlapsRightEdge && !overlapsPreviousLabel;
	};
	
	BurnupChartMetrics.yTickCount = function() {
		var count = 1 + this._data.maxEffort / this._yTickScale();
		return Math.ceil(count);
	};
	
	BurnupChartMetrics.yTickPosition = function(tickOffset) {
		return this.yForEffort(tickOffset * this._yTickScale());
	};
	
	BurnupChartMetrics.yTickLabel = function(tickOffset) {
		return (this._yTickScale() * tickOffset).toString();
	};
	
	BurnupChartMetrics.shouldDrawYTickLabel = function(tickOffset, previousTopEdge) {
		var padding = this._data.yTickLabelHeight * (this.Y_TICK_LABEL_PADDING_MULTIPLIER - 1);
		var labelBottom = this.yTickPosition(tickOffset) + (this._data.yTickLabelHeight / 2) + padding;
		var labelTop = this.yTickPosition(tickOffset) - (this._data.yTickLabelHeight / 2) - padding;
		
		var tickZero = (tickOffset === 0);
		var overlapsBottomEdge = (labelBottom >= this.bottom);
		var overlapsTopEdge = (labelTop <= this.top);
		var overlapsPreviousLabel = (labelBottom >= previousTopEdge);
		
		return !tickZero && !overlapsBottomEdge && !overlapsTopEdge && !overlapsPreviousLabel;
	};

	rs.BurnupChartMetrics.roundUpEffort = function(effort) {
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
}());