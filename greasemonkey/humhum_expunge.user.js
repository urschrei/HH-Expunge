// ==UserScript==
// @name HumHum_expunge 1.3
// @namespace http://github.com/urschrei/HH-expunge
// @description Remove all posts by a specific user, using XPath evaluation to remove the containing table
// @include http://humhum.be/*/*.html*
// ==/UserScript==
var allTables, thisTable, thisLink, matchTable;
var user="";
//=========================================================================
//== add new users to be ignored here =====================================
//=========================================================================
var users = ['cornboy', 'noseworthy', 'hotspanners'];
//=========================================================================
var cleanList = "'/profile/" + users.join(".html' or @href='/profile/") + ".html'";
// now grab the parent table for each instance of each matched user
matchTable = "//div[@id='authorHoldAuthor']/a[@href=" + cleanList + "]/ancestor::table[@class='threadTable']";
allTables = document.evaluate(matchTable, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var j = 0; j < allTables.snapshotLength; j++) {
	thisTable = allTables.snapshotItem(j);
	thisTable.parentNode.removeChild(thisTable); //not hidden, expunged. That's right.
}