/* global Util*/

var Picker = {
    init : false
};

Picker.proc_init = function(){
    if (!this.init){
        this.minDate = new Date(2013, 7, 1, 0, 0, 0, 0);
        this.minDateString = Util.getDateString(this.minDate);
        this.curtDate = Util.getDate(0);
        this.curtDateString = Util.getDateString(this.curtDate);
        this.ydayDate = Util.getDate(-1);
        this.ydayDateString = Util.getDateString(this.ydayDate);
        this.dayInMilliSec = 24 * 60 * 60 * 1000;
        this.init = true;
        this.after30Date = Util.getDate(30);
        this.after60Date = Util.getDate(60);
    }
};

Picker.updateEndDate = function(id, enddate){
    var dp,
        set_to;
    if (Util.hasDatepicker(id) && Util.hasDateObj(enddate))
    {
        set_to = (Util.getDate(null,id) > enddate) ? enddate: Util.getDate(null,id);

        // if current selected date > EndDate, setEndDate will fail
        Util.setDate(id, set_to);
        $(id).datepicker('setEndDate', Util.getDateString(enddate));
        // set date back to selected date
        Util.setDate(id, set_to);
    }
};

Picker.updatePickerByQueryURL = function(query_url, spicker_id, epicker_id) {
    var fdate = Util.getMatchedStr(query_url, /from=(\d{4}-\d{1,2}-\d{1,2})/);
    var tdate = Util.getMatchedStr(query_url, /to=(\d{4}-\d{1,2}-\d{1,2})/);
    if (Util.hasStrValue(fdate) && Util.hasStrValue(tdate)) {
        fdate = new Date(fdate);
        tdate = new Date(tdate);
        if (Util.hasDateObj(fdate) && Util.hasDateObj(tdate)){
            fdate = Util.getDate(0,fdate);
            tdate = Util.getDate(0,tdate);
            if(Picker.isInValidDatePeriod(fdate) && Picker.isInValidDatePeriod(tdate)){
                if(fdate < tdate){
                    Util.setDate(spicker_id,fdate);
                    Util.setDate(epicker_id,tdate);
                }else{
                    Util.setDate(spicker_id,tdate);
                    Util.setDate(epicker_id,fdate);
                }
            }
        }
    }
};

Picker.isInValidDatePeriod = function(date_obj){
    var valid = false;
    if (Util.hasDateObj(date_obj) &&
        (date_obj.valueOf() >= Picker.minDate.valueOf()) &&
        (date_obj.valueOf() <= Picker.ydayDate .valueOf())){
        valid = true;
    }
    return valid;
};

var daypicker_init = function(dp, day_offset){
    var theday, set_to;

    if (Util.hasElement(dp.master)){
        theday = $(dp.master).datepicker
            ({
                weekStart: 1,
                startDate: Picker.minDateString,
                endDate: Picker.ydayDateString,
                autoclose: true
            }).on('changeDate', function(ev)
                {
                    Util.setDate(dp.master,ev.date);
                    if (dp.slave !== null){
                        Util.setDate(dp.slave, ev.date);
                    }
                }).data('datepicker');

        set_to = Util.getDate(Util.isInt(day_offset)?day_offset:0);
        Util.setDate(dp.master,set_to);
        Util.setDate(dp.slave, set_to);
        set_to = null;
    }
};

var datepicker_init = function(from, to, day_offset){
    var fromdate,
        todate,
        from_setto,
        to_setto,
        offset = Util.isInt(day_offset)?day_offset:0;

    if ($(from).length>0 && $(to).length>0 )
    {
        from_setto = Util.getDateString(Util.getDate(-6 + offset));
        to_setto = Util.getDateString(Util.getDate(offset));
        $(from).attr('data-date',from_setto);
        $(to).attr('data-date', to_setto);

        $(from).data("day_offset", offset);
        $(to).data("day_offset", offset);

        (function(){
            fromdate = $(from).datepicker
            ({
                weekStart: 1,
                startDate: Picker.minDateString,
                endDate: Util.getDateString(new Date(
                                    Picker.curtDate.valueOf()+
                                    Picker.dayInMilliSec*$(from).data('day_offset')))
            }).on('changeDate', function(ev)
                {
                    if (ev.date.valueOf() > todate.getDate().valueOf()) {
                        var temp = ev.date;
                        Util.setDate(from, todate.getDate());
                        Util.setDate(to,temp);
                        temp = null;
                    }else{
                        Util.setDate(from, ev.date);
                    }
                    fromdate.hide();
                }).data('datepicker');

            todate = $(to).datepicker
                ({
                    weekStart: 1,
                    startDate: Picker.minDateString,
                    endDate: Util.getDateString(new Date(
                                    Picker.curtDate.valueOf()+
                                    Picker.dayInMilliSec*$(from).data('day_offset')))
                }).on('changeDate', function(ev)
                    {
                        if (ev.date.valueOf() < fromdate.getDate().valueOf()) {
                            var temp = ev.date;
                            Util.setDate(to, fromdate.getDate());
                            Util.setDate(from, temp);
                            temp = null;
                        }else{
                            Util.setDate(to, ev.date);
                        }
                        todate.hide();
                    }).data('datepicker');
        })();

        $(to).datepicker('update', to_setto);
        $(from).datepicker('update', from_setto);
    }
};

