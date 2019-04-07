'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const moment = require('moment');
const eventsEditCmpnt = require('./eventsEdit');
const eventsViewCmpnt = require('./eventsView');

module.exports = Vue.component('events-main', {
    data: function() {
        return {
            events: [],
            selectedEditId: "",
            newEvent: {
                name: "",
                day: {date: "05/17/2019", value: "Friday"},
                hour: "00",
                minute: "00",
                location: "",
                description: "",
                presenter: ""
            },
            eventDays: [{date: "05/17/2019", value: "Friday"},{date: "05/18/2019", value: "Saturday"}, {date: "05/19/2019", value: "Sunday"}]
        }
    },
    computed: {
        startTime: function(){
            return moment(this.newEvent.day.date + " " + this.newEvent.hour + ":" + this.newEvent.minute, "MM-DD-YYYY hh:mm").valueOf()
            //.format("ddd, h:mmA");
        },
        sortedEvents: function(){
            return this.events.sort(function(objA, objB){
                let objAtime = moment(objA.startTime).valueOf();
                let objBtime = moment(objB.startTime).valueOf();
                if (objAtime > objBtime) {return 1}
                if (objAtime < objBtime) {return -1}
                return 0;
            })
        }
    },
    mounted: function(){
        this.fetchEvents()
            .then((events)=>{
                this.events = events;
            })
            .catch((err)=>{
                console.log("Error retrieving events: ", err);
            })
    },
    methods: {
        fetchEvents: function(){
            return ClientLib.getEvents()
                .catch((err)=>{
                    console.log("Error getting events", err);
                })
        },
        deleteEvent: function(index){
            ClientLib.deleteEvent(this.events[index]._id)
                .then(()=>{
                    this.events.splice(index, 1);
                    this.selectedEditId = "";
                })
                .catch((err)=>{
                    console.log("Error deleting events.", err);
                })
        },
        cancelEvent: function(){
            this.selectedEditId = "";
        },
        editEvent: function(index){
            this.selectedEditId = this.events[index]._id;
        },
        createEvent: function(){
            let data = {
                name: this.newEvent.name,
                startTime: this.startTime,
                location: this.newEvent.location,
                description: this.newEvent.description,
                presenter: this.newEvent.presenter
            }
            ClientLib.createEvent(data)
                .then((result)=>{
                    this.events.push(result);
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    },
    template: `
    <div class="main-content container-fluid">
        <h4>Create Event</h4>
        <div class="form-row">
            <div class="form-group col-md-2">
                <select class="form-control" v-model="newEvent.day">
                    <option v-for="day in eventDays" v-bind:value="day">{{day.value}}</option>
                </select>
            </div>
            <div class="form-group col-md-1">
            <input type="text" class="form-control" placeholder="Hour" v-model="newEvent.hour">
            </div>
            <div class="form-group col-md-1">
            <input type="text" class="form-control" placeholder="Minute" v-model="newEvent.minute">
            </div>
            <div class="form-group col-md-4">
                <input type="text" class="form-control"  placeholder="Event Name" v-model="newEvent.name">
            </div>
            <div class="form-group col-md-4">
                <input type="text" class="form-control"  placeholder="Event Location" v-model="newEvent.location">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-9">
                <input type="text" class="form-control"  placeholder="Description" v-model="newEvent.description">
            </div>
            <div class="form-group col-md-2">
                <input type="text" class="form-control"  placeholder="Presenter" v-model="newEvent.presenter">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-11">
                <input type="text" class="form-control"  placeholder="Image Url" v-model="newEvent.imageUrl">
            </div>
            <div class="form-group col-md-1">
                <button class="btn btn-primary" v-on:click="createEvent">Save</button>
            </div>
        </div>
        <hr/>
        <h4 class="divider">Manage Events</h4>
        <div class="manage-events-table">
            <table class="table table-hover table-dark">
                <thead>
                    <tr>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th>Presenter</th>
                    <th>ImageUrl</th>
                    <th width="200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(event, index) in sortedEvents">
                        <events-view 
                            v-if="event._id != selectedEditId"
                            :key="event._id" 
                            :event="event" 
                            v-on:delete-event="deleteEvent(index)"
                            v-on:edit-event="editEvent(index)"
                        ></events-view>
                        <events-edit
                            v-if="event._id == selectedEditId"
                            :key="index"
                            :event="event"
                            :eventDays="eventDays"
                            v-on:cancel-event="cancelEvent"
                        ></events-edit>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    `
})