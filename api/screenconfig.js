'use strict';
const Joi = require('joi');
const Boom = require('boom');

module.exports = (logger, basePath, dbConns)=>{
    let collection = 'screenconfig';
    return [
        {
            method: 'GET',
            path: basePath + "/availableScreens",
            handler: (request, h) => {
                //TODO - Collection for available screens? Have them self register?
                return Promise.resolve([
                    {
                        "displayName":"Upcoming Events",
                        "componentName":"upcomingevents-main",
                        "durationInSeconds": 60
                    },
                    {
                        "displayName":"Sponsors",
                        "componentName":"sponsors-main",
                        "durationInSeconds": 20
                    }
                ])
            },
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: basePath + "/screenConfig",
            handler: (request, h) => {
                let db = dbConns.getConnection("gspfscreen");
                return new Promise((resolve, reject)=>{
                    db.collection(collection).find({}).toArray((err, docs)=>{
                        if (err){ 
                            logger.error({error: err}, "Error retrieving document");
                            throw new Boom.internal("Error retrieving documents")
                        }
                        return resolve(docs);
                    })
                })
            },
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: basePath + "/screenConfig/{name}",
            handler: (request, h) => {
                let db = dbConns.getConnection("gspfscreen");
                return new Promise((resolve, reject)=>{
                    db.collection(collection).find({name: request.params.name}).toArray((err, docs)=>{
                        if (err){ 
                            logger.error({error: err}, "Error retrieving document");
                            throw new Boom.internal("Error retrieving documents")
                        }
                        return resolve(docs[0]);
                    })
                })
            },
            config: {
                auth: false,
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            }
        }
    ]
}