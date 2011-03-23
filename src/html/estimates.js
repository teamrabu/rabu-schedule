rabu_ns.Estimates = function(configJson) {
	var config = configJson;

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

	this.totalEstimate = function() {
		var adder = function(sum, feature) {
			return sum + feature.estimate();
		};
		return this.features().reduce(adder, 0);
	};

	this.features = function() {
		return config.features.map(function(element) {
			return new rabu_ns.Feature(element);
		});
	};
};

rabu_ns.Feature = function(featureJson) {
	var feature = featureJson;

	this.name = function() {
		return feature[0];
	};

	this.estimate = function() {
		return feature[1];
	};

	this.isDone = function() {
		return this.estimate() === 0;
	};
};