<template>
    <div class="row">
        <template v-if="!playlistGenerated">
            <loader></loader>
        </template>
        <template v-else>
            <div class="col-md-9">
                <div id="videoPlyr"></div>
                <p v-if="videoId !== null">Received Video id is {{ videoId }}</p>
                <p v-if="playlistId !== null">Received Playlist id is {{ playlistId }}</p>
            </div>
            <div class="col-md-3">
                Playlist area
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
            currentPlayId: null
            
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

            this.getVidDetails();

            return tmpArr;
        },
        playlistGenerated(){
            if(this.videoIdArr.length > 0){
                if(this.currentPlayId == null) this.createPlayer(this.videoIdArr[0]);
                return true;
            }

            return false;
        }
    },
    methods:{
        //Retrive all video id in a playlist
        getPlaylistVideos(val = this.playlistId, tmpArr = []){
            var vm = this;
            if(tmpArr && tmpArr.length > 0) return tmpArr;

            var paramsArr = {'playlistId': val, 'part': 'snippet,contentDetails','maxResults': 50, 'key': this.config.key, 'fields': 'items(snippet(resourceId/videoId))'};
            this.$http.get(this.config.url+'/playlistItems', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var tmpIdArr = [];
                    resp.items.forEach(element => {
                       if(element.snippet){
                            if(element.snippet.resourceId.videoId) vm.playListArr.push(element.snippet.resourceId.videoId);
                        }
                   });

                   if(tmpIdArr.length > 0) this.getPlaylistVideos(val, tmpIdArr);
                }
            });
        },

        //Get all video details
        getVidDetails(){
            
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
