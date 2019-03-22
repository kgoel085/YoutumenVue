<template>
    <div class="row">
        <template v-if="!playlistGenerated">
            <div class="col-md-12 text-center">
                <loader></loader>
            </div>
        </template>
        <template v-else>
            <div id="playerBlck" class="col-md-8">
                <div class="row">
                    <!-- Player Block -->
                    <div class="col-md-12">
                        <div id="videoPlyr"></div>
                    </div>

                    <!-- Video details block -->
                    <div class="col-md-12">
                        <template v-if="vidArr !== null">
                            <!-- Title -->
                            <p v-if="vidArr.details.title">{{ vidArr.details.title }}</p>

                            <!-- Stats -->
                            <div class="row" v-if="Object.keys(vidArr.stats).length > 0">
                                <div class="col-md-6">
                                    <p>{{ vidArr.stats.viewCount | currency }} Views</p>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <span class="input-group-addon" id="basic-addon1">
                                                    <i class="glyphicon glyphicon-thumbs-up"></i>
                                                </span>
                                                <input type="text" disabled v-model="vidArr.stats.likeCount" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <span class="input-group-addon" id="basic-addon2">
                                                    <i class="glyphicon glyphicon-thumbs-down"></i>
                                                </span>
                                                <input type="text" disabled v-model="vidArr.stats.dislikeCount" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Channel details  -->
                            <div class="row" v-if="Object.keys(vidArr.channel).length > 0 ">
                                <div class="media">
                                    <div class="media-left media-middle">
                                        <a href="#">
                                            <img class="media-object" :src="vidArr.channel.thumbnails.default.url " alt="" :width="vidArr.channel.thumbnails.default.width+'px'" :height="vidArr.channel.thumbnails.default.height+'px'">
                                        </a>
                                    </div>
                                    <div class="media-body">
                                        <h4 class="media-heading">{{vidArr.channel.title }}</h4>
                                        <small>Published on {{ vidArr.channel.publishedAt | dateTime }}</small>
                                    </div>
                                    <div class="media-right media-middle">
                                        <button type="button" class="btn btn-lg btn-block btn-default">Current Subscribers - {{ vidArr.channel.stats.subscriberCount }} </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Video description -->
                            <div class="row" v-if="vidArr.details.description">
                                <div class="col-md-12">
                                    <span>{{ vidArr.details.description }}</span>
                                </div>
                                
                            </div>
                        </template> 
                        <template v-else>
                            <loader class="text-center"></loader>
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <ul id="playlistBlck" class="list-group">
                    <!-- Add another video / playlist in the current one -->
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-md-8">
                                <input type="text" name="" id="" class="form-control" placeholder="Enter the Video / Playlist url you want to add" v-model="userInput.url">
                            </div>
                            <div class="col-md-4">
                                <div class="input-group">
                                    <span class="input-group-btn">
                                        <span class="btn" @click="autoplay = !autoplay" >Autoplay</span> 
                                    </span>
                                    <template v-if="autoplay">
                                        <span class="glyphicon glyphicon-ok text-success" style="padding:7px"></span>
                                    </template>
                                    <template v-else>
                                        <span class="glyphicon glyphicon-remove text-danger" style="padding:7px"></span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </li>

                    <!-- Fetched list from the URL parameters -->
                    <draggable v-model="videoDetailsArr" @end="checkCurrentVid()">
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
                    </draggable>
                </ul>
            </div>
        </template>
    </div>
</template>

<script>
import Loader from '../../sections/extras/loader';
import { configArr } from '../../../classes/configuration';
import draggable from 'vuedraggable'

