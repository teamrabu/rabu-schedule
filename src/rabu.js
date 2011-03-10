"use strict";

var Rabu = function() {}

Rabu.prototype.populateDom = function() {
    var title = document.getElementById("title");
    title.innerHTML = "Hello World";
}
