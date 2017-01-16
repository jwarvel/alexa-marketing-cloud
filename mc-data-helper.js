'use strict';
var _ = require('lodash');
var rp = require('request-promise');


var transactionCountEndpoint = 'https://trust.marketingcloud.com/trans/count/last/1';

function MCDataHelper() {
}

MCDataHelper.prototype.requestTransactionCount = function () {
    return this.getTransactionCount().then(
        function (response) {
            console.log('success - received transaction count');
            return response.body;
        }
    );
};

MCDataHelper.prototype.getTransactionCount = function () {
    var options = {
        method: 'GET',
        uri: transactionCountEndpoint,
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options);
};

MCDataHelper.prototype.formatTransactionCount = function (response) {
    // response looks like:
    // { status: true,  msg: [ '{"date":"01/15/2017","count":1301759115}' ] }
    console.log(response);

    var transactionCount = JSON.parse(response.msg[0]).count;
    console.log(transactionCount);

    if (transactionCount !== undefined) {
        var template = _.template('There have been ${transactionCount} transactions today.')
        return template({
            transactionCount: transactionCount
        });
    } else {
        return _.template('Sorry, I couldn\'t find the transaction count in the response from Marketing Cloud.')({});
    }
};

module.exports = MCDataHelper;
