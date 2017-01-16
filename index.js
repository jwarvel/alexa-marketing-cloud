'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('marketingcloud');
var MCDataHelper = require('./mc-data-helper');

app.launch(function(req, res) {
  var prompt = 'I can check Marketing Cloud status for you.  Currently, I can get the transaction count';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('transactions', {
  'slots': {
  },
  'utterances': ['{|get} {transactions|transaction count|messages|message count} {|today|for today|}']
},
  function(req, res) {

      var reprompt = 'What would you like to know?  Say transaction count';
      var mcDataHelper = new MCDataHelper();
      mcDataHelper.requestTransactionCount().then(function(response) {
        console.log(response);
        res.say(mcDataHelper.formatTransactionCount(response)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I couldn\'t get the transaction count ';
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }

);
//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
