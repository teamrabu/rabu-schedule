require 'rubygems';
require 'watir-webdriver';

def test_html
    url = "file://#{Dir.pwd}/src/rabu.html"

    browser = Watir::Browser.new :firefox
    browser.goto url

    actualTitle = browser.h1(:id, "title").text
    expectedTitle = "Hello World";
    browser.close

    if (expectedTitle != actualTitle) then
        raise "DOM not populated properly: expected [#{expectedTitle}], was [#{actualTitle}]"
    else
        puts "OK"
    end
end
