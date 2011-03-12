/*global Rabu, TestCase, assertSame, assertEquals, objectifyConfig */

(function() {
	var RabuTest = new TestCase("Rabu");

	RabuTest.prototype.setUp = function() {
		this.config = {
			title: "My title",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
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

	RabuTest.prototype.test_iterationProjections = function() {
		assertSame("10%", 10, this.rabu.tenPercentIterationsRemaining());
		assertSame("50%", 20, this.rabu.fiftyPercentIterationsRemaining());
		assertSame("90%", 40, this.rabu.ninetyPercentIterationsRemaining());
	};

	RabuTest.prototype.test_projectionsShouldRoundUp = function() {
		this.config.riskMultipliers = [0.6, 1.4, 1.6];
		this.config.velocity = 9.5;
		this.config.effortRemaining = 73;

		assertSame("10%", 5 /*9.610526315789474*/, this.rabu.tenPercentIterationsRemaining());
		assertSame("50%", 11 /*15.757894736842104*/, this.rabu.fiftyPercentIterationsRemaining());
		assertSame("90%", 13 /*17.294736842105266*/, this.rabu.ninetyPercentIterationsRemaining());
	};

	RabuTest.prototype.test_dateProjections = function() {
		assertEquals("10%", new Date("12 Mar 2011"), this.rabu.tenPercentDate());
		assertEquals("50%", new Date("21 May 2011"), this.rabu.fiftyPercentDate());
		assertEquals("90%", new Date("8 Oct 2011"), this.rabu.ninetyPercentDate());
	};
}());