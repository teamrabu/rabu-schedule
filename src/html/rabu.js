(function() {
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
	}

	function iterations() {
		return config.effortRemaining / config.velocity;
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

	function Rabu(config_in) {
		if (!config_in) {
			throw "Expected config";
		}
		config = config_in;
		decorateConfig();
	}

	Rabu.prototype.populateDom = function() {
		$(".rabu-name").text(config.name);
		$(".rabu-updated").text(new Date(config.updated).toString("MMMM dS, yyyy"));
		$(".rabu-tenPercentDate").text(dateToString(this.tenPercentDate()));
		$(".rabu-fiftyPercentDate").text(dateToString(this.fiftyPercentDate()));
		$(".rabu-ninetyPercentDate").text(dateToString(this.ninetyPercentDate()));
	};

	Rabu.prototype.tenPercentDate = function() {
		return convertToDate(this.tenPercentIterationsRemaining());
	};

	Rabu.prototype.fiftyPercentDate = function() {
		return convertToDate(this.fiftyPercentIterationsRemaining());
	};

	Rabu.prototype.ninetyPercentDate = function() {
		return convertToDate(this.ninetyPercentIterationsRemaining());
	};

	Rabu.prototype.tenPercentIterationsRemaining = function() {
		return calcProjection(config.tenPercentMultiplier());
	};

	Rabu.prototype.fiftyPercentIterationsRemaining = function() {
		return calcProjection(config.fiftyPercentMultiplier());
	};

	Rabu.prototype.ninetyPercentIterationsRemaining = function() {
		return calcProjection(config.ninetyPercentMultiplier());
	};

	this.Rabu = Rabu;
}());
