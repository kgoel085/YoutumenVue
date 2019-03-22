<template>
    <div class="col-md-12" v-if="showBlock">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="media">
                    <template v-if="Object.keys(dataObj.category).length > 0">
                        <div class="media-left">
                            <a href="#">
                                <img class="media-object" :src="dataObj.category.thumbnails.default.url">
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="title"><strong>{{ dataObj.category.title.replace(/\b\w/g, function(l){ return l.toUpperCase() }) }}</strong></h4>
                        </div>
                        <div class="media-right">
                            <i class="glyphicon glyphicon-remove" @click="showBlock = !showBlock"></i>
                        </div>
                    </template>
                </div>
            </div>
            <div class="panel-body">
                <template v-if="Object.keys(dataObj.video).length > 0">
                    <cat-video :videoObj="dataObj.video" :videoType="this.view"></cat-video>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Video from '../video/index.vue';
import Youtube from '../../../classes/Youtube.js';

export default {
    data(){
        return{
            dataObj: {
                category: {},
                video: {}
            },
            apiParamerts: {
                'endpoint': 'Channel', 
                'params': {'id': this.catObject.channelId},
                'successCall': this.getResult
            },
            showBlock: true
        }
    },
    methods:{
        getResult(respObj){
            var vm = this;
            var response = respObj;

            if(response.items){
                var respItm = response.items;
                respItm.forEach(element => {
                    if(element.snippet){
                        var snip = element.snippet;
                        vm.dataObj.category = snip;
                    }

                    if(element.contentDetails.relatedPlaylists){
                        var playList = element.contentDetails.relatedPlaylists;
                        if(playList.uploads) vm.dataObj.video['playlistId'] = playList.uploads;
                    }
                });
            }
        }
    },
    created(){
        var ytObj = new Youtube(this.apiParamerts);
        ytObj.callAPi();
    },
    props:{
        catObject:{
            type: Object,
            default: {}
        },
        view:{
            type:String,
            default: 'playlist'
        }
    },
    components:{
        'cat-video': Video
    }
}
</script>

<style scoped>
    .panel{
        border:1px solid transparent;
        border-bottom:1px solid #ddd;
    }

    .panel > .panel-heading{
        border-bottom: 1px solid transparent;
    }

    .media-object{
        display: block;
        border-radius: 100%;
        width: 32px;
        height: auto;
    }

    .media-body, .media-left, .media-right{
        vertical-align: middle!important;
    }

    .media-body .title{
        font-weight: 500
    }

    .glyphicon{
        color:#ccc;
        cursor:pointer;
        font-size:2em;
    }
</style>
