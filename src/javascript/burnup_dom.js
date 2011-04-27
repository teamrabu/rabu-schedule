// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.BurnupDom = function(element, estimates) {
    var raphael = Raphael;     // prevent JSLint error resulting from calling Raphael without 'new' 
	var paper;
	
	this.populate = function() {
		paper = raphael(element[0], element.width(), element.height());
		paper.path("M0,0 L" + paper.width + "," + paper.height);
	};
	
	this.paper = function(){
		return paper;
	};
};
