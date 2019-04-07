'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const annViewCmpnt = require('./annView');
const annEditCmpnt = require('./annEdit');

module.exports = Vue.component('announcements-main', {
    data: function(){
        return {
            announcements: [],
            selectedEditId: "",
            newAnnouncement: {
                message: "",
                type: "Informational"
            },
            annTypes: [{name: "Informational"}, {name: "Warning"}, {name: "Urgent"}]
        }
    },
    mounted: function(){
        this.fetchAnnouncements()
        .then((results)=>{
            results.forEach((ann)=>{
                this.announcements.push(ann);
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    methods: {
        fetchAnnouncements: function(){
            return ClientLib.getAnnouncements()
                .catch((err)=>{
                    console.log("Error getting announcement list: ", err);
                })
        },
        deleteAnnouncement: function(index){
            ClientLib.deleteAnnouncement(this.announcements[index]._id)
                .then(()=>{
                    this.announcements.splice(index, 1);
                    this.selectedEditId = "";
                })
                .catch((err)=>{
                    console.log("Error deleting announcement.", err);
                })
        },
        cancelAnnouncement: function(){
            this.selectedEditId = "";
        },
        editAnnouncement: function(index){
            this.selectedEditId = this.announcements[index]._id;
        },
        createAnnouncement: function(){
            ClientLib.createAnnouncement(this.newAnnouncement)
                .then((result)=>{
                    this.announcements.push(result);
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    },
    template: `
    <div class="main-content container-fluid">
        <h4>Create Announcement</h4>
        <div class="create-announcement">
            <select id="annType" v-model="newAnnouncement.type">
                <option v-for="type in annTypes" v-bind:value="type.name">{{type.name}}</option>
            </select>
            <input id="annMessage" type="text" v-model="newAnnouncement.message">
            <button class="btn btn-primary" v-on:click="createAnnouncement">Save</button>
        </div>
        <hr class="divider"/>
        <h4>Manage Announcements</h4>
        <table class="table table-striped mt-2">
            <thead>
                <tr>
                    <th class="ann-table-type-header">Type</th>
                    <th>Message</th>
                    <th class="ann-table-type-actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(ann, index) in announcements">
                    <announcement-view 
                        v-if="ann._id != selectedEditId"
                        :key="ann._id" 
                        :announcement="ann" 
                        v-on:delete-announcement="deleteAnnouncement(index)"
                        v-on:edit-announcement="editAnnouncement(index)"
                    ></announcement-view>
                    <announcement-edit
                        v-if="ann._id == selectedEditId"
                        :key="index"
                        :announcement="ann"
                        :annTypes="annTypes"
                        v-on:cancel-announcement="cancelAnnouncement"
                    ></announcement-edit>
                </template>
            </tbody>
        </table>
    </div>
    `
})