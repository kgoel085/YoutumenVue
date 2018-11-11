<template>
    <div class="row">
        <app-video v-for="(video, index) in dataObj.videos" :key="index" :videoObj="video" :videoType="video.type"></app-video>
    </div>
    
</template>

<script>
import Video from './sections/video/index.vue';
export default {
    data(){
        return{
            dataObj: {
                categories: [],
                videos: [],
                videoCount:{
                    total:0,
                    current: 0
                }
            },
            apiArr:{
                paramsArr: {'chart': 'mostpopular', 'maxResults': 10},
                endPoint: 'videos',
                successCallBack: this.getResult,
            }
        }
    },
    methods:{
        getResult(response){
            var vm = this;

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
        }
    },
    created(){
        //Defined in Global Mixin
        this.callAPi(this.apiArr);
    },
    mounted(){
        var vm = this;

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                vm.callAPi(vm.apiArr);
            }
        };
    },
    components:{
        'app-video': Video
    }
}
</script>

<style>

</style>
