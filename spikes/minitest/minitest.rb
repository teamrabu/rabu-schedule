# This spike demonstrates the minitest testing framework for Ruby.

require 'rubygems'
require 'minitest/autorun'

class TestNothing < MiniTest::Unit::TestCase
	def test_pass
		assert(true)
	end
	
	def test_fail
		fail("hi!")
	end
end
		