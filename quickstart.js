var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
// var index = require("./index");
// var http = require('http'),
//     alexaUS_CityUtil = require('./alexaUS_CityUtil');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//     process.env.USERPROFILE) + '/.credentials/';
var TOKEN_DIR = ".credentials/";
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

var roomNamesIds = {
    //Boston
        //Attic,Cafe,Conservatory,Den,Doghouase,Garage,Lounge,Parlor,Playroom,Porch,Shed,Study,Theater
    "a-g.com_61747469632e726f6f6d@resource.calendar.google.com": "Attic",
    //"a-g.com_636166652e726f6f6d@resource.calendar.google.com" : "Boston Cafe",
    "a-g.com_636f6e7365727661746f72792e726f6f6d@resource.calendar.google.com": "Conservatory",
    "a-g.com_64656e2e726f6f6d@resource.calendar.google.com": "Den",
    "a-g.com_646f67686f7573652e726f6f6d@resource.calendar.google.com": "Dog House",
    "a-g.com_6761726167652e726f6f6d@resource.calendar.google.com": "Garage",
    " a-g.com_6c6f756e67652e726f6f6d@resource.calendar.google.com": "Lounge",
    "a-g.com_7061726c6f722e726f6f6d@resource.calendar.google.com": "Parlor",
    " a-g.com_706c6179726f6f6d2e726f6f6d@resource.calendar.google.com": "Playroom",
    "a-g.com_706f7263682e726f6f6d@resource.calendar.google.com": "Porch",
    "a-g.com_736865642e726f6f6d@resource.calendar.google.com": "Shed",
    "a-g.com_7374756474792e726f6f6d@resource.calendar.google.com": "Study",
    "a-g.com_746865617465722e726f6f6d@resource.calendar.google.com": "Theater",
    //Philly
    "a-g.com_626162796d6f6e6b65792e726f6f6d2e70686c@resource.calendar.google.com": "Baby Monkey",
    "a-g.com_6265747765656e74776f6665726e732e726f6f6d2e70686c@resource.calendar.google.com": "Between Two Ferns",
    "a-g.com_62697264796f6e63652e726f6f6d2e70686c@resource.calendar.google.com" : "Birdyonce",
    " a-g.com_646f67652e726f6f6d2e70686c@resource.calendar.google.com": "Doge",
    "a-g.com_646f75626c657261696e626f772e726f6f6d2e70686c@resource.calendar.google.com": "Double Rainbow",
    "a-g.com_657069637361786d616e2e726f6f6d2e70686c@resource.calendar.google.com" : "Epic Sax Man",
    "a-g.com_677261706573746f6d702e726f6f6d2e70686c@resource.calendar.google.com": "Grape Stomp",
    "a-g.com_6c65707265636861756e736179796561682e726f6f6d2e70686c@resource.calendar.google.com": "Leprechaun Say Yeah",
    "a-g.com_736e6f6f707768616c652e726f6f6d2e70686c@resource.calendar.google.com": "Snoopwhale",
    "a-g.com_73746172776172736b69642e726f6f6d2e70686c@resource.calendar.google.com":"Star Wars Kid",
    "a-g.com_73747564696f3534@resource.calendar.google.com":"Studio54",
    "a-g.com_77686973746c65746970732e726f6f6d2e70686c@resource.calendar.google.com": "Whistle Tips",
    "a-g.com_77696e6e656261676f6d616e2e726f6f6d2e70686c@resource.calendar.google.com": "Winnebago Man"

};

