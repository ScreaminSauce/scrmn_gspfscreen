const Vue = require('vue/dist/vue');
const axios = require('axios');
const annViewCmpnt = require('./annView-cmpnt');
const annEditCmpnt = require('./annEdit-cmpnt');

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
            return axios.get('/api/gspfscreen/announcements')
                .then((results)=>{
                    return results.data;
                })
                .catch((err)=>{
                    console.log("Error getting announcement list: ", err);
                })
        },
        deleteAnnouncement: function(index){
            console.log("Deleting: ", this.announcements[index]);
            return axios.delete(window.location.origin + '/api/gspfscreen/announcements', {data: { "_id": this.announcements[index]._id}})
                .then((result)=>{
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
            console.log("Creating announcement", this.newAnnouncement);
            axios.post(window.location.origin + '/api/gspfscreen/announcements', this.newAnnouncement)
                .then((result)=>{
                    this.announcements.push(result.data);
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    },
    template: `
    <div class="main-content">
        <h1>Announcements</h1>
        <hr class="divider"/>
        <h4>Create Announcement</h4>
        <div class="create-announcement">
            <select id="annType" v-model="newAnnouncement.type">
                <option v-for="type in annTypes" v-bind:value="type.name">{{type.name}}</option>
            </select>
            <input id="annMessage" type="text" v-model="newAnnouncement.message">
            <button class="btn btn-primary" v-on:click="createAnnouncement">Save</button>
        </div>
        <hr class="divider"/>
        <table class="table table-striped mt-2">
            <thead>
                <tr>
                    <th style="width:100px;">Type</th>
                    <th>Message</th>
                    <th style="width:155px;">Actions</th>
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