const Vue = require('vue/dist/vue');
const moment = require('moment');

module.exports = Vue.component('announcement-item', {
    props: {
        announcement: Object
    },
    template: `
        <li><a style="color:white;">{{announcement.message}}</a></li>
    `
})