'use strict';
const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

module.exports = (logger, basePath, dbConns)=>{
    let collection = 'events';
    return [
        {
            method: 'GET',
            path: basePath + "/events",
            handler: (request, h) => {
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling GET /events");
                return new Promise((resolve, reject)=>{
                    db.collection(collection).find({}).toArray((err, docs)=>{
                        if (err){ 
                            logger.error({error: err}, "Error retrieving document");
                            throw new Boom.internal("Error retrieving documents")
                        }
                        let result = docs.sort(function(objA, objB){
                            return moment.utc(objA.startTime).diff(moment.utc(objB.startTime))
                        })
                        resolve(result);
                    })
                })
            },
            config: {
                auth: false
            }
        },
        {
            method: "POST",
            path: basePath + "/events",
            handler: (request, h)=>{
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling POST /events");
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
                        name: Joi.string().required(),
                        startTime: Joi.date().required(),
                        location: Joi.string().allow('').optional(),
                        description: Joi.string().allow('').optional(),
                        presenter: Joi.string().allow('').optional(),
                        imageUrl: Joi.string().optional()
                    }
                }
            }
        },
        {
            method: "PUT",
            path: basePath + "/events",
            handler: (request, h)=>{
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling PUT /events");
                return new Promise((resolve, reject)=>{
                    let ops = {
                        "$set":{
                            "name": request.payload.name,
                            "startTime": request.payload.startTime,
                            "location": request.payload.location,
                            "description": request.payload.description,
                            "presenter": request.payload.presenter,
                            "imageUrl": request.payload.imageUrl
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
                        _id: Joi.string().required(),
                        name: Joi.string().required(),
                        startTime: Joi.date().required(),
                        location: Joi.string().allow('').optional(),
                        description: Joi.string().allow('').optional(),
                        presenter: Joi.string().allow('').optional(),
                        imageUrl: Joi.string().optional()
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: basePath + "/events",
            handler: (request, h)=>{
                let db = dbConns.getConnection("gspfscreen");
                logger.info("Calling DELETE /events");
                return new Promise((resolve, reject)=>{
                    db.collection(collection).findOneAndDelete({"_id":ObjectId(request.payload._id)}, (err, results)=>{
                        if (err){
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