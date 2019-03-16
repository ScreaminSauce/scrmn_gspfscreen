'use strict';
const axios = require('axios');
const myCss = require('./style/gspfScreenAdmin.scss');
const annMainCmpnt = require('./components/admin/annMain-cmpnt');
const eventsMainCmpnt = require('./components/admin/eventsMain-cmpnt');
const Vue = require('vue/dist/vue');

module.exports = new Vue({
    el: "#app",
    data: {
        currentTab: "Announcements",
        tabs: ['Announcements', 'Events']
    },
    computed: {
        currentTabComponent: function () {
            return this.currentTab.toLowerCase() + "-main"
        },
        activeTab: function(){
            return this.currentTab;
        }
    },
    methods: {
        onLogoutClicked: function(){
            axios.post(window.location.origin + "/api/auth/logout")
                .then(()=>{
                    window.location = window.location.origin + "/public/auth/index.html";
                })
                .catch((err)=>{
                    console.log("Error logging out: ", err);
                })
        }
    },
    template: ` 
        <div class="container-fluid">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <a class="navbar-brand" href="#">GSPF Dashboard</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item" v-on:click="currentTab='announcements'">
                        <a class="nav-link">Announcements</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-on:click="currentTab='events'">Events</a>
                    </li>
                </ul>
                <div class="form-inline my-2 my-lg-0">
                    <button class="btn btn-outline-success my-2 my-sm-0" v-on:click="onLogoutClicked">Logout</button>
                </div>
                </div>
            </nav>
            <component
                v-bind:is="currentTabComponent"
            ></component>
        </div>
    `,
})

