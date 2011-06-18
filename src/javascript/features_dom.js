// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.FeaturesDom = function(element, estimates) {
	var list;
	var liJQuery;
	var originalOrder;
	var adjustedOrder;
	var divider;
	var included;
	var excluded;
	var dividerHeight;

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
		liJQuery = $("li", list);
		originalOrder = [];
		adjustedOrder = [];
		liJQuery.each(function(index, element) {
			originalOrder[index] = $(element);
			adjustedOrder[index] = $(element);
		});
		divider = $(".rabu-divider");
		included = $(".rabu-included", list);
		excluded = $(".rabu-excluded", list);
		dividerHeight = divider.outerHeight(true);
	}

	function setPosition(element, position) {
		element.offset({
			top: position,
			left: element.offset().left
		});
	}

	function positionElements() {
		var position = list.offset().top;
		adjustedOrder.forEach(function(element, index) {
			if (index === included.length) { position += dividerHeight; }
			setPosition(element, position);
			position += element.outerHeight(true);
		});
	}

	function positionDivider() {
		var position;
		if (excluded.length === 0) {
			var lastIncluded = included.last();
			position = lastIncluded.offset().top + lastIncluded.outerHeight(true);
		}
		else {
			position = excluded.first().offset().top - dividerHeight;
		}
		divider.css("position", "absolute");
		divider.css("top", position);
	}

	function resizeListToAccomodateDivider() {
		var padding = parseInt(list.css("padding-bottom"), 10);
		padding += dividerHeight;
		list.css("padding-bottom", padding);
	}

	function swapFeatures(a, b) {
		var temp = originalOrder[a];
		originalOrder[a] = originalOrder[b];
		originalOrder[b] = temp;
	}

	function findOriginalIndex(domElement) {
		var i;
		for (i = 0; i < originalOrder.length; i++) {
			if (originalOrder[i][0] === domElement) { return i; }
		}
		throw "Couldn't find element";
	}

	function moveTo(originalPosition, newPosition) {
		function moveUp() {
			newPosition = Math.min(newPosition, originalOrder.length - 1);
			originalOrder.forEach(function(xx, index) {
				if (index < originalPosition || index > newPosition) {
					adjustedOrder[index] = originalOrder[index];
				}
				else if (index < newPosition) {
					adjustedOrder[index] = originalOrder[index + 1];
				}
				else if (index === newPosition) {
					adjustedOrder[index] = originalOrder[originalPosition];
				}
				else {
					throw "Unreachable code when moving up. index [" + index + "]; originalPosition: [" + originalPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}
		function moveDown() {
			originalOrder.forEach(function(xx, index) {
				if (index > originalPosition || index < newPosition) {
					adjustedOrder[index] = originalOrder[index];
				}
				else if (index > newPosition) {
					adjustedOrder[index] = originalOrder[index - 1];
				}
				else if (index === newPosition) {
					adjustedOrder[index] = originalOrder[originalPosition];
				}
				else {
					throw "Unreachable code when moving down. index [" + index + "]; originalPosition: [" + originalPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}

		if (newPosition < originalPosition) { moveDown(); }
		else { moveUp(); }
	}

	function onDrag(event, ui) {
		var height = $(event.target).outerHeight(true);
		var offset = ui.offset.top - list.offset().top;
		var newIndex = Math.floor((offset + (height / 2) - 1) / height);
		var originalIndex = findOriginalIndex(event.target);
		moveTo(originalIndex, newIndex);
		positionElements();
	}

	function makeDraggable() {
		liJQuery.draggable({
			axis: 'y',
			containment: [0, list.position().top, 0, list.position().top + list.height()],
			scrollSpeed: 10,
			cursorAt: { top: (divider.outerHeight() / 2) },
			drag: onDrag
		});
	}

	this.populate = function() {
		populateFeatureList();
		initializeElementVars();
		if (divider.length === 0) { return; }

		positionElements();
		positionDivider();
		resizeListToAccomodateDivider();
		makeDraggable();
	};
};