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

__END__


def run_qunit
  ieNum = run_on(Watir::IE.new, "IE")
  firefoxNum = run_on(FireWatir::Firefox.new, "Firefox")

  if(ieNum != firefoxNum)
    print "FAILED\n";
    raise "Test counts don't match (IE: " + ieNum.to_s + "; Firefox: " + firefoxNum.to_s + ")"
  end
end


def run_on(browser, name)
  printf "Testing %s... ", name

  numTests = test_page(browser, name, "game_controllers");
  numTests = test_page(browser, name, "game_model");
  numTests += test_page(browser, name, "home");
  numTests += test_page(browser, name, "pagewide");

  print "ok\n"
  browser.close
  return numTests;
end

def test_page(browser, name, filename)
  browser.goto "http://localhost:8086/test/" + filename

  failures = Integer(browser.span(:class, "bad").text)
  numTests = Integer(browser.span(:class, "all").text)

  if (failures == 0 && numTests != 0)
    return numTests;
  else
    print "FAILED\n"
    raise name + " failed " + failures.to_s + " of " + numTests.to_s + " tests on " + filename
  end
end
