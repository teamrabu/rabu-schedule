// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.FeaturesDom = function(element, estimates) {
	var list;
	var li;
	var divider;
	var included;
	var excluded;
	var initialPositions;

	function toHtml(features, cssClass) {
		return features.reduce(function(sum, feature) {
			var css = cssClass;
			if (feature.isDone()) { css += " rabu-done"; }
			return sum + "<li class='" + css + "'>" + feature.name() + "</li>";
		}, "");
	}

	function populateFeatureList() {
		element.html(toHtml(estimates.includedFeatures(), "rabu-included"));
		element.append(toHtml(estimates.excludedFeatures(), "rabu-excluded"));
	}

	function initializeElementVars() {
		list = $(".rabu-features");
		li = $("li", list);
		divider = $(".rabu-divider");
		included = $(".rabu-included", list);
		excluded = $(".rabu-excluded", list);
	}

	function saveInitialPositions() {
		initialPositions = [];
		li.each(function(index, element) {
			element = $(element);
			initialPositions[index] = element.offset().top;
		});
	}

	function setPosition(element, position) {
		element.offset({
			top: position,
			left: element.offset().left
		});
	}

	function createGapForDividerBefore(targetIndex) {
		var dividerHeight = divider.outerHeight(true);
		li.each(function(index, element) {
			var newPosition = initialPositions[index];
			if (index >= targetIndex) { newPosition += dividerHeight; }
			setPosition($(element), newPosition);
		});
	}

	function positionDivider() {
		var position;
		if (excluded.length === 0) {
			var lastIncluded = included.last();
			position = lastIncluded.offset().top + lastIncluded.outerHeight(true);
		}
		else {
			position = excluded.first().offset().top - divider.outerHeight(true);
		}
		divider.css("position", "absolute");
		divider.css("top", position);
	}

	function makeDraggable() {
		li.draggable({
		});
	}

	this.populate = function() {
		populateFeatureList();
		initializeElementVars();
		if (divider.length === 0) { return; }

		saveInitialPositions();
		createGapForDividerBefore(included.length);
		positionDivider();
		makeDraggable();
	};
};