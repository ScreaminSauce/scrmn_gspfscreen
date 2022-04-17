const Vue = require('vue/dist/vue');
const ClientLib = require('../../../../../lib/clientLib');
const momentTz = require('moment-timezone');
const styles = require('./styles.scss');

const TIME_PER_ITEM = 10000;

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
                if (items.length < 2){
                    this.infoItems.push(
                        {
                            title: "Did you know?", 
                            message: "The Lodi Golden State Pinball Festival started in 2018, but has a history dating back 7 years!",
                            imageUrl: "images/gspflogosm.jpg"
                        },
                        {
                            title: "Pinball was officially invented in 1871",
                            message: "Inventor Montague Redgrave from Ohio turned the century old Bagatelle game into the first pinball game.\n\nThe “Parlor Table Bagatelle” game got popular in bars, where high scores would earn you pride and maybe a free drink.",
                            imageUrl: "images/gspflogosm.jpg"
                        }
                    )
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
            

            const randomChoice = Math.floor(Math.random() * Math.floor(this.infoItems.length));
            this.activeItemIdx = randomChoice;
            this.activeItem = this.infoItems[randomChoice];
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