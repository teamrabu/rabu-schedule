// Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

(function() {
	var rs = rabu.schedule;
	rs.Date = function(dateString) {
		this._date = new Date(dateString);
	};
	var Class = rs.Date.prototype = new rs.Object();

	Class._dateString = function() {
		return this._date.getDate();
	};

	Class._ordinalDateString = function() {
		var date = this._date.getDate();
		if (date === 1 || date === 21 || date === 31) { return date + "st"; }
		else if (date === 2 || date === 22) { return date + "nd"; }
		else if (date === 3 || date === 23) { return date + "rd"; }
		else { return date + "th"; }
	};

	Class._longMonthString = function() {
		return [
			"January", "February", "March", "April", "May", "June", "July", "August",
			"September", "October", "November", "December"
		][this._date.getMonth()];
	};

	Class._shortMonthString = function() {
		return [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
			"Nov", "Dec"
		][this._date.getMonth()];
	};

	Class._yearString = function() {
		return this._date.getFullYear();
	};

	Class.toLongString = function() {
		var day = this._ordinalDateString();
		var month = this._longMonthString();
		var year = this._date.getFullYear();

		return month + " " + day + ", " + year;
	};

	Class.toLongStringNoYear = function() {
		var day = this._ordinalDateString();
		var month = this._longMonthString();

		return month + " " + day;
	};

	Class.toShortStringNoYear = function() {
		var day = this._dateString();
		var month = this._shortMonthString();

		return month + " " + day;
	};

	Class.equals = function() {
		return false;
	};
}());