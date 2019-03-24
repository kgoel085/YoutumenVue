import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

const Home = resolve => {
  require.ensure(['../components/Home.vue'], () => {
      resolve(require('../components/Home.vue'));
  }, 'Home');
}

const Trending = resolve => {
  require.ensure(['../components/Trending.vue'], () => {
      resolve(require('../components/Trending.vue'));
  }, 'Trending');
}

const Search = resolve => {
  require.ensure(['../components/Search.vue'], () => {
      resolve(require('../components/Search.vue'));
  }, 'Search');
}

const Player = resolve => {
  require.ensure(['../components/WatchVideo.vue'], () => {
      resolve(require('../components/WatchVideo.vue'));
  }, 'Player');
}

const Channel = resolve => {
  require.ensure(['../components/Channel.vue'], () => {
      resolve(require('../components/Channel.vue'));
  }, 'Channel');
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/trending',
      name: 'Trending',
      component: Trending,
    },
    {
      path:'/search',
      name: 'Search',
      component: Search
    },
    {
      path:'/watch',
      name: 'Player',
      component: Player
    },
    {
      path:'/channel/:id/:action?',
      component: Channel,
      name:'Channel'
    }
  ]
})
