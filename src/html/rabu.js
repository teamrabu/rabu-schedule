var rabu_ns = {};

rabu_ns.Rabu = function(config_in) {
	var estimates;

	function init(config) {
		if (!config) {
			throw "Expected config";
		}
		estimates = new rabu_ns.Estimates(config);
	}
	init(config_in);
	
	function iterations() {
		return estimates.totalEstimate() / estimates.velocity();
	}

	function calcProjection(multiplier) {
		return iterations() * multiplier;
	}

	function convertToDate(iterationsRemaining) {
		var days = Math.ceil(iterationsRemaining * estimates.iterationLength());
		var date = estimates.currentIterationStarted();
		date.setDate(date.getDate() + days);
		return date;
	}

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
		$(".rabu-tenPercentDate").text(dateToString(this.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(this.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(this.ninetyPercentDate()));
		$(".rabu-features").html(featuresToHtml());
		positionDivider($(".rabu-divider"), $(".rabu-features"));
	};

	this.tenPercentDate = function() {
		return convertToDate(this.tenPercentIterationsRemaining());
	};

	this.fiftyPercentDate = function() {
		return convertToDate(this.fiftyPercentIterationsRemaining());
	};

	this.ninetyPercentDate = function() {
		return convertToDate(this.ninetyPercentIterationsRemaining());
	};

	this.tenPercentIterationsRemaining = function() {
		return calcProjection(estimates.tenPercentMultiplier());
	};

	this.fiftyPercentIterationsRemaining = function() {
		return calcProjection(estimates.fiftyPercentMultiplier());
	};

	this.ninetyPercentIterationsRemaining = function() {
		return calcProjection(estimates.ninetyPercentMultiplier());
	};
};