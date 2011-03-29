rabu_ns.FeaturesDom = function(element, estimates) {

	function featuresToHtml() {
		var reducer = function(sum, feature, cssClass) {
			var openTag = "<li class='" + cssClass + "'>";
			if (feature.isDone()) { openTag = "<li class='" + cssClass + " rabu-done'>"; }
			return sum + openTag + feature.name() + "</li>";
		};
		var includedReducer = function(sum, feature) {
			return reducer(sum, feature, "rabu-included");
		};
		var excludedReducer = function(sum, feature) {
			return reducer(sum, feature, "rabu-excluded");
		};
		return estimates.includedFeatures().reduce(includedReducer, "") +
			estimates.excludedFeatures().reduce(excludedReducer, "");
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
		element.html(featuresToHtml());
		positionDivider($(".rabu-divider"), $(".rabu-features"));
	};
};