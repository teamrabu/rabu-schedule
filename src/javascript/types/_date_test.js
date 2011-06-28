// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	var Test = (new TestCase("Date")).prototype;

	Test.test_incrementDays = function() {
		var date = new rs.Date("10 Jan 2010");
		assertEquals("should increment", new rs.Date("15 Jan 2010"), date.incrementDays(5));
		assertEquals("should be immutable", new rs.Date("15 Jan 2010"), date.incrementDays(5));
		assertEquals("should work across months", new rs.Date("1 Feb 2010"), (new rs.Date("31 Jan 2010")).incrementDays(1));
		assertEquals("should work across years", new rs.Date("1 Jan 2011"), (new rs.Date("31 Dec 2010")).incrementDays(1));
	};

	Test.test_parse = function() {
		var date = new rs.Date("1 Jan 2010");
		assertEquals("January 1st, 2010", date.toLongString());
	};

	Test.test_toLongString = function() {
		assertEquals("1st", "January 1st, 2010", new rs.Date("1 Jan 2010").toLongString());
		assertEquals("2nd", "February 2nd, 2010", new rs.Date("2 Feb 2010").toLongString());
		assertEquals("3rd", "March 3rd, 2010", new rs.Date("3 Mar 2010").toLongString());
		assertEquals("4th", "April 4th, 2010", new rs.Date("4 Apr 2010").toLongString());
		assertEquals("11th", "January 11th, 2010", new rs.Date("11 Jan 2010").toLongString());
		assertEquals("12th", "February 12th, 2010", new rs.Date("12 Feb 2010").toLongString());
		assertEquals("13th", "March 13th, 2010", new rs.Date("13 Mar 2010").toLongString());
		assertEquals("14th", "April 14th, 2010", new rs.Date("14 Apr 2010").toLongString());
		assertEquals("21st", "January 21st, 2010", new rs.Date("21 Jan 2010").toLongString());
		assertEquals("22nd", "February 22nd, 2010", new rs.Date("22 Feb 2010").toLongString());
		assertEquals("23rd", "March 23rd, 2010", new rs.Date("23 Mar 2010").toLongString());
		assertEquals("24th", "April 24th, 2010", new rs.Date("24 Apr 2010").toLongString());
		assertEquals("31st", "January 1st, 2010", new rs.Date("1 Jan 2010").toLongString());
		assertEquals("30th", "April 30th, 2010", new rs.Date("30 Apr 2010").toLongString());
	};

	Test.test_toLongStringNoYear = function() {
		assertEquals("December 25th", new rs.Date("25 Dec 1996").toLongStringNoYear());
	};

	Test.test_toShortStringNoYear = function() {
		assertEquals("Oct 12", new rs.Date("12 Oct 2011").toShortStringNoYear());
	};
}());