# Copyright (C) 2011 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

class Rabu
	def initialize(html_template, config_json)
		@template = html_template
		@config = config_json
	end

	def html
		config_tag = /<%=\s*config\s*%>/u     # The trailing 'u' should make this regex work on UTF-8 input
		raise NoConfigTagError unless @template =~ config_tag
		return @template.gsub(config_tag, @config)
	end
end

class RabuError < StandardError
end

class NoConfigTagError < RabuError
	def to_s
		"Could not find <%= config %> tag in HTML template"
	end
end
