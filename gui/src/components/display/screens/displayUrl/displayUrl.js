const Vue = require('vue/dist/vue');
const styles = require('./styles.scss');

module.exports = Vue.component('display-url', {
    props: ['displayConfig'],
    template: `<iframe style="height:100%;width:100%" :src="displayConfig.url"></iframe>`
})