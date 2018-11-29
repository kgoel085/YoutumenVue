<template>
    <!-- Default layout -->
    <div>
        <template  v-if="layout == 'default'">
            <div class="col-md-12 videoBox">
                    <div class="media">
                        <div class="media-left">
                            <a href="#">
                            <img class="media-object" :src="currentObj.thumbnails.medium.url">
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{ currentObj.title }}</h4>
                            <span class="media-content">
                                <p><small>{{ currentObj.channelTitle }}</small> | <small>{{ currentObj.publishedAt | dateTime}}</small></p>
                                {{ currentObj.description.substr(0, 400) + '....' }}
                            </span>
                        </div>
                    </div>
                </div>
        </template>

        <template v-if="layout == 'playlistItem'">
            {{ currentObj }}
        </template>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            currentObj: this.videoObject
        }
    },
    props:{
        videoObject:{
            default:{},
            type: Object
        },
        layout:{
            type:String
        }
    },
    filters:{
        dateTime:(value) => {
            var months = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var dateVal = value.split('T');
            if(dateVal.length) dateVal = dateVal.join(' ');

            const dtObj = new Date(dateVal);

            // datepart: 'y', 'm', 'w', 'd', 'h', 'n', 's'
            Date.dateDiff = function(datepart, fromdate, todate) {	
            datepart = datepart.toLowerCase();	
            var diff = todate - fromdate;	
            var divideBy = { w:604800000, 
                            d:86400000, 
                            h:3600000, 
                            n:60000, 
                            s:1000 };	
            
            return Math.floor( diff/divideBy[datepart]);
            }

            var today= new Date();
            
            //Check for Hours in less than 24 
            var hrsPast = Date.dateDiff('h', dtObj, today);
            if(hrsPast < 24) return hrsPast + ' hours ago';

            var daysPast =  Date.dateDiff('d', dtObj, today);
            if(daysPast < 3){
                var endStr = ' days ago';
                if(daysPast < 2) endStr = ' day ago';

                return daysPast + endStr;
            }

            var day = dtObj.getDate();
            var monthIndex = dtObj.getMonth();
            var year = dtObj.getFullYear();

            return day + ' ' + months[monthIndex] + ' ' + year;
        }
    }
}
</script>

<style scoped>
    .videoBox{
        padding:5px
    }

    .videoBox .media-content{
        color:hsl(0, 0%, 53.3%)
    }

    .videoBox:hover{
        background-color:#e4e2e2db;
        transition: all 0.2s linear;
        cursor:pointer
    }
</style>
