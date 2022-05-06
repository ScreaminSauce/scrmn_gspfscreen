'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');
const styles = require('./components/display/display-styles.scss');

//Current Screens created are loaded here - Required here for webpack to load 'em
const upcomingEventsMain = require('./components/display/screens/upcomingEvents/upcomingEventsMain');
const sponsorsMain = require('./components/display/screens/sponsors/sponsorsMain');
const infoitemsMain = require('./components/display/screens/infoitems/infoitemsMain');
const displayUrl = require('./components/display/screens/displayUrl/displayUrl');

module.exports = new Vue({
    el: "#app",
    data: function () {
        return {
            currentDisplayCmpnt: String,
            currentDisplayConfig: Object
        }
    },
    mounted: function () {
        this.fetchScreenConfig()
            .then((config) => {
                this.displayOrder = config.displayOrder;
                //[{componentName:"tomorrowevents-main", durationInSeconds:60}];

                this.startDaNewMachine();
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
            if (currentIdx === (list.length - 1)) {
                return 0;
            } else {
                return currentIdx + 1;
            }
        },
        startDaNewMachine: function(){
            if(this.displayOrder.length > 0){
                this.loadScreen(this.displayOrder[0]);
            } else {
                console.log("No display configuration set - reloading in 30 seconds.")
                setTimeout(function(){
                    window.location.reload();
                }, 30 * 1000);
            }
        },
        loadScreen: function(screenConfig, resetLoader){
            if (resetLoader){
                this.fetchScreenConfig()
                    .then((config)=>{
                        this.displayOrder = config.displayOrder;
                        this.startDaNewMachine();
                    })
            } else {
                this.currentDisplayCmpnt = screenConfig.componentName;
                this.currentDisplayConfig = screenConfig.config || {};
                const nextScreenConfigIdx = this.findNextIdx(this.displayOrder, this.displayOrder.indexOf(screenConfig));
                const nextScreenConfig = this.displayOrder[nextScreenConfigIdx];
                setTimeout(()=>{
                    this.loadScreen(nextScreenConfig, nextScreenConfigIdx === 0);
                }, screenConfig.durationInSeconds * 1000)
            }
        }
    },
    template: `
        <component v-bind:is="currentDisplayCmpnt" :displayConfig="currentDisplayConfig"></component>
    `
})