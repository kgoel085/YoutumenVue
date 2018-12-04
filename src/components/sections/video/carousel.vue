<template>
    <div class='carousel-view'>
        <transition-group class="carousel" tag="div">
            <div class="thumbnail" :style="{width: slide.thumbnails.medium.width+'px', height: slide.thumbnails.medium.height+'px'}" v-for="(slide, index) in slides" :key="index">
                <img :src="slide.thumbnails.medium.url" :alt="slide.title" style="width:100%;height:auto">
                <span class="caption"><strong class="title">{{ slide.title.substring(0,70) }}</strong></span>
            </div>
        </transition-group>
        <div class='carousel-controls'>
            <button class='btn carousel-prev'><i class="glyphicon glyphicon-chevron-left"></i></button>
            <button class='btn carousel-next'><i class="glyphicon glyphicon-chevron-right"></i></button>
        </div>
       
    </div>
</template>

<script>
export default {
    data(){
        return{
            slides: this.videoObj
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

    /* .carousel-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .carousel {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        
        width: 24em;
        min-height: 25em;
    }
    .slide {
        flex: 0 0 20em;
        height: 20em;
        margin: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.1em dashed #000;
        border-radius: 50%;
        transition: transform 0.3s ease-in-out;
    }
    .slide:first-of-type {
        opacity: 0;
    }
    .slide:last-of-type {
        opacity: 0;
    } */
</style>
