//add a trim method to the string object's prototype
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};

//wait for messages from expunge.js
chrome.extension.onRequest.addListener("message", respondToMessage, false);

// getter and setter function for settings used by expunge.js
function respondToMessage(messageEvent) {
    if (messageEvent.name == "getSettingValue") {
        // getItem("foo");
        var value = chrome.extension.settings.getItem(messageEvent.message);
		value = value.trim();
        // return value of foo to chrome_script.js
        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendRequest(tab.id, {settingValueIs: value}, function(response) {
            console.log(response.farewell);
          });
        });
    }
    else if (messageEvent.name == "setSettingValue") {
	var tmp = messageEvent.message;
	tmp = tmp.trim();
	tmp = tmp.split('?'); //using ? as a delimiter
	chrome.extension.settings.setItem(tmp[0], tmp[1]);
    }
    else return; //unknown message, do nothing
}


