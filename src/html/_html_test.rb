require 'rubygems';
require 'watir-webdriver';

def test_html(filename)
    url = "file://#{Dir.pwd}/#{filename}"

    browser = Watir::Browser.new :firefox
    browser.goto url

	begin
		assertEquals("Hello World", browser.span(:class, "rabu-name").text, filename, "name");
		assertEquals("January 5th, 2011", browser.span(:class, "rabu-updated").text, filename, "updated");
		assertEquals("March 12th", browser.span(:class, "date rabu-tenPercentDate").text, filename, "10%");
		assertEquals("May 21st", browser.span(:class, "date rabu-fiftyPercentDate").text, filename, "50%");
		assertEquals("October 8th", browser.span(:class, "date rabu-ninetyPercentDate").text, filename, "90%");

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