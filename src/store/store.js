import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        sidebarToggle: false
    },
    getters:{
        'GET_SIDEBAR':state => {
            return state.sidebarToggle;
        }
    },
    mutations:{
        'SET_SIDEBAR':(state, param) => {
            state.sidebarToggle = param;
        }
    },
    actions:{
        'SET_SIDEBAR_VIEW':(context, param) => {
            context.commit('SET_SIDEBAR', param);
        }
    }
});
