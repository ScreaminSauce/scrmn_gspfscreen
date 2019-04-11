'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const infoItemViewCmpnt = require('./infoitemsView');
const infoItemEditCmpnt = require('./infoitemsEdit');

module.exports = Vue.component('infoitems-main', {
    data: function(){
        return {
            infoItems: [],
            selectedItemId: "",
            newInfoItem: {
                title: "",
                message: "",
                imageUrl: ""
            }
        }
    },
    mounted: function(){
        this.fetchInfoItems()
        .then((results)=>{
            this.infoItems = results;
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    methods: {
        fetchInfoItems: function(){
            return ClientLib.getInfoItems()
                .catch((err)=>{
                    console.log("Error getting infoitem list: ", err);
                })
        },
        deleteInfoItem: function(index){
            ClientLib.deleteInfoItem(this.infoItems[index]._id)
                .then(()=>{
                    this.infoItems.splice(index, 1);
                    this.selectedItemId = "";
                })
                .catch((err)=>{
                    console.log("Error deleting infoitem.", err);
                })
        },
        cancelInfoItem: function(){
            this.selectedItemId = "";
        },
        editInfoItem: function(index){
            this.selectedItemId = this.infoItems[index]._id;
        },
        createInfoItem: function(){
            ClientLib.createInfoItem(this.newInfoItem)
                .then((result)=>{
                    this.infoItems.push(result);
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    },
    template: `
    <div class="main-content container-fluid">
        <h4>Create Informational Item</h4>
        <div class="create-infoItem">
            <input type="text" class="col-2" placeholder="Title" v-model="newInfoItem.title">
            <input type="text" class="col-7" placeholder="Message" v-model="newInfoItem.message">
            <input type="text" class="col-2" placeholder="Image URL" v-model="newInfoItem.imageUrl">
            <button class="btn btn-primary" v-on:click="createInfoItem">Save</button>
        </div>
        <hr class="divider"/>
        <h4>Manage Informational Items</h4>
        <table class="table table-striped mt-2">
            <thead>
                <tr>
                    <th class="col-2">Title</th>
                    <th class="col-5">Message</th>
                    <th class="col-3">ImageUrl</th>
                    <th class="col-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, index) in infoItems">
                    <infoitem-view 
                        v-if="item._id != selectedItemId"
                        :key="item._id" 
                        :infoitem="item" 
                        v-on:delete-infoitem="deleteInfoItem(index)"
                        v-on:edit-infoitem="editInfoItem(index)"
                    ></infoitem-view>
                    <infoitem-edit
                        v-if="item._id == selectedItemId"
                        :key="index"
                        :infoitem="item"
                        v-on:cancel-infoitem="cancelInfoItem"
                    ></infoitem-edit>
                </template>
            </tbody>
        </table>
    </div>
    `
})