Rabu Schedule 0.4.1+dev
=================

Rabu Schedule helps Agile software teams discuss their schedules with important stakeholders. For more information, see the [Team Rabu website](http://www.teamrabu.com).


Downloading Rabu Schedule
-------------------------
The latest release of Rabu [may be downloaded here](http://www.teamrabu.com/rabu.zip). Unzip the release file into a directory of your choice.


Running Rabu Schedule
---------------------

Run Rabu Schedule from the command line, as follows. You must have [Java](http://www.java.com/) installed.

	java -jar rabu.jar < estimates.rabu > projection.html

To view the results, open `projection.html` in your web browser.


The Input File Format
---------------------

Rabu takes a JSON file containing a development team's estimates on STDIN and outputs an HTML file containing projections to STDOUT. The input file must be encoded in UTF-8 and the output file will also be encoded in UTF-8. (If you aren't familiar with file encodings, just use plain ASCII, which is a subset of UTF-8.)

There's no error-checking on the input file format at this time, so if Rabu Schedule doesn't seem to work, look for errors in your input file. In particular, look for missing or excess commas, as that's a common error when you cut-and-paste lines in JSON.

The input file uses the following elements. See the `estimates.rabu` file included with the distribution for an example.

	{
		"name": "Hello World",
		
The name of your project.
		
		"updated": "22 Jun 2011",
		
The date that you last updated the information in this file.

		"iterations": [
			
A list of all of the iterations to date for this release. Put your current iteration *first*.

			{
				
Each iteration gets an object of its own. 

				"started": "19 Jun 2011",
			
The date that the iteration started.

				"length": 7,
			
The length of the iteration in calendar days. (In this example, the iteration is one week long.) Note that the value is a number, not a string.

				"velocity": 12,
			
The velocity of the iteration. For your current iteration, use your *estimated* velocity. For completed iterations, use your actual *measured* velocity.

				"riskMultipliers": [1, 2, 4],

Risk multipliers describe how much schedule risk you have, which determines how much spread there is in your schedule projections. They're described in detail [here](http://jamesshore.com/Blog/Rabu/How-Rabus-Schedule-Projections-Work.html). The easiest approach is to use the following rule of thumb:

*Rigorous projects:* If your team achieves the same velocity every iteration, gets everything "done done," and you fix all your bugs each iteration, then you probably don't have much schedule risk. Use [1, 1.4, 1.8] for your risk multipliers.

*Risky projects:* If you don't meet the "rigorous project" criteria, you're more likely to have a lot of schedule risk. Use [1, 2, 4] for your risk multipliers.

			    "included": [

This is a list of all the features that will be included in your schedule projection--typically, the features you intend to ship in your next release.

Rather than listing out every story in your backlog, combine groups of stories into "features" that your stakeholders are interested in. You should only have about five features; if you have too many, you're likely to overwhelm your stakeholders with more detail than they care about, which will make discussing tradeoffs difficult.

					["Feature A", 0],
					["Feature B", 10],
					["Feature C", 8],
					(etc)
				
Each feature has a name (such as "Feature A" in the example above) and an estimate of the work *remaining*. This estimate is the sum of all the remaining stories for the feature. An estimate of zero means the feature is done.

Note that the story estimates are numbers, not strings.

				],
				"excluded": [
					["Feature D", 2],
					["Feature E", 16],
					(etc)
				]
			
You may also list features that are *not* included in your schedule projection in the "excluded" section. Use this to list features that your stakeholders are interested in, but that you have decided not to ship at this time. This helps define the boundaries of your work and creates the opportunity for trade-off discussions with your stakeholders.

The "excluded" section is optional.

			},
		
That's everything you need to describe an iteration.

			{
				"started", "12 Jun 2011",
				"length", 7,
				(etc)
			},
			{
				"started", "5 Jun 2011",
				"length", 7,
				(etc)
			},
			(etc)

After the current iteration, you may list each previous iteration from most recent to least recent. These historical iterations are optional. If present, they'll show up in the Rabu burn-up chart. We recommend erasing the history at the beginning of each release cycle so that the burn-up chart shows your progress towards your current release.

		]
	}

That brings us to the end of the file.

The Rabu input file is easiest to maintain if you update it once at the beginning of each iteration. Start by updating the velocity of the top-most iteration (the iteration you just completed) to your actual measured velocity, then copy-and-paste the entire iteration block to the top. This new iteration block is for the iteration you are starting. Update the "started" element accordingly and update the feature estimates to account for the stories you've completed as well as any other changes to the backlog. With practice, this should only take a few minutes.
	

Limitations
-----------

This early version of Rabu Schedule has some limitations:

- *Subject to change.* Everything about Rabu Schedule is subject to change. In particular, the input file format is likely to change.

- *No command-line error checking.* If you give the command-line tool a bad JSON file, it doesn't warn you.

- *No run-time error handling.* When the Javascript in the HTML file encounters an error (such as a bad JSON file), it silently fails.

- *Limited cross-browser testing.* Rabu Schedule appears to work in Firefox, Safari, Chrome, and Internet Explorer 7+. However, it has only been thoroughly tested in Firefox.

Two apparent limitations are intentional:

- *Command-line interface.* Rabu Schedule is meant to integrate with a development team's workflow. In particular, it runs from the command line so it can be easily automated, and it uses a text-based configuration file to play nicely with version control.

- *Single-file output.* Rabu Schedule's HTML output is self-contained within a single file so you can easily open, email, or host the result.


Source Code
-----------

*Note:* The Rabu build has only been tested on Mac OS 10.6. In particular, although Rabu runs on Windows, the build doesn't work on Windows.

Rabu's source code is [available on GitHub](https://github.com/teamrabu/rabu-schedule). The files in the repository are arranged in the following structure:

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

The build automatically downloads and installs its Ruby dependencies them into the `gems` directory. They're isolated from the rest of your Ruby installation.

To build a release version of Rabu Schedule, use `rake release minify=true` from the command line. The results will be placed in the `released/` directory. Use `rake` on its own for ordinary development. `rake -T` will show you the most commonly-used targets, and `rake -P` will show all targets. Minification is disabled by default, which speeds up the build; use the `minify=true` switch to enable it.

**Important:** After you're done building, be sure to run `rake shutdown` to stop the JsTestDriver server. If you use `./autorake.sh` (described below), breaking out of the script should automatically kill the server.

Two scripts make building more convenient:

- `./rake.sh` is a wrapper around rake that displays a big green or red bar for success and failure.
- `./autorake.sh` automatically runs `./rake.sh` whenever any files change.

Both tools pass their command-line parameters through to rake.


Submitting Patches
------------------

Patches are welcome. Before we can accept your code, we need a signed copyright assignment form. You can find the form in the `copyrights/` directory.
