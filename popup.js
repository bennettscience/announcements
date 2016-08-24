// Send a message to update the feed
chrome.runtime.sendMessage({from: "popup", d: "update"}, function(response) {
	if(response.do == "updateFeed") {
		checkJsonFeed();
	}
});
	// Check for a document ID stored in the Chrome StorageArea
	chrome.storage.sync.get("d", function(items) {
		if(items.d === undefined) {
			var error = chrome.runtime.lastError;
			console.log(error)
			setup();
			$("#clear-ssId").hide();
		} else {
			console.log("The current key is: " + items.d);
			$("#setup").hide();
			$("#clear-ssId").show();
		}
	})

	// Clear the spreadsheet ID
	$("#clear-ssId").click(function() {
		// event.preventDefault();
		chrome.storage.sync.clear( function() { console.log("Key cleared"); setup() });
	})
    function checkJsonFeed() {
		chrome.storage.sync.get("d", function(items) {
			var ssId = items.d;
			var url = "https://spreadsheets.google.com/feeds/list/" + ssId + "/od6/public/values?alt=json";

			$.getJSON(url, function(data) {
				var entry = data.feed.entry;

				$(entry).each(function() {
					$('#data').append('<h2>'+this.gsx$title.$t+'</h2><p>'+this.gsx$text.$t+'</p><h2>Links</h2><a href="'+this.gsx$link1url.$t+'" target="blank">'+this.gsx$link1text.$t+'</a><br /><a href="'+this.gsx$link2url.$t+'" target="blank">'+this.gsx$link2text.$t+'</a><hr />');;
				});
			});
		})
    }

	// Link the spreadsheet to the extension
	function setup() {
		// var ssId = "";
		$("#set").click(function() {
			event.preventDefault();
			var ssId = $("#ssId").val();
			chrome.storage.sync.set({"d": ssId}, function() {
				console.log("Set in storage: "+ssId);
			});
		checkJsonFeed();
		});
	}

// Display the current date
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear();
  $('#date').append('<h1>'+output+'</h1>');

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
