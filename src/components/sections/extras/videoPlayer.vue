<template>
    <div class="row">
        <template v-if="!playlistGenerated">
            <div class="col-md-12 text-center">
                <loader></loader>
            </div>
        </template>
        <template v-else>
            <div class="col-md-8">
                <div id="videoPlyr"></div>
                <p v-if="videoId !== null">Received Video id is {{ videoId }}</p>
                <p v-if="playlistId !== null">Received Playlist id is {{ playlistId }}</p>
            </div>
            <div class="col-md-4">
                <ul class="list-group">
                    <li v-for="(vid, index) in videoDetailsArr" :key="index" class="list-group-item" @click="playVid(vid.vidId)">
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
            playListArr: [],
            currentPlayId: null,
            videoDetailsArr:[],
            
        }
    },
    computed:{
        ListReady(){
            return false;
        },
        videoIdArr(){
            var tmpArr = [];
            if(this.videoId) tmpArr.push(this.videoId);
            if(this.playListArr){
                tmpArr = tmpArr.concat(this.playListArr);
            }

            return tmpArr;
        },
        playlistGenerated(){
            if(this.videoDetailsArr.length > 0){
                this.createPlayer();
                return true;
            }

            return false;
        }
    },
    watch:{
        videoIdArr(val){
            this.getVidDetails(val);
        }
    },
    methods:{
        //Retrive all video id in a playlist
        getPlaylistVideos(val = this.playlistId, tmpArr = []){
            var vm = this;
             var paramsArr = {'playlistId': val, 'part': 'snippet,contentDetails','maxResults': 50, 'key': this.config.key, 'fields': 'items(snippet(resourceId/videoId))'};
            this.$http.get(this.config.url+'/playlistItems', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var tmpIdArr = [];
                    resp.items.forEach(element => {
                       if(element.snippet){
                            if(element.snippet.resourceId.videoId) vm.playListArr.push(element.snippet.resourceId.videoId);
                        }
                   });
                }
            });
        },

        //Get all video details
        getVidDetails(val = this.videoIdArr){
            var vm = this;
            if(this.videoIdArr.length > 0){
                var videoIds = this.videoIdArr.join(',');
                var paramsArr = {'id': videoIds, 'part': 'snippet,contentDetails','key': this.config.key};
                this.$http.get(this.config.url+'/videos', {'params': paramsArr}).then(response => response.json()).then(resp => {
                    if(resp.items && resp.items.length > 0){
                            var tmpIdArr = [];
                            resp.items.forEach(element => {
                            if(element.snippet){
                                element.snippet.id = element.id;
                                vm.videoDetailsArr.push(element.snippet);
                            }
                        });
                    }
                });
            }
        },

        //Get Playlist video id's
        createPlayer(vidId = this.videoId){
            if(this.playrObj){
                if(this.playerFrame !== null) this.playerFrame = null;

                var configObj = {
                    width: '100%',
                    height: 500,
                    videoId: vidId,
                    events: {
                        onReady: this.initialize
                    }
                };

                //Youtube Player Object
                this.playerFrame = new this.playrObj('videoPlyr', configObj);
            }
        },

        //This will be executed when player is ready
        initialize(){
            //this.playerFrame.playVideo();
        }
    },
    beforeMount(){
         if(this.playlistId){
           this.getPlaylistVideos(this.playlistId);
        }
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
