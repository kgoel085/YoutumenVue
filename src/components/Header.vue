<template>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
             <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" @click="toggledMenu = !toggledMenu">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <button class="sideToggle" type="button" @click="sideBarState = !sideBarState"><i class="glyphicon glyphicon-menu-hamburger"></i></button>
                <router-link tag="a" class="navbar-brand" :to="{name: 'Home'}">
                    
                    <img src="../assets/logo.png" style="width:100px;height:auto">
                </router-link>
            </div>
            

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" :class="{in: toggledMenu}" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">

                </ul>
                <form class="navbar-form navbar-left">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search for...">
                        <span class="input-group-btn">
                            <button class="btn btn-default" type="button">
                                <i class="glyphicon glyphicon-search"></i>
                            </button>
                        </span>
                    </div>
                </form>
                <ul class="nav navbar-nav navbar-right">

                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>
</template>

<script>
export default {
    data(){
        return{
            toggledMenu: false
        }
    },
    computed:{
        sideBarState:{
            get(){
                return this.$store.getters.GET_SIDEBAR;
            },
            set(value){
                this.$store.dispatch('SET_SIDEBAR_VIEW', value);
                this.toggledMenu = value;
            }
           
        }
    },
    watch:{
        //Change Glboal sidebar state to check whetehr to open it or not
        sideBarState(value){
            
        }
    }
}
</script>

<style scoped>
    .navbar{margin-bottom: 0px}
    .menuBtn{color:#80808066}
    .menuBtn>.icon{font-size:20px}
    .sideToggle{
        padding: 7px 8px;
        float: left;
        /* border-radius: 0px 5px 5px 0px; */
        margin: 10px;
        background: transparent;
        border: none;
        border-radius: 5px;
    }
</style>
