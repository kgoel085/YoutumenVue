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
            }
        }
    },
    computed:{
        respObj(){
            return this.$store.getters.GET_CURRENT_API_RESPONSE;
        }
    },
    methods:{
        getResult(respObj){
            var vm = this;
            var response = respObj.response;

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
    watch:{
        respObj(obj){
            if(!obj){
                this.$store.dispatch('CALL_API', this.$route.name);
                return false;
            }
            this.getResult(obj);
        }
    },
    mounted(){
        var vm = this;

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                vm.$store.dispatch('CALL_API', vm.$route.name);
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
