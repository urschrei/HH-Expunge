//add a trim method to the string object's prototype
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

chrome.extension.sendRequest({localstorage: "expunge_users"}, function(response) {
    console.log("Asking for list of users…");
    var retrieved = response.expunge_users;
    if (typeof(retrieved) != null) {
    console.log("Got list from local storage. Expunging posts from the following users: " + retrieved);
    kill(retrieved);
}
else console.log("No users stored, so doing nothing.");
});


function kill(users) {
    var allTables, thisTable, matchTable;
    var users_arr = users.split(",");
    for (i = 0; i < users_arr.length; i++) {
        //force the user input to lowercase
        users_arr[i] = users_arr[i].replace(" ","%2b").toLowerCase();
        if (users_arr[i] == "giant%2bhamburger") {
            //you must be joking
            users_arr.splice(i,1);
        }
    }
    // to-do: strip leading and trailing whitespace
    var cleanList = "'/profile/" + users_arr.join(
        ".html' or translate(@href,\
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',\
        'abcdefghijklmnopqrstuvwxyz')='/profile/"
            )
    + ".html'";
    matchTable = "//div[@id='authorHoldAuthor']/a[translate(\
        @href,'ABCDEFGHIJKLMNOPQRSTUVWXYZ',\
        'abcdefghijklmnopqrstuvwxyz')=\
        " + cleanList + "]/ancestor::table[@class='threadTable']";
    allTables = document.evaluate(
        matchTable,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    console.log("Number of comments expunged: " + allTables.snapshotLength);
    if (allTables.snapshotLength > 0) {
        chrome.extension.sendRequest({hit: true});
    }
    for (var j = 0; j < allTables.snapshotLength; j++) {
        thisTable = allTables.snapshotItem(j);
        thisTable.parentNode.removeChild(thisTable);
        //not hidden, expunged. That's right.
    }
}
