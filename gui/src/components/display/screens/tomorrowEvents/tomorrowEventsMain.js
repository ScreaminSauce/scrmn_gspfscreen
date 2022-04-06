'use strict';
const Vue = require('vue/dist/vue');
const ClientLib = require('../../../../../lib/clientLib');
const momentTz = require('moment-timezone');
const tomorrowEventCmpnt = require('./tomorrowEvent');
const TIMEZONE = "America/Los_Angeles"

module.exports = Vue.component('tomorrowevents-main', {
    data: function(){
        return {
            events: []
        }
    },
    computed: {
        date: function(){
            let date = momentTz().tz(TIMEZONE).format("dddd, MMM Do");
            return date;
        },
        time: function(){
            let time = momentTz().tz(TIMEZONE).format("h:mm a");
            return time;
        },
        dayOfTomorrow: function(){
            return momentTz().tz(TIMEZONE).add(1, "day").format("dddd");
        }
    },
    mounted: function(){
        this.fetchEvents()
            .then((events)=>{
                this.events = events;
            })
        
    },
    methods: {
        fetchEvents: function(){
            let today = momentTz().tz(TIMEZONE).format("dddd");
            
            let now = momentTz().tz(TIMEZONE);
            if (now < momentTz("2022-05-13", "YYYY-MM-DD").tz(TIMEZONE)){
                console.log("Not quite showtime yet - coming soon!");
                today = "Thursday";
            }

            return ClientLib.getEvents()
                .then((results)=>{
                    let filteredList = [];
                    results.forEach((evt)=>{
                        let dayOfEvent = momentTz(evt.startTime).tz(TIMEZONE).format("dddd");
                        if (today == "Thursday"){
                            if (dayOfEvent == "Friday") { filteredList.push (evt) }
                        } else if (today == "Friday"){
                            if (dayOfEvent == "Saturday") { filteredList.push (evt) }
                        } else if (today == "Saturday"){
                            if (dayOfEvent == "Sunday") { filteredList.push (evt) }
                        }
                    })
                    return filteredList;
                })
                .catch((err)=>{
                    console.log("Error getting events.", err);
                })
        }
    },
    template: `
        <div class="tomorrowevents-main">
            <div class="header">
                <div class="info-title">{{dayOfTomorrow}}'s Events at a Glance</div>
                <div class="date-time">
                    <div class="date">{{date}}</div>
                    <div class="time">{{time}}</div>
                </div>
            </div>
            <div class="content-description">
                <div v-if="events.length == 0"></div>
                <div class="tomorrowItem" v-if="events.length == 0">
                    <div>All Day</div>
                    <div>Everyone's cleaning up! Feel free to help!</div>
                    <div>All Halls</div>
                </div>
                <div v-if="events.length == 0"></div>
                <tomorrow-event v-for="event in events" :key="event._id" :event="event"></tomorrow-event>
            </div>
        </div>`
})