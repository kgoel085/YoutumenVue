<template>
    <div class="searchDiv">
        <!-- Filters -->
        <filters @filterTriggered="filterChanged"></filters>
        
        <div class="videoSearch">
            <div class="col-md-12">
                <template v-if="Object.keys(videoObj).length > 0">
                    <p>Showing results for "<strong>{{ searchQuery }}</strong>"</p>
                    <app-video v-for="(video, index) in videoObj" :key="index" :videoObj="video" :videoType="video.type"></app-video>
                </template>

                <template v-else>
                    <p class="alert alert-info"> No items founds related to - {{ searchQuery }} </p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Youtube from '../classes/Youtube.js';
import Video from './sections/video/index.vue';
import Filters from './sections/Filters';

export default {
    data(){
        return {
            selectedFilter:{
                'publishedAfter': null,
                'publishedBefore': null,
                'type': null,
                'videoType': null,
                'videoDuration': null,
                'order': null,
            },
            apiParamerts: {
                'endpoint': 'Search', 
                'params': {'q': this.searchQuery},
                'successCall': this.getResult
            },
            videoObj: []
        }
    },
    watch:{
        selectedFilter(val){
            console.log(val);
        }
    },
    computed:{
        searchQuery:{
            get(){
                this.setParameter('q', this.$route.query.searchQry);
                return this.$route.query.searchQry;
            },
            set(value){
                this.setParameter('q', this.$route.query.searchQry);
                return value;
            }
        }
    },
    methods:{
        getResult(respObj){
            var vm = this;
            var response = respObj;

            if(response.nextPageToken) vm.apiParamerts.params.pageToken = response.nextPageToken;

            //Check for received videos
            if(response.items){
                var respItem = response.items;
                respItem.forEach(function(element){
                    if(element.snippet){
                        var snip = element.snippet;

                        element.snippet.type = 'preview';
                        if(element.id){
                            if(element.id.videoId) element.snippet.videoId = element.id.videoId;
                            else if(element.id.playlistId) element.snippet.videoId = element.id.playlistId;
                        }
                        vm.videoObj.push(element.snippet);
                    }
                });
            }
        },
        setParameter(paramKey, paramVal){
            this.videoObj = [];
            this.apiParamerts.params[paramKey] = paramVal;
        },
        filterChanged(val){
            var vm = this;
            for (var k in val){
                //if (val.hasOwnProperty(k)) {
                    vm.selectedFilter[k] = val[k];

                    if(k == 'videoType' && val[k]){
                        if(vm.selectedFilter['type']) vm.selectedFilter['type'] = null;
                    }
               // }
            }
        }
    },
    created(){
       this.searchQuery = this.$route.query.searchQry;
    },
    mounted(){

    },
    components:{
        'app-video': Video,
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
