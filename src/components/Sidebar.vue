<template>
    <transition enter-active-class="animated slideInLeft fast" leave-active-class="animated slideOutLeft fast">
        <div id="mainSideBar" :style="{height: parentHeight+'px'}">
            <div class="row">
                <div class="col-md-12">

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
</style>
