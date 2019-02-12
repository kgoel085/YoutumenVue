<template>
    <div class="row">
        <div class="col-md-12 videoBox" @click="showVideo">
            <div class="media">
                <div class="media-left">
                    <a href="#" class="imgBlock pull-left">
                        <img class="media-object" :src="currentObj.thumbnails.medium.url">
                        <span class="badge" v-if="videoLength !== null">{{ videoLength }}</span>
                    </a>
                </div>
                <div class="media-body">
                    <h4 class="media-heading">{{ currentObj.title }}</h4>
                    <span class="media-content">
                        <p><small>{{ currentObj.channelTitle }}</small> | <small>{{ currentObj.publishedAt | dateTime}}</small></p>
                        {{ currentObj.description.substr(0, 400) + '....' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {configArr} from '../../classes/configuration';

export default {
    data(){
        return{
            videoLength: null,

            //Contains API call point required vars
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            },
        }
    },
    computed:{
        currentObj(){
            return this.videoObj;
        },
        videoId(){
            if(this.videoObj.videoId){
                return this.videoObj.videoId;
            }
            return null;
        },
        playlistId(){
            if(this.videoObj.playlistId) return this.videoObj.playlistId;
            return null;
        },
    },
    methods:{
        //Get the content details for the current video
        getContent(vidId = this.videoId){
            var vm = this;
            this.$http.get(this.config.url+'/videos', {'params': {'part': 'contentDetails', 'id': vidId, 'key': this.config.key, 'fields': 'items(contentDetails/duration)' }}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        //Get only duration
                        if(element.contentDetails.duration) vm.videoLength = vm.$helpers.formatVideoLength(element.contentDetails.duration);
                    });
                }
            });
        },

        //Go to the video
        showVideo(){
            var queryObj = {};

            if(this.videoId) queryObj['v'] = this.videoId;
            if(this.playlistId) queryObj['list'] = this.playlistId;

            if(Object.keys(queryObj).length > 0){
                this.$router.push({
                    name:'Player',
                    query: queryObj
                });
            }
        }
    },
    mounted(){
       if(this.videoId) this.getContent();
    },
    props:{
        videoObj:{
            type: Object,
            default:{}
        },
    }
}
</script>

<style scoped>
    .imgBlock{
        position:relative
    }

    .imgBlock .badge{
        position:absolute;bottom:3px;right:3px
    }
</style>
