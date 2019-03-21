'use strict';
const announcementsApi = require('./announcements');
const eventsApi = require('./events');
const screenConfigApi = require('./screenconfig');
const _ = require('lodash');

module.exports = (logger, basePath, dbConns)=>{
    return _.concat(
        announcementsApi(logger,basePath,dbConns),
        eventsApi(logger,basePath,dbConns),
        screenConfigApi(logger,basePath,dbConns)
    )    
}