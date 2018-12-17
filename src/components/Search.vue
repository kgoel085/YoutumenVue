<template>
    <div class="searchDiv">
        <!-- Filters -->
        <div class="filters">
            <div class="col-md-12">
                <button class="btn btn-md btn-default" type="button" @click="showFilters = showFilters">
                    <i class="glyphicon glyphicon-tasks"></i> <span>Filters</span>
                </button>
            </div>
            <div class="col-md-12" v-if="showFilters">
                <div class="row">
                    <div class="col-md-2" v-for="(filter, index) in filterObj" :key="index">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>{{ filter.title }}  </strong></h3>
                            </div>
                            <div class="panel-body">
                                <template vif="Object.keys(filter.values).lengh > 0">
                                    <div class="col-md-12" v-for="(valueObj, parameter) in filter.values" :key="parameter">
                                        <template v-if="typeof valueObj == 'object'">
                                            <p v-for="(value, valTitle) in valueObj" :key="value" @click="setParameter(parameter, value)">
                                                {{ valTitle }}
                                            </p>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="videoSearch">
            <div class="col-md-12">
                <template v-if="Object.keys(videoObj).length > 0">
                    <p>Showing results for "<strong>{{ searchQuery }}</strong>"</p>
                    <app-video v-for="(video, index) in videoObj" :key="index" :videoObj="video" :videoType="video.type"></app-video>
                </template>

                <template v-else>
                    <p class="alert alert-info"> No items founds related to - {{ searchQuery }} </p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Youtube from '../classes/Youtube.js';
import Video from './sections/video/index.vue';

export default {
    data(){
        return {
            showFilters: false,
            apiParamerts: {
                'endpoint': 'Search', 
                'params': {'q': this.searchQuery},
                'successCall': this.getResult
            },
            videoObj: []
        }
    },
    computed:{
        filterObj(){
            var filterArr = {};

            var ytObj = new Youtube(this.apiParamerts);
            if(ytObj.sectionObj.parameters.extra) filterArr = ytObj.sectionObj.parameters.extra;

            return filterArr;
        },
        searchQuery:{
            get(){
                this.setParameter('q', this.$route.query.searchQry);
                return this.$route.query.searchQry;
            },
            set(value){
                this.setParameter('q', this.$route.query.searchQry);
                return value;
            }
        }
    },
    methods:{
        getResult(respObj){
            var vm = this;
            var response = respObj;

            if(response.nextPageToken) vm.apiParamerts.params.pageToken = response.nextPageToken;

            //Check for received videos
            if(response.items){
                var respItem = response.items;
                respItem.forEach(function(element){
                    if(element.snippet){
                        var snip = element.snippet;

                        element.snippet.type = 'preview';
                        vm.videoObj.push(element.snippet);
                    }
                });
            }
        },
        setParameter(paramKey, paramVal){
            this.videoObj = [];

            // var paramObj = {}
            // paramObj[paramKey] = paramVal;
            // paramObj['q'] = this.$route.query.searchQry;

            // this.apiParamerts.params = paramObj;
            this.apiParamerts.params[paramKey] = paramVal;


            var ytObj = new Youtube(this.apiParamerts);
            ytObj.callAPi();            
        }
    },
    created(){
       this.searchQuery = this.$route.query.searchQry;
    },
    mounted(){
        var ytObj = new Youtube(this.apiParamerts);
        ytObj.callAPi();

        var vm = this;

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                //Call API endpoint again for next record
                 var ytObj = new Youtube(vm.apiParamerts);
                ytObj.callAPi(); 
            }
        };
    },
    components:{
        'app-video': Video
    }
}
</script>

<style scoped>
    .searchDiv div{
        margin-bottom: 10px
    }

    .panel{
        border:none
    }

    .panel-body{
        padding:0px;
        padding-top:3px
    }

    .panel-body p{cursor:pointer; color: #929191}

    .filters .btn{
        border: none;
        font-weight: 600;
        font-size: 1em;
        word-spacing: 8px;
    }

    .btn > span{vertical-align: text-bottom;text-transform: uppercase}
</style>
