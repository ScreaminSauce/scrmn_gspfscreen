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
        <div class="form-row">
            <div class="form-group col-md-6">
                <input type="text" class="form-control" placeholder="Title" v-model="newInfoItem.title">
            </div>
            <div class="form-group col-md-6">
                <input type="text" class="form-control" placeholder="Image URL" v-model="newInfoItem.imageUrl">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-11">
                <textarea type="text" class="form-control" placeholder="Message" v-model="newInfoItem.message"></textarea>
            </div>
            <div class="form-group col-md-1">
                <button class="btn btn-primary" v-on:click="createInfoItem">Save</button>
            </div>
        </div>
        <hr class="divider"/>
        <h4>Manage Informational Items</h4>
        <table class="table table-striped mt-2">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>ImageUrl</th>
                    <th width="200">Actions</th>
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