var bosRoomNamesIds = {
//Boston
        //Attic,Cafe,Conservatory,Den,Doghouase,Garage,Lounge,Parlor,Playroom,Porch,Shed,Study,Theater
    "a-g.com_61747469632e726f6f6d@resource.calendar.google.com": "Attic",
    //"a-g.com_636166652e726f6f6d@resource.calendar.google.com" : "Boston Cafe",
    "a-g.com_636f6e7365727661746f72792e726f6f6d@resource.calendar.google.com": "Conservatory",
    "a-g.com_64656e2e726f6f6d@resource.calendar.google.com": "Den",
    "a-g.com_646f67686f7573652e726f6f6d@resource.calendar.google.com": "Dog House",
    "a-g.com_6761726167652e726f6f6d@resource.calendar.google.com": "Garage",
    " a-g.com_6c6f756e67652e726f6f6d@resource.calendar.google.com": "Lounge",
    "a-g.com_7061726c6f722e726f6f6d@resource.calendar.google.com": "Parlor",
    " a-g.com_706c6179726f6f6d2e726f6f6d@resource.calendar.google.com": "Playroom",
    "a-g.com_706f7263682e726f6f6d@resource.calendar.google.com": "Porch",
    "a-g.com_736865642e726f6f6d@resource.calendar.google.com": "Shed",
    "a-g.com_7374756474792e726f6f6d@resource.calendar.google.com": "Study",
    "a-g.com_746865617465722e726f6f6d@resource.calendar.google.com": "Theater",
};
var philRoomNamesIds = {
    //Philly
    "a-g.com_626162796d6f6e6b65792e726f6f6d2e70686c@resource.calendar.google.com": "Baby Monkey",
    "a-g.com_6265747765656e74776f6665726e732e726f6f6d2e70686c@resource.calendar.google.com": "Between Two Ferns",
    "a-g.com_62697264796f6e63652e726f6f6d2e70686c@resource.calendar.google.com" : "Birdyonce",
    " a-g.com_646f67652e726f6f6d2e70686c@resource.calendar.google.com": "Doge",
    "a-g.com_646f75626c657261696e626f772e726f6f6d2e70686c@resource.calendar.google.com": "Double Rainbow",
    "a-g.com_657069637361786d616e2e726f6f6d2e70686c@resource.calendar.google.com" : "Epic Sax Man",
    "a-g.com_677261706573746f6d702e726f6f6d2e70686c@resource.calendar.google.com": "Grape Stomp",
    "a-g.com_6c65707265636861756e736179796561682e726f6f6d2e70686c@resource.calendar.google.com": "Leprechaun Say Yeah",
    "a-g.com_736e6f6f707768616c652e726f6f6d2e70686c@resource.calendar.google.com": "Snoopwhale",
    "a-g.com_73746172776172736b69642e726f6f6d2e70686c@resource.calendar.google.com":"Star Wars Kid",
    "a-g.com_73747564696f3534@resource.calendar.google.com":"Studio54",
    "a-g.com_77686973746c65746970732e726f6f6d2e70686c@resource.calendar.google.com": "Whistle Tips",
    "a-g.com_77696e6e656261676f6d616e2e726f6f6d2e70686c@resource.calendar.google.com": "Winnebago Man"
};
module.exports = {
    //how do we decide what callback is picked
        //and still unsure if I can say "cityName" == "Boston"
            //
    init: function(cityName, externalCallback) {
        //.val
            //what type
        // Load client secrets from a local file.
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {            
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            // Authorize a client with the loaded credentials, then call the
            // Google Calendar API.
            //authorize(JSON.parse(content), checkRooms, cityName, externalCallback);
            authorize(JSON.parse(content),cityName, checkRooms, externalCallback);
        });
    }
};
//module.exports.init(showAvailableRooms);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, cityName, callback, externalCallback) {
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
            callback(oauth2Client, cityName, externalCallback);
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

