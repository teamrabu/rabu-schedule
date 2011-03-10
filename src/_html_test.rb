require 'rubygems';
require 'watir-webdriver';

def check_html
    url = "file://#{Dir.pwd}/src/rabu.html"

    browser = Watir::Browser.new :firefox
    browser.goto url

    actualTitle = browser.h1(:id, "title").text
    expectedTitle = "Hello World";

    if (expectedTitle != actualTitle) then
        raise "DOM not populated properly: expected [#{expectedTitle}], was [#{actualTitle}]"
    else
        puts "OK"
        browser.close
    end
end

check_html
