'use strict';
const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const ObjectId = require('mongodb').ObjectID;

module.exports = (logger, basePath, dbConns)=>{
    let collection = 'announcements';
    return [
        {
            method: 'GET',
            path: basePath + "/announcements",
            handler: (request, h) => {
                logger.info("Calling GET /announcements");
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
            method: "POST",
            path: basePath + "/announcements",
            handler: (request, h)=>{
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling POST /announcements");

                return new Promise((resolve, reject)=>{
                    db.collection(collection).insertOne(request.payload, (err, results)=>{
                        if (err){
                            logger.error({error: err}, "Error inserting document");
                            throw new Boom.internal("Error inserting document");
                        }
                        return resolve(results.ops[0]);
                    })
                })
            },
            config: {
                validate: {
                    payload: {
                        message: Joi.string().required(),
                        type: Joi.string().required()
                    }
                }
            }
        },
        {
            method: "PUT",
            path: basePath + "/announcements",
            handler: (request, h)=>{
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling PUT /announcements");
                return new Promise((resolve, reject)=>{
                    let ops = {
                        "$set":{
                            "type": request.payload.type,
                            "message": request.payload.message
                        }
                    }
                    db.collection(collection).findOneAndUpdate({"_id":ObjectId(request.payload._id)}, ops, {returnOriginal: false}, (err, results)=>{
                        if (err){
                            throw new Boom.internal();
                        }
                        return resolve(results.value);
                    })

                })
            },
            config: {
                validate: {
                    payload: {
                        _id: Joi.string().required(),
                        message: Joi.string().required(),
                        type: Joi.string().required()
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: basePath + "/announcements",
            handler: (request, h)=>{
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling DELETE /announcements");
                return new Promise((resolve, reject)=>{
                    db.collection(collection).findOneAndDelete({"_id":ObjectId(request.payload._id)}, (err, results)=>{
                        if (err){
                            logger.error({error: err}, "Error Deleting thing.")
                            throw new Boom.internal("Not found?");
                        }
                        return resolve(results);
                    })
                })
            },
            config: {
                validate: {
                    payload: {
                        _id: Joi.string().required()
                    }
                }
            }
        }
    ]
}