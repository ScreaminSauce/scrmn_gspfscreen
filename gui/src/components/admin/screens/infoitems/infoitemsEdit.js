'use strict';
const ClientLib = require('../../../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const _ = require('lodash');

module.exports = Vue.component('infoitem-edit', {
    props: {
        infoitem: Object
    },
    data: function () {
        return {
            editedInfoItem: Object
        }
    },
    mounted: function(){
        this.editedInfoItem = _.cloneDeep(this.infoitem);
    },
    template: `
    <tr>
        <td>
            <input style="width:100%;" type="text" v-model="editedInfoItem.title">
        </td>
        <td>
            <textarea style="width:100%;" v-model="editedInfoItem.message"></textarea>
        </td>
        <td>
            <input style="width:100%;" type="text" v-model="editedInfoItem.imageUrl">
        </td>
        <td>
            <button class="btn btn-primary" v-on:click="onSaveButtonClicked">Save</button>
            <button class="btn btn-secondary" v-on:click="onCancelButtonClicked">Cancel</button>
        </td>
    </tr>
    `,
    methods: {
        onSaveButtonClicked: function(){
            let toBeSaved = {
                title: this.editedInfoItem.title,
                message: this.editedInfoItem.message,
                imageUrl: this.editedInfoItem.imageUrl
            }

            ClientLib.updateInfoItem(this.editedInfoItem._id, toBeSaved)
                .then((result)=>{
                    this.infoitem.title = result.title;
                    this.infoitem.message = result.message;
                    this.infoitem.imageUrl = result.imageUrl;
                    this.$emit('cancel-infoitem');
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        onCancelButtonClicked: function(){
            this.$emit('cancel-infoitem');
        }
    }
})