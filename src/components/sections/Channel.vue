<template>
    <div class="col-md-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="media">
                    <template v-if="Object.keys(channelObj).length > 0">
                        <div class="media-left">
                            <a href="#">
                                <img class="media-object" :class="currentClass" :src="channelObj.thumbnails.high.url">
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="title"><strong>{{ channelObj.title.replace(/\b\w/g, function(l){ return l.toUpperCase() }) }}</strong></h4>
                            <template v-if="!carousel">
                                <p>
                                    <small v-if="channelObj.statistics.subscriberCount">{{ channelObj.statistics.subscriberCount }} subscribers</small>  
                                    <small v-if="channelObj.statistics.videoCount">{{ channelObj.statistics.videoCount }} videos</small>
                                </p>

                                <p v-if="channelObj.description">{{ channelObj.description }}</p>
                            </template>
                        </div>
                        <div class="media-right">
                            <template v-if="channelObj.statistics">
                                <button class="btn btn-danger" disabled>Subscribe {{ channelObj.statistics.subscriberCount | subscriberCount }}</button>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <div class="panel-body" v-if="carousel">
                <template v-if="!vidView && playlistId !== null">
                    <!-- <vuevideo :playlistId="playlistId"></vuevideo> -->
                    <PlaylistCarousel :playlistId="playlistId"></PlaylistCarousel>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import PlaylistCarousel from '../sections/Carousel.vue';

export default {
    data(){
        return{
            channelObj: {},
            playlistId: null,
            currentId: this.catId
        }
    },
    computed:{
        vidView(){
            if(this.playlistId) return false;
            return true;
        },
        currentClass(){
            var curClass = '';
            if(!this.carousel) curClass = 'noCarousel';

            return curClass;
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
                            if(playList.uploads) vm.playlistId = playList.uploads;
                        }

                        //If no playlist found get forcefully
                        if(vm.playlistId === null) vm.getPlaylist();
                        
                    });
                }
            });
        },

        //Get playlist details for the current channel
        getPlaylist(){
            var vm = this;
            var paramArr = {'part': 'snippet', 'key': this.config.key, 'channelId': this.currentId, 'maxResults': 1, 'fields': 'items(id)'};

            this.$http.get(this.config.url+'/playlists', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.id) vm.playlistId = element.id;
                    });
                }
            });
        }
    },
    mounted(){
        if(this.currentId) this.channelDetails();
    },
    props:{
        catId:{
            type: String,
            default: null
        },
        carousel:{
            type: Boolean,
            default: true
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
