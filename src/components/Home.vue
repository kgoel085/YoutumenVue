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
            apiResponse:{
                nextPageToken: null,
                prevPageToken: null
            },
            dataObj: {
                categories: [],
                catCount:{
                    total:0,
                    current: 0
                }
            }
        }
    },
    methods:{
        //Init. api call to retrive trending videos
        callAPi(){
            var vm = this;
            
            var paramsArr = {'chart': 'mostpopular', 'maxResults': 5, 'fields': 'nextPageToken,pageInfo,items(snippet/channelId)'};
            if(vm.apiResponse.nextPageToken){
                paramsArr.pageToken = vm.apiResponse.nextPageToken;
            }
           
            this.$http.get('videos', {params: paramsArr}).then(resp => resp.json()).then(response => {

                //Check for Page Token
                if(response.nextPageToken) vm.apiResponse.nextPageToken = response.nextPageToken;
                if(response.prevPageToken) vm.apiResponse.prevPageToken = response.prevPageToken;

                //Check for Page information
                if(response.pageInfo){
                    if(response.pageInfo.totalResults) vm.dataObj.catCount.total = response.pageInfo.totalResults;
                    if(response.pageInfo.resultsPerPage) vm.dataObj.catCount.current += response.pageInfo.resultsPerPage;
                }

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
            });
        }
    },
    created(){
        this.callAPi();
    },
    mounted(){
        var vm = this;

        //Trigger API Call when user reaches the end of page
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                vm.callAPi();
            }
        });
    },
    beforeDestroy(){
        window.removeEventListener('scroll',  this.callAPi());
    },
    components:{
        'app-category': Category
    }
}
</script>

<style>

</style>
