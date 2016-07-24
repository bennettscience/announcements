$(document).ready(function() {
// Display the current date
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear();
  $('#date').append('<h1>'+output+'</h1>');

// Check the JSON update key in localstorage
  function isUpdated(jsonTimestamp) {
    var storedTimestamp = localStorage.getItem("last-updated");
    if (storedTimestamp == null) {
      localStorage.setItem("last-updated", jsonTimestamp);
      return false;
    }

    if (storedTimestamp == jsonTimestamp) {
      return false;
    } else {
      localStorage.setItem("last-updated", jsonTimestamp);
      console.log("The JSON time is: "+jsonTimestamp);
      console.log("The localStorage is: "+storedTimestamp);
      return true;
    }
  }

// Grab the JSON data and print into the popup as HTML
  function checkJsonFeed() {
    var spreadsheetId = "10j8Ycax02XMkVWMK1v-aYJMHoOjQaLRFuZUOKZEY9nA";

    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetId + "/od6/public/values?alt=json";

    $.getJSON(url, function(data) {
      var entry = data.feed.entry;

      $(entry).each(function() {
        $('.data').append('<h2>'+this.gsx$title.$t+'</h2><p>'+this.gsx$text.$t+'</p>');
      });

      if(isUpdated(data.feed.updated.$t)) {
        chrome.browserAction.setBadgeText({text: "NEW"});
      }
    });
  }
  checkJsonFeed();

// Timer to check the JSON `updated` data.
  chrome.alarms.create("checkJsonFeed", {
    delayInMinutes: 1,
    periodInMinutes: 1
  });

  chrome.alarms.onAlarm.addListener(function(alarm) {
    checkJsonFeed();
  });

  function updateBadge() {
    chrome.browserAction.getBadgeText({}, function(result) {
      if(result === "NEW") {
        chrome.browserAction.setBadgeText({text: ""});
      }
    });
  };
  
  chrome.browserAction.onClicked.addListener(updateBadge);
  updateBadge();
});
