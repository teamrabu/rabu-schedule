Rabu: A tool for collaborative product scheduling
=================================================

Rabu is a tool for collaborative product scheduling. For more information, see the following essays:

* [Announcing Rabu: Your Customers Should Love You](http://jamesshore.com/Blog/Announcing-Rabu.html)
* [Rabu Workflow: How Do We Get Customers To Participate?](http://jamesshore.com/Blog/Rabu/Rabu-Workflow.html)
* [How Rabu's Schedule Projections Work](http://jamesshore.com/Blog/Rabu/How-Rabus-Schedule-Projections-Work.html)

This is an early release of Rabu for people interested in getting their hands dirty. As such, it has many limitations and very little documentation.


Finding your way around
-----------------------

The files in this repository are arranged in the following structure:

- src: Production source code
- lib: Files used at runtime
- build: Files used at buildtime
- generated: Files created by the automated build
- spikes: Non-production experiments


Building Rabu
-------------

Rabu uses [Rake](http://rake.rubyforge.org/) as its build tool. To build a release version of Rabu (such as it is), use `rake release` from the command line. The results will be placed in `generated\release`. Use `rake` on its own to run the tests. `rake -T` will show you the most commonly-used targets, and `rake -P` will show all targets.

Two scripts make building more convenient:

- `./rake.sh` is a wrapper around rake that displays a big green or red bar for success and failure.
- `./autorake.sh` automatically runs `./rake.sh` whenever any files change.

The build has only been tested on Mac OS 10.6, so you may run into problems on other machines. There are also dependencies on various Ruby gems that I haven't yet documented. (Patches welcome.)


Running Rabu
------------

After you build Rabu (using `rake release` as described above), run it from the command line. It takes a JSON file containing estimates on STDIN and outputs a stand-alone HTML file containing projections on STDOUT. Load the HTML file in Firefox to see the projections.

There is no documentation of the input file at this time, but you can find an example input file in `/src/html/_html_test.rabu`.

This is a very early version of Rabu and it has many limitations. Two apparent limitations are intentional:

- Primitive UI. Rabu is meant to be a seamless part of a development team's workflow, so it's designed to work with developers' tools. In particular, Rabu runs from the command line so it can be easily automated, and it uses a text-based configuration file so that it plays nicely with version control.

- Self-contained output. The HTML file Rabu produces is completely self-contained, which allows it to be easily hosted on a webserver, emailed to stakeholders, or simply loaded on a development workstation.


Limitations
-----------

This early version of Rabu has many limitations. Here's a few:

- Subject to change. Everything about Rabu is subject to change. In particular, the .rabu file format is certain to change, and we may switch to a different language for the Rabu command-line script.

- No input error checking. If you give Rabu a bad JSON file, the resulting HTML file won't work.

- No Javascript error handling. When the HTML file encounters an error, it silently fails.

- Only tested on Firefox 3.5. Rabu has only been tested on Firefox 3.5 so far.

- Not-so-powerful visuals. The [Rabu Vision](http://jamesshore.com/Blog/Announcing-Rabu.html) describes a tool that produces "powerful visuals." We're not there yet.

- No interactivity. The [Rabu Workflow](http://jamesshore.com/Blog/Rabu/Rabu-Workflow.html) describes creating a proposal that facilitates discussion. We're not there yet, either.

- No command-line options. The command-line interface is primitive, even for the command line.


Enjoy!
------

Rabu's limitations are your opportunity to contribute! Get your feet wet, poke around, and let us know what you think. Patches welcome!