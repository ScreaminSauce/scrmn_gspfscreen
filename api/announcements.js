'use strict';
const Joi = require('joi');
const Boom = require('boom');
const AnnLib = require('./lib/announcementsLib');

module.exports = (logger, basePath, dbConns)=>{
    let callAnnouncementsLib = function(methodName, onError, ...args){
        let db = dbConns.getConnection('gspfscreen');
        let aLib = new AnnLib(logger, db);
        return aLib[methodName].call(aLib, ...args)
            .catch((err)=>{
                if (onError){
                    return onError(err);
                } else {
                    console.log(err);
                    logger.error({error:err, methodName: methodName});
                    Boom.internal("Error calling announcementsLib." + methodName);
                }
            })
    }

    return [
        {
            method: 'GET',
            path: basePath + "/announcements",
            handler: (request, h) => {
                return callAnnouncementsLib("getAllAnnouncements", null);
            },
            config: {
                auth: false
            }
        },
        {
            method: "POST",
            path: basePath + "/announcements",
            handler: (request, h)=>{
                return callAnnouncementsLib("createAnnouncement", null, request.payload);
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
            path: basePath + "/announcements/announcement/id/{id}",
            handler: (request, h)=>{
                return callAnnouncementsLib("updateAnnouncement", null, request.params.id, request.payload)
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        message: Joi.string().required(),
                        type: Joi.string().required()
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: basePath + "/announcements/announcement/id/{id}",
            handler: (request, h)=>{
                return callAnnouncementsLib("deleteAnnouncement", null, request.params.id);
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            }
        }
    ]
}