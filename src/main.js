// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource';
import {globalMix} from './helpers/global_mixins.js';

//Vuex Object instance
import store from './store/store'

Vue.use(VueResource);
Vue.http.options.root = ' https://www.googleapis.com/youtube/v3';
Vue.http.interceptors.push(function(request, next) {
  // Start the route progress bar.
  NProgress.start();
  
  if(!request.params['part']) request.params['part'] = 'snippet';
  request.params['key'] = 'AIzaSyDAb-J6VKrrQI8xAahMqBmxV3tfcUqxbZY';
  if(!request.params['regionCode']) request.params['regionCode'] = store.getters.GET_SELECTED_LOCATION;
  
  next(resp => {
    // Complete the animation of the route progress bar.
    NProgress.done();
  });
});

//Router Interceptors
router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      NProgress.start()
  }
  next();
})

router.afterEach((to, from) => {
  var chkSideBar = store.getters.GET_SIDEBAR;
  if(chkSideBar) store.dispatch('SET_SIDEBAR_VIEW', !chkSideBar);

  // Complete the animation of the route progress bar.
  NProgress.done()
})


Vue.config.productionTip = false

//Global Mixins
Vue.mixin(globalMix);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
