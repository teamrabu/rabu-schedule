# Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

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
		assertExists("burn-up chart", browser.div(:class, "rabu-burnup"), filename);
		assertExists("burn-up chart X-axis label", browser.div(:class, "rabu-xLabel"), filename);
		assertExists("burn-up chart Y-axis label", browser.div(:class, "rabu-yLabel"), filename);
        assertExists("burn-up chart X-axis tick label", browser.div(:class, "rabu-xTickLabel tickLabel"), filename);
        assertExists("burn-up chart Y-axis tick label", browser.div(:class, "rabu-yTickLabel tickLabel"), filename);
        
	    puts "#{filename} ok"
	ensure
        browser.close
    end
end

def assertPopulated(message, element, filename)
    assertExists(message, element, filename)
	if (element.text == "") then
	    fail "#{message} not populated", filename
	end
end

def assertExists(message, element, filename)
    if (!element.exists?) then
        fail "#{message} does not exist", filename
    end
end

def fail(message, filename)
    puts "#{filename} failed"
    puts message
    raise "HTML unit tests failed"
end