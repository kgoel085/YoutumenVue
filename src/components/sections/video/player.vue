<template>
    <div class="playerBLock">
        <!-- User can also provide a specific video / playlist -->
        <template v-if="!videoFound">
            <div class="form-group">
                <div class="panel panel-default ">
                    <!-- Default panel contents -->
                    <div class="panel-heading bg-danger">Provide either a video url / ID</div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-12">
                                <p>A youtube URL looks like this ( string afer <strong>/watch?v=*</strong> is the video id you want to play ) </p>
                                <strong>https://www.youtube.com/watch?v=<span class="bg-danger">XXXXXXXXXX</span></strong>
                            </div>
                            <div class="col-md-12">
                                <br>
                                <div class="form-group">
                                    <label for="">Paste video URL</label>
                                    <input type="text" name="" id="" class="form-control" placeholder='Paste URl / ID' v-model="vidUrlInput" @change="checkUrl()">
                                    <span v-if="invalidUrl" class="text-danger">Invalid URL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="row">
                <!-- iFrame Block -->
                <div class="col-md-8">
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" :src="ifrmUrl" style="width:100%;height:500px!important"></iframe>
                    </div>
                </div>
                

                <!-- <div class="col-md-12">
                    Video Type is : {{ videoType }} <br>
                    <template v-if="playlistVideo">
                        Playlist ID is : {{ videoId }} <br>
                        Playlist video ID is : {{ playlistVideo }} <br>
                    </template>
                    <template v-else>
                        Video ID is : {{ videoId }} <br>
                    </template>
                </div> -->
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
            
            vidUrlInput: null,

            invalidUrl: false,

            frame:{},

            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            }
        }
    },
    computed:{
        //Check for whether video / playlist found or not
        videoFound(){
            if(this.$route.params.video){
                this.videoId = this.$route.params.video;
                this.videoType = 'video';
            }

            if(this.$route.query.list){
                this.videoId = this.$route.query.list;
                this.playlistVideo = this.$route.params.video;
                this.videoType= 'playlist';
            }

            if(this.videoId && this.videoType){
                if(this.vidUrlInput) this.vidUrlInput = null
                return true;
            }    
            if(this.playlistVideo) this.playlistVideo = null
            return false;
        },

        //Constructs the iframe url
        ifrmUrl(){
            var url = "https://www.youtube.com/embed/";
            var urlParams = ['origin='+window.location.protocol+'//'+window.location.hostname];
            var vidId = this.videoId;

            if(this.videoType == 'playlist'){
                vidId = this.playlistVideo;
                urlParams.push('listType=playlist');
                urlParams.push('list='+this.videoId);
            }

            if(vidId) url = url+vidId;
            if(urlParams.length > 0){
                var strTemp = urlParams.join('&');
                url = url+'?'+strTemp;
            }

            return url;
        }
    },
    methods:{
        //Check whether provided youtube URL is valid or not
        checkUrl(){
            var urlType = null;
            var urlID = null;

            var videoRegEx = /(?:youtube\.com.*(?:\?|&)(?:v)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_]*)/g;
            var playlist = /(?:(?:\?|&)list=)((?!videoseries)[a-zA-Z0-9_]*)/g;

            var matchString = this.vidUrlInput;

            //Check if it is playlist or not
            if(matchString.match(playlist)){
                urlType = 'playlist';
                var extractedID = RegExp.$1;
                if(extractedID){
                    urlID = extractedID;
                }
            }

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

            //Create URL
            var urlVidID = null;
            var paraUrl = {};

            if(urlID){
                urlVidID = urlID;

                if(this.playlistVideo){
                    urlVidID = this.playlistVideo;

                    paraUrl['listType'] = 'playlist';
                    paraUrl['list'] = urlID;
                }
            }

            if(urlVidID){
                this.$router.push({
                    'name': 'Player',
                    'query': paraUrl,
                    'params': {'video': urlVidID}
                });
            }

            this.invalidUrl = true;
        }
    },
    mounted(){
        //this.checkForId();
    }
}
</script>

<style scoped>
    .bg-danger{background-color: #ff0000;color:#fff}
</style>
