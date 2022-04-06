const Vue = require('vue/dist/vue');
const ClientLib = require('../../../../../lib/clientLib');
const momentTz = require('moment-timezone');

const TIME_PER_ITEM = 6000;

module.exports = Vue.component('infoitems-main', {
    data: function(){
        return {
            activeItemIdx: null,
            activeItem: {},
            infoItems: []
        }
    },
    computed: {
        date: function(){
            let date = momentTz().tz("America/Los_Angeles").format("dddd, MMM Do");
            return date;
        },
        time: function(){
            let time = momentTz().tz("America/Los_Angeles").format("h:mm a");
            return time;
        }
    },
    mounted: function(){
        this.fetchInfoItems()
            .then((items)=>{
                if (items.length == 0){
                    this.infoItems = [
                        {
                            title: "Did you know?", 
                            message: "The Lodi Golden State Pinball Festival started in 2018, but has a history dating back 7 years!",
                            imageUrl: window.location.origin + "/public/gspfscreen/images/gspflogosm.jpg"
                        }
                    ]
                } else {
                    this.infoItems = items;
                }
                
                this.showItems = setInterval(this.showRandomThing, TIME_PER_ITEM)
                this.activeItemIdx = Math.floor(Math.random() * Math.floor(this.infoItems.length));
                this.activeItem = this.infoItems[this.activeItemIdx];
            })
    },
    beforeDestroy: function() {
        clearInterval(this.showItems);
    },
    methods: {
        fetchInfoItems: function(){
            return ClientLib.getInfoItems()
                .catch((err)=>{
                    console.log("Error getting info items", err);
                })
        },
        showRandomThing: function(){
            let newItemShown = false;
            while(!newItemShown){
                let randomChoice = Math.floor(Math.random() * Math.floor(this.infoItems.length));
                if ((randomChoice != this.activeItemIdx) || (this.infoItems.length == 1)){
                    this.activeItemIdx = randomChoice;
                    this.activeItem = this.infoItems[randomChoice];
                    newItemShown = true;
                }
            }
        }
    },
    template: `
        <div class="infoitems-main">
            <div class="header">
                <div class="info-title">{{activeItem.title}}</div>
                <div class="date-time">
                    <div class="date">{{date}}</div>
                    <div class="time">{{time}}</div>
                </div>
            </div>
            <div class="content-description"><img class="event-image" v-if="activeItem.imageUrl" v-bind:src="activeItem.imageUrl"></img>{{activeItem.message}}</div>
        </div>`
})