import Vue from "vue"

//Formats number in correct comma seperated format
Vue.filter('subscriberCount', function(value){
    // if(!value) return '';

    // value = value.toString();
    // return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")

    // Nine Zeroes for Billions
    return Math.abs(Number(value)) >= 1.0e+9
    
    ? (Math.abs(Number(value)) / 1.0e+9).toFixed(0) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(value)) >= 1.0e+6

    ? (Math.abs(Number(value)) / 1.0e+6).toFixed(0) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(value)) >= 1.0e+3

    ? (Math.abs(Number(value)) / 1.0e+3).toFixed(0) + "K"

    : Math.abs(Number(value));
});

//Format api returned date into readble format
Vue.filter('dateTime', function(value){
    if(!value) return '';

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
});