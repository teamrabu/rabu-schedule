// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Iteration = function(iteration, effortToDate) {
		function featuresFor(featureList, effort) {
			if (!featureList) { return []; }
			var cumulativeEstimate = 0;
			return featureList.map(function(element) {
				var result = new rs.Feature(element, cumulativeEstimate, effort);
				cumulativeEstimate += result.estimate();
				return result;
			});
		}

		this._iteration = iteration;
		this._effortToDate = effortToDate;
		this._includedFeatures = featuresFor(this._iteration.included, this.effortToDate());
		this._excludedFeatures = featuresFor(this._iteration.excluded, this.totalEffort());
	};
	rs.Iteration.prototype = new rs.Object();
	var Iteration = rs.Iteration.prototype;

	Iteration.startDate = function() {
		return new rs.Date(this._iteration.started);
	};

	Iteration.length = function() {
		return this._iteration.length;
	};

	Iteration.velocity = function() {
		return this._iteration.velocity;
	};

	Iteration.tenPercentMultiplier = function() {
		return this._iteration.riskMultipliers[0];
	};

	Iteration.fiftyPercentMultiplier = function() {
		return this._iteration.riskMultipliers[1];
	};

	Iteration.ninetyPercentMultiplier = function() {
		return this._iteration.riskMultipliers[2];
	};

	Iteration.effortToDate = function() {
		return this._effortToDate;
	};

	Iteration.effortRemaining = function() {
		var adder = function(sum, feature) {
			return sum + feature.estimate();
		};
		return this.includedFeatures().reduce(adder, 0);
	};

	Iteration.totalEffort = function() {
		return this.effortToDate() + this.effortRemaining();
	};

	Iteration.includedFeatures = function() {
		return this._includedFeatures;
	};

	Iteration.excludedFeatures = function() {
		return this._excludedFeatures;
	};

	Iteration.moveFeature = function(oldIndex, newIndex) {
		var included = this._includedFeatures;
		var excluded = this._excludedFeatures;
		var removed;

		function assertIndexInBounds(name, index) {
			if (index < 0 || index > (included.length + excluded.length - 1)) {
				throw (name + " [" + index + "] is out of bounds; 'included' length is [" + included.length + "]; 'excluded' length is [" + excluded.length + "]");
			}
		}
		assertIndexInBounds("oldIndex", oldIndex);
		assertIndexInBounds("newIndex", newIndex);

		if (oldIndex < included.length) {
			removed = included.splice(oldIndex, 1);
			included.splice(newIndex, 0, removed[0]);
		}
		else {
			removed = excluded.splice(oldIndex, 1);
			excluded.splice(newIndex, 0, removed[0]);
		}
	};
}());
