<template>
    <div class='carousel-view'>
        <div class="carousel">
            <div class="thumbnail" :style="{width: slide.thumbnails.medium.width+'px', height: slide.thumbnails.medium.height+'px'}" v-for="(slide, index) in slides" :key="index" @click="showVideo(slide.videoId)">
                <img :src="slide.thumbnails.medium.url" :alt="slide.title" style="width:100%;height:auto">
                <span class="caption"><strong class="title">{{ slide.title.substring(0,70) }}</strong></span>
            </div>
        </div>
        <div class='carousel-controls'>
            <button class='btn carousel-prev' v-if="goLeft"><i class="glyphicon glyphicon-chevron-left"></i></button>
            <button class='btn carousel-next'><i class="glyphicon glyphicon-chevron-right"></i></button>
        </div>
       
    </div>
</template>

<script>
export default {
    data(){
        return{
            slides: this.videoObj,
            goLeft: false
        }
    },
    methods: {
        next () {
            const first = this.slides.shift()
            this.slides = this.slides.concat(first)
        },
        previous () {
            const last = this.slides.pop()
            this.slides = [last].concat(this.slides)
        },
        showVideo(id){
            this.$store.dispatch('SHOW_VIDEO', id);
        }
    },
    props:{
        videoObj:{
            default:() => {
                return []
            },
            type: Array
        }
    }
}
</script>

<style scoped>
    .thumbnail{
        margin-bottom: 0px;
        padding:0px;
        background-color: #fff;
        border: 1px solid transparent;
        position:relative;
        display: inline-block;
    }

    .thumbnail:hover{cursor:pointer;}
    .thumbnail:hover > .caption{
        background-color:#2d2d2dba;
        color:#fff;
        opacity:1;
    }

    .carousel{
        white-space: nowrap;
        overflow: hidden;
        position:relative;
    }

    .caption{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        opacity:0
    }

    .caption .title{
        position: absolute;
        bottom: 15px;
        left: 2px;
        width: 100%;
        white-space: normal;
    }

    .btn{
        border-radius: 100%;
        height: 40px;
        top:50%;
        position: absolute;
    }

    .carousel-prev{
        left:-1%
    }

    .carousel-next{
        right:-1%
    }
</style>
