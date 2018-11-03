// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource';

//.env file reader
import dotenv from 'dotenv';
dotenv.config();


//Vuex Object instance
import store from './store/store'

Vue.use(VueResource);
Vue.http.options.root = ' https://www.googleapis.com/youtube/v3';
Vue.http.interceptors.push(function(request, next) {
  if(!request.params['part']) request.params['part'] = 'snippet';
  request.params['key'] = 'AIzaSyDAb-J6VKrrQI8xAahMqBmxV3tfcUqxbZY';
  if(!request.params['regionCode']) request.params['regionCode'] = store.getters.GET_SELECTED_LOCATION;
  
  next();
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
