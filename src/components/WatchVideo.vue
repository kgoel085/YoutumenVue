<template>
    <div id="playerBLock">
        <!-- If video id or playlist id is unavailable, ask user for the URL -->
        <template v-if="!contentFound">
            <div class="panel panel-danger ">
                <!-- Default panel contents -->
                <div class="panel-heading">Provide a url to watch </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-12">
                            <p>A youtube URL looks like this <strong>https://www.youtube.com/watch?v=<span class="bg-danger">XXXXXXXXXX</span></strong> </p>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <input type="text" name="" id="" class="form-control" placeholder='Paste Youtube Video / playlist URl ' v-model="userInput.url">
                                <span v-if="userInput.error" class="text-danger">{{ userInput.errorMsg }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="row">
                
                <div class="col-md-8">
                    <div class="row">
                        <!-- Video Player -->
                        <div class="col-md-12">
                            <div class="row">
                                <vidPlayer :videoId="currentVidId" @VideoEnded="getNextVid" @videoLoaded="videoLoaded = true" :key="currentVidId"></vidPlayer>
                            </div>
                        </div>

                        <div class="clearfix"></div>

                        <!-- Details Block -->
                        <div class="col-md-12" v-if="detailsFound">
                            <!-- If video is loaded -->
                            <template v-if="videoLoaded">
                                <!-- Title -->
                                <h3 v-if="vidArr.title">{{ vidArr.title }}</h3>

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
                                <div class="row" v-if="Object.keys(vidArr.channelDetails).length > 0 ">
                                    <div class="media col-sm-12">
                                        <div class="media-left media-middle">
                                            <a href="#">
                                                <img class="media-object" :src="vidArr.channelDetails.thumbnails.default.url " alt="" :width="vidArr.channelDetails.thumbnails.default.width+'px'" :height="vidArr.channelDetails.thumbnails.default.height+'px'">
                                            </a>
                                        </div>
                                        <div class="media-body">
                                            <h4 class="media-heading">{{vidArr.channelDetails.title }}</h4>
                                            <small>Published on {{ vidArr.channelDetails.publishedAt | dateTime }}</small>
                                        </div>
                                        <div class="media-right media-middle">
                                            <button type="button" class="btn btn-lg btn-block btn-default">Current Subscribers - {{ vidArr.channelDetails.stats.subscriberCount }} </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Video description -->
                                <div class="row" v-if="vidArr.description">
                                    <div class="col-md-12">
                                        <span>{{ vidArr.description }}</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <loader class="text-center"></loader>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Playlist -->
                <div class="col-md-4">
                    <playList :videoId="videoId" :playlistId="playlistId" :prevPlayId="prevPlayItem" :currentPlayId="currentVidId" :autoplay="autoplayVid" @nextPlaylistItem="playNextVid" @currentItemDetails="showDetails" @autoPlaychanged="autoplayVid = !autoplayVid"></playList>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { configArr } from '../classes/configuration';
import Loader from './sections/extras/loader';
import vidPlayer from './sections/Player';
import playList from './sections/Playlist';

export default {
    data(){
        return{
            //Contains API call point required vars
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            },

            // Video & Playlist vars
            videoId: null,
            playlistId: null,

            //User Input vars
            userInput:{
                url: null,
                error: false,
                errorMsg: 'Invalid URL',
            },

            //Current playlist item
            currentVidId: null,

            //Previous playlist item 
            prevPlayItem: null,

            //Current video details
            vidArr:{},

            //Video loaded
            videoLoaded: false,

            //Video ended
            videoEnded: false,

            //Autoplay video
            autoplayVid: true
        }
    },
    computed:{
        //Checks whether any video or playlist id found or not
        contentFound(){
            //If user provided video id using URL
            if(!this.videoId){
                if(this.$route.query.v) this.videoId = this.$route.query.v;
            }

            //If user provided playlist id using URL
            if(!this.playlistId){
                if(this.$route.query.list) this.playlistId = this.$route.query.list;
            }

            if(this.videoId || this.playlistId){
                return true;
            }

            return false;
        },

        //If Detail arr has something
        detailsFound(){
            if(this.currentVidId !== null) return true;
            return false;
        }
    },
    watch:{
        //Watch for user provided url
        'userInput.url'(val){
            if(val !== null) this.checkUrl(val);
        },

        //If video has ended and autoplay is triggered, play next video
        autoplayVid(val){
            if(val && this.videoEnded) this.getNextVid(this.currentVidId);
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
                if(urlDt.video) queryUrl.v = urlDt.video;
                if(urlDt.playlist) queryUrl.list = urlDt.playlist;
            }

            if(Object.keys(queryUrl).length > 0){
                this.$router.push({
                    name:'Player',
                    query: queryUrl
                });
            }

            return false;
        },

        //Play next video in playlist
        playNextVid(val){
            this.videoEnded = false;
            if(val) this.currentVidId = val;
        },

        //If current video ends, get next one
        getNextVid(val){
            this.videoEnded = true;
            if(val && this.autoplayVid) this.prevPlayItem = val; 
        },

        //Get details regarding current playing video
        showDetails(val){
            if(Object.keys(val).length > 0){
                this.vidArr = {};
                this.vidArr = val;
            }
        }
    },
    components:{
        Loader,
        vidPlayer,
        playList
    }
}
</script>

<style scoped>
    #playerBLock .panel-danger .panel-heading {
        color: #fff;
        background-color: #ea062b;
        border-color: #ea062b;
    }
    #playerBLock .panel-danger {
        border-color: #ea062b;
    }
</style>
