/*global Rabu, TestCase, assertSame, objectifyConfig */

var RabuTest = new TestCase("Rabu");

RabuTest.prototype.setUp = function() {
	this.config = {
		title: "My title",
		riskMultipliers: [1, 2, 4],
		velocity: 10,
		effortRemaining: 100
	};
	this.rabu = new Rabu(this.config);
};

RabuTest.prototype.test_title = function() {
	/*:DOC += <h1 id="title"></h1> */

	this.rabu.populateDom();
	assertSame("My title", $("#title").text());
};

RabuTest.prototype.test_projections = function() {
	assertSame("10%", 10, this.rabu.tenPercentIterationsRemaining());
	assertSame("50%", 20, this.rabu.fiftyPercentIterationsRemaining());
	assertSame("90%", 40, this.rabu.ninetyPercentIterationsRemaining());
};

RabuTest.prototype.test_projectionsShouldWorkWithNonIntegerValues = function() {
	this.config.riskMultipliers = [0.6, 1.4, 1.8];
	this.config.velocity = 9.5;
	this.config.effortRemaining = 73;

	assertSame("10%", 4.610526315789474, this.rabu.tenPercentIterationsRemaining());
	assertSame("50%", 10.757894736842104, this.rabu.fiftyPercentIterationsRemaining());
	assertSame("90%", 13.83157894736842, this.rabu.ninetyPercentIterationsRemaining());
};
