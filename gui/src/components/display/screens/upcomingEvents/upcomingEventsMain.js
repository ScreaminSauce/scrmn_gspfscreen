const Vue = require('vue/dist/vue');
const moment = require('moment');
const axios = require('axios');
const upcomingEventCmpnt = require('./upcomingEvent');

module.exports = Vue.component('upcomingevents-main', {
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
                return this.startEventMachine();
            })
            .catch((err)=>{
                console.log("Error starting display.js", err);
            })
    },
    methods: {
        fetchDisplayConfig: function(){
            return Promise.resolve({
                announcements:{interval: 10000},
                events: {interval: 5000}
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
        startEventMachine: function(){
            this.updateTime();
            
            //Events
            if (this.events.length > 0){
                this.activeEvent = this.events[this.activeEventIdx];            
                this.$refs.evtList[this.activeEventIdx].setActive(true);        
                this._eventsMachine = setInterval(this.setNextActiveEvent, this.displayConfig.events.interval);
            }
           
            //Announcements
            if (this.announcements.length > 0){
                this.activeAnn = this.announcements[this.activeAnnIdx];
                this._annMachine = setInterval(this.setNextActiveAnnouncement, this.displayConfig.announcements.interval);
            }
            
            return Promise.resolve();
        },
        stopEventMachine: function(){
            if (this._eventsMachine){
                clearInterval(this._eventsMachine);
            }
            if (this._annMachine){
                clearInterval(this._annMachine);
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
                    <div class="spacer"></div>
                </div>
                <div class="content">
                    <div class="header">
                        <div><img src="images/gspflogosm.jpg" style="width:175px;height:175px;"></div>
                        <div class="title">Upcoming Events</div>
                        <div class="spacer"></div>
                        <div class="date-time">
                            <div class="date">{{date}}</div>
                            <div class="time">{{time}}</div>
                        </div>
                    </div>
                    <div class="content-body">
                        <div class="content-header"><div>{{activeEvent.name}}</div><div>{{activeEvent.location}} - {{contentDisplayTime}}</div></div>
                        <div class="content-description">{{activeEvent.description}}</div>
                    </div>
                </div>            
            </div>
            <div class="footer">
                <div class="announcement">
                    <div>Announcements</div>
                    <div v-bind:class="annClassObj">{{activeAnn.message}}</div>
                </div>
            </div>
        </div>
    `
})