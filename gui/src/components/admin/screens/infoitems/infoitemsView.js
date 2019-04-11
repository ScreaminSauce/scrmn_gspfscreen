'use strict';
const Vue = require('vue/dist/vue');

module.exports = Vue.component('infoitem-view', {
    props: {
        infoitem: Object
    },
    template: `
        <tr>
            <td>{{infoitem.title}}</td>
            <td>{{infoitem.message}}</td>
            <td class="text-nowrap text-truncate table-imageurl">{{infoitem.imageUrl}}</td>
            <td>
                <button class="btn btn-danger" v-on:click="onDeleteButtonClicked">Delete</button>
                <button class="btn btn-secondary" v-on:click="onEditButtonClicked">Edit</button>
            </td>
        </tr>`,
    methods: {
        onDeleteButtonClicked: function(){
            this.$emit('delete-infoitem');
        },
        onEditButtonClicked: function(){
            this.$emit('edit-infoitem');
        }
    }
})