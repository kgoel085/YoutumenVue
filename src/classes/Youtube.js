import VueResource from 'vue-resource';
import Vue from 'vue';
import store from '../store/store';

Vue.use(VueResource);

export default class Youtube {
    /**
     * @constructor
     * @param {String} callFrom - Currently called route
     */
    constructor(callFrom = 'Trending'){
        this.section = callFrom
        this.sectionObj = {}

        //Setup init. data values
        this.initLoad();
    }

    //Loads calledsections required data values into the class
    initLoad(){
        //Load Main config file
        var sectionData = '';
        try {
            sectionData = require('../helpers/sections/'+this.section+'.json');
        } catch(err) {
            this.getResponse(false, {error: 'Unable to load configuration for selected page'});
        }
        
        if(sectionData){
            this.sectionObj = sectionData;
        }
    }

    //Call the API endpoint
    callAPi(){
        if(Object.keys(this.sectionObj).length == 0){
            return false;
        }

        var prmArr = this.sectionObj.parameters;
        var respArr = this.sectionObj.response

        Vue.http.get(prmArr.url, {params: prmArr.params}).then(resp => resp.json()).then(response => {
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
            store.dispatch('SET_API_RESPONSE', {success: true, response: response});  
        }else{
            store.dispatch('SET_API_RESPONSE', {success: false, response: response});  
        }
    }


}