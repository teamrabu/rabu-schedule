require 'rubygems';
require 'watir-webdriver';

def test_html(filename)
    url = "file://#{Dir.pwd}/#{filename}"

    browser = Watir::Browser.new :firefox
    browser.goto url

	begin
		assertEquals("Hello World", browser.span(:class, "name").text, filename, "name");
		assertEquals("Mar 12th, 2011", browser.span(:class, "tenPercentDate").text, filename, "10%");
		assertEquals("May 21st, 2011", browser.span(:class, "fiftyPercentDate").text, filename, "50%");
		assertEquals("Oct 8th, 2011", browser.span(:class, "ninetyPercentDate").text, filename, "90%");

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