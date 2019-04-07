'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');
const myCss = require('./style/gspfScreenDisplay.scss');

//Current Screens created are loaded here - Required here for webpack to load 'em
const upcomingEventsMain = require('./components/display/screens/upcomingEvents/upcomingEventsMain');
const sponsorsMain = require('./components/display/screens/sponsors/sponsorsMain');

module.exports = new Vue({
    el: "#app",
    data: function () {
        return {
            currentDisplayCmpnt: String,
        }
    },
    mounted: function () {
        this.fetchScreenConfig("default")
            .then((config) => {
                this.displayOrder = config.displayOrder;
                // this.displayOrder = [{componentName:"sponsors-main", durationInSeconds:60}];
                return this.startDaMachine();
            })
            .catch((err) => {
                console.log("Error starting display.js", err);
            })
    },
    methods: {
        fetchScreenConfig: function () {
            return ClientLib.getScreenConfig()
                .catch((err)=>{
                    console.log("Error retrieving screen configuration.", err);
                })
        },
        findNextIdx: function (list, currentIdx) {
            if (currentIdx == (list.length - 1)) {
                return 0;
            } else {
                return currentIdx + 1;
            }
        },
        startDaMachine: function () {
            console.log("Da machine has been started!");
            if (this.displayOrder.length > 1) {
                this.loadNextScreen(this.displayOrder[0], this.displayOrder[1]);
            } else if (this.displayOrder.length == 1) {
                this.currentDisplayCmpnt = this.displayOrder[0].componentName;
                setTimeout(function(){
                    window.location.reload();
                }, this.displayOrder[0].durationInSeconds * 1000);
            } else {
                console.log("What kinda game you playing? No screens are set!");
            }
        },
        loadNextScreen: function (fromObj, toObj) {
            if (fromObj == toObj) {
                window.location.reload();
            } else {
                this.currentDisplayCmpnt = fromObj.componentName;
                setTimeout(() => {
                    this.loadNextScreen(toObj, this.displayOrder[this.findNextIdx(this.displayOrder, this.displayOrder.indexOf(toObj))])
                }, fromObj.durationInSeconds * 1000)
            }
        }
    },
    template: `
        <component v-bind:is="currentDisplayCmpnt"></component>
    `
})