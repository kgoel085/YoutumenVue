//This file contain all the common & handy fucntions used in the project

export default{
    
    //This functions validates & extracts Video ID , Playlist ID from the provided URL
    validateUrl(url = '', returnArray = true){
        var returnArr = {
            success: false,
            data: null,
            errorMsg: 'Please provide a valid URL !',
        };

        if(!url) return returnArr;

        var videoId = '';
        var playlistId = '';
        var testString = url;

        //Chk if URl is from youtube or not 
        var urlValid = false;
        var urlChkRegEx = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
        if(testString.match(urlChkRegEx)) urlValid = true;

        if(!urlValid) return returnArr;

        // RegEx to check for either video or playlist id 
        var video = /(?:youtube\.com.*(?:\?|&)(?:v)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_]*)/g;
        var playlist = /(?:(?:\?|&)list=)((?!videoseries)[a-zA-Z0-9_]*)/g;

        //Check for video
        if(testString.match(video)) videoId = RegExp.$1;

        //Check for playlist
        if(testString.match(playlist)) playlistId = RegExp.$1;

        if((videoId || playlistId) && urlValid){
            returnArr.data = {};
            if(videoId) returnArr.data.video = videoId;
            if(playlistId) returnArr.data.playlist = playlistId;
        }

        if(returnArr.data) returnArr.success = true;
        else{
            returnArr.errorMsg = 'No video or playlist found in the URL';
            returnArr.success = false;
        }

        return returnArr;
    }
}