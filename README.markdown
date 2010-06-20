# General #

This is the source code for the **HumHum Ignore User** Safari 5 extension.  If you're just looking for the binary in order to install and use it, please go to the [downloads page](http://github.com/urschrei/HH-Expunge/downloads "Downloads").

*Please note that you will require a Safari Developer cert in order to build the extension from source using the Safari Extension Builder, and that **it must be installed in Safari before you can proceed**. This does not apply if you just want to install the extension (binary).*

In order to obtain a cert, you must:

1. sign up to the developer program (free), [here](http://developer.apple.com/programs/start/safari/create.php "Apple Developer link")
2. request a Safari extension certificate (free), [here](https://developer.apple.com/safari/certificates/index.action "Apple Developer link")
3. install the cert using Keychain Assistant, by following the instructions above

An introduction to Safari 5 extensions, and a comprehensive developer guide is [here](http://developer.apple.com/safari/library/documentation/Tools/Conceptual/SafariExtensionGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40009977-CH1-SW1 "developer.apple.com link")

Before using these source files with the Safari Extension Builder, please be aware that they must be placed into a directory with a name ending in .safariextension, e.g.:

* meerkat.safariextension  **⬅ Directory** 
1. — `global.html`
2. — `global.js`
3. — `expunge.js`
4. — `Settings.plist`
5. — `Info.plist`

An explanation of the extension "parts list" and architecture can be found [here](http://developer.apple.com/safari/library/documentation/Tools/Conceptual/SafariExtensionGuide/ExtensionsOverview/ExtensionsOverview.html#//apple_ref/doc/uid/TP40009977-CH15-SW3 "Apple Developer Link")  
The `update.plist` file is an update manifest which triggers Safari's Extension Update mechanism. Details pertaining to its use can be found in the [developer documentation](http://developer.apple.com/safari/library/documentation/Tools/Conceptual/SafariExtensionGuide/UpdatingExtensions/UpdatingExtensions.html#//apple_ref/doc/uid/TP40009977-CH12-SW1 "Apple Developer Doc")

# What this extension does #

When a thread is loaded, the `expunge.js` script requests the contents of the "blacklist" user setting field by passing a message to the `global.js` script (loaded by `global.html`), splits the result into an array, constructs an XPath query using the array elements, then builds an XPath snapshot whose nodes (made up of tables of the `threadTable` class) are removed (expunged), thus removing the users' (or user's, if you have chosen to ignore only one) comments from the thread.  
As of **v1.3**, the "blacklist" setting is written to local storage upon every page load, and retrieved/restored (by passing it back to the `global.js` script) when the extension is updated, so your settings will persist. In addition, various actions are written to the Javascript console.

![black logo](http://dl.dropbox.com/u/21382/photos/hb.gif "black HH logo")

