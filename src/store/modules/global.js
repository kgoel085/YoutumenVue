import Vue from 'vue';
import Vuex from 'vuex';
import router from '../../router/index';

//Importing Youtube API Class
import YouTube from '../../classes/Youtube.js';

//Importing ConfigArr
import { configArr } from '../../classes/configuration.js';

Vue.use(Vuex);

const state = {
    sidebarToggle: false,
    locations: [],
    selectedLocation: null,
    anyGlobalChanged: null,
    apiResponse:{
        currentResponse: null,
        lastResponse: null,
        errResponse: null
    }
};

const getters = {
    //Returns current sidebar state
    'GET_SIDEBAR':state => {
        return state.sidebarToggle;
    },

    //Returns array of locations from youtube
    'GET_LOCATIONS':state => {
        var returnArr = [];

        var locObj = state.locations;
        if(locObj.length){
            locObj.forEach(function(element) {
                var tmpObj = {};
                tmpObj['id'] = element.gl
                tmpObj['name'] = element.name;

                if(Object.keys(tmpObj).length > 0) returnArr.push(tmpObj);
            });
        }

        return returnArr;
    },

    //Returns currently selected location
    'GET_SELECTED_LOCATION':state => {
        return state.selectedLocation;
    },

    //Returns last updated global action
    'GET_LAST_GLOBAL_CHANGE':state => {
        var str = state.anyGlobalChanged;
        if(str) return str.split('').sort(function(){return 0.5-Math.random()}).join('');
        return str;
    }, 

    //Returns Current API Response
    'GET_CURRENT_API_RESPONSE':state => {
        return state.apiResponse.currentResponse;
    },

    //Returns Current API Response
    'GET_LAST_API_RESPONSE':state => {
        return state.apiResponse.lastResponse;
    }
};

const mutations = {
    //Sets current state of sidebar
    'SET_SIDEBAR':(state, param) => {
        state.sidebarToggle = param;
    },

    //Sets locations received from youtube
    'SET_LOCATIONS':(state, locations) => {
        state.locations = locations
    },

    //Sets value of location selected by user
    'SET_SELECTED_LOCATION':(state, locationVal) => {
        state.selectedLocation = locationVal;
    },

    //Sets the value of last action performed. Will only trigger for the actions which requires components to be changed again
    'SET_LAST_GLOBAL_CHANGE':(state, lastAction) => {
        var str = lastAction.split('').sort(function(){return 0.5-Math.random()}).join('');
        state.anyGlobalChanged = str;
    },

    //Reset Current API response and set last API response
    'RESET_CURRENT_RESPONSE':(state, reset = null) => {
        var currentResp = state.apiResponse.currentResponse;
        if(currentResp) state.apiResponse.lastResponse = currentResp;    

        currentResp = null;
    },

    //Set current API response
    'SET_CURRENT_API_RESPONSE':(state, resp) => {
        if(resp.success) state.apiResponse.currentResponse = resp;
    }
};

const actions = {
    //Sets current state of sidebar
    'SET_SIDEBAR_VIEW':(context, param) => {
        context.commit('SET_SIDEBAR', param);
    },

    //Sets locations received from youtube at the time of initialize
    'SET_LOCATIONS':(context) => {
        Vue.http.get(configArr.Global.url + '/i18nRegions', {params: {'key': configArr.Global.parameters.key}}).then(response => response.json()).then(resp => {

            var responseArr = []; 

            //Looping through each item and extracting snippet data
            if(resp.items){
                resp.items.forEach(function(element) {
                    if(element.snippet){
                    responseArr.push(element.snippet);
                    }
                });
            }

            if(responseArr.length){
                context.commit('SET_LOCATIONS', responseArr);
            }
        }); 
    },

    //Sets value of location selected by user
    'SET_SELECTED_LOCATION':(context, locationVal) => {
        context.commit('SET_SELECTED_LOCATION', locationVal);
        context.commit('SET_LAST_GLOBAL_CHANGE', 'SET_SELECTED_LOCATION');
    },

    //Call API endpoint
    'CALL_API':(context, endPoint) => {

        //Reset current response
        context.commit('RESET_CURRENT_RESPONSE');


        //Start Loader 
        NProgress.start();

        var ytObj = new YouTube(endPoint);
        ytObj.callAPi();
    },

    //Set API Response
    'SET_API_RESPONSE':(context, resp) => {
        //If API returned with error
        if(resp.error){

        }

        context.commit('SET_CURRENT_API_RESPONSE', resp);

        //Finish Loader
        NProgress.done();
    },

    //re-direct to video page with the received video ID
    'SHOW_VIDEO':(context, resp) => {
        router.push({ 'name': 'Player', 'params':{'id': resp}})
    }
};



export default{
    state,
    mutations,
    actions,
    getters
}