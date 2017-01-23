/**
 * Created with JetBrains WebStorm.
 * User: jill
 * Date: 1/15/17
 * Time: 5:29 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

var _ = require('lodash');

var MCDataHelper = require('./mc-data-helper');


var mcDataHelper = new MCDataHelper();
//
//mcDataHelper.getTransactionCount()
//    .then(function (response) {
//    console.log('transaction count: ', mcDataHelper.formatTransactionCount(response));
//    }).catch(function (err) {
//        console.log('error', err);
//    });

mcDataHelper.getMonthlyTransactionCount()
    .then(function (response) {
        console.log('transaction count: ', mcDataHelper.formatMaxTransactionCount(response));
    }).catch(function (err) {
        console.log('error', err);
    });

//mcDataHelper.getIssueCounts()
//    .then(function (response) {
//        console.log( mcDataHelper.formatIssueCounts(response));
//    }).catch(function (err) {
//        console.log('error', err);
//    });


