'use strict';
const Joi = require('joi');
const Boom = require('@hapi/boom');
const InfoLib = require('../lib/infoitemsLib');

module.exports = (logger, basePath, dbConns)=>{
    let callinfoLib = function(methodName, onError, ...args){
        let db = dbConns.getConnection('gspfscreen');
        let iLib = new InfoLib(logger, dbConns);
        return iLib[methodName].call(iLib, ...args)
            .catch((err)=>{
                if (onError){
                    return onError(err);
                } else {
                    console.log(err);
                    logger.error({error:err, methodName: methodName});
                    Boom.internal("Error calling infoLib." + methodName);
                }
            })
    }

    return [
        {
            method: 'GET',
            path: basePath + "/infoitems",
            handler: (request, h) => {
                return callinfoLib("getAllInfoItems", null);
            },
            config: {
                auth: false
            }
        },
        {
            method: "POST",
            path: basePath + "/infoitems",
            handler: (request, h)=>{
                return callinfoLib("createInfoItem", null, request.payload);
            },
            config: {
                validate: {
                    payload: {
                        title: Joi.string().required(),
                        message: Joi.string().required(),
                        imageUrl: Joi.string().optional().allow('')
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
            path: basePath + "/infoitems/item/id/{id}",
            handler: (request, h)=>{
                return callinfoLib("updateInfoItem", null, request.params.id, request.payload)
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        title: Joi.string().required(),
                        message: Joi.string().required(),
                        imageUrl: Joi.string().optional().allow('')
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
            path: basePath + "/infoitems/item/id/{id}",
            handler: (request, h)=>{
                return callinfoLib("deleteInfoItem", null, request.params.id);
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