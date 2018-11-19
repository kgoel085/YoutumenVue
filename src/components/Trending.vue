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
            }
        }
    },
    computed:{
        respObj(){
            return this.$store.getters.GET_CURRENT_API_RESPONSE;
        }
    },
    methods:{
        getResult(respObj){
            var vm = this;
            var response = respObj.response;

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
    watch:{
        respObj(obj){
            if(!obj){
                this.$store.dispatch('CALL_API', this.$route.name);
                return false;
            }
            this.getResult(obj);
        }
    },
    mounted(){
        var vm = this;

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                //Call API endpoint again for next record
                vm.$store.dispatch('CALL_API', vm.$route.name);
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
