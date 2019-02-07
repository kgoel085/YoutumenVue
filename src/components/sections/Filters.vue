<template>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-md btn-default" type="button" @click="showFilters = !showFilters" v-if="showButton">
                    <i class="glyphicon glyphicon-tasks"></i> <span>Filters</span>
                </button>
            </div>

            <div class="col-md-12 animated" v-if="showFilters">
                <div class="row">
                    <div class="col-md-3" v-for="(filters, filterType) in filterArr" :key="filterType">
                        <table class="table table-condensed">
                            <thead>
                                <tr>
                                    <th>{{ filterType.replace('_', ' ') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, itemIndex) in filters" :key="itemIndex">
                                    <td class="filterItem" @click="setFilter(filterType, itemIndex)">{{ item }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selectedFilter:{
                'publishedAfter': null,
                'publishedBefore': null,
                'type': null,
                'videoType': null,
                'videoDuration': null,
                'order': null,
            },
            filterArr:{
                'Upload':['Last Hour', 'Today', 'This Week', 'This Month', 'This year'],
                'Type':['Video', 'Channel', 'Playlist', 'Movie', 'Show'],
                'Duration':['Short( < 4 Minutes )', 'Medium ( <= 20 Minutes )','Long ( > 20 Minutes )'],
                'Sort_by':['Relevance', 'Upload date', 'View count', 'Rating', 'Title']
            },
            showFilters: false
        }
    },
    computed:{
        showButton(){
            if(!this.buttonEnabled) this.showFilters = true;
            return this.buttonEnabled;
        }
    },
    methods:{
        //Set filter arr valeus based on the event
        setFilter(parent, child){
            if(this.filterArr[parent]){
                switch(parent){
                    case 'Upload':
                        if(this.filterArr[parent][child]) this.setUploadTime(child);
                    break;

                    case 'Type':
                        if(this.filterArr[parent][child]) this.setVideoType( child);
                    break;

                    case 'Duration':
                       if(this.filterArr[parent][child]) this.setLengthType(child);
                    break;

                    case 'Sort_by':
                        if(this.filterArr[parent][child]) this.setSortype(child);
                    break;
                }
            }
        },

        //Set Uplaod type
        setUploadTime(child){
            var prevDate = null;
            var nextDate = null;

            switch(child){
                case 0:
                    var currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() - 1);

                    prevDate = this.$helpers.ISODateString(currentDate);
                    nextDate = this.$helpers.ISODateString();
                break;

                case 2:
                    var current = new Date();     // get current date    
                    var weekstart = current.getDate() - current.getDay() +1;    
                    var weekend = weekstart + 6;       // end day is the first day + 6 

                    nextDate = this.$helpers.ISODateString(new Date(current.setDate(weekend)));  
                    prevDate = this.$helpers.ISODateString(new Date(current.setDate(weekstart)));
                break;

                case 3:
                    var date = new Date();
                    date.setMonth(date.getMonth() - 1);

                    nextDate = this.$helpers.ISODateString(new Date());  
                    prevDate = this.$helpers.ISODateString(date);
                break;

                case 4:
                    var date = new Date();
                    date.setFullYear(date.getFullYear() - 1);

                    nextDate = this.$helpers.ISODateString(new Date());
                    prevDate = this.$helpers.ISODateString(date);
                break;

                default:
                    prevDate = this.$helpers.ISODateString();
                    nextDate = this.$helpers.ISODateString();
                break;
            }

            var tmpObj = {};

            if(prevDate) tmpObj.publishedAfter = prevDate;
            if(nextDate) tmpObj.publishedBefore = nextDate;

            if(Object.keys(tmpObj).length > 0) this.$emit('filterTriggered', tmpObj);
        },

        //Set Uplaod type
        setVideoType(child){
            var videoTypeVal = this.filterArr['Type'][child];
            if(!videoTypeVal) return;

            videoTypeVal = videoTypeVal.toLocaleLowerCase();

            if(child <= 2){
                this.$emit('filterTriggered', {'type':videoTypeVal})
                return false;
            }

            if(videoTypeVal == 'show') videoTypeVal = 'episode';
            this.$emit('filterTriggered', {'videoType':videoTypeVal});
        },

        //Set Uplaod type
        setLengthType(child){
            var lengthVal = this.filterArr['Duration'][child];
            if(!lengthVal) return;

            var lengthValue = '';
            
            switch(child){
                case 0:
                    lengthValue = 'short';
                break;

                case 1:
                    lengthValue = 'medium';
                break;

                case 2:
                    lengthValue = 'long';
                break;
            }

            if(lengthValue) this.$emit('filterTriggered', {'videoDuration': lengthValue});
        },

        //Set Uplaod type
        setSortype(child){
            var sortType = this.filterArr['Sort_by'][child];
            if(!sortType) return;

            switch(child){
                case 0:
                   sortType = 'relevance';
                break;

                case 1:
                    sortType = 'date';
                break;

                case 2:
                    sortType = 'viewCount';
                break;

                case 3:
                    sortType = 'rating';
                break;

                case 4:
                    sortType = 'title';
                break;
            }

            if(sortType) this.$emit('filterTriggered', {'order':sortType});
        }

    },
    props:{
        //Whether to trigger filter block by button, or show it directly
        buttonEnabled: {
            default: true,
            type: Boolean
        }
    }
}
</script>

<style scoped>
    .filterItem{
        cursor:pointer;
        color:rgba(0, 0, 0, 0.5);

    }
    .filterItem:hover{
       color:#000;
    }
</style>
