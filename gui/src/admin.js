'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');

//Used for webpack bundling and component registration.
const styles = require('./components/admin/admin-styles.scss');
const annMainCmpnt = require('./components/admin/screens/announcements/annMain');
const eventsMainCmpnt = require('./components/admin/screens/events/eventsMain');
const infoItemsMainCmpnt = require('./components/admin/screens/infoitems/infoitemsMain');
const screenConfigMainCmpnt = require('./components/admin/screens/screenconfig/screenConfigMain');

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
    beforeCreate: function(){
        ClientLib.getMyUser()
            .then((userInfo)=>{
                if (userInfo.authorizedApps.indexOf('gspfscreen-admin') == -1){
                    //You shouldnt be here.
                    window.location = ClientLib.AUTHENTICATION_URL + "?errCode=2"
                }
            })
            .catch(()=>{
                window.location = ClientLib.AUTHENTICATION_URL + "?errCode=1";
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
                    <li class="nav-item" v-bind:class="{active: currentTab=='infoitems'}">
                        <a class="nav-link" v-on:click="changeTab('infoitems')">Informational</a>
                    </li>
                    <li class="nav-item" v-bind:class="{active: currentTab=='screenconfig'}">
                        <a class="nav-link" v-on:click="changeTab('screenconfig')">Config</a>
                    </li>
                </ul>
                <div>
                    <button class="btn btn-outline-primary my-2 my-sm-0" v-on:click="onAppsButtonClicked">Back to Apps</button>
                    <button class="btn btn-outline-primary my-2 my-sm-0" v-on:click="openDisplayInTab">Preview Display</button>    
                    <button class="btn btn-outline-success my-2 my-sm-0" v-on:click="onLogoutClicked">Logout</button>
                </div>
            </nav>
            <component v-bind:is="currentTabComponent"></component>
        </div>
    `,
})

