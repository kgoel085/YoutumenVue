<template>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-md btn-default" type="button" @click="showFilters = !showFilters" v-if="showButton">
                    <i class="glyphicon glyphicon-tasks"></i> <span>Filters</span>
                </button>
            </div>

            <div class="col-md-12 animated" v-if="showFilters">
                {{ selectedFilter }}
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
            selectedFilter:{},
            filterArr:{
                'Upload':['Last Hour', 'Today', 'This Week', 'This Month', 'This year'],
                'Type':['Video', 'Channel', 'Playlist', 'Movie', 'Show'],
                'Duration':['Short( < 4 Minutes )', 'Long ( > 20 Minutes )'],
                'Sort_by':['Relevance', 'Upload date', 'View count', 'Rating']
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
                break;

                case 2:
                    var current = new Date();     // get current date    
                    var weekstart = current.getDate() - current.getDay() +1;    
                    var weekend = weekstart + 6;       // end day is the first day + 6 

                    nextDate = this.$helpers.ISODateString(new Date(current.setDate(weekstart)));  
                    prevDate = this.$helpers.ISODateString(new Date(current.setDate(weekend)));
                break;

                case 3:
                    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                    var firstDay = new Date(y, m, 1);
                    var lastDay = new Date(y, m + 1, 0);

                    nextDate = this.$helpers.ISODateString(lastDay);  
                    prevDate = this.$helpers.ISODateString(firstDay);
                break;

                case 4:

                break;

                default:
                    prevDate = this.$helpers.ISODateString();
                    nextDate = this.$helpers.ISODateString();
                break;
            }

            console.log(nextDate, '------', prevDate);
        },

        //Set Uplaod type
        setVideoType(child){
            switch(child){
                case 0:

                break;

                case 1:

                break;

                case 2:

                break;

                case 3:

                break;

                case 4:

                break;
            }
        },

        //Set Uplaod type
        setLengthType(child){
            switch(child){
                case 0:

                break;

                case 1:

                break;
            }
        },

        //Set Uplaod type
        setSortype(child){
            switch(child){
                case 0:

                break;

                case 1:

                break;

                case 2:

                break;

                case 3:

                break;
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
</style>
