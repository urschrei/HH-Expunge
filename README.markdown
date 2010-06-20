This is the source code for the **HumHum Ignore User** Safari 5 extension.

*Please note that you will require a Safari developer cert in order to build and install from source using the Safari Extension Builder, and that **it must be installed in Safari before you can proceed**.*

If you have not done so, you must first sign up to the developer program (free) [here](http://developer.apple.com/programs/start/safari/create.php, "Apple Developer link")

Then request a Safari extension certificate (free), [here](https://developer.apple.com/safari/certificates/index.action "Apple Developer link")

An introduction to Safari 5 extensions, and a comprehensive developer guide is [here](http://bit.ly/a80vlI "developer.apple.com link")

Before using these source files with the Safari Extension Builder, please be aware that they must be placed into a directory with a name ending in .safariextension, e.g.:

* meerkat.safariextension  **<--- Directory** 
1. — global.html
2. — global.js
3. — expunge.js
4. — Settings.plist
5. — Info.plist

# What this extension does #

It's quite simple, really: when a thread is loaded, the expunge.js script requests the contents of the "blacklist" user setting field from the global.js script, splits the result into an array, constructs an XPath query using the array elements, then builds an XPath snapshot whose nodes (made up of tables of the `threadTable` class) are removed (expunged), thus removing the users' (or user's, if you have chosen to ignore only one) comments from the thread. As of **v1.3**, the "blacklist" setting is written to local storage upon every page load, and retrieved/restored (by passing it back to the global.js script) when the extension is updated, so your settings will persist.

