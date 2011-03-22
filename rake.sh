#!/usr/bin/ruby

def red(text)
    return "\033[1;30;41m#{text}\033[0m";
end

def green(text)
    return "\033[1;30;42m#{text}\033[0m";
end

system "rake #{$*}"

if $?==0 then
    puts green("                                      ")
    puts green("                                      ")
    puts green("     ----- BUILD SUCCEEDED -----      ")
    puts green("                                      ")
    puts green("                                      ")
else
    puts red("                                      ")
    puts red("                                      ")
    puts red("      ----- BUILD FAILED -----        ")
    puts red("                                      ")
    puts red("                                      ")
end
