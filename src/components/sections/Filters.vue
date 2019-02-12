<template>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-md btn-default" type="button" @click="showFilters = !showFilters" v-if="showButton">
                    <i class="glyphicon glyphicon-tasks"></i> <span>Filters</span>
                </button>
            </div>

            <div class="col-md-12 animated" v-show="showFilters">
                <div class="row">
                    <div class="col-md-3" v-for="(filters, filterKey) in filterArr" :key="filterKey">
                        <table class="table table-condensed">
                            <thead>
                                <tr>
                                    <th>{{ filters.replace('_', ' ') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, itemIndex) in filterOptions[filterKey]" :key="itemIndex" :data-filItem="filterKey+'___'+itemIndex">
                                    <td class="filterItem">
                                        <div class="row">
                                            <div class="col-sm-10" @click="setFilter(filterKey, itemIndex)">
                                                <span>{{ item }}</span>
                                            </div>
                                            <div class="col-sm-2">
                                                <button class="btn btn-block showButton" @click="removeFilter(filterKey, itemIndex)" > X </button>
                                            </div>
                                        </div>
                                    </td>
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
            //Trigger filters by a button click or show filters by default
            showFilters: false,

            //Stores all the selected/active filters
            selectedFilter:{},
            
            //Main filter object. Add new filters here
            filterArr:['Upload','Type','Duration','Sort_by'],

            //Main filters options. Add new filter options here
            filterOptions:[
                ['Last Hour', 'Today', 'This Week', 'This Month', 'This year'],
                ['Video', 'Channel', 'Playlist', 'Movie', 'Show'],
                ['Short( < 4 Minutes )', 'Medium ( <= 20 Minutes )','Long ( > 20 Minutes )'],
                ['Relevance', 'Upload date', 'View count', 'Rating', 'Title'],
            ],

        }
    },
    watch:{
        //Emit new filter object, when user clicks new one
        selectedFilter(val){
            this.$emit('filterTriggered', val);
        }
    },
    computed:{
        //Decides whether to show filter trigger button or not
        showButton(){
            if(!this.buttonEnabled) this.showFilters = true;
            return this.buttonEnabled;
        }
    },
    methods:{
        //Set active filters
        setActiveFilters(parent, child){
            var listItem = document.querySelector('tr[data-filItem="'+parent+'___'+child+'"]');

            if (typeof(listItem) != 'undefined' && listItem != null){
                var result = [],
                node = listItem.parentNode.firstChild;

                while ( node ) {
                    if ( node !== listItem && node.nodeType === Node.ELEMENT_NODE ){
                        if(node.firstChild.classList.contains('active')) node.firstChild.classList.remove('active');
                    }
                    
                    node = node.nextElementSibling || node.nextSibling;
                }

                if(listItem.firstChild.classList.contains('active') == false) listItem.firstChild.classList.add('active');
            }
        },

        //Remove clicked filter
        removeFilter(parent, child){
            if(this.filterArr[parent]){
                var selFilter = this.selectedFilter;
                switch(parent){
                    case 0:
                        if(this.selectedFilter['publishedBefore']) this.selectedFilter['publishedBefore'] = null;
                        if(this.selectedFilter['publishedAfter']) this.selectedFilter['publishedAfter'] = null;
                    break;

                    case 1:
                        if(this.selectedFilter['type']) this.selectedFilter['type'] = null;
                        if(this.selectedFilter['videoType']) this.selectedFilter['videoType'] = null;
                    break;

                    case 2:
                        if(this.selectedFilter['videoDuration']) this.selectedFilter['videoDuration'] = null;
                    break;

                    case 3:
                        if(this.selectedFilter['order']) this.selectedFilter['order'] = null;
                    break;
                }

                var listItem = document.querySelector('tr[data-filItem="'+parent+'___'+child+'"] td');
                if(listItem && listItem.classList.contains('active')) listItem.classList.remove('active');
                
                this.selectedFilter = Object.assign({}, this.selectedFilter, selFilter);
            }
        },

        //Set filter arr valeus based on the event
        setFilter(parent, child){
            if(this.filterArr[parent] && this.filterOptions[parent][child]){
                switch(parent){
                    case 0:
                        this.setUploadTime(child);
                    break;

                    case 1:
                        this.setVideoType(parent, child);
                    break;

                    case 2:
                       this.setLengthType(child);
                    break;

                    case 3:
                        this.setSortype(child);
                    break;
                }

                //Set current filter as active
                this.setActiveFilters(parent, child);
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

            if(Object.keys(tmpObj).length > 0){
                this.selectedFilter = Object.assign({}, this.selectedFilter, tmpObj);
               // this.$emit('filterTriggered', tmpObj);
            }
        },

        //Set Uplaod type
        setVideoType(parent, child){
            var videoTypeVal = this.filterOptions[parent][child]; 
            if(!videoTypeVal) return;

            videoTypeVal = videoTypeVal.toLocaleLowerCase();
            if(videoTypeVal == 'show') videoTypeVal = 'episode';

            var tmpObj = {'type' : videoTypeVal, 'videoType': null};
            if(child > 2){
                tmpObj = {'videoType' : videoTypeVal, 'type': 'video'};
            }

            this.selectedFilter = Object.assign({}, this.selectedFilter, tmpObj);
        },

        //Set Uplaod type
        setLengthType(child){
            //if(!child) return;

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

            if(lengthValue){
                this.selectedFilter = Object.assign({}, this.selectedFilter, {'videoDuration': lengthValue});
                //this.$emit('filterTriggered', {'videoDuration': lengthValue});
            }
        },

        //Set Uplaod type
        setSortype(child){
           //if(!child) return;
            var sortType = '';

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

            if(sortType){
                this.selectedFilter = Object.assign({}, this.selectedFilter, {'order': sortType});
                //this.$emit('filterTriggered', {'order':sortType});
            }
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

    .filterItem.active .showButton{
        display: block;
    }

    .active{
        color:#000;
        background-color:#ccc
    }

    .showButton{
        display: none;
        padding:0px;
    }
</style>
