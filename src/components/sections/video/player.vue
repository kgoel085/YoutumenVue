<template>
    <div class="playerBlock">
        <div id="overlay" v-if="!YTObj"></div>

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
                                    <input type="text" name="" id="" class="form-control" placeholder='Paste Youtube Vidoe / playlist URl ' v-model="userUrl.input" @change="checkUrl()">
                                    <span v-if="userUrl.error" class="text-danger">{{ userUrl.errorMsg }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <!-- Youtube Player container -->
            <div class="row">
                <!-- Video Player -->
                <div class="col-md-8">
                    <div class="row">
                        <!-- Video Frame -->
                        <div class="col-md-12">
                            <div class="embed-responsive embed-responsive-16by9">        
                                <div id="videoPlyr" class="embed-responsive-item"></div>
                            </div>
                        </div>

                        <!-- Video Description -->
                        <div class="col-md-12">
                            
                        </div>
                    </div>
                </div>

                <!-- Playlist Block -->
                <div class="col-md-4">
                    <ul class="list-group">
                        <li v-for="(vid, index) in videos" :key="index" class="list-group-item" @click="playVid(vid.vidId)">
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
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { configArr } from '../../../classes/configuration';
var player = '';
export default {
    data(){
        return{
            //Player Obj vars
            YTObj: null,
            YtObjChk: null,

            //Player parameters
            videos:[],
            playlistVids:[],
            videoId: null,
            playlistId: null,
            currentId: this.videoId,
            playerConfig:{
                autoplay: true
            },

            //User provided url input
            userUrl:{
                input: null,
                error: false,
                errorMsg: (this.$route.query.urlErr) ? this.$route.query.urlErr : 'Invalid URL'
            },

            //Contains API call point required vars
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            }
        }
    },
    computed:{
        //Check for whether video / playlist found or not
        videoFound(){
            //If user provided video id using URL
            if(!this.videoId){
                if(this.$route.query.v) this.videoId = this.$route.query.v;
            }

            //If user provided playlist id using URL
            if(!this.playlistId){
                if(this.$route.query.list) this.playlistId = this.$route.query.list;
            }

            if(this.videoId || this.playlistId){
                this.createPlayer();
                return true;
            }

            return false;
        },
    },
    watch:{
        videoId(val){
            if(!val) return ;
            this.checkId('videos', {'id': val, 'part': 'snippet,contentDetails'});
        },
        
        playlistId(val){
            if(!val) return ;
           this.checkId('playlistItems', {'playlistId': val, 'part': 'snippet,contentDetails','maxResults': 50});
        },
        
        //If Yt obj isset, clear the check interval loop
        YTObj(val){
            if(val) clearTimeout(this.YtObjChk);
        },

        //Add videos from playlist to main video playlist 
        playlistVids(val){
            val.forEach(element => {
                //Find if current id is all ready in main video arr
                var a = this.videos.indexOf(element);
                if(a < 0) this.checkId('videos', {'id': element, 'part': 'snippet,contentDetails'});
            });
        },

        currentId(val){
            console.log(val);
        }
    },
    methods:{
        checkYtAPI(){
            //Check if Youtube YT obj is loaded or not   
            if(window.YT) this.YTObj = window.YT; 

            //If not loaded start a loop to check when it is loaded set the var
            if(!this.YTObj){
                this.YtObjChk = setTimeout(() => {
                    if(window.YT) this.YTObj = window.YT;
                }, 1000);
            }
        },

        //Check the provided URL for Video / Playlist ID
        checkUrl(){
            // RegEx to check for either video or playlist id 
            var video = /(?:youtube\.com.*(?:\?|&)(?:v)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_]*)/g;
            var playlist = /(?:(?:\?|&)list=)((?!videoseries)[a-zA-Z0-9_]*)/g;

            var testString = this.userUrl.input;

            //Check for video
            if(testString.match(video)) this.videoId = RegExp.$1;

            //Check for playlist
            if(testString.match(playlist)) this.playlistId = RegExp.$1;
            
            if(this.videoId || this.playlistId){
                var queryUrl = {};
                if(this.videoId) queryUrl.v = this.videoId;
                if(this.playlistId) queryUrl.list = this.playlistId;

                if(Object.keys(queryUrl).length > 0){
                    this.$router.push({
                        name:'Player',
                        query: queryUrl
                    });
                }
            }else this.userUrl.error = true;
        },

        //Checks whether provided vidoe / playlist id is valid or not
        checkId(endPoint = null, params = {}, chkID){
            if(!endPoint || Object.keys(params).length == 0) return endPoint;
            if(!params.key) params.key = this.config.key;

            var vm = this;

            this.$http.get(this.config.url+'/'+endPoint, {'params': params}).then(response => response.json()).then(resp => {
               if(resp.items && resp.items.length > 0){
                   resp.items.forEach(element => {
                       if(element.snippet && params.id) element.snippet.vidId = params.id;
                       if(endPoint == 'videos') this.videos.push(element.snippet);
                       else{
                           if(element.snippet){
                               if(element.snippet.resourceId.videoId) this.playlistVids.push(element.snippet.resourceId.videoId);
                           }
                       }
                   });
                }else{

                }
            }, err => {
                //console.log(err);
            });
        },

        //Creates Youtubeplayer instance
        createPlayer(){
            if(this.YTObj.Player){
                if(player) player = null;

                //Youtube Player Object
                player = new this.YTObj.Player('videoPlyr', {
                    width: 600,
                    height: 400,
                    videoId: this.videoId,
                    events: {
                        onReady: this.initialize
                    }
                });
            }else{
                this.checkYtAPI();
            }
        },

        //Setup environment when player is ready
        initialize(){
            player.playVideo();
        },

        //Play provided vid ID
        playVid(id){
            this.currentId = id;
            player.cueVideoById(id).playVideo();
        }
    },
    beforeCreate(){
        //Append API source in the header
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    beforeMount(){
        this.checkYtAPI();
        //this.checkForId();
    },
    updated(){
        this.checkYtAPI();
        this.createPlayer();
    }
}
</script>

<style scoped>
    #overlay{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color:#000;
        opacity: .75;
        z-index: 9999999;
    }
    .bg-danger{background-color: #ff0000;color:#fff}
</style>
