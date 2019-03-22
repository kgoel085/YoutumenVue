<template>
    <ul id="playlistBlck" class="list-group">
        <li class="list-group-item">
            <div class="row">
                <div class="col-md-8">
                    <input type="text" name="" id="" class="form-control" placeholder="Enter the Video / Playlist url you want to add" v-model="userInput.url">
                </div>
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-btn">
                            <span class="btn" @click="playlistAutoPlay = !playlistAutoPlay" >Autoplay</span> 
                        </span>
                        <template v-if="playlistAutoPlay">
                            <span class="glyphicon glyphicon-ok text-success" style="padding:7px"></span>
                        </template>
                        <template v-else>
                            <span class="glyphicon glyphicon-remove text-danger" style="padding:7px"></span>
                        </template>
                    </div>
                </div>
            </div>
        </li>
        <template v-if="!playlistGenerated">
            <li class="list-group-item alert">
                <p>No video found !</p>
            </li>
        </template>
        <template v-else>
            <!-- Fetched list from the URL parameters -->
            <draggable v-model="videoDetailsArr" @end="checkCurrentVid()">
                <li v-for="(vid, index) in videoDetailsArr" :key="index" class="list-group-item" @click="playNextVid(vid.id, true)" :data-id="vid.id">
                    <template v-if="vid.thumbnails">
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
        </template>
    </ul>
</template>

<script>
import Loader from '../sections/Loader';
import draggable from 'vuedraggable'

export default {
    data(){
        return{
            //User Input vars
            userInput:{
                url: null,
                error: false,
                errorMsg: 'Invalid URL'
            },

            //Contains all the videos received in the route or by user
            videoDetailsArr:[],

            //Whetehr to autoplay next video or not
            playlistAutoPlay: this.autoplay
            
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
        //If something is there in the playlist get video
        playlistGenerated(val){
            if(val){
                //Play the first video in the list
                setTimeout(() => {
                    this.playNextVid();
                }, 1000);
            }
        },

        //If prevPlayId is changed from parent, get next video
        prevPlayId(val){
            this.playNextVid(val);
        },

        //Valdiate the URL provided by the user
        'userInput.url'(val){
            if(val !== null) this.checkUrl(val);
        },

        //If autoplay is changed, emit it to the parent
        playlistAutoPlay(val){
            this.$emit('autoPlaychanged', val);
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
            var paramsArr = {'id': val, 'part': 'snippet,contentDetails,statistics','key': this.config.key};
            this.$http.get(this.config.url+'/videos', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        if(element.snippet){
                            element.snippet.id = element.id;
                            if(element.statistics) element.snippet.stats = element.statistics;
                            element.snippet.channelDetails = {};

                            if(element.snippet.channelId) this.getChannelDetails(element.snippet.channelId, element.id);

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
        getChannelDetails(val = '', vidId){
            if(!val) return false;

            var vm = this;
            var paramsArr = {'id': val, 'part': 'snippet,statistics','key': this.config.key, 'fields': 'items(id,snippet(title, publishedAt, thumbnails),statistics)'};

            this.$http.get(this.config.url+'/channels', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        if(element.snippet){
                            element.snippet.id = element.id;
                            if(element.statistics) element.snippet.stats = element.statistics;
                            
                            var response = vm.videoDetailsArr.findIndex(element11 => (element11.id == vidId));
                            if(vm.videoDetailsArr[response].channelDetails) vm.videoDetailsArr[response].channelDetails = element.snippet;
                        }
                    });
                }
            });
        },

        //Play next video
        playNextVid(playId = '', userClick = false){
            if(!this.currentPlayId) playId = 0;
            if(!playId) playId = this.currentPlayId;

            var response = this.videoDetailsArr.findIndex(element => (element.id == playId));

            if(!response) response = 0;

            //If function is not called by user
            if(!userClick) response += 1;
           
            var nextVid = this.videoDetailsArr[0].id;
            
            if(this.videoDetailsArr[response].id) nextVid = this.videoDetailsArr[response].id;

            if(nextVid){
                //Set active video
                this.checkCurrentVid(nextVid);
                
                //Return current video id
                this.$emit('nextPlaylistItem', nextVid);

                //Return current video details
                this.$emit('currentItemDetails', this.videoDetailsArr[response]);
            }
        },

        //Check for the current playing video
        checkCurrentVid(val = ''){
            if(!val){
                if(!this.currentPlayId) val = this.videoDetailsArr[0].id;
                else val = this.currentPlayId;
            }

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

        //Returns details about the current video
        videoDetails(currentId = ''){
            if(!currentId) currentId = this.currentPlayId;
            var response = this.videoDetailsArr.findIndex(element => (element.id == currentId));

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
        prevPlayId:{
            default:null,
            type: String
        },
        currentPlayId:{
            default: null,
            type: String
        },
        autoplay:{
            default:true,
            type: Boolean
        }
    },
    components:{
        Loader,
        draggable
    }
}
</script>

<style>

</style>
