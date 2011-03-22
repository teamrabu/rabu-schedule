rabu_ns.Estimates = function(config_in) {

	var config;

	function init(config_in) {
		config = config_in;
	}
	init(config_in);

	this.name = function() {
		return config.name;
	};

	this.updated = function() {
		return new Date(config.updated);
	};

	this.currentIterationStarted = function() {
		return new Date(config.currentIterationStarted);
	};

	this.iterationLength = function() {
		return config.iterationLength;
	};

	this.velocity = function() {
		return config.velocity;
	};

	this.tenPercentMultiplier = function() {
		return config.riskMultipliers[0];
	};

	this.fiftyPercentMultiplier = function() {
		return config.riskMultipliers[1];
	};

	this.ninetyPercentMultiplier = function() {
		return config.riskMultipliers[2];
	};

	this.effortRemaining = function() {
		var adder = function(sum, element) {
			return sum + element[1];
		};
		return config.features.reduce(adder, 0);
	};
};
