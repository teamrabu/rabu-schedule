# This spike demonstrates how to use ERB to concatenate a file.

require "erb"

data_here = "foo"
erb = ERB.new(DATA.read)
print erb.result

__END__
This is a sample template
Data goes here: [<%= data_here %>]
This is the end of the template
