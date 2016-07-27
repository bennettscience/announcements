$(document).ready(function() {
  // Link the spreadsheet to the extension
  function setup() {
    var spreadsheetId = "";
    $("#setup").append('<form><input type="text" id="ssId" value="Enter key here" /><br /><input type="submit" value="set" id="set" />');
    $("#set").click(function() {
      event.preventDefault();
      var ssId = $("#ssId").val();
      chrome.storage.sync.set({"spreadsheetId": ssId}, function() {
        chrome.runtime.sendMessage({
          from:     'popup',
          subject:  'ssId'
        });
        console.log("Message posted with: "+ssId);
      });
    });
  }
  setup();
})
