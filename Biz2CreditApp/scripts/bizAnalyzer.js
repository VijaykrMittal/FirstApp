(function (global) {
    var bizAnalyzerViewModal,
        app = global.app = global.app || {};

    bizAnalyzerViewModal = kendo.data.ObservableObject.extend({
        showrefreshBiz:true,
        showAfter:function()
        {
            var pcsVal =	600;
            var dtiVal =	100;
            var tibVal =	30;
            var cfVal  =	48;
            var irVal  =	1;
            var crVal  =	0;
            var arVal  =	2900000;
            console.log('call');
           jQuery("#personalCreditSliderTxt").val(pcsVal);
        	jQuery("#debitToIncomeSliderTxt").val(dtiVal);
        	jQuery("#timeInBussinessSliderTxt").val(tibVal);
        	jQuery("#industryRiskSliderTxt1").val(irVal);
        	jQuery("#corporateRiskSliderTxt1").val(crVal);
        	jQuery("#cashFlowSliderTxt").val(cfVal);
        	jQuery("#anuRevSliderTxt").val(arVal); 
            app.bizAnalyzer.viewModel.getTotal();
        },
        show:function()
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
            
            

            var pcsVal =	600;
            var dtiVal =	100;
            var tibVal =	30;
            var cfVal  =	48;
            var irVal  =	1;
            var crVal  =	0;
            var arVal  =	2900000;

          /*   var pcsVal =	parseInt(document.getElementById('personalCreditSliderTxt').value);
            var dtiVal =	Math.round(parseInt(document.getElementById('debitToIncomeSliderTxt').value));
            var tibVal =	parseInt(document.getElementById('timeInBussinessSliderTxt').value);
            var cfVal  =	Math.round(document.getElementById('cashFlowSliderTxt').value);
            var irVal  =	parseInt(document.getElementById('industryRiskSliderTxt').value);
            var crVal  =	parseInt(document.getElementById('corporateRiskSliderTxt').value);
            var arVal  =	parseInt(document.getElementById('anuRevSliderTxt').value);*/
            
            $(".dgr_chng_scr").delay(5000).fadeOut();		

            $('.bz_an_mn_pg_alert_cls_btn').click(function(){
                $(".bz_an_mn_pg_alert").slideUp(600, function(){ $(this).remove();});
            }); 

            $(window).load(function(){

                slideTimer = setInterval(function() {
                	$('.bz_an_mn_pg_inr_lw_tbs_cton').fadeOut();
                }, 4000);
            });

            var tooltipElement = '<div class="ui-slider-tooltip" aria-hidden="true" />';
            var tooltip;
            url = ("https:" === document.location.protocol ? "https://" : "http://") + "www.biz2beta.com";

            $('#personalCreditSlider').slider({
               range: "min",     
                value: pcsVal,
            	min: 500,
            	max: 850,
            	step: 1,
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
            	app.bizAnalyzer.viewModel.getTotal();


              },
              slide: function ( event, ui ) {
             		$( "#personalCreditSliderTxt" ).val(ui.value);
            		 app.bizAnalyzer.viewModel.getTotal();
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
            	app.bizAnalyzer.viewModel.getTotal();


              },
              slide: function ( event, ui ) {
             		$( "#debitToIncomeSliderTxt" ).val(ui.value);
            		 app.bizAnalyzer.viewModel.getTotal();
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
            	app.bizAnalyzer.viewModel.getTotal();


              },
              slide: function ( event, ui ) {
            	  
             		$( "#timeInBussinessSliderTxt" ).val(ui.value);
            		 app.bizAnalyzer.viewModel.getTotal();
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
            				 
            		app.bizAnalyzer.viewModel.getTotal();
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
            		app.bizAnalyzer.viewModel.getTotal();
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
            	app.bizAnalyzer.viewModel.getTotal();


              },
              slide: function ( event, ui ) {
             		$( "#cashFlowSliderTxt" ).val(ui.value);
            		app.bizAnalyzer.viewModel.getTotal();
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

             
            	app.bizAnalyzer.viewModel.getTotal();


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

             		app.bizAnalyzer.viewModel.getTotal();
            		  $('.ui-slider-tooltip').attr('aria-hidden', 'true');
            	
              }
            });
            app.bizAnalyzer.viewModel.setShowrefreshBizTrue(); 
        },
        getTotal:function(){
            
        		var url = ("https:" === document.location.protocol ? "https://" : "http://") + "www.biz2beta.com";
        		var calcScore = jQuery("#personalCreditSliderTxt").val()
        		var calcDebt = Math.round(jQuery("#debitToIncomeSliderTxt").val())
        		var calcTimeBusin = jQuery("#timeInBussinessSliderTxt").val()
        		var calcIndusRisk = jQuery("#industryRiskSliderTxt1").val()
        		var calcCorpRisk = jQuery("#corporateRiskSliderTxt1").val()
        		var calcCashFlow = Math.round(jQuery("#cashFlowSliderTxt").val())
        		var calanurevFlow = Math.round(jQuery("#anuRevSliderTxt").val())

        		var newurl=url+"/components/com_bizanalyzertool/sliderCalculation.php";
        		$.post(newurl,{creditScore:calcScore,dtiRatio:calcDebt,ageOfBiss:calcTimeBusin,industxt:calcIndusRisk,corpTxt:calcCorpRisk,cashMargin:calcCashFlow,anuRevenue:calanurevFlow},app.bizAnalyzer.viewModel.getSuccessData1,"json");	
        },
	
    	getSuccessData1:function(data){ 
            console.log(data);
    		jQuery('#netScoreBizanalyserTxt').text(data.total);
    	},
        refres:function(myvalue)
        {
        	var url = ("https:" === document.location.protocol ? "https://" : "http://") + "www.biz2beta.com";
        	var slider  = $('.slider > div').slider({
        	range: "min",     
        	value: myvalue,
        	min: 500,
        	max: 850,
        	step: 1,
        	create: function ( event ) {
        		$( event.target ).find('.ui-slider-handle').append( tooltipElement );
        		tooltip = $('.ui-slider-tooltip');
        	},
            change: function ( event, ui ) {
            	var input = $( event.target ).parent().find('input.answer');
            	input.val( ui.value );
            	var tooltipvalue=ui.value;
            	window.tooltip.text( ui.value );
            	window.tooltip.attr('aria-hidden', 'false');
            	alert(url);
            	$.ajax({
            		url:url+'/components/com_nomatch/action.php?tooltipval='+tooltipvalue+'&div=1',
            		type: "get",
            		success:function(data) { 
             	 	 $('#bz_an_mn_tbs_cont1').html(data); 
            	    }    
                });
                $.ajax({
                  
                   url:url+'/components/com_nomatch/action.php?tooltipval='+tooltipvalue+'&div=2',
                    type: "get",
                    success:function(data) { 
                      $('#bz_an_mn_tbs_cont2').html(data); 
                    }   

                });


              },
            slide: function ( event, ui ) {
                window.tooltip.attr('aria-hidden', 'true');
            	}
            });
        },
        setShowrefreshBizFalse:function()
        {
            var that = this;
            that.set("showrefreshBiz",false);
        },
        setShowrefreshBizTrue:function()
        {
            var that = this;
            that.set("showrefreshBiz",true);
        },
        refreshViewBiz:function()
        {
            console.log('debug');
            app.bizAnalyzer.viewModel.setShowrefreshBizFalse();
            $('#poorindusrsk').parent().addClass("actv");
            $('#poorindusrsk').parent().siblings().removeClass("actv");
            var tab = $('#poorindusrsk').attr("class");
            $(".tab-content").not(tab).css("display", "none");
            $(tab).show();
            app.bizAnalyzer.viewModel.showAfter();
            app.bizAnalyzer.viewModel.show();
            
        }
       

    });
   
    app.bizAnalyzer = {
       viewModel: new bizAnalyzerViewModal()	
    };
})(window);