# Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

require 'test/unit'
require 'generator'

class RabuTest < Test::Unit::TestCase

	def test_interpolation
		rabu = Rabu.new("a\n<%= config %>\nb", "interpolated config")
		assert_equal("a\ninterpolated config\nb", rabu.html)
	end

	def test_interpolation_when_varying_whitespace
		assert_equal("a", Rabu.new("<%=config%>", "a").html)
		assert_equal("b", Rabu.new("<%=   config   %>", "b").html)
	end

	def test_interpolation_when_multiple_instances
		assert_equal("abcabc", Rabu.new("<%=config%><%=config%>", "abc").html)
	end

	def test_interpolation_when_no_config_tag
		assert_raise(NoConfigTagError) do
			Rabu.new("a", "").html
		end
	end

end

