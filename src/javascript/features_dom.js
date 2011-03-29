rabu_ns.FeaturesDom = function(element, estimates) {
	var featureList = $(".rabu-features");
	var divider = $(".rabu-divider");

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

	function positionDivider() {
		var firstExcluded = $(".rabu-excluded", featureList).first();
		if (firstExcluded.length === 0) {
			divider.hide();
			return;
		}

		firstExcluded.css("margin-top", divider.outerHeight(true));

		divider.css("position", "absolute");
		divider.css("top", firstExcluded.offset().top - divider.outerHeight(true));
		divider.css("left", featureList.offset().left + "px");
	}

	function makeDraggable() {
		featureList = $(".rabu-features");
		divider.draggable({
			axis: 'y',
			containment: [0, featureList.offset().top, 0, featureList.offset().top + featureList.height()],
			scrollSpeed: 10,
			cursorAt: { top: (divider.outerHeight() / 2) }
		});
	}

	this.populate = function() {
		populateFeatureList();
		if (divider.length === 0) { return; }

		positionDivider();
		makeDraggable();
	};
};