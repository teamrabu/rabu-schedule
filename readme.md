Rabu Schedule 0.2.dev
=================

Rabu Schedule creates a visual aid for collaborative product scheduling. For more information, see the [Team Rabu website](http://www.teamrabu.com).

This early release of Rabu Schedule is for people interested in getting their hands dirty. It has many limitations (details below) and very little documentation.


Finding your way around
-----------------------

The files in this repository are arranged in the following structure:

- `released/`: Production release files
- `src/`: Production source code
- `lib/`: Files used at runtime
- `build/`: Files used at buildtime
- `generated/`: Files created by the automated build
- `gems/`: Locally-installed gems
- `spikes/`: Non-production experiments
- `copyrights/`: Legal stuff


Running Rabu Schedule
---------------------

Switch to the `released` directory and run Rabu Schedule from the command line, as follows:

	ruby rabu-sched.rb < estimates.rabu > projection.html

To view the results, open `projection.html` in Firefox. (**Important:** Firefox 3.6 is the only browser we've tested thoroughly. Firefox 4, Safari, Chrome, and IE 9 appear to work. Rabu Schedule *does not* work in Internet Explorer 7 or 8--yet.)

You'll need Ruby installed to run Rabu Schedule. Windows users may find an installer at [RubyInstaller](http://rubyinstaller.org/downloads/). 

Rabu Schedule takes a JSON file containing a development team's estimates on STDIN and outputs a nicely-formatted HTML file on STDOUT. There is no documentation of the input file at this time, but you can work from `estimates.rabu` as an example. For another example, see `/src/html/_html_test.rabu`.


Limitations
-----------

This early version of Rabu Schedule has many limitations. Here are a few:

- *Subject to change.* Everything about Rabu Schedule is subject to change. In particular, the input file format is likely to change, and we may switch to a different language for the command-line script.

- *No command-line error checking.* If you give the command-line tool a bad JSON file, it doesn't warn you.

- *No run-time error handling.* When the Javascript in the HTML file encounters an error (such as a bad JSON file), it silently fails.

- *No command-line parameters.* The command-line interface is primitive, even for a CLI.

- *Only tested on Firefox 3.6.* Rabu Schedule works in Firefox and will probably work in Safari and Chrome. Internet Explorer is a crap shoot, as usual.

Two apparent limitations are intentional:

- *Command-line interface.* Rabu Schedule is meant to integrate with a development team's workflow. In particular, it runs from the command line so it can be easily automated, and it uses a text-based configuration file to play nicely with version control.

- *Single-file output.* Rabu Schedule's HTML output is self-contained within a single file so you can easily open, email, or host the result.


Building Rabu Schedule
----------------------

*Note:* Although Rabu Schedule runs on Windows, the build doesn't work on Windows yet. (The "RedCarpet" gem won't install.)

To build Rabu Schedule, you need the following tools installed:

* Ruby
* RubyGems (typically comes with Ruby)
* Rake (`sudo gem install rake`)
* Java
* Firefox

The build depends on some other Ruby gems, but it automatically downloads and installs them into the `gems` directory. They're isolated from the rest of your Ruby installation.

To build a release version of Rabu Schedule, use `rake release` from the command line. The results will be placed in the `released/` directory. Use `rake` on its own for ordinary development. `rake -T` will show you the most commonly-used targets, and `rake -P` will show all targets.

**Important:** After you're done building, be sure to run `rake shutdown` to stop the JsTestDriver server. If you use `./autorake.sh` (described below), breaking out of the script should automatically kill the server.

Two scripts make building more convenient:

- `./rake.sh` is a wrapper around rake that displays a big green or red bar for success and failure.
- `./autorake.sh` automatically runs `./rake.sh` whenever any files change.

Both tools pass their command-line parameters through to rake.

The build has only been tested on Mac OS 10.6, so you may run into problems on other machines.


Submitting Patches
------------------

Patches are welcome. Before we can accept your code, we need a signed copyright assignment form. You can find the form in the `copyrights/` directory.

It's probably best to avoid working on the command-line Ruby tool (found in `src/cli/`) because we're strongly considering switching to Java instead. (We're considering switching because of the possibility of sharing Javascript libraries using Rhino, the deployment convenience of .JAR files, and its large installed base.)


Enjoy!
------

Rabu's limitations are your opportunity to contribute! Get your feet wet, poke around, and let us know what you think.