//add a trim method to the string object's prototype
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

safari.self.addEventListener("message", getMessage, false);
// event listener for incoming requested messages from global.js
safari.self.tab.dispatchMessage("getSettingValue", "blacklist");
// ask for value from global.js, since only it can interact with the Safari object directly
function getMessage(msgEvent) {

    if (msgEvent.name == "settingValueIs")
    retrieved = msgEvent.message;
    storeBlacklist(retrieved);
}

function storeBlacklist(bl) {
    if ("user1,user2,user3" != bl) {
        console.log("Writing user-defined blacklist values to local storage");
        console.log("Values: " + bl);
        bl = bl.trim();
        //strip leading and trailing whitespace
        try {
            localStorage.clear();
        } catch(e) {
            console.log("Couldn't remove local storage item. Argh.");
            return null;
        }
        try {
            localStorage.setItem("blacklist", bl);
        } catch(e) {
            //if (e == "QUOTA_EXCEEDED_ERR") {
            console.log("Caught local storage error … clearing it out and trying again");
            localStorage.clear();
            // clear all HH local storage
            return null;
            //localStorage.setItem("blacklist", bl);
            //}
        }

        kill(bl);
    }
    else
    // default values present: extension is in use for the first time, or post-update
    if (localStorage.getItem("blacklist")) {
        //stored values exist, so use those instead, and restore them to the user preferences
        console.log("Retrieving local storage blacklist values: ");
        kl = localStorage.getItem("blacklist");
        kl = kl.trim();
        //strip leading and trailing whitespace
        console.log("Retrieved values: " + kl + " … restoring your preferences");
        safari.self.tab.dispatchMessage("setSettingValue", "blacklist?" + kl);
        //using ? to delimit in order to avoid splitting the values
        kill(kl);
    }
    else
    //no stored values were found, and the default is in use, so alert the user
    alert("You haven't defined any users to ignore, please go to the HumHum User Ignore extension preferences, and add some.");

}


function kill(users) {
    var allTables,
    thisTable,
    matchTable;
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

// I have no idea what this function is doing in production code, since it doesn't work yet
// due to querySelectorAll difficulties. Mainly to give you an idea of what's going on, I suppose.
function newkill(users) {
    var users_arr = users.split(",");
    var goners = document.querySelectorAll("table.threadTable a[href='/profile/" + users_arr.join(".html'], table.threadTable a[href='/profile/") + ".html']");
    console.log("HH_expunge: Number of comments matched for expunging = " + goners.length);
    for (var i = 0; i < goners.length; ++i) {
        var item = goners[i];
        console.log(item.outerHTML);
        //for experimental purposes only
        item.parentNode.removeChild(item);
    }
}
