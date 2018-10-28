<template>
  <div id="app">
    <!-- Youtube style search bar -->
    <app-header></app-header>

    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  name: 'App',
  components:{
    'app-header': Header
  }
}
</script>

<style>
</style>
