var restify = require('restify');
var builder = require('botbuilder');


var spelling = require('spelling'),
    dictionary = require('spelling/dictionaries/en_US.js');

var dict = new spelling(dictionary);

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    var temp =  dict.lookup(session.message.text);
    if(temp["found"]){
        session.send(session.message.text+" is a right word!");
    }
    else{
        if(temp["suggestions"].length == 0){
            session.send(session.message.text+" is wrong, But we dont have a suggestion!");
        }
        else{
            var txt = 'Suggested: ';
            for(var i in temp["suggestions"]){
                txt +=temp["suggestions"][i]["word"]+" , ";
            }
            session.send(txt.substr(0, txt.length-3));   
        }
    }
});
