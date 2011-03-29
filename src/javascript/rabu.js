var rabu_ns = {};

rabu_ns.Rabu = function(config_in) {
	var estimates;
	var projections;

	function init(config) {
		if (!config) {
			throw "Expected config";
		}
		estimates = new rabu_ns.Estimates(config);
		projections = new rabu_ns.Projections(estimates);
	}
	init(config_in);
	
	function dateToString(date) {
		return date.toString('MMMM dS');
	}

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

	this.populateDom = function() {
		$(".rabu-name").text(estimates.name());
		$(".rabu-updated").text(estimates.updated().toString("MMMM dS, yyyy"));
		$(".rabu-tenPercentDate").text(dateToString(projections.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(projections.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(projections.ninetyPercentDate()));
		$(".rabu-features").html(featuresToHtml());
		positionDivider($(".rabu-divider"), $(".rabu-features"));
	};
};