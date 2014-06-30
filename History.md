
0.3.0 / 2014-06-30
==================

* Added locals to options to properly render haml

0.2.0 / 2014-01-18
==================

 * Add option to specify global default layout path
 * Added a link to express 2.x ejs example. Closes #39.

0.1.1 / 2013-03-21
==================

  * Fixed issue with layouts in a subdirectory (#35 by rguerreiro)
  * Made tests run on windows (by rguerreiro)

0.1.0 / 2013-03-20
==================

  * Don't error out if we don't use a layout (#32 by tedkulp)
  * options.filename is set for renderers to make includes work in Jade (#31 by jep37)
  * Fixed bug with accessing locals within sub-partials (#27 by ecdeveloper)
  * Default to 127.0.0.1 for windows test support. (#25 by rguerreiro)
  * supporting windows paths with backslash (by rguerreiro)
  * Add partial as local to partials. (#22)
  * exporting lookup() in the module (#20 by rguerreiro)
  * Fixed partials within subdirs (#19 by ecdeveloper)
  * Equality typo. (#12)
  * Reorganized the tests into separate apps
  * Now using supertest and express 3.0

0.0.6 / 2012-09-10
==================

  * Added tests and fixes for layout path resolution. (thanks to Jakub Nešetřil @zzen)
  * Added Travis-CI.

0.0.5 / 2012-06-29
==================

  * Support Node v0.8.0 (or any node really).


0.0.4 / 2012-06-25
==================

  * Improved `partials.register()`. (thanks to Stéphane Alnet)


0.0.3 / 2012-06-25
==================

  * Added support for other template engines. (thanks to Stéphane Alnet)

0.0.2 / 2012-03-06
==================

  * Added some tests.
  * Added app locals as template locals.

0.0.1 / 2012-01-25
==================

  * Initial release
