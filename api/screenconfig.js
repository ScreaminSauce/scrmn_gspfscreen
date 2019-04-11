'use strict';
const Joi = require('joi');
const Boom = require('boom');

module.exports = (logger, basePath, dbConns)=>{
    let collection = 'screenconfig';
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