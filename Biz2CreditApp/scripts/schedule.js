(function (global) {
    var ScheduleViewModel,
        app = global.app = global.app || {};

    ScheduleViewModel = kendo.data.ObservableObject.extend({
        phonenumber:'',
        sDate:'',
        sTime:'',
        closeModal:function()
        {
            $("#tabstrip-scall").data("kendoMobileModalView").close();  
        },
        validateSchedule:function()
        {
            var that = this,
            phonenumber = that.get("phonenumber").trim(),
            sDate = kendo.toString(that.get("sDate"), "MM-dd-yyyy");
            sTime = $("#timepicker").val();
            if (phonenumber === "") {
                navigator.notification.alert("Please enter phone number.",
                    function () { }, "Notification", 'OK');

                return;
            }
            if (!$.isNumeric(phonenumber)) {
                navigator.notification.alert("Phone Number should be numeric.");

                return;
            }
            if (phonenumber.length !== 10) {
                navigator.notification.alert("Phone Number should be 10 digits.");

                return;
            }
            if (sDate === "") {
                navigator.notification.alert("Please select date.",
                    function () { }, "Notification", 'OK');

                return;
            }
            if (sTime ==="") {
                navigator.notification.alert("Please select time.",
                    function () { }, "Notification", 'OK');

                return;
            }
            else{ 
                if(!window.connectionInfo.checkConnection()){
                	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                		if (confirmed === true || confirmed === 1) {
                			app.scheduleService.viewModel.validateSchedule();
                		}

                	}, 'Connection Error?', 'Retry,Cancel');
                }
                else
                {
                	app.loginService.viewModel.showloder();
                	that.setSchedule(phonenumber,sDate,sTime); 
                }
            }
           
        },
        setSchedule:function(phonenumber,sDate,sTime)
        {
            
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem("urlMobAppApiUser"),
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: { apiaction:"callschedule",userid:localStorage.getItem("userID"),name:localStorage.getItem("userFName"),email:localStorage.getItem("userEmail"),appid:"",phone:phonenumber ,calldate:sDate,calltime:sTime}
                    },
                },
                schema: {
                    data: function(data)
                    {
                        return [data];
                    }
                },
                error: function (e) {
                	apps.hideLoading();
                	navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                	function () { }, "Notification", 'OK');
                    app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in callschedule api.');
                }, 
               
            });
            dataSource.fetch(function(){
                var that = this;
                var data = that.data();
                app.loginService.viewModel.hideloder();  
            	navigator.notification.alert(data[0]['results']['faultmsg']);  
           });
        },
        ScheduleCloseModalView:function()
        {
            $("#tabstrip-scall").data("kendoMobileModalView").close();
            var that =this;
            that.set("phonenumber","");
            that.set("sDate","");
            $("#timepicker").val("");
        },
        RemoveRougeChar:function(convertString){
        if(convertString.substring(0,1) == ","){
            return convertString.substring(1, convertString.length)                  
        }
        return convertString; 
    }
   
    });
    $(window).on('orientationchange', function () {
        
        
        $("#tabstrip-home").find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px)");
        $("#tabstrip-sign-up").find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px)");
 
        if(window.innerWidth > window.innerHeight)
        {
            $('body').addClass('vertical');
            $('body').removeClass('horizontal');
        }
        else
        {
            $('body').addClass('horizontal');
            $('body').removeClass('vertical');
        }
        app.homesetting.viewModel.closeParentPopover();
      
    });
    app.scheduleService = {
        viewModel: new ScheduleViewModel()	
    };
})(window);
$(document).ready(function(){
    
    if(window.innerWidth > window.innerHeight)
    {
        $('body').addClass('horizontal');
        $('body').removeClass('vertical');
       
    }
    else
    {
        $('body').addClass('vertical');
        $('body').removeClass('horizontal');
        
    }
   
     $('body').on("blur","input.number",function(e) {
													
			var $this = $(this);
			var num = $this.val().replace(/[^0-9]+/g, '').replace(/,/gi, "").split("").reverse().join("");     
			var num2 = app.scheduleService.viewModel.RemoveRougeChar(num.replace(/(.{3})/g,"$1,").split("").reverse().join(""));
			$this.val(num2);								
	});
	
	$('body').on("focus","input.number",function(e) {
 		var $this = $(this);
		var num = $this.val().replace(/,/g,"");
		$this.val(num);						
	});
    
    $("body").removeAttr("style");
    $("body").css('height','100%');
    var todaysDate = new Date();
    var pastDate = new Date(2013, 1, 1);
    var dp = $("#datepicker").kendoDatePicker({
        value: pastDate,
        min: pastDate,
        format: "MM-dd-yyyy",
        open: function(e) {
            if ( dp.min() === pastDate)  {
            	dp.value(todaysDate);
            	dp.min(todaysDate);
            }
            $(".k-weekend").each(function (){
            	$(this).find("a").attr("disabled",true).removeClass("k-link").addClass("k-state-disabled").removeAttr("href");
            	$(this).removeClass("k-state-hover");
            	$(this).addClass("k-state-disabled");
            });
        } 
    }).data("kendoDatePicker");
    $('#datepicker').attr('disabled','disabled');
    $('td.k-weekend a').attr('disabled','disabled');
    $("#timepicker").kendoTimePicker();
    $('#timepicker').attr('disabled','disabled');
    var listOfTimes = $("#timepicker_timeview");
    listOfTimes.empty();
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">08AM - 10AM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">10AM - 12PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">12PM - 02PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">02PM - 04PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">04PM - 06PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">06PM - 08PM</li>');
    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    }

});
