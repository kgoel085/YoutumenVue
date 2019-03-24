<template>
    <div class="row" v-if="Object.keys(bannerObj).length > 0">
        <div class="col-md-12" >
            <img :src="bannerObj.image.bannerImageUrl" alt="" style="width:100%;height:100%">
        </div>

       <!-- Subscribe Box -->
        <subscribeBox :catId="currentId"></subscribeBox>

        <div class="col-md-12">
            <ul class="nav nav-pills">
                <li role="presentation" class="active"><a href="javascript:void(0)" @click="setCurrentTab('featured')">Home</a></li>
                <li role="presentation"><a href="javascript:void(0)" @click="setCurrentTab('about')">About</a></li>
                <li role="presentation"><a href="javascript:void(0)" @click="setCurrentTab('search')">Search</a></li>
            </ul>
        </div>
        <div class="col-md-12">
            <component :is="currentAction" :channelId="currentId" :playlistDetails="playlistObj"></component>
        </div>
    </div>
</template>

<script>
import subscribeBox from './sections/channel/SubscribeBox';
import featured from './sections/channel/Home';

export default {
    data(){
        return{
            playlistObj:{},
            bannerObj:{},
        }
    },
    computed:{
        currentId(){
            if(this.$route.params.id) return this.$route.params.id;

            return false;
        },
        currentAction(){
            if(this.$route.params.action) return this.$route.params.action;

            return 'featured';
        }
    },
    methods:{
        getBanner(){
            var vm = this;
            var paramArr = {'part': 'brandingSettings,contentDetails', 'key': this.config.key, 'id': this.currentId};

            this.$http.get(this.config.url+'/channels', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        if(element.brandingSettings) vm.bannerObj = element.brandingSettings;
                        if(element.contentDetails) vm.playlistObj = element.contentDetails;
                    });
                }
            });
        },
    },
    beforeMount(){
        if(this.currentId) this.getBanner();
    },
    mounted(){
        
    },
    components:{
        subscribeBox,
        featured
    },
}
</script>

<style>

</style>
