require 'test/unit'
require 'rabu'

class RabuTest < Test::Unit::TestCase
	def test_html_generation
		assert_equal("foo", Rabu.new("foo\n").generate_html, "should strip ending linefeed")
	end
end
