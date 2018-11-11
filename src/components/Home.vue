<template>
    <div class="row">
        <app-category v-for="(category, index) in dataObj.categories" :key="index" :catObj="category"></app-category>
    </div>
</template>

<script>
import Category from './sections/category/index';
export default {
    data(){
        return{
            dataObj: {
                categories: [],
                catCount:{
                    total:0,
                    current: 0
                }
            },
            apiArr:{
                paramsArr: {'chart': 'mostpopular', 'maxResults': 5, 'fields': 'nextPageToken,pageInfo,items(snippet/channelId)'},
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
                        if(snip.channelId){
                            var response = vm.dataObj.categories.find(element => (element.value == snip.channelId));
                            if(!response){
                                var tmpArr = {};
                                tmpArr['channelId'] = snip.channelId;
                                tmpArr['type'] = 'channel';
                                tmpArr['view'] = 'playlist';

                                vm.dataObj.categories.push(tmpArr);
                            }
                        }
                    }
                });
            }
        }
    },
    created(){
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
        'app-category': Category
    }
}
</script>

<style>

</style>
