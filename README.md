# announcements
Chrome extension to display JSON data from a Google Spreadsheet

The JS does all the magic with the spreadsheet JSON data and the HTML displays it nicely in the Chrome browser. The JS will also ping the spreadsheet every few minutes to see if there have been updates. If there was an update made, a badge notification will appear on the extension icon. Sweet.

# Installation
To load an extension locally:

1. Clone or download a zip of the repo. Unzip the directory.
2. Open `chrome:extensions` and make sure Developer Mode is checked.
3. Click on "Load unpacked extension" and select the unzipped directory.

# Link to a spreadsheet
Google spreadsheets publish in multiple formats when you publish one to the web (this is different than **sharing**). One of those formats is JSON.

[Grab this template spreadsheet](https://docs.google.com/spreadsheets/d/10j8Ycax02XMkVWMK1v-aYJMHoOjQaLRFuZUOKZEY9nA/copy) and save it to your Drive. Then, go to File > Publish to the web and publish it with all the default settings.

The extension needs one more thing: *the spreadsheet key*. Go back to the template spreadsheet and grab the jumble of letters and numbers that come after `https://docs.google.com/spreadsheets/d/` and before `edit#gid=0` in the URL. When you click on the extension icon the first time, you'll be prompted to copy and paste that spreadsheet key into the box.

# License
This is provided AS IS under an MIT Open License.
