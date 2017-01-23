'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var cheerio = require('cheerio');


var transactionCountEndpoint = 'https://trust.marketingcloud.com/trans/count/last/';

var issueCountEndpoint = 'https://trust.marketingcloud.com/timelines/timelineUIDayPublic';
var monthlyIssueCountEndpoint = 'https://trust.marketingcloud.com/timelines/timelineUIMonthPublic';

function MCDataHelper() {
}

// get transactions

MCDataHelper.prototype.getTransactionCount = function (range) {
    var options = {
        method: 'GET',
        uri:  transactionCountEndpoint + range,
        json: true
    };
    return rp(options);
};

MCDataHelper.prototype.formatTransactionCount = function (response) {
    // response looks like:
    // { status: true,  msg: [ '{"date":"01/15/2017","count":1301759115}' ] }

    var transactionCount = JSON.parse(response.msg[0]).count;

    if (transactionCount !== undefined) {
        var template = _.template('There have been ${transactionCount} transactions today.')
        return template({
            transactionCount: transactionCount
        });
    } else {
        return _.template('Sorry, I couldn\'t find the transaction count in the response from Marketing Cloud.')({});
    }
};

// get max transaction count in the last 30 days

MCDataHelper.prototype.getMonthlyTransactionCount = function () {
    var options = {
        method: 'GET',
        uri: monthlyTransactionCountEndpoint,
        json: true
    };
    return rp(options);
};

MCDataHelper.prototype.formatMaxTransactionCount = function (response) {
    // takes response from monthly transaction count and finds max
    // { status: true,  msg: [ '{"date":"01/15/2017","count":1301759115}',... ] }
    console.log(response.msg);


    // convert strings to objects in array, then reverse sort by count

    var max = _.reverse(_.sortBy(_.map(response.msg, function(item) { return JSON.parse(item); }), ['count']))[0];

    if (max !== undefined) {
        var template = _.template('The busiest day in the last 30 days was on ${date}, when there were ${count} transactions.')
        return template(max);
    } else {
        return _.template('Sorry, I couldn\'t find the transaction counts in the response from Marketing Cloud.')({});
    }
};


// get issue counts


MCDataHelper.prototype.getIssueCounts = function (range) {
    //console.log('getissuecount')

    var options = {
        method: 'GET',
        uri: (range === 'month') ?  monthlyIssueCountEndpoint : issueCountEndpoint,
        json: true
    };
    return rp(options);
};

MCDataHelper.prototype.formatIssueCounts = function (response, range) {
    // response is divs for timeline bars
    var timelineDivs = response.timeline;

    var $ = cheerio.load(timelineDivs);

    var stacks = ['S1', 'S2', 'S4', 'S5', 'S6', 'S7'];
    var issues = [];

    // add issue counts to issues object
    _.each(stacks, function (stack) {
        issues.push({
            stack: stack,
            count: $('#' + stack + '-MarketingCloud-bar .timelineDatapoint').length
        });

    });

    var text = (range === 'day') ? 'In the last 24 hours, ' : 'In the last 4 weeks, ';
    var template = _.template('${stack} had ${count} issues. ');

    _.forEach(issues, function (issue) {
        text += template(issue);
    });

    return text.replace(' 1 issues',' 1 issue');


};

module.exports = MCDataHelper;
