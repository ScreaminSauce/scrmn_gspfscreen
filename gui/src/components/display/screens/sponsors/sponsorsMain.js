const Vue = require('vue/dist/vue');
const styles = require('./styles.scss');

module.exports = Vue.component('sponsors-main', {
    props: ['displayConfig'],
    data: function(){
        return {
            images: [
                'images/sponsors/coin-opSpons.jpg',
                'images/sponsors/PPMspons.jpg',
                'images/sponsors/Hawkspons.jpg',
                'images/sponsors/marcospecspons.jpg',
                'images/sponsors/wow-spons.png',
                'images/sponsors/pirate-spons.png'
            ]
        }
    },
    template: `
        <div class="sponsors-main">
            <div class="header">2022 Golden State Pinball Festival Sponsors</div>
            <div class="sponsor-images">
                <div v-for="image in images" :key="image"><img v-bind:src="image"></div>
            </div>
        </div>`
})