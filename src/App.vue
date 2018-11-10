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
      <router-view :key="changedVal"/>
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
      //Get Global state of sidear and Show it based on it 
      return this.$store.getters.GET_SIDEBAR;
    },
    changedVal(){
      return this.$store.getters.GET_LAST_GLOBAL_CHANGE;
    }
  },
  watch:{
    changedVal(value){
      if(this.sideBar) this.$store.dispatch('SET_SIDEBAR_VIEW', !this.sideBar);
    }
  },
  components:{
    'app-header': Header,
    'app-sidebar': Sidebar
  },
  beforeCreate(){
    //To globally set locations
    this.$store.dispatch('SET_LOCATIONS');

    //Set selected region based on the IP
    var selectedCountry = "IN";
    this.$resource('http://ip-api.com/json').query().then(resp => resp.json()).then(response => {
      var countryCode = response.countryCode;
      var foundCountry = this.$store.getters.GET_LOCATIONS.find(element => (element.id == countryCode));
      
     
      if(foundCountry) selectedCountry = foundCountry.id;
    }, err => {});
    this.$store.dispatch('SET_SELECTED_LOCATION', selectedCountry);
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

  body { padding-top: 70px; }

  #nprogress .bar {
    background: #ff0000!important;
  }
</style>
