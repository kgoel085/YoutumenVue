<template>
    <div class="searchDiv">
        <!-- Filters -->
        <filters @filterTriggered="filterChanged"></filters>
        
        <div class="videoSearch">
            <div class="col-md-12">
                <template v-if="Object.keys(videoObj).length > 0">
                    <p>Showing results for "<strong>{{ searchQuery }}</strong>"</p>
                    <div class="col-md-12" v-for="(video, index) in videoObj" :key="index">
                        <template v-if="video.videoId || video.playlistId">
                            <app-video :videoId="video.videoId" :playlistId="video.playlistId" :maxResults=4></app-video>
                        </template>
                        <template v-else>
                            <appChannel :catId="video.channelId" :carousel="false"></appChannel>
                        </template>
                    </div>
                    
                </template>

                <template v-else>
                    <p class="alert alert-info"> No items founds related to - {{ searchQuery }} </p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Video from './sections/Video';
import Filters from './sections/Filters';
import Channel from './sections/Channel.vue';

export default {
    data(){
        return {
            videoObj: [],
            appliedFilters:{},
            pageToken: null
        }
    },
    computed:{
        searchQuery:{
            get(){
                return this.$route.query.searchQry;
            },
            set(value){
                return value;
            }
        }
    },
    watch:{
        appliedFilters(val){
            if(val){
                this.videoObj = [];
                this.pageToken = null;
                this.getResult();
            }
        },
        searchQuery(val){
            if(val){
                this.searchQuery = val;
                this.videoObj = [];
                this.getResult();
            }
        }
    },
    methods:{
        getResult(){
            var vm = this;
            var paramArr = {'part': 'snippet', 'maxResults': 15, 'order': 'relevance', 'q': this.searchQuery, 'key': this.config.key,'type':'video', 'videoType':'any'};
            if(Object.keys(this.appliedFilters).length > 0){
                for(var filter in this.appliedFilters){
                    
                    if(!this.appliedFilters[filter]) delete paramArr[filter];
                    if(this.appliedFilters[filter]) paramArr[filter] = this.appliedFilters[filter];
                    
                }
            }

            if(this.pageToken && this.pageToken !== null) paramArr['pageToken'] = this.pageToken;

            this.$http.get(this.config.url+'/search', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.nextPageToken) this.pageToken = resp.nextPageToken;
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;
                    
                    respItems.forEach(element => {
                        var tmpObj = {};
                        //Get Video OR Playlist ID
                        if(element.id.videoId) tmpObj['videoId'] = element.id.videoId;
                        else if(element.id.playlistId) tmpObj['playlistId'] = element.id.playlistId;
                        else if(element.id.channelId) tmpObj['channelId'] = element.id.channelId;

                        vm.videoObj.push(tmpObj);
                    });
                }
            });
        },
        filterChanged(val){
            this.appliedFilters = Object.assign({}, this.appliedFilters, val);
        }
    },
    created(){
       this.searchQuery = this.$route.query.searchQry;
    },
    mounted(){
        var vm = this;

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                vm.getResult();
            }
        };
        if(this.searchQuery) this.getResult();
    },
    components:{
        'app-video': Video,
        'appChannel': Channel,
        Filters
    }
}
</script>

<style scoped>
    .searchDiv div{
        margin-bottom: 10px
    }

    .panel{
        border:none
    }

    .panel-body{
        padding:0px;
        padding-top:3px
    }

    .panel-body p{cursor:pointer; color: #929191}

    .filters .btn{
        border: none;
        font-weight: 600;
        font-size: 1em;
        word-spacing: 8px;
    }

    .btn > span{vertical-align: text-bottom;text-transform: uppercase}
</style>
