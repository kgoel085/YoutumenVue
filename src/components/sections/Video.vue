<template>
    <div class="col-md-12">

        <!-- If playlist is provided -->
        <template v-if="videoId || playlistId">
            <div class="media" @click="showVideo(videoId, playlistId)" :class="currentClass">
                <div class="media-left">
                    <a href="#" class="imgBlock pull-left">
                        <img class="media-object" :src="slides[0].thumbnails.medium.url">
                        <!-- Playlist is there -->
                        <span class="itemCount text-center" v-if="playlistId && slides[0].itemCount > 0"><span>{{slides[0].itemCount}} <br> <i class="	glyphicon glyphicon-list"></i></span></span> 
                    </a>
                </div>
                <div class="media-body">
                    <h4 class="media-heading">{{ slides[0].title }}</h4>
                    <span class="media-content">

                        <p v-if="slides[0].channelTitle"><small>{{ slides[0].channelTitle }}</small> | <small>{{ slides[0].publishedAt | dateTime}}</small></p>

                        <p v-if="slides[0].title"><small>{{ slides[0].title }}</small> </p>

                        <p v-if="slides[0].description">{{ slides[0].description.substr(0, 400) + '....' }}</p>

                        <template v-if="items.length > 0">
                            <p>
                                <small v-for="(item, indexItem) in items" :key="indexItem">{{ item }}</small>
                            </p>
                        </template>
                    </span>
                </div>
            </div>
        </template>
    </div>
    
</template>

<script>
import Carousel from 'vue-owl-carousel';

export default {
    data(){
        return{
            slides: [],
            currentHeight: 0,
            videoArr: [],
            items:[],
            pageToken: null
        }
    },
    computed:{
        screenSize(){
            return screen.availWidth;
        },
        currentId(){
            var curId = null;
            if(this.videoId) curId = this.videoId;
            if(!curId && this.playlistId) curId = this.playlistId;
            if(!curId && this.channelId) curId = this.channelId;

            return curId;
        },
        currentClass(){
            var currentCLass = 'video';
            if(this.playlistId) currentCLass = 'playlist';
            if(this.channelId) currentCLass = 'channel';

            return currentCLass;
        }
    },
    watch:{
        videoArr(val){
            if(val && typeof(val) == 'object') this.getVideoDetails();
        }
    },
    methods: {
        //Get all the items in the playlist
        getPlaylist(){
            var vm = this;

            var paramArr = {'part': 'snippet,contentDetails', 'maxResults': this.maxResults, 'key': this.config.key, 'id': this.currentId};

            this.$http.get(this.config.url+'/playlists', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;
                    
                    respItems.forEach(element => {
                        if(element.snippet){
                            if(element.contentDetails.itemCount) element.snippet.itemCount = element.contentDetails.itemCount;

                            vm.slides.push(element.snippet);
                            vm.getPlaylistItems();
                        }
                    });
                }
            });
        },

        //Get all the items in the playlist
        getPlaylistItems(){
            var vm = this;

            var paramArr = {'part': 'snippet,contentDetails', 'maxResults': 2, 'key': this.config.key, 'playlistId': this.currentId};

            this.$http.get(this.config.url+'/playlistItems', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;
                    
                    respItems.forEach(element => {
                        if(element.snippet.title) vm.items.push(element.snippet.title);
                    });
                }
            });
        },

        //Get all the detailsfor the videos in the playlist
        getVideoDetails(){
            var vm = this;
            var videoIds = this.currentId;
            if(this.videoArr.length > 0) videoIds = vm.videoArr.join(',');

            var paramArr = {'part': 'snippet, statistics', 'fields':'items(id,snippet,statistics)','key': this.config.key, 'id': videoIds}; 
            this.$http.get(this.config.url+'/videos', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.snippet){
                            if(element.id) element.snippet['videoId'] = element.id;
                            if(element.statistics) element.snippet.statistics = element.statistics;
                            vm.slides.push(element.snippet);
                        }
                    });
                }
            });
        },

        //Redirect to the selected video
        showVideo(id, playistId){
            //this.$store.dispatch('SHOW_VIDEO', id);
            var queryArr = {};
            
            if(id) queryArr['v'] = id;
            if(playistId) queryArr['list'] = playistId;

            this.$router.push({ name: 'Player', query: queryArr })
        },

        //Get video image based on the screen resolution
        getImage(imgObj){
            var returnImg = imgObj['default']['url'];

            var defaultImageSize = 'default';
            if(this.screenSize >= 320 ) defaultImageSize = 'medium';
            if(this.screenSize >= 480 ) defaultImageSize = 'high';
            if(this.screenSize >= 640 ) defaultImageSize = 'standard';
            if(this.screenSize >= 1280 ) defaultImageSize = 'maxres';

            if(imgObj[defaultImageSize]){
                var currentObj = imgObj[defaultImageSize]['url'];
                if(currentObj){
                    returnImg = currentObj;
                    this.currentHeight = imgObj['medium']['height'];
                }
            }

            return returnImg;
        }
    },
    mounted(){
        if(this.playlistId) this.getPlaylist();
        if(this.videoId) this.getVideoDetails();
        if(this.channelId){}
    },
    props:{
        videoId:{
            type: String,
            default: null
        },
        playlistId:{
            type: String,
            default: null
        },
        channelId:{
            type: String,
            default: null
        },
        maxResults:{
            type: Number,
            default: 1
        }
    },
    components:{
        'vue-carousel': Carousel
    }
}
</script>

<style scoped>
    .media{
        padding:6px
    }

    .media.playlist .imgBlock{
        position: relative
    }
    .media.playlist .itemCount{
        position: absolute;
        right: 0;
        top: 0; 
        width: 50%;
        height: 100%;
        background: #020202b3
    }
    .media.playlist .itemCount > span{
        position: absolute;
        top: 35%;
        color: #fff;
        font-size: 20px;

    }

</style>
