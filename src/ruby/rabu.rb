require "erb"

class Rabu
	def initialize(html_template, config_json)
		@template = html_template
		@config = config_json
	end

	def html
		config_tag = /<%=\s*config\s*%>/
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
