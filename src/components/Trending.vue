<template>
    <div class="row">
        <app-video v-for="(video, index) in dataObj.videos" :key="index" :videoObj="video" :videoType="video.type"></app-video>
        <button @click="callAPi">Getmore Videos</button>
    </div>
    
</template>

<script>
import Video from './sections/video/index.vue';
export default {
    data(){
        return{
            apiResponse:{
                nextPageToken: null,
                prevPageToken: null
            },
            dataObj: {
                categories: [],
                videos: [],
                videoCount:{
                    total:0,
                    current: 0
                }
            }
        }
    },
    methods:{
        //Init. api call to retrive trending videos
        callAPi(){
            var vm = this;

            var paramsArr = {'chart': 'mostpopular', 'maxResults': 10};
            if(vm.apiResponse.nextPageToken){
                paramsArr.pageToken = vm.apiResponse.nextPageToken;
            }
           
            this.$http.get('videos', {params: paramsArr}).then(resp => resp.json()).then(response => {
                
                //Check for Page Token
                if(response.nextPageToken) vm.apiResponse.nextPageToken = response.nextPageToken;
                if(response.prevPageToken) vm.apiResponse.prevPageToken = response.prevPageToken;

                //Check for Page information
                if(response.pageInfo){
                    if(response.pageInfo.totalResults) vm.dataObj.videoCount.total = response.pageInfo.totalResults;
                    if(response.pageInfo.resultsPerPage) vm.dataObj.videoCount.current += response.pageInfo.resultsPerPage;
                }

                //Check for received videos
                if(response.items){
                    var respItem = response.items;
                    respItem.forEach(function(element){
                        if(element.snippet){
                            var snip = element.snippet;

                            //Get Channel ID
                            if(snip.channelId && vm.dataObj.categories.length < 5) vm.dataObj.categories.push(snip.channelId);

                            element.snippet.type = 'preview';
                            vm.dataObj.videos.push(element.snippet);
                        }
                    });
                }
            });
        }
    },
    created(){
        this.callAPi();
    },
    components:{
        'app-video': Video
    }
}
</script>

<style>

</style>
