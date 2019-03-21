'use strict';
const axios = require('axios');
const Vue = require('vue/dist/vue');

//Used for webpack bundling and component registration.
const myCss = require('./style/gspfScreenAdmin.scss');
const annMainCmpnt = require('./components/admin/screens/announcements/annMain');
const eventsMainCmpnt = require('./components/admin/screens/events/eventsMain');

module.exports = new Vue({
    el: "#app",
    data: {
        currentTab: "Announcements",
        tabs: ['Announcements', 'Events']
    },
    computed: {
        currentTabComponent: function () {
            return this.currentTab.toLowerCase() + "-main"
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
            <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                <a class="navbar-brand" href="#">GSPF Dashboard</a>
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
            </nav>
            <component
                v-bind:is="currentTabComponent"
            ></component>
        </div>
    `,
})

