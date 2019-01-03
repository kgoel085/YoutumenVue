<template>
    <div class="row">
        <template v-if="!playlistGenerated">
            <div class="col-md-12 text-center">
                <loader></loader>
            </div>
        </template>
        <template v-else>
            <div id="playerBlck" class="col-md-8">
                <div id="videoPlyr"></div>
                <p v-if="videoId !== null">Received Video id is {{ videoId }}</p>
                <p v-if="playlistId !== null">Received Playlist id is {{ playlistId }}</p>
            </div>
            <div class="col-md-4">
                <ul id="playlistBlck" class="list-group">
                    <li v-for="(vid, index) in videoDetailsArr" :key="index" class="list-group-item" @click="playVid(vid.id, $event)" :data-id="vid.id">
                        <template v-if="vid.title">
                            <div class="media">
                                <div class="media-left">
                                    <a href="#">
                                        <img class="media-object" :src="vid.thumbnails.medium.url" width="140px" height="auto">
                                    </a>
                                </div>
                                <div class="media-body">
                                    <span class="media-heading"><strong>{{ vid.title }}</strong></span><br>
                                    <small>{{ vid.channelTitle }}</small>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <loader class="text-center"></loader>
                        </template>
                    </li>
                </ul>
            </div>
        </template>
    </div>
</template>

<script>
import Loader from '../../sections/extras/loader';
import { configArr } from '../../../classes/configuration';
export default {
    components:{
        'loader': Loader
    },
    data(){
        return{
            //Contains API call point required vars
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            },

            playerFrame: null,
            videoDetailsArr:[]
        }
    },
    computed:{
        ListReady(){
            return false;
        },
        playlistGenerated(){
            if(this.videoDetailsArr.length > 0) return true;
            return false;
        }
    },
    watch:{
        playlistGenerated(val){
            if(val){
                //If playlist is generated, play the video
                setTimeout(() => {
                    var listItem = null;
                    var listItemVid = null;

                    //Playlist first video id
                    var firstChidId = this.videoDetailsArr[0].id;
                    if(firstChidId){
                        if(document.querySelector('[data-id="'+firstChidId+'"]')) listItemVid = document.querySelector('[data-id="'+firstChidId+'"]');
                    }

                    //If video id is there play that video
                    if(this.videoId){
                        if(document.querySelector('[data-id="'+this.videoId+'"]')) listItemVid = document.querySelector('[data-id="'+this.videoId+'"]');
                    }

                    if(listItemVid !== null && listItemVid){
                        listItemVid.click();
                    }
                }, 1000);
            } 
        }
    },
    methods:{
        //Retrive all video id in a playlist
        getPlaylistVideos(val = this.playlistId, tmpArr = []){
            var vm = this;
             var paramsArr = {'playlistId': val, 'part': 'snippet,contentDetails','maxResults': 50, 'key': this.config.key, 'fields': 'items(snippet(resourceId/videoId))'};
            this.$http.get(this.config.url+'/playlistItems', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                       if(element.snippet){
                            if(element.snippet.resourceId.videoId) this.getVidDetails(element.snippet.resourceId.videoId);
                        }
                   });
                }
            });
        },

        //Get all video details
        getVidDetails(val = this.videoIdArr){
            var vm = this;
            var paramsArr = {'id': val, 'part': 'snippet,contentDetails','key': this.config.key};
            this.$http.get(this.config.url+'/videos', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        if(element.snippet){
                            element.snippet.id = element.id;
                            vm.videoDetailsArr.push(element.snippet);
                        }
                    });
                }
            });
        },

        //Play the current clicked video
        playVid(vidID, event){
            var listItem = event.target.closest('li');
            this.createPlayer(vidID);
        },

        //Get Playlist video id's
        createPlayer(vidId){
            if(!vidId) vidId = this.videoId;

            if(this.playrObj){
                if(this.playerFrame !== null) this.playerFrame.destroy();

                var configObj = {
                    width: '100%',
                    height: 500,
                    videoId: vidId,
                    events: {
                        onReady: this.initialize,
                        onStateChange: this.checkState
                    }
                };

                //Youtube Player Object
                this.playerFrame = new this.playrObj('videoPlyr', configObj);
            }
        },

        //This will be executed when player is ready
        initialize(){
            this.playerFrame.playVideo();
        },

        checkState(evt){
            //console.log(evt);
        }
    },
    beforeMount(){
        if(this.videoId) this.getVidDetails(this.videoId);
        if(this.playlistId) this.getPlaylistVideos(this.playlistId);
    },
    props:{
        videoId:{
            default: null,
            type: String
        },
        playlistId:{
            default:null,
            type:String
        },
        playrObj:{

        }
    }
}
</script>

<style>

</style>
