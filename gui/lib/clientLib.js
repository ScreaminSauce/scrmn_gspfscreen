'use strict';
const axios = require('axios');
const originBase = window.location.origin;
const _ = require('lodash');

class ClientLib {
    static handleError(err){
        if (_.has(err, "response.status")){
            if (err.response.status == 401){
                //User has been logged out, or trying to get in without authentication
                window.location = ClientLib.AUTHENTICATION_URL + "?errCode=1";
            } else if (err.response.status == 403){
                //User trying to do something naughty (Forbidden)... may as well send them to the login page.
                window.location = ClientLib.AUTHENTICATION_URL + "?errCode=2";
            } else {
                return Promise.reject(err);
            }
        } else {
            return Promise.reject(err);
        }
    }

    static logout(){
        return axios.post(`${originBase}/api/auth/logout`,{});
    }

    static getMyUser(){
        return axios(`${originBase}/api/auth/myUser`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static getScreenConfig(){
        return axios.get(`${originBase}/api/gspfscreen/screenconfig`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static getAnnouncements(){
        return axios.get(`${originBase}/api/gspfscreen/announcements`)
        .then((result)=>{
            return result.data;
        }, ClientLib.handleError)
    }

    static createAnnouncement(annInfo){
        return axios.post(`${originBase}/api/gspfscreen/announcements`, annInfo)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static updateAnnouncement(id, updateInfo){
        return axios.put(`${originBase}/api/gspfscreen/announcements/announcement/id/${id}`, updateInfo)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static deleteAnnouncement(id){
        return axios.delete(`${originBase}/api/gspfscreen/announcements/announcement/id/${id}`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static getEvents(){
        return axios.get(`${originBase}/api/gspfscreen/events`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static createEvent(eventInfo){
        return axios.post(`${originBase}/api/gspfscreen/events`, eventInfo)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static updateEvent(id, updateInfo){
        return axios.put(`${originBase}/api/gspfscreen/events/event/id/${id}`, updateInfo)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static deleteEvent(id){
        return axios.delete(`${originBase}/api/gspfscreen/events/event/id/${id}`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static getInfoItems(){
        return axios.get(`${originBase}/api/gspfscreen/infoitems`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static createInfoItem(infoItem){
        return axios.post(`${originBase}/api/gspfscreen/infoitems`, infoItem)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static updateInfoItem(id, updateInfo){
        return axios.put(`${originBase}/api/gspfscreen/infoitems/item/id/${id}`, updateInfo)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }

    static deleteInfoItem(id){
        return axios.delete(`${originBase}/api/gspfscreen/infoitems/item/id/${id}`)
            .then((result)=>{
                return result.data;
            }, ClientLib.handleError)
    }
}

ClientLib.APPLICATION_URL = "/public/auth/application.html";
ClientLib.AUTHENTICATION_URL = "/public/auth/login.html";
ClientLib.DISPLAY_PREVIEW_URL = "/public/gspfscreen/display.html";

module.exports = ClientLib;