//add a trim method to the string object's prototype
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

var showable;

// event listener for incoming requested messages from global.js
safari.self.tab.dispatchMessage("getShowableValue", "showable");
safari.self.tab.dispatchMessage("getSettingValue", "blacklist");


// ask for value from global.js, since only it can interact with the Safari object directly
function getMessage(msgEvent) {
    if (msgEvent.name == "showableValueIs"){
        showable = msgEvent.message;
    }else if(msgEvent.name == "settingValueIs"){
        retrieved = msgEvent.message;
        storeBlacklist(retrieved);
    }
}

safari.self.addEventListener("message", getMessage, false);

function storeBlacklist(bl) {
    if ("user1,user2,user3" != bl) {
        // console.log("Writing user-defined blacklist values to local storage");
        // console.log("Values: " + bl);
        bl = bl.trim();
        //strip leading and trailing whitespace
        localStorage.clear();
        //clear all local storage, since we're currently only using one field
        try {
            localStorage.setItem("ignorelist", bl);
        } catch(e) {
            console.log("Couldn't write local storage item. I think this \
is a bug, and am proceeding with ignored-user comment removal anyway.");
            localStorage.clear();
            kill(bl);
            return;
        }

        kill(bl);
    } else
    // default values present: extension is in use for the first time, or post-update
    if (localStorage.getItem("ignorelist")) {
        //stored values exist, so use those, and restore them to the user prefs
        // console.log("Retrieving local storage blacklist values: ");
        kl = localStorage.getItem("ignorelist");
        kl = kl.trim();
        //strip leading and trailing whitespace
        // console.log("Retrieved values: " + kl + " … restoring your preferences");
        safari.self.tab.dispatchMessage("setSettingValue", "blacklist?" + kl);
        //using ? to delimit in order to avoid splitting the values
        kill(kl);
    } else
    //no stored values were found, and the default is in use, so alert the user
    alert("You haven't defined any users to ignore, please go to the HumHum \
User Ignore extension preferences,\
and add some (use lowercase for user names).");

}



function kill(users) {
    var allTables, thisTable, matchTable;
    var users_arr = users.split(",");
    for (i = 0; i < users_arr.length; i++) {
        //force the user input to lowercase
        users_arr[i] = users_arr[i].replace(" ","%2b").toLowerCase();
        // Allow for trailing commas
        if (users_arr[i] == "giant%2bhamburger" || "") {
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
    // console.log("Number of comments expunged: " + allTables.snapshotLength);
    for (var j = 0; j < allTables.snapshotLength; j++) {
        thisTable = allTables.snapshotItem(j);
        if(!showable){
            thisTable.parentNode.removeChild(thisTable);
            //not hidden, expunged. That's right.
        }else{
            // just hidden :(
            var trollPost = thisTable.firstChild.firstChild;
            trollPost.style.display = 'none';
            trollPost.style.border = "1px dotted #ccc";
            trollPost.id = "hidden_" + j;
            var temp = thisTable.insertRow(0);
            temp.setAttribute("data-target", "hidden_" + j);
            temp.style.width = "100%";
            temp.style.fontFamily = "sans-serif";
            temp.style.fontSize = "9px";
            temp.style.padding = "2px 6px";
            temp.style.margin = "1px 0px";
            temp.style.cursor = "pointer";
            temp.style.backgroundColor = "#eee";
            temp.innerHTML = '<td colspan="2" style="padding:2px 4px">trollpost</td>'; // soz

            temp.onclick = function(){
                var targ = document.getElementById(this.getAttribute('data-target'));
                if(targ.style.display == 'block'){
                    targ.style.display = 'none';
                }else{
                    targ.style.display = 'block';
                }
            }
        }
    }
}
