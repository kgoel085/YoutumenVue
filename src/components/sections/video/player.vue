<template>
    <div class="row">

    </div>
</template>

<script>
import { configArr } from '../../../classes/configuration';

export default {
    data(){
        return{
            iframeUrl: 'https://www.youtube.com/embed',
            videoId: null,
            videoType: null,
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            }
        }
    },
    computed:{
        //Check for whether video / playlist found or not
        videoFound(){
            if(this.videoId && this.videoType) return true;
            return false;
        }
    },
    methods:{
        //Check for video/playlist ID & type
        checkForId(id, type){
            var vidType = null;

            //If id and type are given set thm
            if(type == 'video' || type == 'playlist' && id){
                this.videoId = id;
                this.videoType = type;
                return false;
            }

            //First check if id is in route
            if(this.$route.params.id){
                vidType = this.getResponse(this.$route.params.id);
                if(vidType) this.checkForId(id, vidType);
            }
        },
        getResponse(id, type){
            var responseTrue = false;
            var returnVal = null;

            if(!id) return returnVal;

            if(!type || type == 'video'){
                //First check if it is video or not
                this.$http.get(this.config.url+'/videos', {params: {'id': id, 'key': this.config.key}}).then(resp => resp.json()).then(response => {
                    if(response.items.length && response.kind == 'youtube#videoListResponse'){
                       this.checkForId(id, 'video');
                        return false;
                    }

                    this.getResponse(id, 'playlist');
                }, err => {
                    this.getResponse(id, 'playlist');
                });
            }
            
            if(type == 'playlist'){
                //If still no result, search for playlist
                this.$http.get(this.config.url+'/playlistItems', {params: {'playlistId': id, 'key': this.config.key}}).then(resp => resp.json()).then(response => {
                     if(response.items.length && response.kind == 'youtube#playlistItemListResponse'){
                       this.checkForId(id, 'playlist');
                        return false;
                    }
                   this.getResponse();
                }, err => {
                    this.getResponse();
                });
            }
        }
    },
    mounted(){
        this.checkForId();
    }
}
</script>

<style>

</style>