var quick_daypicker_init = function(dp, quick_pre, quick_nxt){
    if (Util.hasElement(dp.master)){
        $(quick_pre).click(function(){
            var set_to = Util.getDate(-1, Util.getDate(null, dp.master));
            if (set_to >= Picker.minDate){
                $(quick_nxt).removeClass('disabled');
                Util.setDate(dp.master, set_to);
                Util.setDate(dp.slave, set_to);
                set_to = null;
            }
        });
        $(quick_nxt).click(function(){
            var set_to = Util.getDate(1, Util.getDate(null, dp.master));
            if (set_to <= Picker.ydayDate){
                $(quick_nxt).removeClass('disabled');
                if (set_to.valueOf() === Picker.ydayDate){
                    $(quick_nxt).addClass('disabled');
                }
                Util.setDate(dp.master, set_to);
                Util.setDate(dp.slave, set_to);
                set_to = null;
            }else{
                $(quick_nxt).addClass('disabled');
            }
        });
    }
};

var quick_weekpicker_init = function(start_picker, end_picker, quick_pre, quick_nxt){
    var get_week_date = function(specified_date, is_pre){
        var theDay = new Date(specified_date),
            oneJan = new Date(theDay.getFullYear(), 0, 1),
            oneJanDayOffset = (oneJan.getDay() === 0) ? 6 : oneJan.getDay()-1,
            diffDay = Math.ceil((theDay - oneJan) / Picker.dayInMilliSec),
            weekOfYear = Math.ceil((diffDay + oneJanDayOffset) / 7),
            weekStartDate = new Date(oneJan.valueOf()+
                                     ((weekOfYear-1+(is_pre === true ? -1 : 1))*7 - oneJanDayOffset) * Picker.dayInMilliSec),
            weekEndDate = new Date(weekStartDate.valueOf()+6 * Picker.dayInMilliSec);

        return {
            startDate:weekStartDate,
            endDate: weekEndDate
        };
    };
    $(quick_pre).click(function(){
        var week = get_week_date(Util.getDateString(start_picker), true);
        if (week.endDate > Picker.minDate){//week not before minDate
            $(quick_nxt).css('display','inline-block');

            if (week.startDate < Picker.minDate){
                //week-start-date < minDate < week-end-date
                Util.setDate(start_picker,Picker.minDate);
                $(quick_pre).css('display','none');
            }else{
                //minDate < week-start-date < week-end-date
                Util.setDate(start_picker,week.startDate);
            }
            Util.setDate(end_picker,week.endDate);
        }
    });
    $(quick_nxt).click(function(){
        var week = get_week_date(Util.getDateString(start_picker), false),
            set_to = new Date(Picker.curtDate.valueOf()+Picker.dayInMilliSec*$(end_picker).data('day_offset'));

        if (week.startDate < Picker.curtDate){//week not after curtDate
            $(quick_pre).css('display','inline-block');

            Util.setDate(start_picker,week.startDate);
            if (week.endDate > set_to){
                //week-start-date < curtDate < week-end-date
                Util.setDate(end_picker,set_to);
                $(quick_nxt).css('display','none');
            }else{
                //week-start-date < week-end-date < curtDate
                Util.setDate(end_picker,week.endDate);
            }
        }
        set_to = null;
    });
};

var tip_init = function(element) {
    var tip_gen_option = function(type,text){
            var tip_default_option = {
                    style: { width: 250 }
                };

            switch(type){
                case 'hover':
                    Util.extendObj(
                        tip_default_option,
                        { content : { title: '幫助說明', text: text } }
                    );
                    break;
                case 'click':
                    Util.extendObj(
                        tip_default_option,
                        {
                            show:{ event: 'click' },
                            hide:{ event: 'unfocus'},
                            content : { title: '幫助說明', text: text, button: true }
                        }
                    );
                    break;
            }
            return tip_default_option;
        },
        autotip_function = function(type, target){
            var tip_pop_left   = { position:{ my: 'top right' , at: 'bottom left'  } },
                tip_pop_center = { position:{ my: 'top center', at: 'bottom center'} },
                tip_patt = /<!--(.*?)-->/g,
                tip_text,
                tip_option;

            if ($(target).parent().length>0){
                tip_text = $(target).parent()[0].innerHTML.match(tip_patt);
                if (tip_text!==null){
                    tip_text = tip_text[0].replace(/(<!--|-->)/g, '');
                    tip_option = tip_gen_option(type, tip_text);

                    if ($(target).hasClass("pop-bottom-left")){
                        Util.extendObj(tip_option, tip_pop_left);
                    }
                    if ($(target).hasClass("pop-bottom-center")){
                        Util.extendObj(tip_option, tip_pop_center);
                    }
                    $(target).qtip(tip_option);
                }
            }
        };
        if (element !== undefined){
            if (Util.hasElement(element)){
                $(element).find(".autotip").each(function(){
                    autotip_function('hover', this);
                });
            }
        }else {
            $(".autotip").each(function(){
                autotip_function('click',this);
            });
        }
};

var bs_tip_init = function(){
    $('.tip').tooltip();
    $('.tip-left').tooltip({ placement: 'left' });
    $('.tip-right').tooltip({ placement: 'right' });
    $('.tip-top').tooltip({ placement: 'top' });
    $('.tip-bottom').tooltip({ placement: 'bottom' });
};