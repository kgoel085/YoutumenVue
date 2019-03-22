<template>
    <div class="row">
        <app-video v-for="(video, index) in videos" :key="index" :videoId="video"></app-video>
    </div>
    
</template>

<script>
import Video from './sections/Video';
import Loader from './sections/Loader';

export default {
    data(){
        return{
            videos: [],
            pageToken: null,
        }
    },
    computed:{
        
    },
    methods:{
        getResult(){
            var vm = this;
            var paramArr = {'chart': 'mostpopular', 'maxResults': 10, 'key': this.config.key};

            if(this.pageToken && this.pageToken !== null) paramArr['pageToken'] = this.pageToken;

            this.$http.get(this.config.url+'/videos', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.nextPageToken) this.pageToken = resp.nextPageToken;
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.id) vm.videos.push(element.id);
                    });
                }
            });
        }
    },
    mounted(){
        var vm = this;
        if(vm.videos.length == 0) vm.getResult();

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                vm.getResult();
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
