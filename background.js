$(document).ready(function() {
	chrome.runtime.onMessage.addListener(function(msg,sender,response) {
		if((msg.from == "popup") && (msg.d == "update")) {
			console.log("received");
			response({do: "updateFeed"});
		}
	})
// This runs all of the background work necessary to display information
// in the popup.html file.

// Check the JSON update key in localstorage
  function isUpdated(jsonTimestamp) {
    var storedTimestamp = localStorage.getItem("last-updated");

    // If there is no timestamp in localstorage, store it.
    if (storedTimestamp == null) {
      localStorage.setItem("last-updated", jsonTimestamp);
      return false;
    }

    // If there is a stamp and it equals the last JSON stamp, stop.
    // If it's not the same, update the stamp.
    if (storedTimestamp == jsonTimestamp) {
		console.log("There's no new data, quitting.")
      return false;
    } else {
		console.log("New data! Restting the timestamp.")
      localStorage.setItem("last-updated", jsonTimestamp);
      console.log("The new localStorage time is: "+jsonTimestamp);
      return true;
    }
  }
	function checkJsonFeed() {
		console.log("Checking the JSON timestamp data...")
		chrome.storage.sync.get("d", function(items) {
			var ssId = items.d;
			var url = "https://spreadsheets.google.com/feeds/list/" + ssId + "/od6/public/values?alt=json";

			$.getJSON(url, function(data) {
				var entry = data.feed.entry;
				
				chrome.runtime.sendMessage({msg: "print"}, function() {
					console.log("Message sent")
				})
				// $(entry).each(function() {
					// $('#data').append('<h2>'+this.gsx$title.$t+'</h2><p>'+this.gsx$text.$t+'</p>');
				// });
				
				// If there has been an update in the jsonTimestamp, add a badge
				// to the browserAction icon
				if(isUpdated(data.feed.updated.$t)) {
					console.log("There's been an update. Setting the badge.");
					chrome.browserAction.setBadgeText({text: "NEW"});
				}
			});
		})        
    }

// Timer to check the JSON `updated` data.
  chrome.alarms.create("checkJsonFeed", {
    delayInMinutes: 1,
    periodInMinutes: 1
  });

  // Check the spreadsheet feed every minute looking for a change
  // in the update data.
    chrome.alarms.onAlarm.addListener(function(alarm) {
		console.log("Checking feed...")
		checkJsonFeed();
	});

  // Check the badge on a click - if there is text, remove the badge.
  function updateBadge() {
    chrome.browserAction.getBadgeText({}, function(result) {
      if(result === "NEW") {
        chrome.browserAction.setBadgeText({text: ""});
      }
    });
  };

  // Run the updateBadge script. Chrome forces events to be separated out
  // by callback functions for security purposes.
  chrome.browserAction.onClicked.addListener(updateBadge);
  updateBadge();

});