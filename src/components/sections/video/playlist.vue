<template>
    <div class="row">
        <pre>{{ currentObj }}</pre>
    </div>
</template>

<script>
export default {
    data(){
        return{
            currentObj: {}
        }
    },
    methods:{
        callAPi(){
            var vm = this;
            
            var paramsArr = {'part': 'snippet,contentDetails', 'playlistId': vm.videoObject.playlistId, 'maxResults': 10};
            this.$http.get('playlistItems', {params: paramsArr}).then(resp => resp.json()).then(response => {
                console.log(response);
            });
        }
    },
    created(){
        this.callAPi();
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
