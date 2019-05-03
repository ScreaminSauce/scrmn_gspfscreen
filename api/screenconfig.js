'use strict';
const Joi = require('joi');
const Boom = require('boom');
const momentTz = require('moment-timezone');

module.exports = (logger, basePath, dbConns)=>{
    let defaultConfig = { 
        "name" : "default", 
        "displayOrder" : [ 
            { 
                "displayName" : "Upcoming Events", 
                "componentName" : "upcomingevents-main", 
                "durationInSeconds" : "60" 
            }, 
            { 
                "displayName" : "Sponsors", 
                "componentName" : "sponsors-main", 
                "durationInSeconds" : "20" 
            },
            {
                "displayName":"Informational Screens",
                "componentName":"infoitems-main",
                "durationInSeconds": "30"
            },
            {
                "displayName": "Tomorrows Events",
                "componentName":"tomorrowevents-main",
                "durationInSeconds": "20"
            }
        ] }
    return [
        {
            method: 'GET',
            path: basePath + "/screenconfig",
            handler: (request, h) => {
                return Promise.resolve(defaultConfig);
            },
            config: {
                auth: false
            }
        }
    ]
}