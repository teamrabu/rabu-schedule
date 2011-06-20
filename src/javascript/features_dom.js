// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.FeaturesDom = function(element, estimates) {
	var list;
	var liJQuery;
	var orderBeforeDrag = [];
	var positionsBeforeDrag = [];
	var featuresInOrder = [];
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
		liJQuery.each(function(index, element) {
			orderBeforeDrag[index] = $(element);
			featuresInOrder[index] = $(element);
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
		featuresInOrder.forEach(function(element, index) {
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

	function swapFeatures(a, b) {       // TODO: unused, deleteme
		var temp = orderBeforeDrag[a];
		orderBeforeDrag[a] = orderBeforeDrag[b];
		orderBeforeDrag[b] = temp;
	}

	function moveElement(originalPosition, newPosition) {
		function moveUp() {
			newPosition = Math.min(newPosition, orderBeforeDrag.length - 1);
			orderBeforeDrag.forEach(function(xx, index) {
				if (index < originalPosition || index > newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index];
				}
				else if (index < newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index + 1];
				}
				else if (index === newPosition) {
					featuresInOrder[index] = orderBeforeDrag[originalPosition];
				}
				else {
					throw "Unreachable code when moving up. index [" + index + "]; originalPosition: [" + originalPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}
		function moveDown() {
			orderBeforeDrag.forEach(function(xx, index) {
				if (index > originalPosition || index < newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index];
				}
				else if (index > newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index - 1];
				}
				else if (index === newPosition) {
					featuresInOrder[index] = orderBeforeDrag[originalPosition];
				}
				else {
					throw "Unreachable code when moving down. index [" + index + "]; originalPosition: [" + originalPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}

		if (newPosition < originalPosition) { moveDown(); }
		else { moveUp(); }
	}

	function findOriginalIndex(domElement) {
		var i;
		for (i = 0; i < orderBeforeDrag.length; i++) {
			if (orderBeforeDrag[i][0] === domElement) { return i; }
		}
		throw "Couldn't find element";
	}

	function findNewIndex(domElement, pageOffset, originalIndex) {
		function draggingUp(i) { return originalIndex >= i; }

		var draggerTop = pageOffset;
		var draggerHeight = $(domElement).outerHeight(true);
		var i, elementTop, elementHeight, elementCenter;

		for (i = positionsBeforeDrag.length - 1; i > 0; i--) {
			if (draggingUp(i)) {
				elementTop = positionsBeforeDrag[i - 1];
				elementHeight = orderBeforeDrag[i - 1].outerHeight(true);
				elementCenter = (elementHeight / 2);

				if (draggerTop > elementTop + elementCenter) { return i; }
			}
			else {
				elementTop = positionsBeforeDrag[i];
				elementHeight = orderBeforeDrag[i].outerHeight(true);
				elementCenter = (elementHeight / 2);

				if (draggerTop + draggerHeight >= elementTop + elementCenter ) { return i; }
			}
		}
		return 0;
	}

	function handleDrag(event, ui) {
		var originalPosition = findOriginalIndex(event.target);
		var newPosition = findNewIndex(event.target, ui.offset.top, originalPosition);
		moveElement(originalPosition, newPosition);
		positionElements();
	}

	function handleDragStart(event, ui) {
		featuresInOrder.forEach(function(element, index) {
			positionsBeforeDrag[index] = $(element).offset().top;
		});
	}

	function makeDraggable() {
		var lastFeature = featuresInOrder[featuresInOrder.length - 1];
		var listTop = featuresInOrder[0].offset().top;
		var listBottom = lastFeature.offset().top + lastFeature.outerHeight(true);
		liJQuery.draggable({
			axis: 'y',
			containment: [0, listTop, 0, listBottom],
			scrollSpeed: 10,
			start: handleDragStart,
			drag: handleDrag
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