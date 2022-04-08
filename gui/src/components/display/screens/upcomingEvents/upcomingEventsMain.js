'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const momentTz = require('moment-timezone')
const upcomingEventCmpnt = require('./upcomingEvent');

const TIMEZONE = "America/Los_Angeles";
const MAX_EVENTS_TO_DISPLAY = 7;
const EVENT_INTERVAL_MS = 5000;
const EVENT_TIME_BUFFER_MINUTES = 10;

module.exports = Vue.component('upcomingevents-main', {
    data: function(){
        return {
            events: [],
            activeEventIdx: 0,
            activeEvent: {}
        }
    },
    computed: {
        contentDisplayTime: function(){
            return momentTz(this.activeEvent.startTime).tz(TIMEZONE).format("ddd, h:mm a");
        },
        date: function(){
            let date = momentTz().tz(TIMEZONE).format("dddd, MMM Do");
            return date;
        },
        time: function(){
            let time = momentTz().tz(TIMEZONE).format("h:mm a");
            return time;
        }
    },
    mounted: function(){
        this.displayConfig = { events: {interval: EVENT_INTERVAL_MS} };
        return this.updateEvents()
            .then(()=>{
                return this.startEventMachine();
            })
            .catch((err)=>{
                console.log("Error starting display.js", err);
            })
    },
    methods: {
        fetchDisplayConfig: function(){
            return Promise.resolve()
        },
        updateEvents: function(){
            // let cdate = momentTz('2022-05-13 14:01').tz(TIMEZONE);
            let cdate = momentTz().tz(TIMEZONE);
            return ClientLib.getEvents()
                .then((results)=>{
                    results.forEach((evt)=>{
                        let evtdate = momentTz(evt.startTime).tz(TIMEZONE).add(EVENT_TIME_BUFFER_MINUTES, 'minutes');
                        if (cdate < evtdate && (this.events.length < MAX_EVENTS_TO_DISPLAY)){
                            this.events.push(evt)
                        }
                    })
                })
                .catch((err)=>{
                    console.log("Error getting events.", err);
                })
        },
        findNextIdx: function(list, currentIdx){
            if (currentIdx == (list.length - 1)){
                return 0;
            } else {
                return currentIdx + 1;
            }
        },
        setNextActiveEvent: function(){
            this.$refs.evtList[this.activeEventIdx].setActive(false);
            this.activeEventIdx = this.findNextIdx(this.events, this.activeEventIdx);
            this.activeEvent = this.events[this.activeEventIdx];
            this.activeEvent.description = `${this.activeEvent.description}`;
            this.$refs.evtList[this.activeEventIdx].setActive(true);        
        },
        startEventMachine: function(){
            
            //Events
            if (this.events.length > 0){
                this.activeEvent = this.events[this.activeEventIdx];            
                this.$refs.evtList[this.activeEventIdx].setActive(true);        
                this._eventsMachine = setInterval(this.setNextActiveEvent, this.displayConfig.events.interval);
            }
            
            return Promise.resolve();
        },
        stopEventMachine: function(){
            if (this._eventsMachine){
                clearInterval(this._eventsMachine);
            }
        }
    },
    beforeDestroy: function(){
        this.stopEventMachine();
    },
    template: `
        <div class="upcomingevents-main">
            <div class="main-body">
                <div class="sidebar">
                    <upcoming-event ref="evtList" v-for="evt in events" :key="evt._id" :event="evt"></upcoming-event>
                </div>
                <div class="content">
                    <div class="header">
                        <div><img class="gspf-header-image" src="images/gspflogosm.jpg"></div>
                        <div class="title">Upcoming Events</div>
                        <div class="spacer"></div>
                        <div class="date-time">
                            <div class="date">{{date}}</div>
                            <div class="time">{{time}}</div>
                        </div>
                    </div>
                    <div class="content-body">
                        <div class="content-header">
                            <div>{{activeEvent.name}}</div>
                            <div>{{activeEvent.location}} - {{contentDisplayTime}}</div>
                        </div>
                        <div class="content-description"><img class="event-image" v-if="activeEvent.imageUrl" v-bind:src="activeEvent.imageUrl"></img>{{activeEvent.description}}</div>
                    </div>
                </div>            
            </div>
        </div>
    `
})