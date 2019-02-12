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
    },

    //Returns the provided date formatted as RFC 3339 format
    ISODateString(d = null){
        if(d == null) d = new Date();
        function pad(n){return n<10 ? '0'+n : n}
        return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + pad(d.getUTCHours())+':'
            + pad(d.getUTCMinutes())+':'
            + pad(d.getUTCSeconds())+'Z';
    },

    //Format youtube provided video duration
    formatVideoLength(time = null){
        if(time == null) return ;
    
        var a = time.match(/\d+H|\d+M|\d+S/g);
        var result = 0;
    
        var d = { 'H': 3600, 'M': 60, 'S': 1 };
        var num;
        var type;
    
        for (var i = 0; i < a.length; i++) {
            num = a[i].slice(0, a[i].length - 1);
            type = a[i].slice(a[i].length - 1, a[i].length);
    
            result += parseInt(num) * d[type];
        }

        //Format seconds to actual time
        d = Number(result);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay;
    }

}