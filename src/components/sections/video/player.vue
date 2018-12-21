<template>
    <div class="row">
        <!-- User can also provide a specific video / playlist -->
        <template v-if="!videoFound">
            <!-- Modal -->
            <div id="myModal" class="modal fade in" role="dialog" style="display:block">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header bg-danger">
                            <h4 class="modal-title">Provide either a video url / ID </h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>A youtube URL looks like this ( string afer <strong>/watch?v=*</strong> is the video id you want to play ) </p>
                                    <strong>https://www.youtube.com/watch?v=<span class="bg-danger">XXXXXXXXXX</span></strong>
                                </div>
                                <div class="col-md-12">
                                    <br>
                                    <div class="form-group">
                                        <label for="">Paste video URL / ID</label>
                                        <input type="text" name="" id="" class="form-control" placeholder='Paste URl / ID' v-model="videoInput" @change="checkUrl()">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="col-md-12">
                Video Type is : {{ videoType }} <br>
                <template v-if="playlistVideo">
                    Playlist ID is : {{ videoId }} <br>
                    Playlist video ID is : {{ playlistVideo }} <br>
                </template>
                <template v-else>
                    Video ID is : {{ videoId }} <br>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import { configArr } from '../../../classes/configuration';

export default {
    data(){
        return{
            iframeUrl: 'https://www.youtube.com/embed',

            videoId: null,
            videoType: null,
            
            playlistVideo: null,
            
            videoInput: null,
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            }
        }
    },
    computed:{
        //Check for whether video / playlist found or not
        videoFound(){
            if(this.videoId && this.videoType){
                if(this.videoInput) this.videoInput = null
                return true;
            }    
            if(this.playlistVideo) this.playlistVideo = null
            return false;
        }
    },
    methods:{
        //Check for video/playlist ID & type
        checkForId(id, type){
            var vidType = null;

            //If id and type are given set thm
            if(type == 'video' || type == 'playlist' && id){
                this.videoId = id;
                this.videoType = type;
                return false;
            }

            //First check if id is in route
            if(this.$route.params.id){
                vidType = this.getResponse(this.$route.params.id);
                if(vidType) this.checkForId(id, vidType);
            }
        },
        getResponse(id, type){
            var responseTrue = false;
            var returnVal = null;

            if(!id) return returnVal;

            if(!type || type == 'video'){
                //First check if it is video or not
                this.$http.get(this.config.url+'/videos', {params: {'id': id, 'key': this.config.key}}).then(resp => resp.json()).then(response => {
                    if(response.items.length && response.kind == 'youtube#videoListResponse'){
                       this.checkForId(id, 'video');
                        return false;
                    }

                    this.getResponse(id, 'playlist');
                }, err => {
                    this.getResponse(id, 'playlist');
                });
            }
            
            if(type == 'playlist'){
                //If still no result, search for playlist
                this.$http.get(this.config.url+'/playlistItems', {params: {'playlistId': id, 'key': this.config.key}}).then(resp => resp.json()).then(response => {
                     if(response.items.length && response.kind == 'youtube#playlistItemListResponse'){
                       this.checkForId(id, 'playlist');
                        return false;
                    }
                   this.getResponse();
                }, err => {
                    this.getResponse();
                });
            }
        },

        //Check whether provided youtube URL is valid or not
        checkUrl(){
            var urlType = null;
            var urlID = null;

            var videoRegEx = /(?:youtube\.com.*(?:\?|&)(?:v)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_]*)/g;
            var playlist = /(?:(?:\?|&)list=)((?!videoseries)[a-zA-Z0-9_]*)/g;

            var matchString = this.videoInput;

            //Check if it is playlist or not
            if(matchString.match(playlist)){
                urlType = 'playlist';
                var extractedID = RegExp.$1;
                if(extractedID){
                    urlID = extractedID;
                }
            }

            //if(!urlID || !urlType){
                //Check if it is video or not
                if(matchString.match(videoRegEx)){
                    var extractedID = RegExp.$1;
                    if(extractedID){

                        //If playlist is already set, this will be the video id to play in the playlist
                        if(urlType == 'playlist'){
                            this.playlistVideo = extractedID;
                        }else{
                            urlType = 'video';
                            urlID = extractedID;
                        }
                    }
                }
            //}

            if(urlType) this.videoType = urlType;
            if(urlID) this.videoId = urlID;
        }
    },
    mounted(){
        this.checkForId();
    }
}
</script>

<style scoped>
    .bg-danger{background-color: #ff0000;color:#fff}
</style>
