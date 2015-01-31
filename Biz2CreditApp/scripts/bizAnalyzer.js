var app = app || {};

app.bizAnalyzer = (function () {
    'use strict'
    
     var bizAnalyzerViewModal = (function () {
         
        var showrefreshBiz=kendo.observable({ 
            showrefreshBizVal: true,
            
            personaCreditScore: '',
            personaCreditRiskType: '',
            
            debitToIncomeScore: '',
            debitToIncomeRiskType: '',
            
            timeInBussinessScore:'',
            timeInBussinessRiskType:'',
            
            industryScore:'',
            industryRiskType:'',
            
            corporateScore:'',
            corporateRiskType:'',
            
            cashFlowScore:'',
            cashFlowRiskType:'',
            
            anuRevScore:'',
            anuRevRiskType:'',
            
            bizScore:'',
            
            setBizScore:function(total)
            { 
                var that = this;
                that.set("bizScore",total);

            },
            setShowrefreshBizFalse:function()
            { 
                var that = this;
                that.set("showrefreshBizVal",false);

            },
            setShowrefreshBizTrue:function()
            {
                var that = this;
                that.set("showrefreshBizVal",true);
            },
            setPersonaCreditStatus:function(data)
            {
                var that = this;
                that.set("personaCreditScore",data.creditscore);
                that.set("personaCreditRiskType",data.riskType);
                
                if(data.riskType==="Low Risk"){	
                    var grade  =  "Excellent";	
                    var class1 =  "exc";
                }
                if(data.riskType==="Medium Risk"){
                    var grade  =  "Good";
                    var class1 =  "goo";
                }
                if(data.riskType==="High Risk"){
                    var grade  =  "Low";
                    var class1 =  "bav";	
                }
                 $('#excpercre span').addClass(class1);
 				$('#excpercre span').text(grade);
            },
            
            setDebitToIncomeStatus:function(data)
            {
                var that = this;
                that.set("debitToIncomeScore",data.dtiRatioVal);
                that.set("debitToIncomeRiskType",data.riskType);
                if(data.riskType==="Low Risk"){	
                    var grade  =  "Good";	
                    var class1 =  "goo";
                }
                if(data.riskType==="Medium Risk"){
                    var grade  =  "Average";
                    var class1 =  "avg";
                }
                if(data.riskType==="High Risk"){
                    var grade  =  "Low";
                    var class1 =  "bav";	
                }
                $('#gooddebttoinco span').addClass(class1);
 			   $('#gooddebttoinco span').text(grade);
            },
            setTimeInBussinessStatus:function(data)
            {
                var that = this;
                that.set("timeInBussinessScore",getAgeStatus(data.age));
                that.set("timeInBussinessRiskType",data.riskType);

                
                if(data.age>=0 && data.age<=6){
                    var class1='bav';
                    var grade='Low';				
                } 
                else if(data.age>6 && data.age<=12){
                    var class1='avg';
                    var grade='Average';

                } 
                else if(data.age>12 && data.age<=36){
                    var class1='goo';
                    var grade='Good';

                }
                else if(data.age>36){
                    var class1='exc';
                    var grade='Excellent';
                }
                $('#timeinbusiness span').addClass(class1);
 			   $('#timeinbusiness span').text(grade);
            },
            setIndustryStatus:function(data)
            {
                var that = this;
                that.set("industryScore",data.industryRiskVal);
                that.set("industryRiskType",data.riskType);

                
                if(data.riskType==="Low Risk"){
                    var class1='exc';
                    var grade='Excellent';
                }
                else if(data.riskType==="Medium Risk"){
                    var class1='goo';
                    var grade='Good';
                }
                else if(data.riskType==="High Risk"){
                    var class1='bav';
                    var grade='Low';
                }
                $('#poorindusrsk span').addClass(class1);
 			   $('#poorindusrsk span').text(grade);
            },
            setCorporateStatus:function(data)
            {
                var that = this;
                that.set("corporateScore",data.corpRiskVal);
                that.set("corporateRiskType",data.riskType);

                
                if(data.riskType==="High Risk"){
                    var class1='bav';
                    var grade='Low';
                }
                else if(data.riskType==="Medium Risk"){
                    var class1='poo';
                    var grade='Average';
                }
                else if(data.riskType==="Low Risk"){
                    var class1='goo';
                    var grade='Good';
                }
                $('#averagecorporisk span').addClass(class1);
 			   $('#averagecorporisk span').text(grade);
            },
            setCashFlowStatus:function(data)
            {
                var that = this;
                that.set("cashFlowScore",data.cashFlowRiskVal);
                that.set("cashFlowRiskType",data.riskType);

                
                if(data.riskType==="High Risk"){
                    var class1='bav';
                    var grade='Low';
                }
                else if(data.riskType==="Medium Risk"){
                    var class1='avg';
                    var grade='Average';
                }
                else if(data.riskType==="Low Risk"){
                    var class1='goo';
                    var grade='Good';
                }
                
                $('#belowavgcashflow span').addClass(class1);
 			   $('#belowavgcashflow span').text(grade);
            },
            setAnuRevStatus:function(data)
            {
                var that = this;
                that.set("anuRevScore",data.annualRevRiskVal);
                that.set("anuRevRiskType",data.riskType);

                
                if(data.riskType==="High Risk"){
                    var class1='bav';
                    var grade='Low';
                }
                else if(data.riskType==="Medium Risk"){
                    var class1='goo';
                    var grade='Good';
                }
                else if(data.riskType==="Low Risk"){
                    var class1='exc';
                    var grade='Excellent';
                }
                
                $('#goodrevenue span').addClass(class1);
 			   $('#goodrevenue span').text(grade);
            },
            
        });
    
        var showAfter=function()
        {
            
            var pcsVal =	app.homesetting.viewModel.BizAnalyzerData.credittype.creditscore;
            var dtiVal =	app.homesetting.viewModel.BizAnalyzerData.dtiRatio.dtiRatioVal;
            var tibVal =	app.homesetting.viewModel.BizAnalyzerData.ageOfBiss.age;
            var cfVal  =	escapeHTML(app.homesetting.viewModel.BizAnalyzerData.cashFlowRisk.cashFlowRiskVal);
            var irVal  =	app.homesetting.viewModel.BizAnalyzerData.industryRisk.riskType;
            var crVal  =	app.homesetting.viewModel.BizAnalyzerData.corpRisk.riskType;
            var arVal  =	escapeHTML(app.homesetting.viewModel.BizAnalyzerData.annualRevRisk.annualRevRiskVal);
             
            showrefreshBiz.setPersonaCreditStatus(app.homesetting.viewModel.BizAnalyzerData.credittype);
            showrefreshBiz.setDebitToIncomeStatus(app.homesetting.viewModel.BizAnalyzerData.dtiRatio);
            showrefreshBiz.setTimeInBussinessStatus(app.homesetting.viewModel.BizAnalyzerData.ageOfBiss);
            
            showrefreshBiz.setIndustryStatus(app.homesetting.viewModel.BizAnalyzerData.industryRisk);
            showrefreshBiz.setCorporateStatus(app.homesetting.viewModel.BizAnalyzerData.corpRisk);
            showrefreshBiz.setCashFlowStatus(app.homesetting.viewModel.BizAnalyzerData.cashFlowRisk);
            
            showrefreshBiz.setAnuRevStatus(app.homesetting.viewModel.BizAnalyzerData.annualRevRisk);
            console.log(app.homesetting.viewModel.BizAnalyzerData);
            showrefreshBiz.setBizScore(app.homesetting.viewModel.BizAnalyzerData.bizscore);
            
            
            jQuery("#personalCreditSliderTxt").val(pcsVal);
        	jQuery("#debitToIncomeSliderTxt").val(dtiVal);
        	jQuery("#timeInBussinessSliderTxt").val(tibVal);
            jQuery("#cashFlowSliderTxt").val(cfVal);
        	jQuery("#industryRiskSliderTxt1").val(irVal);
        	jQuery("#corporateRiskSliderTxt1").val(crVal);
        	jQuery("#anuRevSliderTxt").val(arVal); 
            
            getTotal();
        };
        var show=function()
        {
            jQuery.browser = {};
            (function () {
                jQuery.browser.msie = false;
                jQuery.browser.version = 0;
                if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                    jQuery.browser.msie = true;
                    jQuery.browser.version = RegExp.$1;
                }
            })();
            
            $(".tabs-menu a").click(function(event) {
                event.preventDefault();
                $(this).parent().addClass("actv");
                $(this).parent().siblings().removeClass("actv");
                var tab = $(this).attr("class");
                $(".tab-content").not(tab).css("display", "none");
                $(tab).show();
            });
            
            
            var pcsVal =	app.homesetting.viewModel.BizAnalyzerData.credittype.creditscore;
            var dtiVal =	app.homesetting.viewModel.BizAnalyzerData.dtiRatio.dtiRatioVal;
            var tibVal =	app.homesetting.viewModel.BizAnalyzerData.ageOfBiss.age;
            var cfVal  =	escapeHTML(app.homesetting.viewModel.BizAnalyzerData.cashFlowRisk.cashFlowRiskVal);
            var irVal  =	checkIndustryRiskType(app.homesetting.viewModel.BizAnalyzerData.industryRisk.riskType);
            var crVal  =	checkCorporateRiskType(app.homesetting.viewModel.BizAnalyzerData.corpRisk.riskType);
            var arVal  =	escapeHTML(app.homesetting.viewModel.BizAnalyzerData.annualRevRisk.annualRevRiskVal);
            
            
            $(".dgr_chng_scr").delay(5000).fadeOut();		

            $('.bz_an_mn_pg_alert_cls_btn').click(function(){
                $(".bz_an_mn_pg_alert").slideUp(600, function(){ $(this).remove();});
            }); 

            $(window).load(function(){

               var slideTimer = setInterval(function() {
                	$('.bz_an_mn_pg_inr_lw_tbs_cton').fadeOut();
                }, 4000);
            });

            var tooltipElement = '<div class="ui-slider-tooltip" aria-hidden="true" />';
            var tooltip;
            var url = ("https:" === document.location.protocol ? "https://" : "http://") + "www.biz2beta.com";

            $('#personalCreditSlider').slider({
                range: "min",     
                value: pcsVal,
                min: 500,
                max: 850,
                step: 1,
                animate: false,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },
                change: function ( event, ui ) {
                    
                    var input = $( event.target ).parent().find('input.answer');
                    input.val( ui.value );
                    var tooltipvalue=ui.value;
                    $('#personalCreditSlider .ui-slider-tooltip').text( ui.value );
                    $('#personalCreditSlider .ui-slider-tooltip').attr('aria-hidden', 'false');
                    $( "#personalCreditSliderTxt" ).val(ui.value);
                    getTotal();
                },
                slide: function ( event, ui ) {
                    
                    $( "#personalCreditSliderTxt" ).val(ui.value);
                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');
                }
            });

            $('#debitToIncomeSlider').slider({
                range: "max",
                value: dtiVal,
                min: 0,
                max: 100,
                reversed: true,
                step: 1,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },
                change: function ( event, ui ) {
                    
                    var input = $( event.target ).parent().find('input.answer');
                    input.val( ui.value );
                    var tooltipvalue=ui.value;
                    $('#debitToIncomeSlider .ui-slider-tooltip').text( ui.value );
                    $('#debitToIncomeSlider .ui-slider-tooltip').attr('aria-hidden', 'false');
                    $( "#debitToIncomeSliderTxt" ).val(ui.value);
                    getTotal();
                },
                slide: function ( event, ui ) {
                    
                    $( "#debitToIncomeSliderTxt" ).val(ui.value);
                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');

                }
                });

            //////////////////
            $('#timeInBussinessSlider').slider({
                range: "min",
                value: tibVal,
                min: 0,
                max: 36,
                step: 1,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },
                change: function ( event, ui ) {
                    
                    var input = $( event.target ).parent().find('input.answer');
                    input.val( ui.value );
                    var tooltipvalue=ui.value;
                    $('#timeInBussinessSlider .ui-slider-tooltip').text( ui.value );
                    $('#timeInBussinessSlider .ui-slider-tooltip').attr('aria-hidden', 'false');
                    $( "#timeInBussinessSliderTxt" ).val(ui.value);
                    getTotal();


                },
                slide: function ( event, ui ) {

                    $( "#timeInBussinessSliderTxt" ).val(ui.value);
                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');

                }
            });

            //////////////////
            $('#industryRiskSlider').slider({
                range: "min",
                value: irVal,
                min: 0,
                max: 3,
                step: 1,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },

                slide: function ( event, ui ) {

                    if(ui.value>=0 && ui.value<=1){
                        $( "#industryRiskSliderTxt1" ).val("High Risk");
                    } 
                    if(ui.value>1 && ui.value<=2 ){
                        $( "#industryRiskSliderTxt1" ).val("Medium Risk");
                    }
                    if(ui.value>2 ){
                        $( "#industryRiskSliderTxt1" ).val("Low Risk");
                    }

                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');

                }
            });
            //////////////////
            $('#corporateRiskSlider').slider({
                range: "max",
                value: crVal,
                min: 0,
                max: 3,
                step: 1,
                reversed: true,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },
                slide: function ( event, ui ) {
                    if(ui.value>=0 && ui.value<=1){
                        $( "#corporateRiskSliderTxt1" ).val("Low Risk");
                    } 
                    if(ui.value>1 && ui.value<=2 ){
                        $( "#corporateRiskSliderTxt1" ).val("Medium Risk");
                    }
                    if(ui.value>2 ){
                       $( "#corporateRiskSliderTxt1" ).val("High Risk");
                    }
                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');

                }
                });
            ////////////////////////////////
            $('#cashFlowSlider').slider({
                range: "min",     
                value: cfVal,
                min: 0,
                max: 100,
                step: 1,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },
                change: function ( event, ui ) {
                    
                    var input = $( event.target ).parent().find('input.answer');
                    input.val( ui.value );
                    var tooltipvalue=ui.value;
                    $('#cashFlowSlider .ui-slider-tooltip').text( ui.value );
                    $('#cashFlowSlider .ui-slider-tooltip').attr('aria-hidden', 'false');
                    $( "#cashFlowSliderTxt" ).val(ui.value);
                    getTotal();


                },
                slide: function ( event, ui ) {
                    
                    $( "#cashFlowSliderTxt" ).val(ui.value);
                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');

                }
            });
            ////////////////////////////////
            $('#anurevSlider').slider({
                range: "min",     
                value: arVal,
                min: 0,
                max: 5000001,
                step: 50000,
                create: function ( event ) {
                    
                    $( event.target ).find('.ui-slider-handle').append( tooltipElement );
                    tooltip = $('.ui-slider-tooltip');

                },
                change: function ( event, ui ) {
                    
                    var input = $( event.target ).parent().find('input.answer');
                    input.val( ui.value );

                    var tooltipvalue=ui.value/1000000;

                    $('#anurevSlider .ui-slider-tooltip').text( tooltipvalue );
                    $('#anurevSlider .ui-slider-tooltip').attr('aria-hidden', 'false');
                    if(ui.value>=0 && ui.value<=250000){
                        $( "#anuRevSliderTxt1" ).val("High Risk");
                    } 
                    if(ui.value>250001 && ui.value<=2500000 ){
                        $( "#anuRevSliderTxt1" ).val("Medium Risk");
                    }
                    if(ui.value>2500001 ){
                        $( "#anuRevSliderTxt1" ).val("Low Risk");
                    }
                    $( "#anuRevSliderTxt" ).val(ui.value);
                    getTotal();

                },
                slide: function ( event, ui ) {

                    if(ui.value>=0 && ui.value<=250000){
                        $( "#anuRevSliderTxt1" ).val("High Risk");
                    } 
                    if(ui.value>250001 && ui.value<=2500000 ){
                        $( "#anuRevSliderTxt1" ).val("Medium Risk");
                    }
                    if(ui.value>2500001 ){
                        $( "#anuRevSliderTxt1" ).val("Low Risk");
                    }
                    $( "#anuRevSliderTxt" ).val(ui.value);

                    getTotal();
                    $('.ui-slider-tooltip').attr('aria-hidden', 'true');

                }
            });
            showrefreshBiz.setShowrefreshBizTrue();
            
        };
        var getTotal=function(){
            
            var calcScore = jQuery("#personalCreditSliderTxt").val()
            var calcDebt = Math.round(jQuery("#debitToIncomeSliderTxt").val())
            var calcTimeBusin = jQuery("#timeInBussinessSliderTxt").val()
            var calcIndusRisk = jQuery("#industryRiskSliderTxt1").val()
            var calcCorpRisk = jQuery("#corporateRiskSliderTxt1").val()
            var calcCashFlow = Math.round(jQuery("#cashFlowSliderTxt").val())
            var calanurevFlow = Math.round(jQuery("#anuRevSliderTxt").val())
            
            var dataParam =  {};
            dataParam['apiaction']='slidercalculation';
            dataParam['creditscore']=calcScore;
            dataParam['dtiratio']=calcDebt;
            dataParam['ageofbiss']=calcTimeBusin;
            dataParam['industxt']=calcIndusRisk;
            dataParam['corptxt']=calcCorpRisk;
            dataParam['cashmargin']=calcCashFlow;
            dataParam['anurevenue']=calanurevFlow;

            $.post(localStorage.getItem("urlMobAppApiUser"),dataParam,getSuccessData1,"json");	
        };
	
    	var getSuccessData1=function(data){ 
    		jQuery('#netScoreBizanalyserTxt').text(data.results.totalBizscore);
    	};
        
        
        var refreshViewBiz=function()
        {
             showrefreshBiz.setShowrefreshBizFalse();
            $('#poorindusrsk').parent().addClass("actv");
            $('#poorindusrsk').parent().siblings().removeClass("actv");
            var tab = $('#poorindusrsk').attr("class");
            $(".tab-content").not(tab).css("display", "none");
            $(tab).show();
            setTimeout(function() { showAfter();
                show();
            }, 100);
              
        };
        var  escapeHTML=function(text)
        {
            var textVal =text.replace( /[\*\^\'\!\@\$]/g , '');
            return parseInt(textVal.replace( /,/g , ''));
        };
        var checkIndustryRiskType =function(val)
        {

            if(val ==="High Risk"){
                
               return 0;
            } 
            if(val ==="Medium Risk"){
                
               return 1;
            } 
            if(val ==="Low Risk" ){
                
               return 2;
            }

        };
        var checkCorporateRiskType =function(val)
        {

            if(val ==="High Risk"){
                
               return 2;
            } 
            if(val ==="Medium Risk"){
                
               return 1;
            } 
            if(val ==="Low Risk" ){
                
               return 0;
            }

        };
         
         var getAgeStatus=function(data)
           {
               var year,month,yrMonth;
               
               if(data>=12)
               {
                   month = data%12;
                   yrMonth = data-month;
                   year = yrMonth/12;
               }
               else
               {
                   month=data;
                   year=0;
               }
               
               return  year+" year(s), "+month+" month(s)";
               
           };
       

        return {
            showrefreshBiz:showrefreshBiz,
            showAfter: showAfter,
            show: show,
            getTotal: getTotal,
            getSuccessData1: getSuccessData1,
            refreshViewBiz: refreshViewBiz,
            escapeHTML:escapeHTML,
            checkIndustryRiskType:checkIndustryRiskType,
            checkCorporateRiskType:checkCorporateRiskType,
            getAgeStatus:getAgeStatus,
            
        };

    }());
    
    return bizAnalyzerViewModal;
}());