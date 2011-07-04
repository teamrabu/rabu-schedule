// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	var Test = new TestCase("ApplicationModel").prototype;
	var mockEstimates, mockDates, mockFeatures, mockBurnup;
	var model;

	function MockDom() {
		this._populateCalled = false;
	}
	MockDom.prototype = new rs.Object();
	MockDom.prototype.populate = function() {
		this._populateCalled = true;
	};
	MockDom.prototype.assertPopulateCalled = function(message) {
		assertTrue(message + ".populate() should have been called", this._populateCalled);
	};

	Test.setUp = function() {
		mockEstimates = {};
		mockDates = new MockDom();
		mockFeatures = new MockDom();
		mockBurnup = new MockDom();
		model = new rs.ApplicationModel(mockEstimates, mockDates, mockFeatures, mockBurnup);
	};

	Test.test_initialize_populatesAllDoms = function() {
		model.initialize();
		mockDates.assertPopulateCalled("dates");
		mockFeatures.assertPopulateCalled("features");
		mockBurnup.assertPopulateCalled("burnup");
	};
}());