'use strict';
const Vue = require('vue/dist/vue');
const momentTz = require('moment');

module.exports = Vue.component('tomorrow-event', {
    props: {
        event: Object
    },
    data: function(){
        return {};
    },
    computed: {
        displayTime: function(){
            return momentTz(this.event.startTime).tz("America/Los_Angeles").format("ddd, h:mm a");
        }
    },
    methods:{},
    template: `
        <div class="tomorrowItem">
            <div>{{displayTime}}</div>
            <div>{{event.name}}</div>
            <div>{{event.location}}</div>
        </div>
    `
})