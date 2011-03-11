"use strict";

var RabuTest = TestCase("Rabu");

RabuTest.prototype.testTitle = function() {
	/*:DOC += <h1 id="title"></h1> */
	var rabu = new Rabu();
	rabu.populateDom();

	var title = document.getElementById("title");
	assertEquals("Hello World", title.innerHTML);
};