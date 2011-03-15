#!/usr/bin/ruby

# This code based on work placed into the public domain by Peter Cooper
# https://gist.github.com/113226


require 'find'

trap("INT") do
	puts
	exit
end

files = {}
loop do
    changed = false
    Find.find(File.dirname(__FILE__)) do |file|
        next if file == "."
        next if file.start_with? "./generated"
        next if file.start_with? "./.idea"
        next if file.start_with? "./.git"

        ctime = File.ctime(file).to_i

        if ctime != files[file]
            files[file] = ctime
            if not changed
                changed = true
                puts "Changed files:"
            end
            puts file
        end
    end

    if changed
		system "./rake.sh #{$*}"
    end

    sleep 1
end
