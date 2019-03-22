<template>
    <div class="col-md-12">

        <!-- If playlist is provided -->
        <template v-if="playlistId">
            <div class='carousel-view' v-if="slides.length > 0  ">
                <vue-carousel class="carousel" :dots="false" :rewind="false" :items="4" :nav="false" :key="screenSize">
                    <template slot="next"><button :class="'carousel-next btn btn-default btn-circle'"> <i class="glyphicon glyphicon-chevron-left"></i> </button></template>

                    <div class="thumbnail" v-for="(slide, index) in slides" :key="index" @click="showVideo(slide.videoId, playlistId)">
                        <img :src="getImage(slide.thumbnails)" :alt="slide.title" :style="{width: '100%', height: currentHeight+'px'}">

                        <p class="caption" style="font-weight:550">{{ slide.title.substring(0,70) }}</p>

                        <kbd>
                            <small v-if="slide.statistics.viewCount">{{ slide.statistics.viewCount | subscriberCount }} Views</small>
                        </kbd>
                        <kbd>
                            <small v-if="slide.statistics.likeCount">{{ slide.statistics.likeCount | subscriberCount }} Likes</small>
                            <small v-if="slide.statistics.dislikeCount">{{ slide.statistics.dislikeCount | subscriberCount }} Dislikes</small>
                        </kbd>
                    </div>
            
                    <template slot="prev"><button :class="'carousel-prev btn btn-default btn-circle'"> <i class="glyphicon glyphicon-chevron-right"></i> </button></template>
                </vue-carousel>
            </div>
        </template>

        <template v-if="videoId">
            <div class="media" @click="showVideo(slides[0].videoId)">
                <div class="media-left">
                    <a href="#" class="imgBlock pull-left">
                        <img class="media-object" :src="slides[0].thumbnails.medium.url">
                    </a>
                </div>
                <div class="media-body">
                    <h4 class="media-heading">{{ slides[0].title }}</h4>
                    <span class="media-content">
                        <p><small>{{ slides[0].channelTitle }}</small> | <small>{{ slides[0].publishedAt | dateTime}}</small></p>
                        {{ slides[0].description.substr(0, 400) + '....' }}
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

            return curId;
        }
    },
    watch:{
        videoArr(val){
            if(val && typeof(val) == 'object') this.getVideoDetails();
        }
    },
    methods: {
        //Get all the items in the playlist
        getPlaylistItems(){
            var vm = this;

            var paramArr = {'part': 'contentDetails', 'maxResults': this.maxResults, 'key': this.config.key, 'playlistId': this.currentId};

            this.$http.get(this.config.url+'/playlistItems', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;
                    
                    var tmpArr = [];
                    respItems.forEach(element => {
                        if(element.contentDetails.videoId){
                            if($.inArray(element.contentDetails.videoId, tmpArr) < 0){
                                tmpArr.push(element.contentDetails.videoId);
                            }
                        }
                    });

                    if(tmpArr.length > 0) vm.videoArr = tmpArr;
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
                            if(element.statistics) element.snippet.statistics = element.statistics
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
        if(this.playlistId) this.getPlaylistItems();
        if(this.videoId) this.getVideoDetails();
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
        maxResults:{
            type: Number,
            default: 8
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

    .thumbnail{
        margin-bottom: 0px;
        background-color: #fff;
        border: 1px solid transparent;
        position:relative;
    }

    .thumbnail:hover{cursor:pointer;}

    .carousel{
        position:relative;
    }

    .btn-circle {
        width: 40px;
        height: 40px;
        text-align: center;
        position: absolute;
        padding: 6px 0;
        font-size: 12px;
        line-height: 1.42;
        border-radius: 100%;
        top: 35%;
        z-index: 9;
    }

    .carousel span:first-child > button{
        right: -2%;
    }

    .carousel span:last-child > button{
        left: -2%;
    }
</style>
