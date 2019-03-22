<template>
    <div id="videoBlock">
        <!-- If Youtube API is not ready, search for it -->
        <template v-if="!PlayerLoaded">
            <div class="panel panel-danger">
                <div class="panel-body">
                    <template v-if="playerLoading">
                        <p class="text-center">Setting up player</p>
                        <loader class="text-center"></loader>
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
        <template v-else>
            <template v-if="videoId">
                <div class="col-md-12">
                    <div id="videoPlyr"></div>
                </div>
            </template>
            <template v-else>
                <loader></loader>
            </template>
        </template>
    </div>
</template>

<script>
import Loader from '../sections/Loader';

export default {
    data(){
        return{
            // Youtube Player Obj
            //playerLoading: true,
            YtPlyr:{
                obj: null,
                checkVar: 0
            },

            // Refresh Timer vars
            refreshTimer: {
                timer: 10,
                funcObj: 0
            },

            //Current player object
            playerFrame: null,
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

        currentId(){
            return this.videoId
        },

        playerLoading(){
            if(this.YtPlyr.obj !== null) return false;

            return true;
        }
    },
    watch:{
        //Watch refresh timer
        'refreshTimer.timer'(val){
            //If value is Zero, means Youtueb API not loaded / downloaded so refresh the page
            if(val == 0) this.$router.go(this.$router.currentRoute)
        },

        PlayerLoaded(val){
            //If player is loaded, play video
            if(this.videoId) this.createPlayer();
        },

        videoId(val){
            if(val){
                //If player is already set up destroy it 
                //if(this.playerFrame !== null) this.playerFrame.destroy();
                
                //Create new one with new video id
                this.createPlayer(val);
            }
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
                            setTimeout(() => {
                                vm.YtPlyr.obj = window.YT.Player;
                                vm.createPlayer();
                            }, 1000);
                        }
                    }, 1000);
                }

            }, 1000);
        },

        //Create Youtube player instance
        createPlayer(vidId){
            if(!vidId) vidId = this.currentId;
            var configObj = {
                width: '100%',
                height: 500,
                videoId: vidId,
                events: {
                    onReady: this.initialize,
                    onStateChange: this.checkState
                }
            };


            if(this.YtPlyr.obj){
                //Youtube Player Object
                this.playerFrame = new this.YtPlyr.obj('videoPlyr', configObj);
            }
        },

        //This will be executed when player is ready
        initialize(){
            this.playerFrame.playVideo();
            this.$emit('videoLoaded', true);
        },

        //Do actions based on current video state
        checkState(evt){
            var evntData = false;

            //Video ended
            if(evt.data == 0){
                this.$emit('VideoEnded', this.currentId);
            }
        }
    },
    /**
     * To load Youtube Chromeless API to control player using javascript
     */
    beforeCreate(){
        //Append API source in the header
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
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
    props:{
        videoId:{
            default: null,
            type: String
        }
    },
    components:{
        Loader
    }
}
</script>

<style>

</style>
