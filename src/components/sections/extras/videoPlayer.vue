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
                    <draggable v-model="videoDetailsArr" @start="drag=true" @end="drag=false">
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
            currentId: null,
            videoEnded: false,
            playerFrame: null,
            videoDetailsArr:[],
            autoplay: false,

            //User Input vars
            userInput:{
                url: null,
                error: false,
                errorMsg: 'Invalid URL'
            },
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
        },
        videoEnded(value){
            if(value && this.autoplay) this.playNextVid();
        },
        autoplay(value){
            if(value && this.videoEnded) this.playNextVid();
        },
        'userInput.url'(val){
            if(val !== null) this.checkUrl(val);
        }
    },
    methods:{
        //Valdiate the url
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
            var paramsArr = {'id': val, 'part': 'snippet,contentDetails','key': this.config.key};
            this.$http.get(this.config.url+'/videos', {'params': paramsArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    resp.items.forEach(element => {
                        if(element.snippet){
                            element.snippet.id = element.id;
                            if(vm.videoDetailsArr.length){
                                var response = vm.videoDetailsArr.findIndex(element11 => (element11.id == element.id));
                                if(response < 0){
                                    vm.videoDetailsArr.push(element.snippet);
                                    return false;
                                }
                            }

                            vm.videoDetailsArr.push(element.snippet);
                        }
                    });
                }
            });
        },

        //Play the current clicked video
        playVid(vidID, event){
            var listItem = event.target.closest('li');
            var result = [],
            node = listItem.parentNode.firstChild;

            while ( node ) {
                if ( node !== listItem && node.nodeType === Node.ELEMENT_NODE ){
                    if(node.classList.contains('active')) node.classList.remove('active');
                }
                
                node = node.nextElementSibling || node.nextSibling;
            }

            if(listItem.classList.contains('active') == false) listItem.classList.add('active');
            this.createPlayer(vidID);
        },

        //Play next video
        playNextVid(){
            var response = this.videoDetailsArr.findIndex(element => (element.id == this.currentId));

            if(!response) response = 0;
            response = response + 1;

            var nextVid = this.videoDetailsArr[0].id;
            if(this.videoDetailsArr[response].id) nextVid = this.videoDetailsArr[response].id;

            if(nextVid){
                var liElem = document.querySelector('[data-id="'+nextVid+'"]');
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
                if(this.autoplay) this.playNextVid();
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
