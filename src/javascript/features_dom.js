// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

rabu.schedule.FeaturesDom = function(element, estimates) {
	var list;
	var liJQuery;
	var divider;
	var included;
	var excluded;
	var dividerHeight;

	var orderBeforeDrag = [];
	var positionsBeforeDrag = [];
	var featuresInOrder = [];

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
		function copyArray(array) { return array.slice(); }

		list = $(".rabu-features");
		liJQuery = $("li", list);
		divider = $(".rabu-divider");
		included = $(".rabu-included", list);
		excluded = $(".rabu-excluded", list);
		dividerHeight = divider.outerHeight(true);
		divider.css("position", "absolute");

		included.each(function(index, element) {
			featuresInOrder.push($(element));
		});
		featuresInOrder.push(divider);
		excluded.each(function(index, element) {
			featuresInOrder.push($(element));
		});
		orderBeforeDrag = copyArray(featuresInOrder);
	}

	function setPosition(element, position) {
		element.offset({
			top: position,
			left: element.offset().left
		});
	}

	function positionFeatures() {
		var position = list.offset().top;
		featuresInOrder.forEach(function(element, index) {
			// This is all quite overcomplicated and could probably be simplified by
			// making the in/out divider a <li> and letting the browser do positioning.
			// For that matter, JQueryUI probably solves this problem directly. Live and learn.
			position += parseInt(element.css("margin-top"), 10);
			setPosition(element, position);
			position += parseInt(element.css("margin-bottom"), 10);
			position += element.outerHeight(false);
		});
	}

	// TODO: deleteme
//	function positionDivider() {
//		var position;
//		if (excluded.length === 0) {
//			var lastIncluded = included.last();
//			position = lastIncluded.offset().top + lastIncluded.outerHeight(true);
//		}
//		else {
//			position = excluded.first().offset().top - dividerHeight;
//		}
//		divider.css("position", "absolute");
//		divider.css("top", position);
//	}

	function positionElements() {
		positionFeatures();
//		positionDivider();
	}

	function resizeListToAccomodateDivider() {
		var padding = parseInt(list.css("padding-bottom"), 10);
		padding += dividerHeight;
		list.css("padding-bottom", padding);
	}


	function moveElement(prevPosition, newPosition) {
		function moveDown() {
			newPosition = Math.min(newPosition, orderBeforeDrag.length - 1);
			orderBeforeDrag.forEach(function(xx, index) {
				if (index < prevPosition || index > newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index];
				}
				else if (index < newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index + 1];
				}
				else if (index === newPosition) {
					featuresInOrder[index] = orderBeforeDrag[prevPosition];
				}
				else {
					throw "Unreachable code when moving up. index [" + index + "]; prevPosition: [" + prevPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}
		function moveUp() {
			orderBeforeDrag.forEach(function(xx, index) {
				if (index > prevPosition || index < newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index];
				}
				else if (index > newPosition) {
					featuresInOrder[index] = orderBeforeDrag[index - 1];
				}
				else if (index === newPosition) {
					featuresInOrder[index] = orderBeforeDrag[prevPosition];
				}
				else {
					throw "Unreachable code when moving down. index [" + index + "]; prevPosition: [" + prevPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}

		if (newPosition < prevPosition) { moveUp(); }
		else { moveDown(); }
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
				elementHeight = orderBeforeDrag[i - 1].outerHeight(false);
				elementCenter = (elementHeight / 2);

				if (draggerTop > elementTop + elementCenter) { return i; }
			}
			else {
				elementTop = positionsBeforeDrag[i];
				elementHeight = orderBeforeDrag[i].outerHeight(false);
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
		var listBottom = lastFeature.offset().top;
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
		resizeListToAccomodateDivider();
		makeDraggable();
	};
};