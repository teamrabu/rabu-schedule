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

	this.effortRemaining = function() {
		return config.effortRemaining;
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
};
