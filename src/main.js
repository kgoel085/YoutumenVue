// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource';
import {globalMix} from './helpers/global_mixins.js';

//Vuex Object instance
import store from './store/store'

//Helper function objects
import helpers from './classes/helpers';
const plugin = {
  install () {
      Vue.helpers = helpers
      Vue.prototype.$helpers = helpers
  }
}

Vue.use(plugin)

Vue.use(VueResource);
Vue.http.interceptors.push(function(request, next) {
  if(!request.params['part']) request.params['part'] = 'snippet';
  if(!request.params['regionCode']) request.params['regionCode'] = store.getters.GET_SELECTED_LOCATION;
  
  next(resp => {

  });
});

//Router Interceptors
router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    //Loads the first response for the called component
    store.dispatch('CALL_API', to.name);
  }
  next();
})

router.afterEach((to, from) => {
  //Checks for wether sidebar is open or not
  var chkSideBar = store.getters.GET_SIDEBAR;
  if(chkSideBar) store.dispatch('SET_SIDEBAR_VIEW', !chkSideBar);
})


Vue.config.productionTip = false

//Global Mixins - Currently disabled and using Vuex to manage response
//Vue.mixin(globalMix);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
