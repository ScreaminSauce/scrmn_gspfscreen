'use strict';
const Joi = require('joi');
const ScreenConfigLib = require('../lib/screenConfigLib');

module.exports = (logger, basePath, dbConns)=>{
    const defaultConfig = { 
        "displayOrder" : [ 
            {
                "componentName" : "display-url", 
                "config":{url:"https://www.neverdrains.com/gspf2022/standingsDisplay.php", count: 1},
                "durationInSeconds" : 30
            },
            { 
                "componentName" : "upcomingevents-main", 
                "config":{test:true, count: 1},
                "durationInSeconds" : 30
            }, 
            { 
                "componentName" : "sponsors-main", 
                "config":{displayurl:"https://blah", count: 2},
                "durationInSeconds" : 10  
            },
            {
                "componentName":"infoitems-main",
                "config":{test:false, count: 3},
                "durationInSeconds": 30 //20
            },
            // {
            //     "displayName": "Tomorrows Events",
            //     "componentName":"tomorrowevents-main",
            //     "durationInSeconds": "20" //20
            // }
        ] }
    return [
        {
            method: 'GET',
            path: basePath + "/screenconfig",
            handler: (request, h) => {
                const configLib = new ScreenConfigLib(logger, dbConns)
                return configLib.getConfig();
            },
            config: {
                auth: false
            }
        },
        {
            method: 'PUT',
            path: basePath + "/screenconfig",
            handler: (request, h) => {
                const configLib = new ScreenConfigLib(logger, dbConns)
                return configLib.updateConfig(request.payload)
                    .catch((err)=>{
                        logger.error({err}, "error!");
                        return Promise.reject(err);
                    })
            },
            config: {
                validate: {
                    payload: Joi.object().allow()
                },
                auth: {
                    access: {
                        scope: ["+gspfscreen-admin"]
                    }
                }
            }
        }
    ]
}