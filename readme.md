Rabu Schedule 0.1.4.dev
===================

Rabu Schedule is a tool for collaborative product scheduling with the goal of creating exemplary customer relationships. For more information, see the following essays:

* [Announcing Rabu: Your Customers Should Love You](http://jamesshore.com/Blog/Announcing-Rabu.html)
* [Rabu Workflow: How Do We Get Customers To Participate?](http://jamesshore.com/Blog/Rabu/Rabu-Workflow.html)
* [How Rabu's Schedule Projections Work](http://jamesshore.com/Blog/Rabu/How-Rabus-Schedule-Projections-Work.html)

This early release of Rabu Schedule is for people interested in getting their hands dirty. It has many limitations and very little documentation.


Finding your way around
-----------------------

The files in this repository are arranged in the following structure:

- `released`: The most recent release files
- `src`: Production source code
- `lib`: Files used at runtime
- `build`: Files used at buildtime
- `generated`: Files created by the automated build
- `gems`: Locally-installed gems
- `spikes`: Non-production experiments
- `copyrights`: Legal stuff


Running Rabu Schedule
---------------------

Switch to the `released` directory and run Rabu Schedule from the command line, as follows:

	ruby rabu-sched.rb < estimates.rabu > projection.html

You'll need Ruby installed.

Rabu Schedule takes a JSON file containing estimates on STDIN and outputs a self-contained HTML file containing projections on STDOUT. Load the HTML file in Firefox to see the projections. There is no documentation of the input file at this time, but you can find another example in `/src/html/_html_test.rabu`.


Building Rabu Schedule
----------------------

Rabu Schedule's build depends on [Rake](http://rake.rubyforge.org/). Assuming you have Ruby installed, you should be able to install it with `gem install rake` (`sudo gem install rake` on Mac OS X). The build automatically downloads and installs its other dependencies into the `gems` directory the first time you build.
	
To build a release version of Rabu Schedule, use `rake release` from the command line. The results will be placed in `generated\release`. Use `rake` on its own to run the tests. `rake -T` will show you the most commonly-used targets, and `rake -P` will show all targets.

**Important:** After you're done building, be sure to run `rake shutdown` to stop the JsTestDriver server. If you use `./autorake.sh` (described below), breaking out of the script should automatically kill the server.

Two scripts make building more convenient:

- `./rake.sh` is a wrapper around rake that displays a big green or red bar for success and failure.
- `./autorake.sh` automatically runs `./rake.sh` whenever any files change.

Both tools pass their command-line parameters through to rake.

The build has only been tested on Mac OS 10.6, so you may run into problems on other machines.


Submitting Patches
------------------

Patches are welcome. Before we can accept your code, we need a signed copyright assignment form. You can find the form in the `copyrights` directory.

It's probably best to avoid working on the command-line Ruby tool (found in `src/ruby`) because we're strongly considering switching to Java instead. (We're considering switching because of the possibility of sharing Javascript libraries using Rhino, the deployment convenience of .JAR files, and its large installed base.)


Limitations
-----------

This early version of Rabu Schedule has many limitations. Here are a few:

- Subject to change. Everything about Rabu Schedule is subject to change. In particular, the input file format is certain to change, and we may switch to a different language for the command-line script.

- No command-line error checking. If you give Rabu Schedule a bad JSON file, it doesn't warn you.

- No run-time error handling. When the Javascript in the HTML file encounters an error (such as a bad JSON file), it silently fails.

- Only tested on Firefox 3.5. Rabu Schedule has only been tested on Firefox 3.5 so far.

- Not-so-powerful visuals. The [Rabu Vision](http://jamesshore.com/Blog/Announcing-Rabu.html) describes a tool that produces "powerful visuals." We're not there yet.

- No interactivity. The [Rabu Workflow](http://jamesshore.com/Blog/Rabu/Rabu-Workflow.html) describes creating a proposal that facilitates discussion. We're not there yet, either.

- No command-line parameters. The command-line interface is primitive, even for a CLI.

Two apparent limitations are intentional:

- Command-line interface. Rabu tools are meant to be a seamless part of a development team's workflow, so Rabu Schedule is designed to work with developers' tools. In particular, it runs from the command line so it can be easily automated, and it uses a text-based configuration file so that it plays nicely with version control.

- Self-contained output. Rabu Schedule's HTML output is completely self-contained, which allows it to be easily hosted on a webserver, emailed to stakeholders, or just opened from the file system.


Enjoy!
------

Rabu's limitations are your opportunity to contribute! Get your feet wet, poke around, and let us know what you think.