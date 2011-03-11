"use strict";

var RabuTest = TestCase("Rabu");

RabuTest.prototype.setUp = function() {
	this.config = {
		title: "My title"
	}
};

RabuTest.prototype.testTitle = function() {
	/*:DOC += <h1 id="title"></h1> */

	var rabu = new Rabu(this.config);
	rabu.populateDom();

	assertEquals("My title", $("#title").text());
};