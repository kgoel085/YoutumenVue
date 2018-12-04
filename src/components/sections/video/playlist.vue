<template>
    <div class="row">
        <template v-if="Object.keys(currentObj).length > 0">
            <video-play :videoObj="currentObj"></video-play>
        </template>
    </div>
</template>

<script>
import Youtube from '../../../classes/Youtube.js';
import VideoCarousel from '../video/carousel.vue';

export default {
    data(){
        return{
            currentObj: [],
            apiParamerts: {
                'endpoint': 'Playlist', 
                'params': {'playlistId': this.videoObject.playlistId},
                'successCall': this.getResult
            }
        }
    },
    components:{
        'video-play': VideoCarousel
    },
    methods:{
        getResult(respObj, showVid = false){
            var vm = this;
            if(respObj.items){
                var items = respObj.items;
                var tmpArr = [];

                items.forEach((element) => {
                    if(element.snippet){
                        //Get Playlist video ID
                        var snip = element.snippet;

                        //If false then request video data
                        if(showVid == false){
                            if(snip.resourceId.videoId) tmpArr.push(snip.resourceId.videoId);
                        }else{
                            snip['type'] = 'playlistItem';
                            vm.currentObj.push(snip);
                        }
                        
                    }
                });

                if(tmpArr.length > 0) this.getVideos(tmpArr.join(','));
            }
        },

        getVideos(idObj = ''){
            //If call is made with video ids, get vidoe details
            if(typeof(idObj) == 'string'){
                var vidIds = idObj;
                var yuTubObj = new Youtube(
                    {
                        'endpoint': 'Video',
                        'params': {'id': vidIds},
                        'successCall': this.getVideos
                    }
                );
                yuTubObj.callAPi();

                return false;
            }

            //Else show video response
            if(typeof(idObj) == 'object') this.getResult(idObj, true);
            
        }
    },
    created(){
        var ytObj = new Youtube(this.apiParamerts);
        ytObj.callAPi();
    },
    props:{
        videoObject:{
            default:{},
            type: Object
        },
        layout:{
            type:String
        }
    }
}
</script>

<style>

</style>
