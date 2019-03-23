<template>
    <div class='carousel-view' v-if="slides.length > 0">
        <vue-carousel class="carousel" :dots="false" :rewind="false" :items="4" :nav="false" :key="screenSize">
            <template slot="next"><button :class="'carousel-next btn btn-default btn-circle'"> <i class="glyphicon glyphicon-chevron-left"></i> </button></template>

            <div class="thumbnail" v-for="(slide, index) in slides" :key="index" @click="showVideo(slide.videoId)">
                <img :src="getImage(slide.thumbnails)" :alt="slide.title" :style="{width: '100%', height: currentHeight+'px'}">

                <p class="caption" style="font-weight:550">{{ slide.title.substring(0,70) }}</p>

                <kbd>
                    <small v-if="slide.statistics.viewCount">{{ slide.statistics.viewCount | subscriberCount }} Views</small>
                </kbd>
                <kbd>
                    <small v-if="slide.statistics.likeCount">{{ slide.statistics.likeCount | subscriberCount }} Likes</small> | 
                    <small v-if="slide.statistics.dislikeCount">{{ slide.statistics.dislikeCount | subscriberCount }} Dislikes</small>
                </kbd>
            </div>
    
            <template slot="prev"><button :class="'carousel-prev btn btn-default btn-circle'"> <i class="glyphicon glyphicon-chevron-right"></i> </button></template>
        </vue-carousel>
    </div>
</template>

<script>
import Carousel from 'vue-owl-carousel';

export default {
    data(){
        return{
            slides: [],
            currentHeight: 0,
            videoArr: []
        }
    },
    computed:{
        screenSize(){
            return screen.availWidth;
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
            var paramArr = {'part': 'contentDetails', 'maxResults': 8, 'fields': 'items(contentDetails(videoId))', 'key': this.config.key, 'playlistId': this.playlistId};

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
            var videoIds = vm.videoArr.join(',');

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
        showVideo(id){
            //this.$store.dispatch('SHOW_VIDEO', id);
            this.$router.push({ name: 'Player', query: { 'v': id } })
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
    },
    props:{
        playlistId:{
            type:String,
            default: null
        }
    },
    components:{
        'vue-carousel': Carousel
    }
}
</script>

<style scoped>
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
