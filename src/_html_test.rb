require 'rubygems';
require 'watir-webdriver';

def test_html
	file = "src/rabu.html";
    url = "file://#{Dir.pwd}/#{file}"

    browser = Watir::Browser.new :firefox
    browser.goto url

	begin
		actualProjectName = browser.span(:class, "projectName").text
		expectedProjectName = "Hello World";
	ensure
        browser.close
    end

    if (expectedProjectName != actualProjectName) then
        puts "#{file} failed"
        puts "DOM not populated properly: expected [#{expectedProjectName}], was [#{actualProjectName}]"
        raise "HTML unit tests failed"
    else
        puts "#{file} ok"
    end
end
