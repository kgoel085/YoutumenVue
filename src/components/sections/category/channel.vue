<template>
    <div class="col-md-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="media">
                    <div class="media-left">
                        <a href="#">
                            <img class="media-object" :src="dataObj.category.thumbnails.default.url">
                        </a>
                    </div>
                    <div class="media-body">
                        <h4 class="title"><strong>{{ dataObj.category.title.replace(/\b\w/g, function(l){ return l.toUpperCase() }) }}</strong></h4>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <cat-video :videoObj="dataObj.video" :videoType="this.view"></cat-video>
            </div>
        </div>
    </div>
</template>

<script>
import Video from '../video/index.vue';
export default {
    data(){
        return{
            dataObj: {
                category: {},
                video: {}
            }
        }
    },
    methods:{
        callAPi(){
            var vm = this;
            
            var paramsArr = {'part': 'snippet,contentDetails', 'id': vm.catObject.channelId, 'fields': 'items(id,contentDetails,snippet(title, thumbnails, description))'};
            this.$http.get('channels', {params: paramsArr}).then(resp => resp.json()).then(response => {
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
            });
        }
    },
    created(){
        this.callAPi();
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
</style>
