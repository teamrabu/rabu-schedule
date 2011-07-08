// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	var Test = new TestCase("ApplicationModel").prototype;
	var mockEstimates, mockIteration, mockDates, mockFeatures, mockBurnup;
	var model;

	function MockDom() {}
	MockDom.prototype = new rs.Object();
	MockDom.prototype.populate = function() {
		this.populateCalledWith = Array.prototype.slice.call(arguments);
	};

	function MockIteration() {
		this.effortRemainingReturnValues = [50, 60];
	}
	MockIteration.prototype = new rs.Object();
	MockIteration.prototype.moveFeature = function() {
		this.moveFeatureCalledWith = Array.prototype.slice.call(arguments);
	};
	MockIteration.prototype.effortRemaining = function() {
		return this.effortRemainingReturnValues.shift();
	};

	function MockEstimates(mockIteration) {
		this._currentIteration = mockIteration;
	}
	MockEstimates.prototype = new rs.Object();
	MockEstimates.prototype.currentIteration = function() {
		return this._currentIteration;
	};

	Test.setUp = function() {
		mockIteration = new MockIteration();
		mockEstimates = new MockEstimates(mockIteration);
		mockDates = new MockDom();
		mockFeatures = new MockDom();
		mockBurnup = new MockDom();
		model = new rs.ApplicationModel(mockEstimates, mockDates, mockFeatures, mockBurnup);
	};

	Test.test_initialize_populatesAllDoms = function() {
		model.initialize();
		assertEquals("dates.populate()", [], mockDates.populateCalledWith);
		assertEquals("features.populate()", [mockEstimates.currentIteration()], mockFeatures.populateCalledWith);
		assertEquals("burnup.populate()", [], mockBurnup.populateCalledWith);
	};

	Test.test_moveFeature_updatesIterationAndRepopulatesDoms = function() {
		model.moveFeature(1, 2);
		assertEquals("moveFeature()", [1, 2], mockEstimates.currentIteration().moveFeatureCalledWith);
		assertEquals("dates.populate()", [], mockDates.populateCalledWith);
		assertEquals("burnup.populate()", [], mockBurnup.populateCalledWith);
	};

	Test.test_moveFeature_doesNotRepopulateIfEstimateUnchanged_forPerformance = function() {
		mockIteration.effortRemainingReturnValues = [1, 1];
		model.moveFeature(1, 2);
		assertEquals("moveFeature()", [1, 2], mockIteration.moveFeatureCalledWith);
		assertEquals("dates.populate()", undefined, mockDates.populateCalledWith);
		assertEquals("burnup.populate()", undefined, mockBurnup.populateCalledWith);
	};
}());