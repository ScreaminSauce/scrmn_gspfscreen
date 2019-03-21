const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const ObjectId = require('mongodb').ObjectID;

module.exports = (logger, basePath, dbConns)=>{
    let collection = 'screenconfig';
    return [
        {
            method: 'GET',
            path: basePath + "/availableScreens",
            handler: (request, h) => {
                logger.info("Calling GET /availableScreens");
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
                logger.info("Calling GET /screenConfig");
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
                logger.info("Calling GET /screenConfig/{name}");
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
        },
        {
            method: 'PUT',
            path: basePath + "/screenConfig",
            handler: (request, h) => {
                logger.info("Calling PUT /announcements");
                let db = dbConns.getConnection("gspfscreen");
                return new Promise((resolve, reject)=>{
                    let ops = {
                        "$set":{
                            "displayOrder": request.payload.displayOrder
                        }
                    }
                    db.collection(collection).findOneAndUpdate({"_id":ObjectId(request.payload._id)}, ops, {returnOriginal: false}, (err, results)=>{
                        if (err){
                            throw new Boom.internal("Not found?");
                        }
                        return resolve(results.value);
                    })
                })
            },
            config: {
                validate: {
                    payload: {
                        "_id":Joi.string().required(),
                        "displayOrder":Joi.array().required()
                    }
                }
            }
        }
    ]
}