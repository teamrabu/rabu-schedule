class Rabu
	def initialize(html_template)
		@template = html_template
	end

	def generate_html
		return @template.chomp
	end
end
