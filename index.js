'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('marketingcloud');
var MCDataHelper = require('./mc-data-helper');
var reprompt =  'What would you like to know?  Ask for transaction count, issue count, or busiest day.'

app.launch(function (req, res) {
    var prompt = 'I can check Marketing Cloud status for you.  I can get transaction counts, issue counts, and the busiest day.';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('transactions', {
        'slots': {
        },
        'utterances': ['{|get} {transactions|transaction|messages|message} {|count|counts} {|today|for today|}']
    },
    function (req, res) {

        var mcDataHelper = new MCDataHelper();
        mcDataHelper.getTransactionCount(1).then(function (response) {
            console.log(response);
            res.say(mcDataHelper.formatTransactionCount(response)).shouldEndSession(false).send();
        }).catch(function (err) {
                console.log(err.statusCode);
                var prompt = 'I couldn\'t get the transaction count ';
                res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
        return false;
    }
);

app.intent('maxTransactions', {
        'slots': {
        },
        'utterances': ['{|get|what was} {|the} {busiest} {day} {|in the last} {month|thirty days}']
    },
    function (req, res) {

        var mcDataHelper = new MCDataHelper();
        mcDataHelper.getTransactionCount(30).then(function (response) {
            console.log(response);
            res.say(mcDataHelper.formatMaxTransactionCount(response)).shouldEndSession(false).send();
        }).catch(function (err) {
                console.log(err.statusCode);
                var prompt = 'I couldn\'t get the transaction count ';
                res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
        return false;
    }
);

app.intent('issuesDay', {
        'slots': {
        },
        'utterances': ['{|get} {|the} {issues|issue} {|count|counts} {|for|in} {|the} {|last} {|day|twenty-four hours}']
    },
    function (req, res) {

        var mcDataHelper = new MCDataHelper();
        mcDataHelper.getIssueCounts('day').then(function (response) {

            res.say(mcDataHelper.formatIssueCounts(response,'day')).shouldEndSession(false).send();
        }).catch(function (err) {
                console.log(err.statusCode);
                var prompt = 'I couldn\'t get the issue counts ';
                res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
        return false;
    }

);

app.intent('issuesMonth', {
        'slots': {
        },
        'utterances': ['{|get} {|the} {issues|issue} {|count|counts} {|for|in} {|the} {|last} {month|four weeks}']
    },
    function (req, res) {

        var mcDataHelper = new MCDataHelper();
        mcDataHelper.getIssueCounts('month').then(function (response) {

            res.say(mcDataHelper.formatIssueCounts(response,'month')).shouldEndSession(false).send();
        }).catch(function (err) {
                console.log(err.statusCode);
                var prompt = 'I couldn\'t get the issue counts ';
                res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
        return false;
    }

);

app.intent("AMAZON.StopIntent", {}, function (req, res) {
    res.say('Good-bye!').shouldEndSession(true).send();
    return false;
});

app.intent('sendflow', {
    'slots': {},
    'utterances': ['{|what do you think of|tell me about|do you like} {send flow|sendflow}']
}, function (req, res) {
    res.say("Sendflow is a joy to use!").shouldEndSession(false).send();;
    return false;
});


module.exports = app;
