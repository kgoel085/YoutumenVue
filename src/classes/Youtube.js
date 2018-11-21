import VueResource from 'vue-resource';
import Vue from 'vue';
import store from '../store/store';

//Contains Configuration for each section
import { configArr } from '../classes/configuration';

Vue.use(VueResource);

export default class Youtube {
    /**
     * @constructor
     * @param {String} callFrom - Currently called route
     */
    constructor(callFrom = 'Trending'){
        this.section = callFrom
        this.sectionObj = {}
        this.respObj = {
            nextPageToken: null,
            prevPageToken: null,
            videoCount:{
                total: 0,
                current: 0
            }
        }
        this.receivedResp = null

        //Setup init. data values
        this.initLoad();
    }

    //Loads calledsections required data values into the class
    initLoad(){
        //Load Main config file
        var sectionData = '';

        if(configArr[this.section]) sectionData = configArr[this.section];
        if(!sectionData) this.getResponse(false, {error: 'Unable to load configuration for selected page'});

        this.sectionObj = sectionData;
    }

    //Call the API endpoint
    callAPi(){
        if(Object.keys(this.sectionObj).length == 0){
            return false;
        }

        var prmArr = this.sectionObj.parameters;
        var respArr = this.respObj;

        //Get Last response token to get next one
        var lastAPIResp = store.getters.GET_LAST_API_RESPONSE;
        if(lastAPIResp && lastAPIResp.callFrom == this.section){
            if(lastAPIResp.response.nextPageToken) prmArr.params.pageToken = lastAPIResp.response.nextPageToken;
        }else{
            prmArr.params.pageToken = '';
        }

        //Setting Init. values
        Vue.http.options.root = configArr.Global.url;
        
        //Merge Global config params with the curret request params
        if(Object.keys(prmArr.params).length > 0){
            var mergeObj = Object.assign(prmArr.params, configArr.Global.parameters);
            if(mergeObj) prmArr.params = mergeObj;
        }

        //Get current API endpoint response
        Vue.http.get(prmArr.endpoint, {params: prmArr.params}).then(resp => resp.json()).then(response => {
            //Check for Page Token
            if(response.nextPageToken) respArr.nextPageToken = response.nextPageToken;
            if(response.prevPageToken) respArr.prevPageToken = response.prevPageToken;

            //Check for Page information
            if(response.pageInfo){
                if(response.pageInfo.totalResults) respArr.videoCount.total = response.pageInfo.totalResults;
                if(response.pageInfo.resultsPerPage) respArr.videoCount.current += response.pageInfo.resultsPerPage;
            }
            this.getResponse(true, response);
        }, err => {
            this.getResponse(false, err);
        });
    }

    /**
     * Set response values based on type
     * @param {Boolean} type - Return true or false based on whether api was successfully passed 
     * @param {*} response - Contains api response data 
     */
    getResponse(type = false, response = {}){
        if(type == true){
            store.dispatch('SET_API_RESPONSE', {success: true, response: response, callFrom: this.section});  
        }else{
            store.dispatch('SET_API_RESPONSE', {error: true, response: response, callFrom: this.section});  
        }
    }


}