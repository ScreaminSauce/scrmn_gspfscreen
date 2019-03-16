'use strict';
const announcementsApi = require('./announcements');
const eventsApi = require('./events');
const _ = require('lodash');

module.exports = (logger, basePath, dbConns)=>{
    return _.concat(
        announcementsApi(logger,basePath,dbConns),
        eventsApi(logger,basePath,dbConns)
    )    
}