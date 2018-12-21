export const configArr = {
    //This keys stores the Global configuaration values
    'Global':{
        //Place your values here that you want to send with every api request
        'parameters':{
            'key': 'PLACE YOUR API KEY HERE',
        },
        'url': 'URL of your API'
    },
    //Below keys define the parameters that will be send for the selected selection
    'Locations':{
        parameters:{
            params: {},
            endpoint: 'i18nRegions'
        }
    },
    'Home':{
        parameters:{
            params: {'chart': 'mostpopular', 'maxResults': 1, 'fields': 'nextPageToken,pageInfo,items(snippet/channelId)'},
            endpoint:'videos',
        }
    },
    'Trending':{
        parameters:{
            params: {'chart': 'mostpopular', 'maxResults': 10},
            endpoint:'videos',
        }
    },
    'Channel':{
        parameters:{
            params: {'part': 'snippet,contentDetails', 'fields': 'items(id,contentDetails,snippet(title, thumbnails, description))', 'id': null},
            endpoint: 'channels'
        }
    },
    'Playlist':{
        parameters:{
            params:{'part': 'snippet,contentDetails', 'maxResults': 8, 'fields': 'items(snippet(resourceId/videoId))', 'playlistId': null},
            endpoint: 'playlistItems'
        }
    },
    'Video':{
        parameters:{
            params:{'part': 'snippet,contentDetails', 'id': null},
            endpoint:'videos'
        },
    }
}