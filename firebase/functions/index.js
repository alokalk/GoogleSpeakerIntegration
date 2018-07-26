'use strict';
var firebase = require("firebase");
// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
var config = {
   
    authDomain: "https://actions-codelab-cf789.firebaseapp.com",
    databaseURL: "https://actions-codelab-cf789.firebaseio.com"
   
};
firebase.initializeApp(config);
  
var database = firebase.database();

app.intent('summary', (conv, {choice}) =>{
    var ref = database.ref("blobs");
    var articles = "";
    return ref.once("value")
        .then(function(snapshot) {
            var articles = [];
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.child("body").val();
                // console.log(childData);
                articles += childData + " . Finished reading current summary. Moving on, ";
            });
            articles += ". End of summaries!"
            conv.ask(articles);
        });
});
app.intent('user choice', (conv, {choice}) => {
   
    // Respond with the user's lucky number and end the conversation.
    conv.ask('Hi It is user choice !!');
    //conv.ask(mystring + " KIK");
});


app.intent('Default Welcome Intent', (conv, {choice}) =>{
    var ref = database.ref("blobs");
    var summaryRef = database.ref("readinglist");
    //   var ref = firebase.database().refFromURL("https://actions-codelab-cf789.firebaseio.com/blobs");
    const request = require('request'); //pramod's mini adventure
    var unirest = require('unirest'); //pramod's mini adventure
    return ref.once("value")
        .then(function(snapshot) {
            var a = snapshot.numChildren(); //
            var topics = ['economy', ' finance', ' culture'];
            console.log(a);
            conv.ask('You have  ' + a + ' articles! about topics such as '+ topics + ' and others. Would you like me to summarize them or do you prefer to listen to the full content?');
            
        });
});

app.intent('New Welcome', (conv, {choice}) =>{
    var ref = database.ref("readinglist");
    //   var ref = firebase.database().refFromURL("https://actions-codelab-cf789.firebaseio.com/blobs");
    return ref.once("value")
        .then(function(snapshot) {
            var message = "Hello, There are currently the following articles!\n";
            snapshot.forEach(function(childSnapshot) {
                var text = childSnapshot.child("text").val();
                var title = childSnapshot.child("title").val();
                var blob_id = childSnapshot.child("blob_id").val();
                // console.log(childData);
                message += blob_id + ": " + title + " : " + text + "\n";
            });
            message += "Select the article number you would like to read!";
            conv.ask(message);
        });
});

app.intent('Get Article Number', (conv, {article}) =>{
    var ref = database.ref("blobs");
    console.log(article);
    //   var ref = firebase.database().refFromURL("https://actions-codelab-cf789.firebaseio.com/blobs");
    return ref.once("value")
        .then(function(snapshot) {
           snapshot.forEach(function(childSnapshot) {
               var blob_id = childSnapshot.child("blob_id").val();
               if(article == blob_id){
                var childData = childSnapshot.child("body").val();
                // console.log(childData);
                var article = childData;
                conv.ask('Here is the Article, ' + article + '. Would you like to listen to another article?');
                return true;
               }
            });
        });
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);