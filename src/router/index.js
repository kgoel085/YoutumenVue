import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

const Home = resolve => {
  require.ensure(['../components/Home.vue'], () => {
      resolve(require('../components/Home.vue'));
  }, 'Home');
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }
  ]
})
