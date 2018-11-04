<template>
    <div class="col-md-12">
        <component :is="selectedComponent" :videoObject="videoObj" :layout="layout"></component>
    </div>
</template>

<script>
import videoPreview from './preview.vue';

export default {
    data(){
        return{
            layout: 'default'
        }
    },
    computed:{
        selectedComponent(){
            return (this.videoType !== 'preview') ? '': 'app-preview';
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
        'app-preview': videoPreview
    }
}
</script>

<style>

</style>
