/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

var gcal = require("./quickstart");
var personFinder = require('./findPerson');
gcal.init("Boston", function(data){
           console.log("Free rooms here are " + data, "Greeter", "Hello World!");
        })



/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    "HelloWorldIntent": function (intent, session, response) {
        // gcal.init(function(data) {    
        //     response.tellWithCard("Free rooms here are " + data, "Greeter", "Hello World!");
        // register custom intent handlers

        //*****
        //response.tellWithCard("Turnip!", "Greeter", "Hello World!");
        speechOutput = {
            speech: "<speak> A and G is a fiercely independent advertising agency located in the cities where independence was born, Boston and Philadelphia. "
                //+" <audio src='https://s3.amazonaws.com/gerritsensfx/hawk.mp3'/>"
                //+ "You can ask me to find an A&G confrence room or employee in Boston or Philadelphia"
                + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        response.ask(speechOutput);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    },
//};
        
    
    "LocationIntent": function(intent, session, response){
        var citySlot = intent.slots.City,
        cityName;
        if(citySlot && citySlot.value){
            cityName = citySlot.value.toLowerCase();
        }

        console.log(cityName);
        gcal.init(cityName, function(data){
           response.tellWithCard("Free rooms in    " + cityName + "    are    " 
                +  data, "Greeter", "Hello World!");
        })


    },
    "PersonFinderIntent": function (intent, session, response) {        
        var personSlot = intent.slots.PersonName,
            employeeName;
        if (personSlot && personSlot.value){
            employeeName = personSlot.value.toLowerCase();
        }
        personFinder.init(employeeName, function(data) {
            response.tellWithCard(employeeName + data, "Greeter", "Hello World!");
        })
   
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};

