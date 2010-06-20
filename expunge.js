safari.self.tab.dispatchMessage("getSettingValue", "blacklist");
// ask for value
safari.self.addEventListener("message", getMessage, false);
// wait for reply
function getMessage(msgEvent) {

	if (msgEvent.name == "settingValueIs") 
	retrieved = msgEvent.message;
	storeBlacklist(retrieved);
}

function storeBlacklist(bl) {
	if ("user1,user2,user3" != bl) {
		console.log("Writing user-defined blacklist values to local storage");
		console.log("Values: " + bl);
	localStorage.setItem("blacklist",bl); //store the new item
	kill(bl);
}
	else if (localStorage.getItem("blacklist")) { //stored item exists, so use it instead
	console.log("Retrieving local storage blacklist values: ");
	kl = localStorage.getItem("blacklist");
	console.log("Retrieved values: " + kl + " … restoring your preferences");
	// This is lazy, cos there's no error handling
	safari.self.tab.dispatchMessage("setSettingValue", "blacklist?" + kl); //using ? to delimit in order to avoid splitting the values
	kill(kl);
}
	else 
	console.log("Default values in use, and no local storage detected … exiting");
	return; //no value exists, and the default is in use, so do nothing
}


function kill(users) {
	var allTables, thisTable, matchTable;
	var users_arr = users.split(",");
	// to-do: strip leading and trailing whitespace
	var cleanList = "'/profile/" + users_arr.join(".html' or @href='/profile/") + ".html'";
	matchTable = "//div[@id='authorHoldAuthor']/a[@href=" + cleanList + "]/ancestor::table[@class='threadTable']";
	allTables = document.evaluate(matchTable, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	console.log("Number of comments expunged: " + allTables.snapshotLength);
	for (var j = 0; j < allTables.snapshotLength; j++) {
		thisTable = allTables.snapshotItem(j);
		thisTable.parentNode.removeChild(thisTable);
		//not hidden, expunged. That's right.
	}
}


function newkill(users) {
	var users_arr = users.split(",");
	var goners = document.querySelectorAll("table.threadTable a[href='/profile/" + users_arr.join(".html'], table.threadTable a[href='/profile/") + ".html']");
	console.log("HH_expunge: Number of comments matched for expunging = " + goners.length);
	for (var i = 0; i < goners.length; ++i) {
		var item = goners[i];
		console.log(item.outerHTML); //for experimental purposes only
		item.parentNode.removeChild(item);
	}
}
