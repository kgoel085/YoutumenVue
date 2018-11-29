<template>
    <div class="row">
        <pre>{{ currentObj }}</pre>
    </div>
</template>

<script>
import Youtube from '../../../classes/Youtube.js';

export default {
    data(){
        return{
            currentObj: {},
            apiParamerts: {
                'endpoint': 'Playlist', 
                'params': {'playlistId': this.videoObject.playlistId},
                'successCall': this.getResult
            }
        }
    },
    methods:{
        getResult(respObj){
            console.log(respObj);
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
    },
}
</script>

<style>

</style>
