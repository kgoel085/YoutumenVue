<template>
    <div class="col-md-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="media">
                    <template v-if="Object.keys(channelObj).length > 0">
                        <template v-if="playlistId && channelObj.title">
                            <div class="media-left" >
                                <strong>
                                    <span>{{ channelObj.title }}</span>
                                    <span class="glyphicon glyphicon-triangle-right"></span>
                                    <span style="cursor:pointer" @click="showPlaylist(playlistId)">Play all</span>    
                                </strong> 

                                <p v-if="channelObj.description">{{ channelObj.description }}</p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="media-left" @click="showChannel(currentId)">
                                <a href="#">
                                    <img class="media-object" :class="currentClass" :src="channelObj.thumbnails.high.url">
                                </a>
                            </div>
                            <div class="media-body">
                                <h4 class="title"><strong>{{ channelObj.title.replace(/\b\w/g, function(l){ return l.toUpperCase() }) }}</strong></h4>
                                <template v-if="!showCarousel">
                                    <p>
                                        <small v-if="channelObj.statistics.subscriberCount">{{ channelObj.statistics.subscriberCount | subscriberCount }} subscribers</small>  
                                        <small v-if="channelObj.statistics.videoCount">{{ channelObj.statistics.videoCount }} videos</small>
                                    </p>

                                    <p v-if="channelObj.description && showDescription">{{ channelObj.description }}</p>
                                </template>
                            </div>
                            <div class="media-right">
                                <template v-if="channelObj.statistics">
                                    <button class="btn btn-danger" disabled>Subscribe {{ channelObj.statistics.subscriberCount | subscriberCount }}</button>
                                </template>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
            <div class="panel-body" v-if="showCarousel">
                <template v-if="!vidView && playLstId !== null">
                    <!-- <vuevideo :playlistId="playLstId"></vuevideo> -->
                    <PlaylistCarousel :playlistId="playLstId" @listLoaded="setFirstVideo"></PlaylistCarousel>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import PlaylistCarousel from './Carousel';

export default {
    data(){
        return{
            channelObj: {},
            playLstId: null,
            currentId: this.catId,
            videoId: null
        }
    },
    computed:{
        vidView(){
            if(this.playLstId) return false;
            return true;
        },
        currentClass(){
            var curClass = '';
            if(!this.showCarousel) curClass = 'noCarousel';

            return curClass;
        },
        showCarousel(){
            if(this.playlistId || this.carousel) return true;
            return false;
        }
    },
    methods:{
        //Get all the channel details
        channelDetails(){
            var vm = this;
            var paramArr = {'part': 'snippet,contentDetails,statistics', 'key': this.config.key, 'id': this.currentId};

            this.$http.get(this.config.url+'/channels', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.statistics) element.snippet.statistics = element.statistics;
                        if(element.snippet) vm.channelObj = element.snippet;
                        //if(element.statistics.subscriberCount) vm.channelObj.statistics = element.statistics.subscriberCount;

                        //If playlist is there / else get any playlist for the current channel
                        if(element.contentDetails){
                            var playList = element.contentDetails.relatedPlaylists;
                            if(playList.uploads) vm.playLstId = playList.uploads;
                        }

                        //If no playlist found get forcefully
                        if(vm.playLstId === null && vm.showCarousel) vm.getPlaylist();
                        
                    });
                }
            });
        },

        //Get playlist details for the current channel
        getPlaylist(){
            var vm = this;
            var paramArr = {'part': 'snippet', 'key': this.config.key, 'channelId': this.currentId, 'maxResults': 1, 'fields': 'items(id)'};

            //If playlist is provided in prop, get the title not just id
            if(vm.playlistId){
                if(paramArr['fields']) paramArr['fields'] = 'items(id,snippet)';

                //If playlist id is there, send id instead of channel id 
                if(paramArr['channelId']) delete paramArr['channelId'];
                if(!paramArr['id']) paramArr['id'] = vm.playlistId;
            }
            this.$http.get(this.config.url+'/playlists', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.id){
                            vm.playLstId = element.id;
                            if(vm.playlistId) vm.playLstId = vm.playlistId;
                        }
                        if(element.snippet) vm.channelObj = element.snippet;
                    });
                }
            });
        },

        //Redirectes to channel page
        showChannel(channelID = null){
            if(!channelID) channelID = this.currentId;

            this.$router.push({
                name: 'Channel',
                params: {id: channelID}
            })
        },

        showPlaylist(playlistId = null){
            var queryArr = {};

            var playId = (playlistId) ? playlistId : this.playlistId;
            if(playId) queryArr['list'] = playId;
            if(this.videoId) queryArr['v'] = this.videoId;

            if(playId){
                this.$router.push({
                    name: 'Player',
                    query: queryArr
                })
            }
        },

        setFirstVideo(firstVidId = null){
            if(firstVidId) this.videoId = firstVidId;
        }
    },
    mounted(){
        if(this.catId){
            if(this.playlistId){
                this.getPlaylist();
                return false;    
            }
            
            this.channelDetails();
        }
    },
    props:{
        catId:{
            type: String,
            default: null
        },
        playlistId:{
            type: String,
            default: null
        },
        carousel:{
            type: Boolean,
            default: false
        },
        showDescription:{
            type:Boolean,
            default: false
        }
    },
    components:{
        PlaylistCarousel
    }
}
</script>

<style scoped>
    .panel{
        border:1px solid transparent;
        border-bottom:1px solid #ddd;
    }

    .panel > .panel-heading{
        border-bottom: 1px solid transparent;
    }

    .media-object{
        display: block;
        border-radius: 100%;
        width: 50px;
        height: auto;
    }

    /* When carousel is disabeld this clss will be added to adjust the elements */
    .media-object.noCarousel{
        width:100px
    }

    .media-left span.glyphicon{
        vertical-align: bottom;
        color: #5a5757;
        font-size: 20px;
    }

    .media-body, .media-left, .media-right{
        vertical-align: middle!important;
    }

    .media-body .title{
        font-weight: 500
    }

    .glyphicon{
        color:#ccc;
        cursor:pointer;
        font-size:2em;
    }
</style>
