<template>
    <div class="col-md-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="media">
                    <template v-if="Object.keys(channelObj).length > 0">
                        <div class="media-left">
                            <a href="#">
                                <img class="media-object" :src="channelObj.thumbnails.high.url">
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="title"><strong>{{ channelObj.title.replace(/\b\w/g, function(l){ return l.toUpperCase() }) }}</strong></h4>
                        </div>
                        <div class="media-right">
                            <template v-if="channelObj.statistics">
                                <button class="btn btn-danger" disabled>Subscribe {{ channelObj.statistics | subscriberCount }}</button>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <div class="panel-body">
                <template v-if="!vidView && playlistId !== null">
                    <vuevideo :playlistId="playlistId"></vuevideo>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Video from './Video';

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
        }
    },
    methods:{
        //Get all the channel details
        channelDetails(){
            var vm = this;
            var paramArr = {'part': 'snippet,contentDetails,statistics', 'key': this.config.key, 'id': this.currentId, 'fields':'items(id,snippet(title, publishedAt, thumbnails),statistics(hiddenSubscriberCount, subscriberCount), contentDetails)'};

            this.$http.get(this.config.url+'/channels', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.snippet) vm.channelObj = element.snippet;
                        if(element.statistics.subscriberCount) vm.channelObj.statistics = element.statistics.subscriberCount;

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
        }
    },
    components:{
        'vuevideo': Video
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
        width: 32px;
        height: auto;
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
