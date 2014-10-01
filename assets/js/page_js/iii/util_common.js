var Util = {};

Util.getMatchedStr = function (str, regex){
    var matchStr = '';
    if (Util.hasStrValue(str) && Util.isRegex(regex)){
        matchStr = str.match(regex);
        matchStr = Util.isArray(matchStr)? matchStr[1] : '';
    }
    return matchStr;
};

Util.getGrowthRate = function(present,past){
    if (this.isNumber(present) && this.isNumber(past) && past > 0){
        return (present-past)/past;
    }
};

Util.getDate = function(day_interval, baseObj) {
    var interval = parseInt(day_interval,10),
        calcDate;

    if (Util.hasDatepicker(baseObj)){
        calcDate = new Date($(baseObj).datepicker('getDate'));
    }else{
        calcDate = Util.hasDateObj(baseObj)? baseObj : new Date();
        calcDate = new Date(calcDate.getFullYear(), calcDate.getMonth(), calcDate.getDate(), 0, 0, 0, 0);
        calcDate.setDate(calcDate.getDate()+interval);
    }

    return calcDate;
};

Util.setDate = function(target, date){
    var e = $(target),
        date_str;
    if (typeof e === 'object' ){
        date_str = Util.getDateString(date);
        if (Util.hasDatepicker(e)){
            $(e).datepicker('update', date);
            $(e).data('date', date_str);
        } else if ($(e).is('span')){
            $(e)[0].innerHTML = date_str;
        }
        date_str = null;
    }
};

Util.getDateString = function(input){
    var returnDate = null,
        returnString = null,
        mm,
        dd;

    if (typeof input === 'string' ){
        if ($(input).is('div')){
            returnString = $(input).data('date');
        }else if ($(input).is('input')){
            returnString = $(input).val();
        }else if ($(input).is('span')){
            returnString = $(input)[0].innerText;
        }
    } else {
        returnDate = Util.isInt(input) ? Util.getDate(input) :
                     Util.hasDateObj(input)? input : Util.getDate(0);
        mm = returnDate.getMonth()+1;
        dd = returnDate.getDate();
        mm = (mm < 10 ? '0' : '') + mm;
        dd = (dd < 10 ? '0' : '') + dd;
        returnString = returnDate.getFullYear() + "-" + mm + "-" + dd;
    }

    returnDate = null;
    return returnString;
};

Util.getReadableTime = function(seconds){
    var hour = Math.floor(seconds / 3600),
        min = Math.floor((seconds-hour*3600) / 60),
        sec = seconds-hour*3600-min*60,
        val = (hour===0 && min===0 && sec===0) ? '-' :
              (hour>0?hour+"時":"")+(min>=0?min+"分":"")+(sec>=0?sec+"秒":"");
    return val;
};

Util.numberFormat = function (number, decimals, dec_point, thousands_sep) {
      //  code from: https://raw.github.com/kvz/phpjs/master/functions/strings/number_format.js
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k).toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
};

Util.getActiveTipBottom = function(menu_id) {
    var activeButtom = [];
    activeButtom = $("a.tip-bottom.active");
    return activeButtom;
};

Util.hasElement = function(element_id){
    var hasElement = false;

    if (Util.isArray(element_id)){
        for (var i=0;i<element_id.length;i++){
            hasElement = arguments.callee(element_id[i]);
            if (!hasElement){
                break;
            }
        }
    }else{
        if ($(element_id).length>0){
            hasElement = true;
        }
    }
    return hasElement;
};

Util.genArray = function(element,length){
    var array = null;
    if (length>0 && element!==null){
        array = [];
        for (var i=0;i<length;i++){
            array.push(element);
        }
    }
    return array;
};

Util.sumArray = function (arr){
    var total = null;
    if (this.hasArrayObj(arr))
    {
        total = 0;
        for (var i=0;i<arr.length;i++) {
            total += arr[i];
        }
    }
    return total;
};

Util.isVisible = function(target){
    var allvisible = true;
    if (Util.hasArrayObj(target))
    {
        for(var id in target){
            if (!$(id).is(':visible')){
                allvisible = false;
                break;
            }
        }
    }
    else if (typeof(target)==='string' && !$(target).is(':visible'))
    {
        allvisible = false;
    }else{
        allvisible = false;
    }

    return allvisible;
};

Util.hasObj = function (o){
    return typeof(o)==='object';
};

Util.hasDateObj = function (o) {
    return typeof(o)==='object' && (o.getTime() === o.getTime());
};

Util.hasArrayObj = function (o) {
    var hasArray = false;
    if (Util.isArray(o)){
        hasArray = (o.length > 0);
    }else if (Util.hasObj(o)){
        for (var prop in o){
            if ( o.hasOwnProperty(prop) ){
                hasArray = arguments.callee(o[prop]);
                if (!hasArray){
                    break;
                }
            }
        }
    }
    //return (isArray(o) && o.length>0);
    return hasArray;
};

Util.isArray = function (o) {
  return (!!o && typeof o.push !== "undefined");
};

Util.hasStrValue = function (item) {
    return (typeof(item)==='string' || (typeof item ==="object"&& item['constructor'])) && item.length>0 ;
};

Util.extendObj = function(o1, o2){
    var n;
    if (!o1) {
        o1 = {};
    }
    for (n in o2){
        if ( o2.hasOwnProperty(n) ){
            o1[n] = o2[n];
        }
    }
    return o1;
};

Util.isRegex = function(obj){
    return Util.hasObj(obj) && (obj instanceof RegExp);
};

Util.isFunction = function(obj){
    if (this.getType===undefined){
        this.getType = {};
    }
    return obj && this.getType.toString.call(obj) === '[object Function]';
};

Util.isBoolean = function(b) {
    return typeof(b) === "boolean";
};

Util.isInt = function(n){
    return typeof(n)=== 'number' && n%1===0;
};

Util.isNumber = function(n){
    return typeof(n)=== 'number';
};

Util.isIntInStr = function(str){
    return typeof(str)=== 'string' && !isNaN(str);
};

Util.isValidDate = function(d){
  if ( Object.prototype.toString.call(d) !== "[object Date]" ){
    return false;
  }
  return !isNaN(d.getTime());
};

Util.utc2Date = function(utc_seconds){
    var d = new Date(0);
    d.setUTCSeconds(utc_seconds);
    return d.valueOf();
};

Util.hasDatepicker = function(o){
    return Util.hasElement(o) && ( $(o).data('datepicker')!==undefined );
};