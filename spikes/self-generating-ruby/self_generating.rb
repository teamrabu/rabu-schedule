# This spike demonstrates how a Ruby script can generate a file based on data stored within the script.

File.open("deleteme.txt", "w") do |output|
	output.write DATA.read
end

__END__
line 1
line 2

