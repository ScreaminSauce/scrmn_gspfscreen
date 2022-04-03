'use strict';
const announcementsApi = require('./endpoints/announcements');
const eventsApi = require('./endpoints/events');
const screenConfigApi = require('./endpoints/screenconfig');
const infoItemsApi = require('./endpoints/infoitems');

module.exports = {
    name: "gspfscreen",
    type: "api",
    api: function api(logger, basePath, dbConns){
        return [
            ...announcementsApi(logger,basePath,dbConns),
            ...eventsApi(logger,basePath,dbConns),
            ...screenConfigApi(logger,basePath,dbConns),
            ...infoItemsApi(logger, basePath, dbConns)
        ]
    },
    dbConnections: [
        {
            name: "gspfscreen",
            type: "mongo",
            url: process.env.MONGO_URI_GSPFSCREEN,
            dbName: process.env.MONGO_DATABASE_GSPFSCREEN
        }
    ]
}

