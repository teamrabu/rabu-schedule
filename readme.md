Rabu Schedule 0.3-dev
=================

Rabu Schedule helps Agile software teams discuss their schedules with important stakeholders. For more information, see the [Team Rabu website](http://www.teamrabu.com).

This early release of Rabu Schedule is for people interested in getting their hands dirty. It has many limitations (details below) and very little documentation.


Downloading Rabu Schedule
-------------------------
The latest release of Rabu [may be downloaded here](http://www.teamrabu.com/rabu.zip). Unzip the release file into a directory of your choice.


Running Rabu Schedule
---------------------

Run Rabu Schedule from the command line, as follows. You must have [Java](http://www.java.com/) installed.

	java -jar rabu.jar < estimates.rabu > projection.html

To view the results, open `projection.html` in your web browser.

Rabu takes a JSON file containing a development team's estimates on STDIN and outputs an HTML file on STDOUT. Your JSON file must be encoded in UTF-8 (or plain ASCII). There is no documentation of the input file at this time, but you can work from `estimates.rabu` as an example. For another example, see `/src/html/_html_test.rabu`.


Limitations
-----------

This early version of Rabu Schedule has many limitations. Here are a few:

- *Subject to change.* Everything about Rabu Schedule is subject to change. In particular, the input file format is likely to change.

- *No command-line error checking.* If you give the command-line tool a bad JSON file, it doesn't warn you.

- *No run-time error handling.* When the Javascript in the HTML file encounters an error (such as a bad JSON file), it silently fails.

- *Limited cross-browser testing.* Rabu Schedule appears to work in Firefox, Safari, Chrome, and Internet Explorer 7+. However, it has only been thoroughly tested in Firefox 3.6.

Two apparent limitations are intentional:

- *Command-line interface.* Rabu Schedule is meant to integrate with a development team's workflow. In particular, it runs from the command line so it can be easily automated, and it uses a text-based configuration file to play nicely with version control.

- *Single-file output.* Rabu Schedule's HTML output is self-contained within a single file so you can easily open, email, or host the result.


Source Code
-----------

*Note:* The Rabu build has only been tested on Mac OS 10.6. In particular, although Rabu will run on Windows, the build doesn't work on Windows.

Rabu's source code is [available on GitHub](https://github.com/teamrabu/rabu-schedule). The files in the respository are arranged in the following structure:

- `released/`: Production release files
- `src/`: Production source code
- `lib/`: Files used at runtime
- `build/`: Files used at buildtime
- `generated/`: Files created by the automated build
- `gems/`: Locally-installed gems
- `spikes/`: Non-production experiments
- `copyrights/`: Legal stuff

To build Rabu Schedule from source, you need the following tools installed:

* Ruby
* RubyGems (typically comes with Ruby)
* Rake (`sudo gem install rake`)
* Java JDK
* Firefox

The build depends on some other Ruby gems, but it automatically downloads and installs them into the `gems` directory. They're isolated from the rest of your Ruby installation.

To build a release version of Rabu Schedule, use `rake release` from the command line. The results will be placed in the `released/` directory. Use `rake` on its own for ordinary development. `rake -T` will show you the most commonly-used targets, and `rake -P` will show all targets.

**Important:** After you're done building, be sure to run `rake shutdown` to stop the JsTestDriver server. If you use `./autorake.sh` (described below), breaking out of the script should automatically kill the server.

Two scripts make building more convenient:

- `./rake.sh` is a wrapper around rake that displays a big green or red bar for success and failure.
- `./autorake.sh` automatically runs `./rake.sh` whenever any files change.

Both tools pass their command-line parameters through to rake.


Submitting Patches
------------------

Patches are welcome. Before we can accept your code, we need a signed copyright assignment form. You can find the form in the `copyrights/` directory.
