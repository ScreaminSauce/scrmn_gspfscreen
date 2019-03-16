const Vue = require('vue/dist/vue');
const moment = require('moment');

module.exports = Vue.component('event-item', {
    props: {
        event: Object
    },
    data: function(){
        return {
            isActive: false
        }
    },
    computed: {
        displayTime: function(){
            return moment(this.event.startTime).format("ddd, h:mm a")
        }
    },
    methods:{
        setActive(val){
            this.isActive = val;
        }
    },
    template: `
        <div class="eventItem" v-bind:class="{ 'active-event': isActive }"><h1>{{displayTime}}</h1><h3>{{event.name}}</h3></div>
    `
})