GreeterTest = TestCase("GreeterTest");

GreeterTest.prototype.testGreet = function() {
    var greeter = new myapp.Greeter();
    assertEquals("Hello World!", greeter.greet("World"));
//    assertTrue("Console output: \n[" + document.URL + "]\n", false);

    body = document.getElementsByTagName("body")[0];
    body.innerHTML = "fodo!";
};