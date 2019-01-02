<template>
    <div id="playerBLock">
        <!-- If Youtube API is not ready, search for it -->
        <template v-if="!PlayerLoaded">
            <div class="panel panel-danger">
                <div class="panel-body">
                    <template v-if="playerLoading">
                        <p class="text-center">Setting up player</p>
                        <loader-div class="text-center"></loader-div>
                        <p class="text-center">
                            Page will refresh in {{ refreshTimer.timer }} seconds if player still not loaded
                        </p>
                    </template>
                    <template class="text-center" v-else>
                        <p class="text-center">Player initiated successfully. Please wait ...</p>
                    </template>
                </div>
            </div>
        </template>
        <!-- If Youtube API object found & Player is also loaded proceed   -->
        <template v-else>
            <!-- If video id not playlist id is unavailable, ask user for the URL -->
            <template v-if="!contentFound">
                <div class="panel panel-danger ">
                    <!-- Default panel contents -->
                    <div class="panel-heading">Provide either a url to watch </div>
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
            <!-- If Video / Playlist id found proceed further -->
            <template v-else>
                <p v-if="PlayerLoaded">Youtube Player Loaded</p>
                <video-plyer :playrObj="YtPlyr.obj" :videoId="videoId" :playlistId="playlistId"></video-plyer>
            </template>
        </template>
    </div>
</template>

<script>
import Loader from '../../sections/extras/loader';
import videoPlayer from '../../sections/extras/videoPlayer';
export default {
    data(){
        return{
            // Youtube Player Obj
            playerLoading: true,
            YtPlyr:{
                obj: null,
                checkVar: 0
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

            // Refresh Timer vars
            refreshTimer: {
                timer: 10,
                funcObj: 0
            }
        }
    },
    computed:{
        //Check whether Youtube player API is loaded or not
        PlayerLoaded(){
            if(this.YtPlyr.obj !== null){
                //Reset the refresh timer
                window.clearInterval(this.refreshTimer.funcObj);
                window.clearTimeout(this.YtPlyr.checkVar);
                this.refreshTimer.timer = 10;

                return true;
            }
            return false;
        },

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
        }
    },
    watch:{
        //Watch refresh timer
        'refreshTimer.timer'(val){
            //If value is Zero, means Youtueb API not loaded / downloaded so refresh the page
            if(val == 0) this.$router.go(this.$router.currentRoute)
        },

        //Watch for user provided url
        'userInput.url'(val){
            if(val !== null) this.checkUrl(val);
        }
    },
    methods:{
        /**
         * This method checks whether the Youtube API object is loaded or not
         */
        chkApiObj(){
            var vm = this;
            vm.refreshTimer.funcObj = setInterval(function(){ 
                if(vm.refreshTimer.timer > 0) vm.refreshTimer.timer -= 1;

                //If not loaded start a loop to check when it is loaded set the var
                if(!vm.YtPlyr.obj){
                    vm.YtPlyr.checkVar = setTimeout(() => {
                        if(window.YT.Player){
                            //Show user player is loaded and than proceed
                            vm.playerLoading = false;
                            setTimeout(() => {
                                vm.YtPlyr.obj = window.YT.Player;
                            }, 1000);
                        }
                    }, 1000);
                }

            }, 1000);
        },

        //Validate and Extracts Video ID / Playlist ID from the provided URl
        checkUrl(url = ''){
            if(!url){
                this.userInput.error = true;
                this.userInput.errorMsg = 'Please provide a vaid  URL to continue';
                return false;
            }

            var videoId = '';
            var playlistId = '';
            var testString = url;

            //Chk if URl is from youtube or not 
            var urlValid = false;
            var urlChkRegEx = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
            if(testString.match(urlChkRegEx)) urlValid = true;

            if(!urlValid){
                this.userInput.error = true;
                return false;
            }

            // RegEx to check for either video or playlist id 
            var video = /(?:youtube\.com.*(?:\?|&)(?:v)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_]*)/g;
            var playlist = /(?:(?:\?|&)list=)((?!videoseries)[a-zA-Z0-9_]*)/g;

            //Check for video
            if(testString.match(video)) videoId = RegExp.$1;

            //Check for playlist
            if(testString.match(playlist)) playlistId = RegExp.$1;

            if((videoId || playlistId) && urlValid){
                var queryUrl = {};
                if(videoId) queryUrl.v = videoId;
                if(playlistId) queryUrl.list = playlistId;

                if(Object.keys(queryUrl).length > 0){
                    this.$router.push({
                        name:'Player',
                        query: queryUrl
                    });
                }
            }

            return false;
        }
    },
    /**
     * To load Youtube Chromeless API to control player using javascript
     */
    beforeCreate(){
        //Append API source in the header
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api?origin=http://localhost:8080";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    /**
    * On load check whether the Youtube player API object is available or not 
    */
    beforeMount(){
        //If youtube api not loaded check for it
        if(window.YT) this.YtPlyr.obj = window.YT.Player;
        if(!this.YtPlyr.obj) this.chkApiObj();
    },
    components:{
        'loader-div': Loader,
        'video-plyer': videoPlayer
    }
}
</script>

<style scoped>
    #playerBLock .panel-danger>.panel-heading {
        color: #fff;
        background-color: #ea062b;
        border-color: #ea062b;
    }
    #playerBLock .panel-danger {
        border-color: #ea062b;
    }
</style>
