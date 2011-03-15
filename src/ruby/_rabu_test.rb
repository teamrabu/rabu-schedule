require 'test/unit'
require 'rabu'

class RabuTest < Test::Unit::TestCase
	def setup
		@rabu = Rabu.new
	end

	def test_nothing
		assert_equal(42, @rabu.nothing)
	end
end
