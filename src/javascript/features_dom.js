// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	// The drag-and-drop code is all quite overcomplicated and could probably be simplified by
	// making the in/out divider a <li> and letting the browser do positioning.
	// For that matter, JQueryUI has a 'sortable' tool that probably eliminates the need
	// for all of the drag-and-drop code. (Live and learn.) Alternatively,
	// http://threedubmedia.com/code/event/drag is a very lightweight, clean-looking approach
	// to drag-and-drop that could work well as an alternative to using JQueryUI's events.

	var rs = rabu.schedule;
	rs.FeaturesDom = function(element, estimates) {
		this._element = element;
		this._estimates = estimates;

		this._orderBeforeDrag = [];
		this._positionsBeforeDrag = [];
		this._featuresInOrder = [];
	};
	rs.FeaturesDom.prototype = new rs.Object();
	var FeaturesDom = rs.FeaturesDom.prototype;

	FeaturesDom._toHtml = function(features, cssClass) {
		return features.reduce(function(sum, feature) {
			var css = cssClass;
			if (feature.isDone()) { css += " rabu-done"; }
			return sum + "<li class='" + css + "'>" + feature.name() + "</li>";
		}, "");
	};

	FeaturesDom._populateFeatureList = function() {
		this._element.html(this._toHtml(this._estimates.includedFeatures(), "rabu-included"));
		this._element.append(this._toHtml(this._estimates.excludedFeatures(), "rabu-excluded"));
	};

	FeaturesDom._initializeElementVars = function() {
		function pushAll(from, to) {
			var i, len;
			for (i = 0, len = from.length; i < len; i++) {
				to.push($(from[i]));
			}
		}

		this._list = $(".rabu-features");
		this._liJQuery = $("li", this._list);
		this._divider = $(".rabu-divider");
		this._included = $(".rabu-included", this._list);
		this._excluded = $(".rabu-excluded", this._list);
		this._dividerHeight = this._divider.outerHeight(true);
		this._divider.css("position", "absolute");

		pushAll(this._included, this._featuresInOrder);
		this._featuresInOrder.push(this._divider);
		pushAll(this._excluded, this._featuresInOrder);
	};

	FeaturesDom._positionElements = function() {
		var self = this;
		function setPosition(element, position) {
			element.offset({ top: position });
		}

		var position = this._list.offset().top;
		this._featuresInOrder.forEach(function(element, index) {
			position += parseInt(element.css("margin-top"), 10);
			setPosition(element, position);
			position += parseInt(element.css("margin-bottom"), 10);
			position += element.outerHeight(false);
		});
	};

	FeaturesDom._resizeListToAccomodateDivider = function() {
		var padding = parseInt(this._list.css("padding-bottom"), 10);
		padding += this._dividerHeight;
		this._list.css("padding-bottom", padding);
	};

	FeaturesDom._moveElement = function(prevPosition, newPosition) {
		var self = this;
		function moveDown() {
			newPosition = Math.min(newPosition, self._orderBeforeDrag.length - 1);
			self._orderBeforeDrag.forEach(function(xx, index) {
				if (index < prevPosition || index > newPosition) {
					self._featuresInOrder[index] = self._orderBeforeDrag[index];
				}
				else if (index < newPosition) {
					self._featuresInOrder[index] = self._orderBeforeDrag[index + 1];
				}
				else if (index === newPosition) {
					self._featuresInOrder[index] = self._orderBeforeDrag[prevPosition];
				}
				else {
					throw "Unreachable code when moving up. index [" + index + "]; prevPosition: [" + prevPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}
		function moveUp() {
			self._orderBeforeDrag.forEach(function(xx, index) {
				if (index > prevPosition || index < newPosition) {
					self._featuresInOrder[index] = self._orderBeforeDrag[index];
				}
				else if (index > newPosition) {
					self._featuresInOrder[index] = self._orderBeforeDrag[index - 1];
				}
				else if (index === newPosition) {
					self._featuresInOrder[index] = self._orderBeforeDrag[prevPosition];
				}
				else {
					throw "Unreachable code when moving down. index [" + index + "]; prevPosition: [" + prevPosition + "]; newPosition: [" + newPosition + "]";
				}
			});
		}

		if (newPosition < prevPosition) { moveUp(); }
		else { moveDown(); }
	};

	FeaturesDom._findOriginalIndex = function(domElement) {
		var i;
		for (i = 0; i < this._orderBeforeDrag.length; i++) {
			if (this._orderBeforeDrag[i][0] === domElement) { return i; }
		}
		throw "Couldn't find element";
	};

	FeaturesDom._findNewIndex = function(domElement, pageOffset, originalIndex) {
		function draggingUp(i) { return originalIndex >= i; }

		var draggerTop = pageOffset;
		var draggerHeight = $(domElement).outerHeight(true);
		var i, elementTop, elementHeight, elementCenter;

		for (i = this._positionsBeforeDrag.length - 1; i > 0; i--) {
			if (draggingUp(i)) {
				elementTop = this._positionsBeforeDrag[i - 1];
				elementHeight = this._orderBeforeDrag[i - 1].outerHeight(false);
				elementCenter = (elementHeight / 2);

				if (draggerTop > elementTop + elementCenter) { return i; }
			}
			else {
				elementTop = this._positionsBeforeDrag[i];
				elementHeight = this._orderBeforeDrag[i].outerHeight(false);
				elementCenter = (elementHeight / 2);

				if (draggerTop + draggerHeight >= elementTop + elementCenter ) { return i; }
			}
		}
		return 0;
	};

	FeaturesDom._makeDraggable = function() {
		var self = this;

		function handleDrag(event, ui) {
			var originalPosition = self._findOriginalIndex(event.target);
			var newPosition = self._findNewIndex(event.target, ui.offset.top, originalPosition);
			self._moveElement(originalPosition, newPosition);
			self._positionElements();
		}

		function handleDragStart(event, ui) {
			function copyArray(array) { return array.slice(); }

			self._orderBeforeDrag = copyArray(self._featuresInOrder);
			self._featuresInOrder.forEach(function(element, index) {
				self._positionsBeforeDrag[index] = $(element).offset().top;
			});
		}

		function handleDragStop(event, ui) {
			self._positionElements();
		}

		var lastFeature = this._featuresInOrder[this._featuresInOrder.length - 1];
		var listTop = this._list.offset().top;
		var listBottom = this._list.offset().top + this._list.outerHeight(false);
		this._liJQuery.draggable({
			axis: 'y',
			containment: [0, listTop, 0, listBottom],
			scroll: false,      // disabled due to bug that prevents containment from being respected when autoscrolling. Last checked in jQueryUI 1.8.13
//			scrollSpeed: 10,
			start: handleDragStart,
			drag: handleDrag,
			stop: handleDragStop
		});
	};

	FeaturesDom.populate = function() {
		this._populateFeatureList();
		this._initializeElementVars();
		if (this._divider.length === 0) { return; }

		this._positionElements();
		this._resizeListToAccomodateDivider();
		this._makeDraggable();
	};
}());