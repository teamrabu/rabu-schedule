require 'rubygems';
require 'watir-webdriver';

def test_html
	file = "src/rabu.html";
    url = "file://#{Dir.pwd}/#{file}"

    browser = Watir::Browser.new :firefox
    browser.goto url

    actualTitle = browser.h1(:id, "title").text
    expectedTitle = "Hello World";
    browser.close

    if (expectedTitle != actualTitle) then
        puts "#{file} failed"
        puts "DOM not populated properly: expected [#{expectedTitle}], was [#{actualTitle}]"
        raise "HTML unit tests failed"
    else
        puts "#{file} ok"
    end
end
