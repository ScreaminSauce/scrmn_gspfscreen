const Vue = require('vue/dist/vue');
const moment = require('moment');

module.exports = Vue.component('upcoming-event', {
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
        <div class="eventItem" v-bind:class="{ 'active-event': isActive }">
            <div>{{displayTime}}</div>
            <div>{{event.name}}</div>
        </div>
    `
})