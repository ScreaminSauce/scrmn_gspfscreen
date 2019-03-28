const Vue = require('vue/dist/vue');
const moment = require('moment');

module.exports = Vue.component('events-view', {
    props: {
        event: Object
    },
    computed: {
        startTime: function(){
            return moment(this.event.startTime).format("ddd, h:mm A");
        }
    },
    methods: {
        onDeleteButtonClicked: function(){
            this.$emit('delete-event');
        },
        onEditButtonClicked: function(){
            this.$emit('edit-event');
        }
    },
    template: `
    <tr>
        <th scope="row">{{startTime}}</th>
        <td>{{event.name}}</td>
        <td>{{event.location}}</td>
        <td>{{event.description}}</td>
        <td>{{event.presenter}}</td>
        <td class="text-nowrap text-truncate table-imageurl">{{event.imageUrl}}</td>
        <td class="form-row">
            <div class="form-group">
                <button class="btn btn-danger" v-on:click="onDeleteButtonClicked">Delete</button>    
                <button class="btn btn-primary" v-on:click="onEditButtonClicked">Edit</button>
            </div>
        </td>
    </tr>
    `
});