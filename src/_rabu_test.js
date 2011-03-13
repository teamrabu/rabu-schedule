/*global Rabu, TestCase, assertSame, assertEquals, objectifyConfig */

(function() {
	var RabuTest = new TestCase("Rabu");
	var rabu;
	var config;

	RabuTest.prototype.setUp = function() {
		config = {
			name: "My name",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
			velocity: 10,
			effortRemaining: 100
		};
		rabu = new Rabu(config);
	};

	RabuTest.prototype.test_domTitle = function() {
		/*:DOC += <span class="name"></span> */
		/*:DOC += <span class="name"></span> */

		rabu.populateDom();
		assertSame("should set name", "My name", $(".name:eq(0)").text());
		assertSame("should work with multiple elements", "My name", $(".name:eq(1)").text());
	};

	RabuTest.prototype.test_domProjections = function() {
		/*:DOC += <span class="tenPercentDate"></span> */
		/*:DOC += <span class="fiftyPercentDate"></span> */
		/*:DOC += <span class="ninetyPercentDate"></span> */

		rabu.populateDom();
		assertSame("10%", "Mar 12th, 2011", $(".tenPercentDate").text());
		assertSame("50%", "May 21st, 2011", $(".fiftyPercentDate").text());
		assertSame("90%", "Oct 8th, 2011", $(".ninetyPercentDate").text());
	};

	RabuTest.prototype.test_iterationProjections = function() {
		assertSame("10%", 10, rabu.tenPercentIterationsRemaining());
		assertSame("50%", 20, rabu.fiftyPercentIterationsRemaining());
		assertSame("90%", 40, rabu.ninetyPercentIterationsRemaining());
	};

	RabuTest.prototype.test_dateProjections = function() {
		assertEquals("10%", new Date("12 Mar 2011"), rabu.tenPercentDate());
		assertEquals("50%", new Date("21 May 2011"), rabu.fiftyPercentDate());
		assertEquals("90%", new Date("8 Oct 2011"), rabu.ninetyPercentDate());
	};

	RabuTest.prototype.test_iterationProjectionsShouldNotRound = function() {
		config.riskMultipliers = [0.6, 1.4, 1.6];
		config.velocity = 9.5;
		config.effortRemaining = 73;

		assertSame("10%", 4.610526315789474, rabu.tenPercentIterationsRemaining());
		assertSame("50%", 10.757894736842104, rabu.fiftyPercentIterationsRemaining());
		assertSame("90%", 12.294736842105264, rabu.ninetyPercentIterationsRemaining());
	};

	RabuTest.prototype.test_dateProjectionsShouldRoundUpToNextDay = function() {
		config.effortRemaining = 14;
		config.iterationLength = 1;

		assertSame("10%", 1.4, rabu.tenPercentIterationsRemaining());
		assertSame("50%", 2.8, rabu.fiftyPercentIterationsRemaining());
		assertSame("90%", 5.6, rabu.ninetyPercentIterationsRemaining());
		assertEquals("10%", new Date("3 Jan 2011"), rabu.tenPercentDate());
		assertEquals("50%", new Date("4 Jan 2011"), rabu.fiftyPercentDate());
		assertEquals("90%", new Date("7 Jan 2011"), rabu.ninetyPercentDate());
	};
}());