function checkRooms(auth, cityName, callback) {
    var calendar = google.calendar('v3');
    //*

    //if city name = boston, rooms = boston
    //var rooms = conferenceRooms();

    //????
   if(cityName == "boston"){
        var rooms = bosConferenceRooms();
    }
    else if(cityName == "philadelphia"){
        var rooms = philConferenceRooms();
    }
    //**
    else if(cityName == "philly"){
        var rooms = philConferenceRooms();
    }
    else if(cityName == "phillie"){
        var rooms = philConferenceRooms();
    }
    var freeRooms = [];
    
    var d = new Date();
    var e = new Date();
    e.setMinutes(e.getMinutes()+30);
    var n = d.toISOString();
    var m = e.toISOString();
    
    calendar.freebusy.query({
        auth: auth,
        resource: {
            // timeMin: "2016-07-05T3:30:00-04:00",
            // timeMax: "2016-07-05T4:00:00-04:00",
            timeMin: n,
            timeMax: m,
            items: rooms
        }
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var calendarStatuses = response.calendars;
        for (var key in calendarStatuses) {
            var obj = calendarStatuses[key];
            if (obj["busy"].length === 0) {
                freeRooms.push(key);
            }
        }
        var roomNames = "";

        //cut off freeRooms.length 2 indicies early b/c we append the last index after
            //to avoid extra 'and'
        for (var i = 0; i < (freeRooms.length-2); i++) {

            //roomNames += roomNamesIds[freeRooms[i]] + "     and     ";
            //roomNames += roomNamesIds[freeRooms[i]] + "               ";
            roomNames += roomNamesIds[freeRooms[i]] + "\n" + "\n" + "\n";
        }
       
        roomNames += "and               " + roomNamesIds[freeRooms[(freeRooms.length-1)]] + ".    ";
        
        callback(roomNames);
        //externalCallback(roomNames);
    });
    //};


}
// function checkBosRooms(auth, callback) {
//     var calendar = google.calendar('v3');
//     var rooms = bosConferenceRooms();
//     var bosFreeRooms = [];
    
//     var d = new Date();
//     var e = new Date();
//     e.setMinutes(e.getMinutes()+30);
//     var n = d.toISOString();
//     var m = e.toISOString();

//     calendar.freebusy.query({
//         auth: auth,
//         resource: {
//             // timeMin: "2016-07-05T3:30:00-04:00",
//             // timeMax: "2016-07-05T4:00:00-04:00",
//             timeMin: n,
//             timeMax: m,
//             items: rooms
//         }
//     }, function(err, response) {
//         if (err) {
//             console.log('The API returned an error: ' + err);
//             return;
//         }
//         var calendarStatuses = response.calendars;
//         for (var key in calendarStatuses) {
//             var obj = calendarStatuses[key];
//             if (obj["busy"].length === 0) {
//                 bosFreeRooms.push(key);
//             }
//         }
//         var bosRoomNames = "";

//     for (var i = 0; i < (bosFreeRooms.length-2); i++) {

//             bosRoomNames += bosRoomNamesIds[bosFreeRooms[i]] + "     and     ";
//         }
//     bosRoomNames += bosRoomNamesIds[freeRooms[(bosFreeRooms.length-1)]] + ".    ";
//     callback(bosRoomNames);
//     });
// }
// function checkPhilRooms(auth, callback) {
//     var calendar = google.calendar('v3');
//     var rooms = philConferenceRooms();
//     var philFreeRooms = [];
    
//     var d = new Date();
//     var e = new Date();
//     e.setMinutes(e.getMinutes()+30);
//     var n = d.toISOString();
//     var m = e.toISOString();

//     calendar.freebusy.query({
//         auth: auth,
//         resource: {
//             // timeMin: "2016-07-05T3:30:00-04:00",
//             // timeMax: "2016-07-05T4:00:00-04:00",
//             timeMin: n,
//             timeMax: m,
//             items: rooms
//         }
//     }, function(err, response) {
//         if (err) {
//             console.log('The API returned an error: ' + err);
//             return;
//         }
//         var calendarStatuses = response.calendars;
//         for (var key in calendarStatuses) {
//             var obj = calendarStatuses[key];
//             if (obj["busy"].length === 0) {
//                 philFreeRooms.push(key);
//             }
//         }
//         var philRoomNames = "";

//     for (var i = 0; i < (philFreeRooms.length-2); i++) {

