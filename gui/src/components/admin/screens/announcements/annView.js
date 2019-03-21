const Vue = require('vue/dist/vue');

module.exports = Vue.component('announcement-view', {
    props: {
        announcement: Object
    },
    template: `
        <tr>
            <td v-bind:class="classObject">{{announcement.type}}</td>
            <td>{{announcement.message}}</td>
            <td>
                <button class="btn btn-danger" v-on:click="onDeleteButtonClicked">Delete</button>
                <button class="btn btn-secondary" v-on:click="onEditButtonClicked">Edit</button>
            </td>
        </tr>`,
    computed: {
        classObject: function(){
            let obj = {}
            obj["edit-announcement-" + this.announcement.type] = true;
            return obj;
        }
    },
    methods: {
        onDeleteButtonClicked: function(){
            this.$emit('delete-announcement');
        },
        onEditButtonClicked: function(){
            this.$emit('edit-announcement');
        }
    }
})