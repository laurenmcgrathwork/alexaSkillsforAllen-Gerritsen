var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var util = require('util');
var momentTz = require('moment-timezone');
var moment = require('moment');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//     process.env.USERPROFILE) + '/.credentials/';
var TOKEN_DIR = ".credentials/";
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

module.exports = {
    init: function(personName, externalCallback) {
        // Load client secrets from a local file.
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            // Authorize a client with the loaded credentials, then call the
            // Google Calendar API.
            authorize(JSON.parse(content), personName, checkSchedule, externalCallback);
        });
    }
};
module.exports.init("Jon Heller", announcePerson);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, personName, callback, externalCallback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, personName, externalCallback);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

function checkSchedule(auth, personName, externalCallback) {
    var responseString = " is currently available"; // assume they're free
    var d = new Date();
    var e = new Date();
    e.setMinutes(e.getMinutes() + 300);
    var n = d.toISOString();
    var m = e.toISOString();

    var personEmail = getEmailFromName(personName);
    var calendar = google.calendar('v3');
    calendar.freebusy.query({
        auth: auth,
        resource: {
            timeMin: n,
            timeMax: m,
            items: [{
                "id": personEmail
            }]
        }
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        var calendarStatuses = response.calendars;
        console.log(util.inspect(calendarStatuses[Object.keys(calendarStatuses)[0]]["busy"], false, null));
        if (calendarStatuses[Object.keys(calendarStatuses)[0]]["busy"].length!=0) {
            var startTime = calendarStatuses[Object.keys(calendarStatuses)[0]]["busy"][0]["start"];
            var endTime = calendarStatuses[Object.keys(calendarStatuses)[0]]["busy"][0]["end"];
            // If they have some meeting listed
            if (startTime) {
                var now = moment();
                var meetingStart = moment(startTime);
                var meetingEnd = moment(endTime);
                // Check if they're currently in this meeting
                if (now.isBetween(meetingStart, meetingEnd)) {
                    meetingEnd = meetingEnd.tz('America/New_York').format('h:mm');
                    responseString = " is in a meeting until " + meetingEnd;
                }
            }
        }

        externalCallback(responseString);
    });
}

function getEmailFromName(personName) {
    var names = personName.split(' ');
    var firstLetter = names[0].charAt(0);
    var lastName = names[1];
    var personEmail = firstLetter + lastName + "@a-g.com";
    return personEmail;
}

function announcePerson(personInfo) {
    console.log(personInfo);
}