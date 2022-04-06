'use strict';

module.exports = (logger, basePath, dbConns)=>{
    let defaultConfig = { 
        "name" : "default",
        "startDate": "2022-05-13",
        "endDate": "2022-05-13",
        "displayOrder" : [ 
            { 
                "displayName" : "Upcoming Events", 
                "componentName" : "upcomingevents-main", 
                "durationInSeconds" : "30" //30 
            }, 
            { 
                "displayName" : "Sponsors", 
                "componentName" : "sponsors-main", 
                "durationInSeconds" : "10"  
            },
            {
                "displayName":"Informational Screens",
                "componentName":"infoitems-main",
                "durationInSeconds": "30" //20
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
                return Promise.resolve(defaultConfig);
            },
            config: {
                auth: false
            }
        }
    ]
}