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
	var Prototype = rs.Iteration.prototype = new rs.Object();

	Prototype.startDate = function() {
		return new rs.Date(this._iteration.started);
	};

	Prototype.length = function() {
		return this._iteration.length;
	};

	Prototype.velocity = function() {
		return this._iteration.velocity;
	};

	Prototype.tenPercentMultiplier = function() {
		return this._iteration.riskMultipliers[0];
	};

	Prototype.fiftyPercentMultiplier = function() {
		return this._iteration.riskMultipliers[1];
	};

	Prototype.ninetyPercentMultiplier = function() {
		return this._iteration.riskMultipliers[2];
	};

	Prototype.effortToDate = function() {
		return this._effortToDate;
	};

	Prototype.effortRemaining = function() {
		var adder = function(sum, feature) {
			return sum + feature.estimate();
		};
		return this.includedFeatures().reduce(adder, 0);
	};

	Prototype.totalEffort = function() {
		return this.effortToDate() + this.effortRemaining();
	};

	Prototype.includedFeatures = function() {
		return this._includedFeatures;
	};

	Prototype.excludedFeatures = function() {
		return this._excludedFeatures;
	};

	Prototype.moveFeature = function(fromIndex, toIndex) {
		var included = this._includedFeatures;
		var excluded = this._excludedFeatures;

		function assertIndexInBounds(name, index) {
			if (index < 0 || index > (included.length + excluded.length)) {
				throw (name + " [" + index + "] is out of bounds; 'included' length is [" + included.length + "]; 'excluded' length is [" + excluded.length + "]");
			}
		}
		assertIndexInBounds("fromIndex", fromIndex);
		assertIndexInBounds("toIndex", toIndex);

		var moving;
		var divider = false;
		if (fromIndex < included.length) {
			// from: included features
			moving = included.splice(fromIndex, 1);
		}
		else if (fromIndex === included.length) {
			// from: divider
			divider = true;
			if (toIndex > fromIndex) {
				moving = excluded.splice(0, toIndex - fromIndex);
			}
			else {
				moving = included.splice(toIndex - fromIndex);
			}
		}
		else if (fromIndex > included.length) {
			// from: excluded features
			moving = excluded.splice(fromIndex - included.length - 1, 1);
		}

		if (divider) {
			if (toIndex > fromIndex) {
				included.push.apply(included, moving);
			}
			else {
				excluded.unshift.apply(excluded, moving);
			}
		}
		else if (toIndex < included.length) {
			// to: included features
			included.splice(toIndex, 0, moving[0]);
		}
		else if (toIndex === included.length) {
			// to: before divider
			included.splice(toIndex, 0, moving[0]);
		}
		else if (toIndex > included.length) {
			// to: excluded features
			excluded.splice(toIndex - included.length - 1, 0, moving[0]);
		}
	};
}());
