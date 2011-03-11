#!/usr/bin/ruby

def red(text)
    return "\033[1;30;41m#{text}\033[0m";
end

def green(text)
    return "\033[1;30;42m#{text}\033[0m";
end

system "rake #{$*}"

if $?==0 then
    puts green("----- BUILD SUCCEEDED -----")
else
    puts red("----- BUILD FAILED -----")
end
