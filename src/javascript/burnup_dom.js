// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates) {
    this.TICK_LENGTH = 10;

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
	
    function axisLabels() {
		xLabel = copyText(xLabelElement);        
        yLabel = copyText(yLabelElement);
		
        xLabel.translate((paper.width + yLabel.getBBox().height) / 2, paper.height - (xLabel.getBBox().height / 2));
		yLabel.translate(yLabel.getBBox().height / 2, (paper.height - xLabel.getBBox().height) / 2);
		yLabel.rotate(270, true);
    }

    function axes() {
		var xLabelHeight = xLabel.getBBox().height;
		var yLabelWidth = yLabel.getBBox().height;    // the width of the label is its height because it's rotated 270 degrees
		var x = self.TICK_LENGTH + yLabelWidth;
		var y = paper.height - self.TICK_LENGTH - xLabelHeight;
		xAxis = line(yLabelWidth, y, paper.width, y);
		yAxis = line(x, 0, x, paper.height - xLabelHeight);
	}
	
	this.populate = function() {
		hideInteriorElements();
		paper = raphael(element[0], element.width(), element.height());
		axisLabels();
        axes();
	};
	
	this.paper = function(){
		return paper;
	};
};
