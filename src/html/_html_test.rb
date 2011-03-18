require 'rubygems';
require 'watir-webdriver';

def test_html(filename)
    url = "file://#{Dir.pwd}/#{filename}"

    browser = Watir::Browser.new :firefox
    browser.goto url

	begin
		assertEquals("Hello World", browser.span(:class, "name").text, filename, "name");
		assertEquals("March 12th", browser.span(:class, "date tenPercentDate").text, filename, "10%");
		assertEquals("May 21st", browser.span(:class, "date fiftyPercentDate").text, filename, "50%");
		assertEquals("October 8th", browser.span(:class, "date ninetyPercentDate").text, filename, "90%");

	    puts "#{filename} ok"
	ensure
        browser.close
    end
end

def assertEquals(expected, actual, filename, message="DOM")
	if (expected != actual) then
		puts "#{filename} failed"
		puts "#{message} expected <#{expected}>, was <#{actual}>"
		raise "HTML unit tests failed"
	end
end