export default {
    components:{
        'loader': Loader,
        draggable
    },
    data(){
        return{
            //Contains API call point required vars
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            },
            //Current playing ID
            currentId: null,

            //Current video ended
            videoEnded: false,

            //Current player object
            playerFrame: null,

            //Contains all the videos received in the route or by user
            videoDetailsArr:[],

            //Decides whetehr to play next vidoe or not
            autoplay: true,

            //Current video details only
            vidArr: null,

            //User Input vars
            userInput:{
                url: null,
                error: false,
                errorMsg: 'Invalid URL'
            },
        }
    },
    computed:{
        //If playlist has any video's return true else false
        playlistGenerated(){
            if(this.videoDetailsArr.length > 0) return true;
            return false;
        }
    },
    watch:{
        //If playlist has something than proceed
        playlistGenerated(val){
            if(val){
                //Play the first video in the list
                setTimeout(() => {
                    this.playNextVid();
                }, 1000);
            } 
        },

        //If autoplay is enabled and video as ended, play next one
        videoEnded(value){
            if(value && this.autoplay) this.playNextVid();
        },

        //If auto play is enabled wait for video to finish and go to next else if video has already ended play next video
        autoplay(value){
            if(value && this.videoEnded) this.playNextVid();
        },

        //Valdiate the URL provided by the user
        'userInput.url'(val){
            if(val !== null) this.checkUrl(val);
        },

        //Check for the active video in the playlist and perform specific acions
        currentId(val){
            this.checkCurrentVid(val);

            //Show current video details
            var response = this.videoDetailsArr.findIndex(element => (element.id == val));
            //if(this.videoDetailsArr[response]) this.showVidDetails(response);
        }
    },
    methods:{
        //Validate and Extracts Video ID / Playlist ID from the provided URl
        checkUrl(url = ''){
            var rspUrl = this.$helpers.validateUrl(url);

            if(!rspUrl.success){
                this.userInput.error = true;
                if(rspUrl.errorMsg) this.userInput.errorMsg = rspUrl.errorMsg;
                return false;
            }

            var queryUrl = {};
            if(rspUrl.success && rspUrl.data){
                this.userInput.error = false;

                var urlDt = rspUrl.data;
                if(urlDt.video) this.getVidDetails(urlDt.video);
                if(urlDt.playlist) this.getPlaylistVideos(urlDt.playlist);

                this.userInput.url = null;
            }

            return false;
        },

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
            var paramsArr = {'id': val, 'part': 'snippet,contentDetails,statistics','key': this.config.key};
            this.$http.get(this.config.url+'/videos', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        if(element.snippet){
                            element.snippet.id = element.id;
                            if(element.statistics) element.snippet.stats = element.statistics;
                            if(vm.videoDetailsArr.length){
                                var response = vm.videoDetailsArr.findIndex(element11 => (element11.id == element.id));
                                if(response < 0){
                                    vm.videoDetailsArr.push(element.snippet);
                                }
                            }else{
                                vm.videoDetailsArr.push(element.snippet);
                            }
                        }
                    });
                }
            });
        },

        //Get Channel details
        getChannelDetails(val = ''){
            if(!val) return false;

            var vm = this;
            var paramsArr = {'id': val, 'part': 'snippet,statistics','key': this.config.key, 'fields': 'items(id,snippet(title, publishedAt, thumbnails),statistics)'};

            this.$http.get(this.config.url+'/channels', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        if(element.snippet){
                            element.snippet.id = element.id;
                            if(element.statistics) element.snippet.stats = element.statistics;
                            vm.vidArr.channel = element.snippet;
                        }
                    });
                }
            });
        },

        //Check for the current playing video
        checkCurrentVid(val = ''){
            if(!val) val = this.currentId;

            var listItem = document.querySelector('li[data-id="'+val+'"]');

            if (typeof(listItem) != 'undefined' && listItem != null){
                var result = [],
                node = listItem.parentNode.firstChild;

                while ( node ) {
                    if ( node !== listItem && node.nodeType === Node.ELEMENT_NODE ){
                        if(node.classList.contains('active')) node.classList.remove('active');
                    }
                    
                    node = node.nextElementSibling || node.nextSibling;
                }

                if(listItem.classList.contains('active') == false) listItem.classList.add('active');
            }
        },

        //Show current video details
        showVidDetails(val = ''){
            if(!this.videoDetailsArr[val]) return false;

            var currentObj = this.videoDetailsArr[val];
            this.vidArr = {};

            //Stats
            if(currentObj.stats) this.vidArr.stats = currentObj.stats;

            //Video details
            if(currentObj) this.vidArr.details = currentObj;

            //Video tags
            if(currentObj.tags) this.vidArr.tags = currentObj.tags;
            
            //Channel details
            if(currentObj.channelId) this.getChannelDetails(currentObj.channelId);
        },

        //Play the current clicked video
        playVid(vidID, event){
            this.createPlayer(vidID);
        },

        //Play next video
        playNextVid(){
            var response = this.videoDetailsArr.findIndex(element => (element.id == this.currentId));

            if(!response) response = 0;
            response += 1;

            var nextVid = this.videoDetailsArr[0].id;
            if(this.videoDetailsArr[response].id) nextVid = this.videoDetailsArr[response].id;

            if(nextVid){
                var liElem = document.querySelector('li[data-id="'+nextVid+'"]');
                if(liElem) liElem.click();
            }
        },

        //Get Playlist video id's
        createPlayer(vidId, index){
            if(!vidId) vidId = this.videoId;
            this.currentId = vidId;

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

        //Do actions based on current video state
        checkState(evt){
            var evntData = false;

            //Video ended
            if(evt.data == 0){
                this.videoEnded = true;
            }else{
                this.videoEnded = false;
            }
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
