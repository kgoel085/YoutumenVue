<template>
    <div class="col-md-12">
        <div class="row">
            <!-- Category selected view -->
            <component :is="catType" :catObject="catObj" :view="catView"></component>
        </div>
    </div>
</template>

<script>
import Channel from './channel.vue';

export default {
    data(){
        return{ 
            
        }
    },
    computed:{
        catType(){
            var selectedType = '';
            var catType = this.catObj.type;

            switch (catType) {
                case 'channel':
                default:
                    selectedType = 'cat-channel'
                break;
            }

            return selectedType;
        },
        catView(){
            var selectedView = '';
            var catView = this.catObj.view;

            switch (catView) {
                case 'playlist':
                default:
                    selectedView = 'playlist'
                break;
            }

            return selectedView;
        }
    },
    props:{
        catObj:{
            type: Object,
            default:{}
        }
    },
    components:{
        'cat-channel': Channel
    }
}
</script>

<style>

</style>
