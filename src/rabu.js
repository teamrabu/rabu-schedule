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

	function Rabu(config_in) {
		if (!config_in) {
			throw "Expected config";
		}
		config = config_in;
		decorateConfig();
	}

	Rabu.prototype.populateDom = function() {
		$("#title").text(config.title);
	};

	Rabu.prototype.tenPercentIterationsRemaining = function() {
		return iterations() * config.tenPercentMultiplier();
	};

	Rabu.prototype.fiftyPercentIterationsRemaining = function() {
		return iterations() * config.fiftyPercentMultiplier();
	};

	Rabu.prototype.ninetyPercentIterationsRemaining = function() {
		return iterations() * config.ninetyPercentMultiplier();
	};

	this.Rabu = Rabu;
}());
