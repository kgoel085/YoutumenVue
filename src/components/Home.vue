<template>
    <div class="row">
        <template v-if="Object.keys(categoryIds).length > 0">
            <app-category v-for="(category, index) in categoryIds" :key="index" :catId="category" :carousel="true"></app-category>
        </template>
        <template else>
            <loader class="text-center"></loader>
        </template>
        
    </div>
</template>

<script>
import Category from './sections/channel/SubscribeBox';
import Loader from './sections/Loader';

export default {
    data(){
        return{
            categoryIds:[],
            pageToken: null,
            catCount:{
                total:0,
                current: 0
            }
        }
    },
    methods:{
        getResult(){
            var vm = this;
            var paramArr = {'chart': 'mostpopular', 'maxResults': 5, 'fields': 'nextPageToken,pageInfo,items(snippet/channelId)', 'key': this.config.key};

            if(this.pageToken && this.pageToken !== null) paramArr['pageToken'] = this.pageToken;

            this.$http.get(this.config.url+'/videos', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.nextPageToken) this.pageToken = resp.nextPageToken;
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.snippet){

                            //If channel id not already fetched
                            if(element.snippet.channelId){
                                if(jQuery.inArray(element.snippet.channelId, vm.categoryIds) < 0){
                                    vm.categoryIds.push(element.snippet.channelId);
                                }
                            }
                        }
                    });
                }
            });
        }
    },
    mounted(){
        var vm = this;
        if(vm.categoryIds.length == 0) vm.getResult();

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                vm.getResult();
            }
        };
    },
    components:{
        'app-category': Category,
        Loader
    }
}
</script>

<style>

</style>
