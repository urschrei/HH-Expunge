# General #

This is the source code for the **HumHum Ignore User** Safari 5 and Google Chrome extensions. If you're just looking for the binaries in order to install and use them, go to the [downloads page](http://github.com/urschrei/HH-Expunge/downloads "Downloads").

*Please note that you will require a Safari Developer cert in order to build the extension from source using the Safari Extension Builder, and that **it must be installed in Safari before you can proceed**. This does not apply if you just want to install the extension (binary).*

As of **Safari extension v1.3**, the "blacklist" setting is written to local storage upon every page load, and retrieved/restored (by passing it back to the global.html page) when the extension is updated, so your settings will persist. In addition, various actions are written to the Javascript console.

**please add usernames in lowercase**

![black logo](http://dl.dropbox.com/u/21382/photos/hb.gif "black HH logo")

## Addendum ##

I'm pretty sure there's a bug in the current implementation of Safari 5's HTML5 local storage functionality. It's not a show-stopper – it's preventing the list of ignored users being written to offline storage after a certain number of writes – but it's sufficiently irritating for me to detail here. The error console is your friend, if you're wondering what's going on.








