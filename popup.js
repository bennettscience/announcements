// This runs all of the background work necessary to display information
// in the window.html file.

$(document).ready(function() {
  spreadsheetId = "";
// Display the current date
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear();
  $('#date').append('<h1>'+output+'</h1>');

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
      return false;
    } else {
      localStorage.setItem("last-updated", jsonTimestamp);
      console.log("The JSON time is: "+jsonTimestamp);
      console.log("The localStorage is: "+storedTimestamp);
      return true;
    }
  }

  // Link the spreadsheet to the extension
  function setup() {
    $('.setup').append('<form><input type="text" id="key">Paste your spreadsheet key here and click submit.</input><br /><input type="submit" id="sub"></input>');
    var value = $("#key");
    $("#sub").click(function() {
      var spreadsheetId = value.val();
    })
    return spreadsheetId;
  }

// Grab the JSON data and print into the popup as HTML
  function checkJsonFeed() {

    // If the spreadsheetId is empty, run setup.
    if(spreadsheetId = "") {
      setup();
    } else {
      var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetId + "/od6/public/values?alt=json";

      $.getJSON(url, function(data) {
        var entry = data.feed.entry;

        $(entry).each(function() {
          $('.data').append('<h2>'+this.gsx$title.$t+'</h2><p>'+this.gsx$text.$t+'</p>');
        });

        // If there has been an update in the jsonTimestamp, add a badge
        // to the browserAction icon
        if(isUpdated(data.feed.updated.$t)) {
          chrome.browserAction.setBadgeText({text: "NEW"});
        }
      });
    }
  }
  checkJsonFeed();

// Timer to check the JSON `updated` data.
  chrome.alarms.create("checkJsonFeed", {
    delayInMinutes: 1,
    periodInMinutes: 1
  });

  // Check the spreadsheet feed every minute looking for a change
  // in the update data.
  chrome.alarms.onAlarm.addListener(function(alarm) {
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
