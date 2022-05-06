'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');

module.exports = Vue.component('screenconfig-main', {
    data: function(){
        return {
            screenConfig: String,
            statusMessage: "",
            hasError: false
        }
    },
    mounted: function(){
        this.fetchScreenConfig()
            .then((result)=>{
                debugger;
                this.screenConfig = JSON.stringify(result, null, 4);
            })
            .catch((err)=>{
                console.log(err);
            })
    },
    methods: {
        fetchScreenConfig: function(){
            return ClientLib.getScreenConfig()
                .catch((err)=>{
                    console.log("Error getting screen config: ", err);
                })
        },
        updateScreenConfig: function(){
            this.statusMessage = "";
            this.hasError = false;
            let parsedJson;
            try {
                parsedJson = JSON.parse(this.screenConfig);
            } catch (ex){
                this.hasError = true;
                this.statusMessage = "Invalid JSON - Please try again"
                return;
            }
            return ClientLib.updateScreenConfig(parsedJson)
                .then(()=>{
                    this.statusMessage = "Display Config Saved."
                })
                .catch((err)=>{
                    console.log(err);
                    this.hasError = true;
                    this.statusMessage = err.message;
                })
        }
    },
    template: `
    <div class="main-content container-fluid">
        <h4>Edit Screen Configuration</h4>
        <div class="form-row" style="height:100%;">
            <div class="form-group col-md-12">
                <textarea class="form-control screenconfig-text" rows=25 v-model="screenConfig"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-1">
                <button class="btn btn-primary" v-on:click="updateScreenConfig">Save</button>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-12">
                <p v-bind:class="{'text-danger': hasError, 'text-primary': !hasError}">{{statusMessage}}</p>
            </div>
        </div>
    </div>
    `
})