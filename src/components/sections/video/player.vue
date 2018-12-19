<template>
    <div>
        Received Video Id: {{videoId}}  
    </div>    
</template>

<script>
export default {
    computed:{
        videoId(){
            return this.$route.params.id;
        }
    }
}
</script>

<style>

</style>
