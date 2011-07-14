// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	// The drag-and-drop code is all quite overcomplicated and could probably be simplified by
	// making the in/out divider a <li> and letting the browser do positioning.
	// For that matter, JQueryUI has a 'sortable' tool that probably eliminates the need
	// for all of the drag-and-drop code. (Live and learn.) Alternatively,
	// http://threedubmedia.com/code/event/drag is a very lightweight, clean-looking approach
	// to drag-and-drop that could work well as an alternative to using JQueryUI's events.

	var LIST_CLASS = ".rabu-features";

	var rs = rabu.schedule;
	rs.FeaturesDom = function(applicationModel) {
		if (!applicationModel) { throw "expected applicationModel"; }
		this._applicationModel = applicationModel;
	};
	var FeaturesDom = rs.FeaturesDom.prototype = new rs.Object();

	function cssToInt(element, css) {
		return parseInt(element.css(css), 10);
	}

	FeaturesDom._toHtml = function(features, cssClass) {
		return features.reduce(function(sum, feature) {
			var css = cssClass;
			if (feature.isDone()) { css += " rabu-done"; }
			return sum + "<li class='" + css + "'>" + feature.name() + "</li>";
		}, "");
	};

	FeaturesDom._populateFeatureList = function(iteration) {
		$(LIST_CLASS).html(this._toHtml(iteration.includedFeatures(), "rabu-included"));
		$(LIST_CLASS).append(this._toHtml(iteration.excludedFeatures(), "rabu-excluded"));
	};

	FeaturesDom._initializeElementVars = function() {
		function pushAll(from, to) {
			var i, len;
			for (i = 0, len = from.length; i < len; i++) {
				to.push($(from[i]));
			}
		}

		this._list = $(LIST_CLASS);
		this._liJQuery = $("li", this._list);
		this._divider = $(".rabu-divider");
		this._included = $(".rabu-included", this._list);
		this._excluded = $(".rabu-excluded", this._list);
		this._dividerHeight = this._divider.outerHeight(true);
		this._divider.css("position", "absolute");

		this._orderBeforeDrag = [];
		this._positionsBeforeDrag = [];
		this._featuresInOrder = [];
		pushAll(this._included, this._featuresInOrder);
		this._featuresInOrder.push(this._divider);
		pushAll(this._excluded, this._featuresInOrder);
	};

	FeaturesDom._layoutElements = function() {
		var self = this;

		function setPosition(element, position) {
			var marginTop = cssToInt(element, "margin-top");
			if (marginTop < 0) {
				position += marginTop;
			}
			element.offset({ top: position });
			position += element.outerHeight(true);
			if (marginTop < 0) {
				position -= marginTop;
			}
			return position;
		}

		function assignClass(element, included) {
			element.removeClass("rabu-included");
			element.removeClass("rabu-excluded");
			element.addClass(included ? "rabu-included" : "rabu-excluded");
		}

		var position = this._list.offset().top;
		position += cssToInt(this._list, "border-top-width");
		position += cssToInt(this._list, "padding-top");
		position -= cssToInt(this._liJQuery, "margin-top");

		var included = true;
		this._featuresInOrder.forEach(function(element, index) {
			position = setPosition(element, position);
			if (element === self._divider) {
				included = false;
			}
			else {
				assignClass(element, included);
			}
		});
	};

	FeaturesDom._resizeListToAccomodateDivider = function() {
		var padding = parseInt(this._list.css("padding-bottom"), 10);
		padding += this._dividerHeight;
		this._list.css("padding-bottom", padding);
	};

	FeaturesDom._makeDraggable = function() {
		var self = this;
		
		function moveDown(prevPosition, newPosition) {
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

		function moveUp(prevPosition, newPosition) {
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

		function moveElement(prevPosition, newPosition) {
			if (newPosition < prevPosition) { moveUp(prevPosition, newPosition); }
			else { moveDown(prevPosition, newPosition); }
			self._layoutElements();
		}

		function findOriginalIndex(list, domElement) {
			var i;
			for (i = 0; i < list.length; i++) {
				if (list[i][0] === domElement) { return i; }
			}
			throw "Couldn't find element";
		}

		function findNewIndex(domElement, pageOffset, originalIndex) {
			function draggingUp(i) { return originalIndex >= i; }

			function topMarginBorderAndPadding(element) {
				return cssToInt(element, "margin-top") + cssToInt(element, "border-top-width") + cssToInt(element, "padding-top");
			}

			var jqElement = $(domElement);
			var pixelsBeforeContent = topMarginBorderAndPadding(jqElement);

			var draggerContentTop = pageOffset + pixelsBeforeContent;
			var draggerContentBottom = draggerContentTop + jqElement.height();
			var i, element, elementTop, elementHeight, elementCenter, marginTop;

			for (i = self._positionsBeforeDrag.length - 1; i > 0; i--) {
				if (draggingUp(i)) {
					element = self._orderBeforeDrag[i - 1];
					elementTop = self._positionsBeforeDrag[i - 1] + topMarginBorderAndPadding(element);
					marginTop = cssToInt(element, "margin-top");
					if (marginTop < 0) { elementTop -= marginTop; }
					elementHeight = element.height();
					elementCenter = elementTop + (elementHeight / 2);

					if (draggerContentTop > elementCenter) { return i; }
				}
				else {
					element = self._orderBeforeDrag[i];
					elementTop = self._positionsBeforeDrag[i] + topMarginBorderAndPadding(element);
					marginTop = cssToInt(element, "margin-top");
					if (marginTop < 0) { elementTop -= marginTop; }
					elementHeight = element.height();
					elementCenter = elementTop + (elementHeight / 2);

					if (draggerContentBottom >= elementCenter ) { return i; }
				}
			}
			return 0;
		}

		function handleDragStart(event, ui) {
			function copyArray(array) { return array.slice(); }

			self._orderBeforeDrag = copyArray(self._featuresInOrder);
			self._featuresInOrder.forEach(function(element, index) {
				self._positionsBeforeDrag[index] = $(element).offset().top;
			});
		}

		function handleDrag(event, ui) {
			var positionBeforeDragStarted = findOriginalIndex(self._orderBeforeDrag, event.target);
			var currentPosition = findOriginalIndex(self._featuresInOrder, event.target);
			var newPosition = findNewIndex(event.target, ui.offset.top, positionBeforeDragStarted);
			moveElement(positionBeforeDragStarted, newPosition);
			self._applicationModel.moveFeature(currentPosition, newPosition);
		}

		function handleDragStop(event, ui) {
			self._layoutElements();
		}

		var lastFeature = this._featuresInOrder[this._featuresInOrder.length - 1];
		var listTop = this._list.offset().top;
		var listBottom = this._list.offset().top + this._list.outerHeight(false);
		var draggables = this._liJQuery.add(this._divider);
		draggables.draggable({
			axis: 'y',
			containment: [0, listTop, 0, listBottom],
			scroll: false,      // disabled due to bug that prevents containment from being respected when autoscrolling. Last checked in jQueryUI 1.8.13
//			scrollSpeed: 10,
			start: handleDragStart,
			drag: handleDrag,
			stop: handleDragStop
		});
	};

	FeaturesDom.populate = function(iteration) {
		this._populateFeatureList(iteration);
		this._initializeElementVars();
		if (this._divider.length === 0) { return; }

		this._layoutElements();
		this._resizeListToAccomodateDivider();
		this._makeDraggable();
	};
}());