//             philRoomNames += philRoomNamesIds[philRooms[i]] + "     and     ";
//         }
//     philRoomNames += philRoomNamesIds[freeRooms[(philFreeRooms.length-1)]] + ".    ";
//     callback(philRoomNames);
//     });
//}
function showAvailableRooms(rooms) {
    console.log(rooms);
}


function conferenceRooms() {
    var rooms = [{

    //Boston
        //Attic,Cafe,Conservatory,Den,Doghouse,Garage,Lounge,Parlor,Playroom,Porch,Shed,Study,Theater
         "id": "a-g.com_61747469632e726f6f6d@resource.calendar.google.com", //Attic
    },{
        //     "id":" a-g.com_636166652e726f6f6d@resource.calendar.google.com", //Boston Cafe
    // },{
        "id": "a-g.com_636f6e7365727661746f72792e726f6f6d@resource.calendar.google.com", // Conserv
    }, {
         "id": "a-g.com_64656e2e726f6f6d@resource.calendar.google.com", // Den
    },{
        "id": "a-g.com_646f67686f7573652e726f6f6d@resource.calendar.google.com", //Dog House
    },{
         "id": "a-g.com_6761726167652e726f6f6d@resource.calendar.google.com", // garage
    },{
         "id": " a-g.com_6c6f756e67652e726f6f6d@resource.calendar.google.com", //Lounge
    }, {
        "id": "a-g.com_7061726c6f722e726f6f6d@resource.calendar.google.com", // parlor
    },{
        "id":" a-g.com_706c6179726f6f6d2e726f6f6d@resource.calendar.google.com",//playroom
    },{
        "id":"a-g.com_706f7263682e726f6f6d@resource.calendar.google.com", //Porch
    },{
        "id":"a-g.com_736865642e726f6f6d@resource.calendar.google.com", //shed
    }, {
         "id":"a-g.com_7374756474792e726f6f6d@resource.calendar.google.com"//Study
    }, {
        "id":"a-g.com_746865617465722e726f6f6d@resource.calendar.google.com", //Theater
    }, {

    //Philly
        //Can I assume every conference room that has a google calendar and isn't listed as a Boston room on Intranet is real room in Philly 
        "id":  "a-g.com_626162796d6f6e6b65792e726f6f6d2e70686c@resource.calendar.google.com", //Baby Monkey
    },{
       "id": "a-g.com_6265747765656e74776f6665726e732e726f6f6d2e70686c@resource.calendar.google.com", //Between Two Ferns
    },{
        "id": "a-g.com_62697264796f6e63652e726f6f6d2e70686c@resource.calendar.google.com", //Birdyonce
    },{
    
        "id": " a-g.com_646f67652e726f6f6d2e70686c@resource.calendar.google.com", //Doge
    }, {
        "id": "a-g.com_646f75626c657261696e626f772e726f6f6d2e70686c@resource.calendar.google.com",//Double Rainbow
    },{
        "id": "a-g.com_657069637361786d616e2e726f6f6d2e70686c@resource.calendar.google.com", //Epic Sax Man
    },{
        "id": "a-g.com_677261706573746f6d702e726f6f6d2e70686c@resource.calendar.google.com", //grape stomp
    },{
        "id": "a-g.com_6c65707265636861756e736179796561682e726f6f6d2e70686c@resource.calendar.google.com", //Leprechaun Say Yeah
    },{
        "id":"a-g.com_736e6f6f707768616c652e726f6f6d2e70686c@resource.calendar.google.com", //Snoopwhale
    }, {
        "id": "a-g.com_73746172776172736b69642e726f6f6d2e70686c@resource.calendar.google.com", //Star Wars Kid
    }, {
        "id":"a-g.com_73747564696f3534@resource.calendar.google.com", //Studio54
    }, {
        "id":"a-g.com_77686973746c65746970732e726f6f6d2e70686c@resource.calendar.google.com", //Whistle Tips
    }, {
        "id":"a-g.com_77696e6e656261676f6d616e2e726f6f6d2e70686c@resource.calendar.google.com" //Winnebago Man
    }];
    return rooms;
}
function bosConferenceRooms() {
    var bosRooms = [{

    //Boston
        //Attic,Cafe,Conservatory,Den,Doghouse,Garage,Lounge,Parlor,Playroom,Porch,Shed,Study,Theater
         "id": "a-g.com_61747469632e726f6f6d@resource.calendar.google.com", //Attic
    },{
        //     "id":" a-g.com_636166652e726f6f6d@resource.calendar.google.com", //Boston Cafe
    // },{
        "id": "a-g.com_636f6e7365727661746f72792e726f6f6d@resource.calendar.google.com", // Conserv
    }, {
         "id": "a-g.com_64656e2e726f6f6d@resource.calendar.google.com", // Den
    },{
        "id": "a-g.com_646f67686f7573652e726f6f6d@resource.calendar.google.com", //Dog House
    },{
         "id": "a-g.com_6761726167652e726f6f6d@resource.calendar.google.com", // garage
    },{
         "id": " a-g.com_6c6f756e67652e726f6f6d@resource.calendar.google.com", //Lounge
    }, {
        "id": "a-g.com_7061726c6f722e726f6f6d@resource.calendar.google.com", // parlor
    },{
        "id":" a-g.com_706c6179726f6f6d2e726f6f6d@resource.calendar.google.com",//playroom
    },{
        "id":"a-g.com_706f7263682e726f6f6d@resource.calendar.google.com", //Porch
    },{
        "id":"a-g.com_736865642e726f6f6d@resource.calendar.google.com", //shed
    }, {
         "id":"a-g.com_7374756474792e726f6f6d@resource.calendar.google.com"//Study
    }, {
        "id":"a-g.com_746865617465722e726f6f6d@resource.calendar.google.com", //Theater
    }];
    return bosRooms;
}
function philConferenceRooms() {
    var philRooms = [{
        //Philly
        //Can I assume every conference room that has a google calendar and isn't listed as a Boston room on Intranet is real room in Philly 
        "id":  "a-g.com_626162796d6f6e6b65792e726f6f6d2e70686c@resource.calendar.google.com", //Baby Monkey
    },{
       "id": "a-g.com_6265747765656e74776f6665726e732e726f6f6d2e70686c@resource.calendar.google.com", //Between Two Ferns
    },{
        "id": "a-g.com_62697264796f6e63652e726f6f6d2e70686c@resource.calendar.google.com", //Birdyonce
    },{
        "id": " a-g.com_646f67652e726f6f6d2e70686c@resource.calendar.google.com", //Doge
    }, {
        "id": "a-g.com_646f75626c657261696e626f772e726f6f6d2e70686c@resource.calendar.google.com",//Double Rainbow
    },{
        "id": "a-g.com_657069637361786d616e2e726f6f6d2e70686c@resource.calendar.google.com", //Epic Sax Man
    },{
        "id": "a-g.com_677261706573746f6d702e726f6f6d2e70686c@resource.calendar.google.com", //grape stomp
    },{
        "id": "a-g.com_6c65707265636861756e736179796561682e726f6f6d2e70686c@resource.calendar.google.com", //Leprechaun Say Yeah
    },{
        "id":"a-g.com_736e6f6f707768616c652e726f6f6d2e70686c@resource.calendar.google.com", //Snoopwhale
    }, {
        "id": "a-g.com_73746172776172736b69642e726f6f6d2e70686c@resource.calendar.google.com", //Star Wars Kid
    }, {
        "id":"a-g.com_73747564696f3534@resource.calendar.google.com", //Studio54
    }, {
        "id":"a-g.com_77686973746c65746970732e726f6f6d2e70686c@resource.calendar.google.com", //Whistle Tips
    }, {
        "id":"a-g.com_77696e6e656261676f6d616e2e726f6f6d2e70686c@resource.calendar.google.com" //Winnebago Man
    }];
    return philRooms;
}
