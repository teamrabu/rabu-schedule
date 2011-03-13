require 'rubygems';
require 'watir-webdriver';

FILE = "src/rabu.html";

def test_html
    url = "file://#{Dir.pwd}/#{FILE}"

    browser = Watir::Browser.new :firefox
    browser.goto url

	begin
		assertEquals("Hello World", browser.span(:class, "name").text, "name");
		assertEquals("Mar 12th, 2011", browser.span(:class, "tenPercentDate").text, "10%");
		assertEquals("May 21st, 2011", browser.span(:class, "fiftyPercentDate").text, "50%");
		assertEquals("Oct 8th, 2011", browser.span(:class, "ninetyPercentDate").text, "90%");

	    puts "#{FILE} ok"
	ensure
        browser.close
    end
end

def assertEquals(expected, actual, message="DOM")
	if (expected != actual) then
		puts "#{FILE} failed"
		puts "#{message} expected <#{expected}>, was <#{actual}>"
		raise "HTML unit tests failed"
	end
end