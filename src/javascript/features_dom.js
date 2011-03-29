rabu_ns.FeaturesDom = function(element, estimates) {

	function toHtml(features, cssClass) {
		return features.reduce(function(sum, feature) {
			var css = cssClass;
			if (feature.isDone()) { css += " rabu-done"; }
			return sum + "<li class='" + css + "'>" + feature.name() + "</li>";
		}, "");
	}

	function populateFeatureList() {
		element.append(toHtml(estimates.includedFeatures(), "rabu-included"));
		element.append(toHtml(estimates.excludedFeatures(), "rabu-excluded"));
	}

	function positionDivider(divider, features) {
		var firstExcluded = $(".rabu-excluded", features).first();
		if (divider.length === 0 || firstExcluded.length === 0) {
			divider.hide();
			return;
		}

		firstExcluded.css("margin-top", divider.outerHeight(true));

		divider.css("position", "absolute");
		divider.css("top", firstExcluded.offset().top - divider.outerHeight(true));
		divider.css("left", features.offset().left + "px");
	}

	this.populate = function() {
		populateFeatureList();
		positionDivider($(".rabu-divider"), $(".rabu-features"));
	};
};