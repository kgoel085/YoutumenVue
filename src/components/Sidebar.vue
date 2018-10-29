<template>
    <transition enter-active-class="animated slideInLeft fast" leave-active-class="animated slideOutLeft fast">
        <div id="mainSideBar" :style="{height: parentHeight+'px'}">
            <div class="row">
                <div class="col-md-12">
                    <ul class="sideMenu">
                        <!-- Location List -->
                        <template v-if="locationList.length > 0">
                            <li>
                                <select name="" id="" class="form-control" v-model="selectedLocation">
                                    <option v-for="(location, index) in locationList" :key="index" :value="location.id">{{ location.name }}</option>
                                </select>
                            </li>
                        </template>

                        <li>
                            <i class="glyphicon glyphicon-home icon"></i>
                            <a>Home</a>
                        </li>
                        <li>
                            <i class="glyphicon glyphicon-fire icon"></i>
                            <a>Trending</a>
                        </li>
                        <li>
                            <i class="glyphicon glyphicon-folder-close icon"></i>
                            <a>Subscription</a>
                        </li>
                    </ul>

                    <ul class="sideMenu">
                        <li class="heading">
                            <a >Library</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </transition>    
</template>

<script>
export default {
    data(){
        return {
            parentHeight: 0
        }
    },
    computed:{
        locationList:{
            get(){
                var locationObj = this.$store.getters.GET_LOCATIONS;
                if(locationObj.length > 0) return locationObj;
            }
        },
        selectedLocation:{
            get(){
                return this.$store.getters.GET_SELECTED_LOCATION;
            },
            set(value){
                if(value){
                    var response = this.locationList.find(element => (element.id == value));
                    if(response){
                        this.$store.dispatch('SET_SELECTED_LOCATION', value);
                    }
                }
            }
        }
    },
    methods:{
        setHeight(){
            var mainElement = this.$el;

            var rect = mainElement.getBoundingClientRect();
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            var topDiff = rect.top + scrollTop;

            var newHeight = window.innerHeight - topDiff;
            this.parentHeight = newHeight;
        }
    },
    mounted() {
        //Set Sidebar height 
        this.setHeight();

        window.addEventListener('resize', () => {
            this.setHeight();
        });
    },
    destroyed(){
        window.removeEventListener('resize', this.setHeight());
    }
}
</script>

<style>

#mainSideBar{
    background: #ffffff;
    width:20%;
    position: absolute;
    left: 0;
    z-index: 99;
}

.sideMenu{
    list-style-type:none;
    margin: 10px 0px 10px 0px;
    padding: 0px;
    font-size:16px;
}

.sideMenu li {
    padding: 10px 34px;
    cursor:pointer;
}

.sideMenu .heading{
    font-weight:600;
}

.sideMenu .heading:hover{
    background:transparent
}

.sideMenu .icon, .sideMenu i{
    color:#888888
}

.sideMenu a{
    padding-left: 10%;
    font-weight: 400;
    margin: 0;
    vertical-align: middle;
    text-decoration: none;
    padding: 10px;
    color: #4e4949!important;
}

.sideMenu li:hover{
    background:#eae8e8d1
}
</style>
