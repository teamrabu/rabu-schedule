GreeterTest = TestCase("GreeterTest");

GreeterTest.prototype.testGreet = function() {
    var greeter = new myapp.Greeter();
    assertEquals("Hello World!", greeter.greet("World"));
//    assertTrue("Console output: \n[" + document.URL + "]\n", false);

    var body = document.getElementsByTagName("body")[0];

//    body.innerHTML = "tag: <p id='my_para'>para</p>";
//    var my_para = document.getElementById("my_para");
//    assertEquals("P", my_para.tagName);

    body.innerHTML = "<iframe id='bob' src='http://localhost:4224' ></iframe>"
    ;
    var bob = document.getElementById("bob");
    console.log(bob.innerHTML);
    bob.onload = function() {
    };
    assertFalse("failure!");


};