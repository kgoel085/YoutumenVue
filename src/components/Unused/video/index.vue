<template>
    <div class="col-md-12">
        <component :is="selectedComponent" :videoObject="videoObj" :layout="layout"></component>
    </div>
</template>

<script>
import videoPreview from './preview.vue';
import videoPlaylist from './playlist.vue';

export default {
    data(){
        return{
            layout: 'default'
        }
    },
    computed:{
        selectedComponent(){
            var selectedComp = '';
            var selectedVidType = this.videoType;

            switch(selectedVidType){
                case 'playlist':
                    selectedComp = 'app-playlist'
                break;

                //Default layout
                case 'preview':
                default:
                    selectedComp = 'app-preview'
                break;
            }

            
            return selectedComp;
        }
    },
    props:{
        videoObj:{
            type: Object,
            default:{}
        },
        videoType:{
            type: String,
            default: 'preview'
        }
    },
    components:{
        'app-preview': videoPreview,
        'app-playlist': videoPlaylist
    }
}
</script>

<style>

</style>
