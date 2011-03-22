var rabu_ns = {};

rabu_ns.Rabu = function(config_in) {
	var config;

	function decorateConfig() {
		config.tenPercentMultiplier = function() {
			return config.riskMultipliers[0];
		};
		config.fiftyPercentMultiplier = function() {
			return config.riskMultipliers[1];
		};
		config.ninetyPercentMultiplier = function() {
			return config.riskMultipliers[2];
		};
		config.effortRemaining2 = function() {
			return config.effortRemaining;
		};
	}

	function iterations() {
		return config.effortRemaining2() / config.velocity;
	}

	function calcProjection(multiplier) {
		return iterations() * multiplier;
	}

	function convertToDate(iterationsRemaining) {
		var days = Math.ceil(iterationsRemaining * config.iterationLength);
		var date = new Date(config.currentIterationStarted);
		date.setDate(date.getDate() + days);
		return date;
	}

	function dateToString(date) {
		return date.toString('MMMM dS');
	}

	function init(config_in) {
		if (!config_in) {
			throw "Expected config";
		}
		config = config_in;
		decorateConfig();
	}

	this.populateDom = function() {
		$(".rabu-name").text(config.name);
		$(".rabu-updated").text(new Date(config.updated).toString("MMMM dS, yyyy"));
		$(".rabu-tenPercentDate").text(dateToString(this.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(this.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(this.ninetyPercentDate()));
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
		return calcProjection(config.tenPercentMultiplier());
	};

	this.fiftyPercentIterationsRemaining = function() {
		return calcProjection(config.fiftyPercentMultiplier());
	};

	this.ninetyPercentIterationsRemaining = function() {
		return calcProjection(config.ninetyPercentMultiplier());
	};

	init(config_in);
};