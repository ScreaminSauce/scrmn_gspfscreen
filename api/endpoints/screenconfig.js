'use strict';
const Joi = require('joi');
const Boom = require('@hapi/boom');
const momentTz = require('moment-timezone');

module.exports = (logger, basePath, dbConns)=>{
    let defaultConfig = { 
        "name" : "default", 
        "displayOrder" : [ 
            { 
                "displayName" : "Upcoming Events", 
                "componentName" : "upcomingevents-main", 
                "durationInSeconds" : "10" 
            }, 
            { 
                "displayName" : "Sponsors", 
                "componentName" : "sponsors-main", 
                "durationInSeconds" : "10" 
            },
            {
                "displayName":"Informational Screens",
                "componentName":"infoitems-main",
                "durationInSeconds": "10"
            },
            {
                "displayName": "Tomorrows Events",
                "componentName":"tomorrowevents-main",
                "durationInSeconds": "10"
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