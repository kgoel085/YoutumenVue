export const globalMix = {
    data(){
        return{
            apiArr:{
                paramsArr: {'chart': 'mostpopular', 'maxResults': 10},
                endPoint: 'videos',
                successCallBack: this.getResult,
            },
            apiResponse:{
                nextPageToken: null,
                prevPageToken: null,
                videoCount:{
                    total: 0,
                    current: 0
                }
            }
        }
    },
    methods:{
        //Init. api call to retrive trending videos
        callAPi(apiObj){
            var vm = this;

            //API required variables
            var paramsArr = (apiObj.paramsArr && Object.keys(apiObj.paramsArr).length > 0) ? apiObj.paramsArr : this.apiArr.paramsArr;
            var endPoint = (apiObj.endPoint) ? apiObj.endPoint : this.apiArr.endPoint;
            var successCallBack = (apiObj.successCallBack) ? apiObj.successCallBack : this.apiArr.successCallBack;
            var errorCallBack = '';

            if(vm.apiResponse.nextPageToken){
                paramsArr.pageToken = vm.apiResponse.nextPageToken;
            }
            
            this.$http.get(endPoint, {params: paramsArr}).then(resp => resp.json()).then(response => {
                
                //Check for Page Token
                if(response.nextPageToken) vm.apiResponse.nextPageToken = response.nextPageToken;
                if(response.prevPageToken) vm.apiResponse.prevPageToken = response.prevPageToken;

                //Check for Page information
                if(response.pageInfo){
                    if(response.pageInfo.totalResults) vm.apiResponse.videoCount.total = response.pageInfo.totalResults;
                    if(response.pageInfo.resultsPerPage) vm.apiResponse.videoCount.current += response.pageInfo.resultsPerPage;
                }

                successCallBack(response);
            }, err => {
                errorCallBack(err);
            });
        }
    }
}