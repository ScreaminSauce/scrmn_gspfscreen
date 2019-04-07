'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const _ = require('lodash');

module.exports = Vue.component('announcement-edit', {
    props: {
        announcement: Object,
        annTypes: Array
    },
    data: function () {
        return {
            editedAnnouncement: Object
        }
    },
    mounted: function(){
        this.editedAnnouncement = _.cloneDeep(this.announcement);
    },
    computed: {
        classObject: function () {
            let obj = {}
            obj["edit-announcement-" + this.announcement.type] = true;
            return obj;
        }
    },
    template: `
    <tr v-bind:class="classObject">
        <td colspan="2">
            <select id="annType" class="col-2" v-model="editedAnnouncement.type">
                <option v-for="type in annTypes" v-bind:value="type.name">{{type.name}}</option>
            </select>
            <input id="annMessage" type="text" class="col-8" v-model="editedAnnouncement.message">
        </td>
        <td colspan="1">
            <button class="btn btn-primary" v-on:click="onSaveButtonClicked">Save</button>
            <button class="btn btn-secondary" v-on:click="onCancelButtonClicked">Cancel</button>
        </td>
    </tr>
    `,
    methods: {
        onSaveButtonClicked: function(){
            let toBeSaved = {
                type: this.editedAnnouncement.type,
                message: this.editedAnnouncement.message
            }

            ClientLib.updateAnnouncement(this.editedAnnouncement._id, toBeSaved)
                .then((result)=>{
                    this.announcement.type = result.type;
                    this.announcement.message = result.message;
                    this.$emit('cancel-announcement');
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        onCancelButtonClicked: function(){
            this.$emit('cancel-announcement');
        }
    }
})