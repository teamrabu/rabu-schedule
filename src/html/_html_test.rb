require 'rubygems';
require 'watir-webdriver';

def test_html(filename)
    url = "file://#{Dir.pwd}/#{filename}"

    browser = Watir::Browser.new :firefox
    browser.goto url

	begin
		assertPopulated("name", browser.span(:class, "rabu-name"), filename);
		assertPopulated("updated", browser.span(:class, "rabu-updated"), filename);
		assertPopulated("10% projection", browser.span(:class, "date rabu-tenPercentDate"), filename);
		assertPopulated("50% projection", browser.span(:class, "date rabu-fiftyPercentDate"), filename);
		assertPopulated("90% projection", browser.span(:class, "date rabu-ninetyPercentDate"), filename);
		assertPopulated("feature list", browser.ol(:class, "rabu-features"), filename);

	    puts "#{filename} ok"
	ensure
        browser.close
    end
end

def assertPopulated(message, element, filename)
	if (element.text == "") then
		puts "#{filename} failed"
		puts "#{message} not populated"
		raise "HTML unit tests failed"
	end
end