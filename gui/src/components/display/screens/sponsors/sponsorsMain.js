const Vue = require('vue/dist/vue');

module.exports = Vue.component('sponsors-main', {
    data: function(){return {
        images: [
            '/public/gspfscreen/images/sponsors/allpurespons.png',
            '/public/gspfscreen/images/sponsors/capPubspons.png',
            '/public/gspfscreen/images/sponsors/cliffyspon.jpg',
            '/public/gspfscreen/images/sponsors/coin-opSpons.jpg',
            '/public/gspfscreen/images/sponsors/DHIFspons.jpg',
            '/public/gspfscreen/images/sponsors/fliproomspons.jpg',
            '/public/gspfscreen/images/sponsors/GEXspons.jpg',
            '/public/gspfscreen/images/sponsors/Hawkspons.jpg',
            '/public/gspfscreen/images/sponsors/herlifespons.jpg',
            '/public/gspfscreen/images/sponsors/kludtspons.jpg',
            '/public/gspfscreen/images/sponsors/marcospecspons.jpg',
            '/public/gspfscreen/images/sponsors/mezelspons.jpg',
            '/public/gspfscreen/images/sponsors/PPMspons.jpg',
            '/public/gspfscreen/images/sponsors/RobAnthSpon.jpg',
            '/public/gspfscreen/images/sponsors/wescospons.jpg'
        ]
    }},
    template: `
        <div class="sponsors-main">
            <div class="header">2019 Golden State Pinball Festival Sponsors</div>
            <div class="sponsor-images">
                <div v-for="image in images" :key="image"><img v-bind:src="image"></div>
            </div>
        </div>`
})