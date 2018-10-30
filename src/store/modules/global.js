import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    sidebarToggle: false,
    locations: [],
    selectedLocation: 'IN',
    anyGlobalChanged: null
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
        state.anyGlobalChanged = lastAction;
    }
};

const actions = {
    //Sets current state of sidebar
    'SET_SIDEBAR_VIEW':(context, param) => {
        context.commit('SET_SIDEBAR', param);
    },

    //Sets locations received from youtube at the time of initialize
    'SET_LOCATIONS':(context) => {
        Vue.http.get('i18nRegions').then(response => response.json()).then(resp => {

            var responseArr = []; 

            //Looping through each item and extracting snippet data
            if(resp.items.length){
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
    }
};



export default{
    state,
    mutations,
    actions,
    getters
}