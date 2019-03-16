const Vue = require('vue/dist/vue');
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');

module.exports = Vue.component('events-edit', {
    props: {
        eventDays: Array,
        event: Object
    },
    data: function(){return {
        editedEvent: Object,
        hour: Number,
        minute: Number,
        day: {date: "05/17/2019", value: "Friday"}
    }},
    computed: {
        startTime: function(){
            return moment(this.day.date + " " + this.hour + ":" + this.minute, "MM-DD-YYYY hh:mm").valueOf()
        }
    },
    methods: {
        onSaveButtonClicked: function(){
            let data = {
                _id: this.editedEvent._id,
                name: this.editedEvent.name,
                startTime: this.startTime,
                location: this.editedEvent.location || "",
                description: this.editedEvent.description || "",
                presenter: this.editedEvent.presenter || ""
            }

            return axios.put(window.location.origin + '/api/gspfscreen/events', data)
                .then((result)=>{
                    console.log(result.data);
                    this.event.startTime = result.data.startTime;
                    this.event.name = result.data.name;
                    this.event.location = result.data.location;
                    this.event.presenter = result.data.presenter;
                    this.event.description = result.data.description;
                    this.initializeView();
                    this.$emit('cancel-event');
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        onCancelButtonClicked: function(){
            this.$emit('cancel-event');
        },
        initializeView: function(){
            
            this.editedEvent = _.cloneDeep(this.event);
            let currentTime = moment(this.editedEvent.startTime);

            let dayOfWeek = currentTime.format('dddd');
            this.day = this.eventDays.find((obj)=>{return obj.value == dayOfWeek});
            
            this.hour = currentTime.format('hh');
            this.minute = currentTime.format('mm');
        }
    },
    mounted: function(){
        this.initializeView();
    },
    template: `
    <tr class="editRow" style="background-color:dimgrey; ">
        <td colspan=5>
            <div class="form-row">
                <div class="form-group col-md-2">
                    <select class="form-control" v-model="day">
                        <option v-for="day in eventDays" v-bind:value="day">{{day.value}}</option>
                    </select>
                </div>
                <div class="form-group col-md-1">
                <input type="text" class="form-control"  placeholder="Hour" v-model="hour">
                </div>
                <div class="form-group col-md-1">
                <input type="text" class="form-control"  placeholder="Minute" v-model="minute">
                </div>
                <div class="form-group col-md-4">
                    <input type="text" class="form-control"  placeholder="Event Name" v-model="editedEvent.name">
                </div>
                <div class="form-group col-md-4">
                    <input type="text" class="form-control"  placeholder="Event Location" v-model="editedEvent.location">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-8">
                <input type="text" class="form-control"  placeholder="Description" v-model="editedEvent.description">
                </div>
                <div class="form-group col-md-2">
                <input type="text" class="form-control"  placeholder="Presenter" v-model="editedEvent.presenter">
                </div>
                
            </div>
        </td>
        <td>
            <div class="form-group">
                <button class="btn btn-primary" v-on:click="onSaveButtonClicked">Save</button>
                <button class="btn btn-secondary" v-on:click="onCancelButtonClicked">Cancel</button>
            </div>
        </td>
    </tr>
    `
});