<template>
  <div id="app">
    <!-- Youtube style search bar -->
    <app-header></app-header>

    <!-- Sidebar -->
    <template v-if="sideBar">
        <app-sidebar></app-sidebar>
    </template>

    <div class="container-fluid" :class="{overlay: sideBar}">
      <!-- Main Content View -->
      <router-view/>
    </div>


  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  data(){
    return{
      
    }
  },
  computed:{
    sideBar(){
      //GEt Global state of sidear and Show it based on it 
      return this.$store.getters.GET_SIDEBAR;
    }
  },
  components:{
    'app-header': Header,
    'app-sidebar': Sidebar
  }
}
</script>

<style >
  .overlay {
      background: #ccc;
      height: 100%!important;
      width: 100%!important;
      position: fixed;
      transition: all 0.5s ease;
  }
</style>
