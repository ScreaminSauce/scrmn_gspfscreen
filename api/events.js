'use strict';
const Joi = require('joi');
const Boom = require('boom');
const EventsLib = require('./lib/eventsLib');

module.exports = (logger, basePath, dbConns)=>{
    let callEventsLib = function(methodName, onError, ...args){
        let db = dbConns.getConnection('gspfscreen');
        let eLib = new EventsLib(logger, db);
        return eLib[methodName].call(eLib, ...args)
            .catch((err)=>{
                if (onError){
                    return onError(err);
                } else {
                    console.log(err);
                    logger.error({error:err, methodName: methodName});
                    Boom.internal("Error calling eventsLib." + methodName);
                }
            })
    }

    return [
        {
            method: 'GET',
            path: basePath + "/events",
            handler: (request, h) => {
                return callEventsLib("getAllEvents", null);
            },
            config: {
                auth: false
            }
        },
        {
            method: "POST",
            path: basePath + "/events",
            handler: (request, h)=>{
                return callEventsLib("createEvent", null, request.payload);
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
                },
                auth: {
                    access: {
                        scope: ["+gspfscreen-admin"]
                    }
                }
            }
        },
        {
            method: "PUT",
            path: basePath + "/events/event/id/{id}",
            handler: (request, h)=>{
                return callEventsLib("updateEvent", null, request.params.id, request.payload);
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        name: Joi.string().required(),
                        startTime: Joi.date().required(),
                        location: Joi.string().allow('').optional(),
                        description: Joi.string().allow('').optional(),
                        presenter: Joi.string().allow('').optional(),
                        imageUrl: Joi.string().allow('').optional()
                    }
                },
                auth: {
                    access: {
                        scope: ["+gspfscreen-admin"]
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: basePath + "/events/event/id/{id}",
            handler: (request, h)=>{
                return callEventsLib("deleteEvent", null, request.params.id);
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
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