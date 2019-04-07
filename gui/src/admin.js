'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');

//Used for webpack bundling and component registration.
const myCss = require('./style/gspfScreenAdmin.scss');
const annMainCmpnt = require('./components/admin/screens/announcements/annMain');
const eventsMainCmpnt = require('./components/admin/screens/events/eventsMain');

module.exports = new Vue({
    el: "#app",
    data: {
        currentTab: "announcements"
    },
    computed: {
        currentTabComponent: function () {
            return this.currentTab + "-main";
        }
    },
    methods: {
        changeTab: function(tabName){
            this.currentTab = tabName;
        },
        onLogoutClicked: function(){
            ClientLib.logout()
                .then(()=>{
                    window.location = ClientLib.AUTHENTICATION_URL;
                })
                .catch((err)=>{
                    console.log("Error logging out: ", err);
                })
        },
        openDisplayInTab: function(){
            window.open(ClientLib.DISPLAY_PREVIEW_URL, "_blank");
        },
        onAppsButtonClicked: function(){
            window.location = ClientLib.APPLICATION_URL;
        }
    },
    mounted: function(){
        ClientLib.getMyUser()
            .catch(()=>{
                window.location = ClientLib.AUTHENTICATION_URL;
            })
    },
    template: `
        <div class="container-fluid">
            <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                <a class="navbar-brand" href="#">GSPF Display Dashboard</a>
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item" v-bind:class="{active: currentTab=='announcements'}" v-on:click="changeTab('announcements')">
                        <a class="nav-link">Announcements</a>
                    </li>
                    <li class="nav-item" v-bind:class="{active: currentTab=='events'}">
                        <a class="nav-link" v-on:click="changeTab('events')">Events</a>
                    </li>
                </ul>
                <div>
                    <button class="btn btn-outline-primary my-2 my-sm-0" v-on:click="onAppsButtonClicked">Back to Apps</button>
                    <button class="btn btn-outline-primary my-2 my-sm-0" v-on:click="openDisplayInTab">Preview Display</button>    
                    <button class="btn btn-outline-success my-2 my-sm-0" v-on:click="onLogoutClicked">Logout</button>
                </div>
            </nav>
            <component
                v-bind:is="currentTabComponent"
            ></component>
        </div>
    `,
})

