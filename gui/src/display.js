'use strict';
const axios = require('axios');
const Vue = require('vue/dist/vue');
const moment = require('moment');
const myCss = require('./style/gspfScreenDisplay.scss');
const annItemCmpnt = require('./components/display/annItem-cmpnt');
const eventItemCmpnt = require('./components/display/eventItem-cmpnt');

module.exports = new Vue({
    el: "#app",
    data: function(){
        return {
            events: [],
            activeEventIdx: 0,
            activeEvent: {},
            announcements: [],
            activeAnnIdx: 0,
            activeAnn: {},
            time: String,
            date: moment().format("dddd, MMM Mo")
        }
    },
    computed: {
        contentDisplayTime: function(){
            return moment(this.activeEvent.startTime).format("ddd, h:mm a");
        },
        annClassObj: function(){
             return {
                 annMessage: true,
                 annInformational: this.activeAnn.type == "Informational",
                 annWarning: this.activeAnn.type == "Warning",
                 annUrgent: this.activeAnn.type == "Urgent",
             }
        }
    },
    mounted: function(){
        this.fetchDisplayConfig()
            .then((config)=>{
                this.displayConfig = config;
                return this.updateEvents();
            })        
            .then(()=>{
                return this.updateAnnouncements();
            })
            .then(()=>{
                return this.startDaMachine();
            })
            .catch((err)=>{
                console.log("Error starting display.js", err);
            })
    },
    methods: {
        fetchDisplayConfig: function(){
            return Promise.resolve({
                announcements:{interval: 10000},
                events: {interval: 5000},
                screens: {interval: 60000}
            })
        },
        updateEvents: function(){
            return axios.get(window.location.origin + "/api/gspfscreen/events")
                .then((results)=>{
                    let totalEventsToDisplay = 6;
                    let totalAdded = 0;
                    results.data.forEach((evt)=>{
                        let cdate = moment();
                        let evtdate = moment(evt.startTime);
                        if (cdate < evtdate && (totalAdded < totalEventsToDisplay)){
                            this.events.push(evt)
                            totalAdded = totalAdded + 1;
                        }
                    })
                })
                .catch((err)=>{
                    console.log("Error getting events.", err);
                })
        },
        updateAnnouncements: function(){
            return axios.get(window.location.origin + "/api/gspfscreen/announcements")
                .then((results)=>{
                    results.data.forEach((evt)=>{this.announcements.push(evt)})
                })
                .catch((err)=>{
                    console.log("Error getting announcements.", err);
                })
        },
        updateTime: function(){
            this.time =  moment().format("h:mm a")
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
            this.$refs.evtList[this.activeEventIdx].setActive(true);        
        },
        setNextActiveAnnouncement: function(){
            this.activeAnnIdx = this.findNextIdx(this.announcements, this.activeAnnIdx);
            this.activeAnn = this.announcements[this.activeAnnIdx];    
        },
        startDaMachine: function(){
            this.updateTime();
            
            //Events
            if (this.events.length > 0){
                this.activeEvent = this.events[this.activeEventIdx];            
                this.$refs.evtList[this.activeEventIdx].setActive(true);        
                setInterval(this.setNextActiveEvent, this.displayConfig.events.interval);
            }
           
            //Announcements
            if (this.announcements.length > 0){
                this.activeAnn = this.announcements[this.activeAnnIdx];
                setInterval(this.setNextActiveAnnouncement, this.displayConfig.announcements.interval);
            }
            
            setTimeout(function(){
                window.location.reload();
            }, this.displayConfig.screens.interval);

            console.log("Da machine has been started!");
            return Promise.resolve();
        }
    },
    template: `
    <div class="main-content">
        <div class="sideInfo">
            <event-item ref="evtList" v-for="evt in events" :key="evt._id" :event="evt"></event-item>
            <div class="spacer"></div>
        </div>
        <div class="header">
            <div><img src="images/gspflogosm.jpg" style="width:175px;height:175px;"></div>
            <div class="title">Upcoming Events</div>
            <div class="spacer"></div>
            <div class="date-time">
                <div class="date">{{date}}</div>
                <div class="time">{{time}}</div>
            </div>
        </div>
        <div class="content">
            <div class="content-header"><div>{{activeEvent.name}}</div><div>{{activeEvent.location}} - {{contentDisplayTime}}</div></div>
            <div class="content-description">{{activeEvent.description}}</div>
        </div>
        <div class="announcements-ticker">
            <div class="announcement">
                <span>Announcements</span>
                <span v-bind:class="annClassObj">{{activeAnn.message}}</span>
            </div>
        </div>
    </div>
    `
})