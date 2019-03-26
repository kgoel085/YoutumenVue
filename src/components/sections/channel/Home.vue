<template>
    <div class="row">
        <div class="col-md-12" v-if="contentLoaded">
            <template v-if="section.upload.length > 0">

            </template>

            <template v-if="section.playlist.length > 0">
                <div class="row">
                    <!-- Channel's uploaded videos -->
                    <div class="col-md-12" v-if="playlistDetails.relatedPlaylists.uploads">
                        <PlayListBlock :catId="channelId" :playlistId="playlistDetails.relatedPlaylists.uploads"></PlayListBlock>
                    </div>
                    <div class="col-md-12" v-for="(playlst, playlstIndex) in section.playlist" :key="playlstIndex" >
                        <!-- If playlist is single row -->
                        <template v-if="playlst.type = 'singlePlaylist'">

                            <!-- If style is horizontal row and more than 1 playlist id is received -->
                            <template v-if="playlst.style = 'horizontalRow' && playlst.list.length <= 1">
                                <PlayListBlock :catId="channelId" :playlistId="playlst.list[0]"></PlayListBlock>
                            </template>
                            
                            <template v-if="playlst.style = 'verticalList' && playlst.list.length < 1">
                                <PlayListBlock :catId="channelId" :playlistId="playlst.list[0]"></PlayListBlock>
                            </template>

                            <!-- If style is vertical, show block rather than carousel -->
                            <template v-if="playlst.style = 'verticalList' && playlst.list.length > 1">
                                <p v-if="playlst.title">{{ playlst.title }}</p>
                                <VideoBlock v-for="(vidPlay, VidIndex) in playlst.list" :key="VidIndex" :playlistId="vidPlay" :maxResults=4 >
                                </VideoBlock>
                            </template>
                        </template>
                    </div>
                </div>
            </template>

            <template v-if="section.channel.length > 0">

            </template>
        </div>
    </div>
</template>

<script>
import subscribeBox from './SubscribeBox';
import Video from '../Video';

export default {
    data(){
        return{
            section:{
                upload: [],
                playlist: [],
                channel: []
            }
        }
    },
    computed:{
        contentLoaded(){
            var vm = this;
            var currentCount = 0;

            $.each(vm.section, function(key, sections){
                if(sections.length > 0) currentCount += sections.length; 
            });

            if(currentCount > 0) return true;

            return false;
        }
    },
    methods:{
        getChannelSections(){
            var vm = this;
            var paramArr = {'part': 'snippet,contentDetails', 'key': this.config.key, 'channelId': this.channelId};

             this.$http.get(this.config.url+'/channelSections', {'params': paramArr}).then(response => response.json()).then(resp => {
                if(resp.items && resp.items.length > 0){
                    var respItems = resp.items;

                    respItems.forEach(element => {
                        var tmpObj = {};

                        if(element.snippet){
                            if(element.contentDetails) element.snippet.list = element.contentDetails.playlists;

                            var snippet = element.snippet;
                            var listType = snippet.type;
                            var listStyle = snippet.style;

                            var playlistArr = [];
                            //Check the type of current object
                            if(listType.indexOf('Playlist') > -1){
                                vm.section.playlist.push(snippet);
                            }else if(listType.indexOf('Uploads') > -1){
                                vm.section.upload.push(snippet);
                            }else if(listType.indexOf('Channels') > -1){
                                vm.section.channel.push(snippet);
                            }
                        }
                    });
                }
            });
        },
    },
    mounted(){
        if(this.channelId && this.contentLoaded === false) this.getChannelSections();
    },
    props:{
        channelId:{
            type: String,
            default: null
        },
        playlistDetails:{
            type: Object,
            default:{}
        }
    },
    components:{
        'PlayListBlock': subscribeBox,
        'VideoBlock': Video
    }
}
</script>

<style>

</style>
