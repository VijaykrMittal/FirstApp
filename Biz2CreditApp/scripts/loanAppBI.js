(function (global) {
    var loanViewModal,
        app = global.app = global.app || {};

    loanViewModal = kendo.data.ObservableObject.extend({
        currentfid:(localStorage.getItem("fid") !== '') ?  localStorage.getItem("fid") : '',
        currentfidStatus:false,
        legal_business_name:'',
        dba_name:'',
        street_no:'',
        street_name:'',
        apt_suite_unit:'',
        select_state:'',
        select_city:'',
        zip_code:'',
        mobile_number:(localStorage.getItem("userMobile") !== '') ?  localStorage.getItem("userMobile") : '',
        select_b_l_s:'',
        industry:'',
        sub_industry:'',
        select_buss_s_m:'',
        select_buss_s_y:'',
        yettostart:1,
        average_annual_revenue:'',
        buss_operating_expenses:'', 
        acceptcard_yes:'Yes',
        acceptcard_no:'No',
        datefirstProcessed_month:'',
        datefirstProcessed_day:'',
        datefirstProcessed_year:'',
        c_c_card_processor:'',
        merchant_id:'',
        MonthlyVolumeAmountsList1:'',
        MonthlyVolumeTicketsList1:'',
        MonthlyVolumeAmountsList2:'',
        MonthlyVolumeTicketsList2:'',
        MonthlyVolumeAmountsList3:'',
        MonthlyVolumeTicketsList3:'',
        MonthlyVolumeAmountsList4:'',
        MonthlyVolumeTicketsList4:'',
        debttype_yes:'Yes',
        debttype_no:'No',
        selectdebttype:'',
        selDisbursed:'',
        busproInfo_owned:2,
        busproInfo_leased:1,
        outstandingMort_yes:1,
        outstandingMort_no:0,
        mortgage_bank:'',
        outs_bal:'',
        month_mort_amount:'',
        monthly_rent:'',
        landlord_name:'',
        contact_number:'',
        real_state:'',
        inventory:'',
        equip_finance:'',
        account_rece:'',
        currntControl:0,
        totbusinessDebtYesDiv:'',
        deleteIds:'',
        dnb_dun_no:'',
        busi_out_mort_type_yes:1,
        busi_out_mort_type_no:0,
        debttype:'',
        
        afterShow:function()
        {
            if($('.crditaccep').val()==='Yes') {
                
            	app.loansetting.viewModel.creditCardValidate();
            }
           
        },
        show:function(e) {
            
            e.sender.reload=false;
            e.view.reload=false;
            
            $(".km-native-scroller").scrollTop(0);
            $("#add-form").unbind('.myPlugin');
            $(".outDebt").unbind(".myPlugin");
            $(".que_hint").kendoTooltip({
                autoHide: false,
                width: 240,
                showOn: "click",
                callout: false,
                content: function(e) {
                	return e.target.context.nextElementSibling.innerHTML;
                },
            });
            
            /*--------------function for select--------------*/

            $('#count_number').change(function() {
                var sel_value = $(this).val();

                if (sel_value < '5') {
                	$('#dis_count').show();
                } else {
                	$('#dis_count').hide();
                }
            });

            /*--------------function for radio--------------*/
            $('.se_radio').click(function() {
                var sel_value = $(this).val();
                if (sel_value==='1') {
                	$('#credit_show').show();
                } else {
                	$('#credit_show').hide();
                }
            });
            
            // credit card accpted
            
            $('.crditaccep').click(function() {
                var sel_value = $(this).val();
                if (sel_value === 'Yes') {
                	$('#credit_show').show();
                } else {
                	$('#credit_show').hide();
                }
            });
            
            
			$(".busimort").click(function() {
            	var mort_value=$(this).val();	
            	if(mort_value==='1'){
            		$("#outstandingMortagageDiv").show();		
            	} else {
            		$("#outstandingMortagageDiv").hide();	
            	}
            							  
             });
            // outtand dept

            $('.outDebt').on("click.myPlugin", function() {
            	var sel_value=$(this).val();
                if(sel_value==='Yes'){
                    if($('#currntControl').val()==='0' || $('#currntControl').val()==='') {
                    	$("#add-form").trigger('click');
                    }
                    $('#outsta_debt').show();
                }
                else{
                    if($('#currntControl').val()>0) {
                    	navigator.notification.alert('Please delete all the existing debts information');
                    	$('input:radio[name=debttype]:nth(0)').prop('checked',true);
                        $('#outsta_debt').show();
                    } else {
                    	$('#outsta_debt').hide();
                    }
                }    
          
            })

            // outtand dept

            $('.businf').click(function() {
                var sel_value = $(this).val();
                if (sel_value==='2') {
                   // $('#busi_out_mort_type.input[type=radio]').attr("checked",true);
                    $("#outstandingMortagageDiv").hide();
                	$('#busInfobx').show();
                	$('#busInfobx2').hide();
                } else {
                	$('#busInfobx2').show();
                	$('#busInfobx').hide();
                }
            });
            

            // credi card proc
            $('#creditcardproc').change(function() {
                var sel_value = $(this).val();
                if (sel_value==='') {
                	$('.mercPr').hide();
                } else {
                	$('.mercPr').show();
                }
            })

            // credit score yes/no

            $('.crYes').click(function() {
                var sel_value = $(this).val();
                if (sel_value==='1') {
                	$('#crdscrYes').hide();
                	$('#crdscrNo').show();
                } else {
                	$('#crdscrYes').show();
                	$('#crdscrNo').hide();
                }
            });
            
            $("#yettostart").click(function() {
                if($(this).is(':checked')) {
                    $('#dbs_month').val("");
                    $('#dbs_year').val("");

                    $('#revenue').val("");
                    $('#operatingexp').val("");

                    $('#dbs_month').attr("disabled","disabled");
                    $('#dbs_year').attr("disabled","disabled");

                    $('#revenue').attr("disabled","disabled");
                    $('#operatingexp').attr("disabled","disabled");

                } else {
                    $('#dbs_month').removeAttr("disabled");
                    $('#dbs_year').removeAttr("disabled");

                    $('#revenue').removeAttr("disabled","disabled");
                    $('#operatingexp').removeAttr("disabled","disabled");

                }

            });
            $.validator.addMethod("alphanumeric", function(value, element) {
            	return this.optional(element) || /^\w+$/i.test(value);
            });
            $.validator.addMethod("loginRegex", function(value, element) {
            	return this.optional(element) || /^[a-z0-9\-\s]+$/i.test(value);
            });

            $.validator.addMethod("zipcodeUS", function(value, element) {
            	return this.optional(element) || /\d{5}-\d{4}$|^\d{5}$/.test(value);
            });	
            $.validator.addMethod("phoneUS", function(phone_number, element) {
                phone_number = phone_number.replace(/\s+/g, "");
                return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
            });

            $.validator.addMethod("ownerPercent", function(value, element) {

            	var total_per = (parseInt($("#own_percent").val())+parseInt(value));
            	if(total_per > 100) { return false;	} else { return true; }
            });
            $.validator.addMethod("dbscurrent", function(value, element) {
                var d = new Date();
                var n = d.getMonth(); 
                var o = d.getFullYear(); 
                var c= parseInt($("#dbs_year").val());
                n=n+1;
                if(value>n && o===c)  {
                	return false; 
                } else {
                	return true; 
                }
            });
            // outtand dept
            if(typeof viewFModel === 'undefined')
            {
                viewFModel = kendo.observable();
            }
            //viewFModel = kendo.observable();
            var addForm = $("#add-form");
            
            if(typeof index === 'undefined')
            {
                 index = 0;
            }
            addForm.on("click.myPlugin", function() {
            
                app.loansetting.viewModel.addOutDebtVar(++index);
                var form = app.loansetting.viewModel.getForm(index);
                app.loansetting.viewModel.setHiddenField(index);

                var tot = parseInt($('#currntControl').val()) + 1;
                $('#currntControl').val(tot);
                $("#debtwrapper").append(form);
                $("#debttype"+index).rules("add", {
                	required: true,
                	messages: {
                		required: "This value is required"
                	}
                });
                $("#yeardisbursed"+index).rules("add", {
                	required: true,
                	messages: {
                		required: "This value is required"
                	}
                });
                totalOutstanding = 0;
                
                $("#remove-form" + index).on("click", function() {
                    var currentIndex = $(this).data("index");
                    $("#debt" + currentIndex).remove();
                    $("#loan_" + currentIndex).remove();
                    $('#currntControl').val($('#currntControl').val() - 1);
                    app.loansetting.viewModel.setHiddenFieldDeleteIds(currentIndex);
                    if ($('#currntControl').val().trim() === '0' || $('#currntControl').val().trim() === 0) {
                        $(".outDebt").prop("checked", false); 
                        $('#outsta_debt').hide();
                    }
                    app.loansetting.viewModel.deleteOutDebtVar(currentIndex);
                });
            });

            
            
          $("#B2cAppForms").validate({
        		
        	rules: {
        			orgname: {
        				required: true
        			},
        			civic: { 
        				required: true,
        				number : true
        			},
        			baddr: {
        				required: true
        			},
    				state: {
    					required: true
    				},
        			cmbCity: {
        				required: true
        			},
        			zipcode: {
        				required: true,
        				zipcodeUS: true
        				
        			},
        			businessphone: {
        				required: true,
        				phoneUS: true
        			},
        			blegal: {
        				required: true
        				},
        			orgtype: {
        				required: true
        			},
        			orgcategory: {
        				required: true
        			},
        			dbs_year: {
        				required: true
        			},
        			dbs_month: {
        				required: true,
        				dbscurrent: true
        			},
        			revenue: {
        				required: true,
        				number: true
        			},
        			operatingexp: {
        				required: true,
        				number: true
        			},
        			acceptcard: {
        				required: true,
        				},
        			debttype: {
        				required: true
        				
        			},
        			busi_pro_info_type: {
        				required: true
        			},
                
                    busproInfo:{
                    	required:true,
                    }
        			
        		},
        	messages: {
        			orgname: {
        				required: "This value is required"
        			 },
        			civic: { 
        				required: "This value is required",
        				number: "Please enter digits only"
        			},
        			baddr: {
        				required: "This value is required"
        			},
        			state: {
        				required: "This value is required"
        			},
        			cmbCity: {
        				required: "This value is required"
        			},
        			zipcode: {
        				required: "This value is required",
        				zipcodeUS: "Please enter valid zipcode"
        				
        			},
        			businessphone: {
        				required: "This value is required",
        				phoneUS: "US phone number required"
        			},
        			blegal: {
        				required: "This value is required"
        			},
        			orgtype: {
        				required: "This value is required"
        			},
        			orgcategory: {
        				required: "This value is required"
        			},
        			dbs_year: {
        				required: "This value is required"
        			},
        			dbs_month: {
        				required: "This value is required",
        				dbscurrent: "Please select valid value"
        			},
        			revenue: {
        				required: "This value is required",
        				number: "Please enter digits only"
        			},
        			operatingexp: {
        				required: "This value is required",
        				number: "Please enter digits only"
        			},
        			acceptcard: {
        				required: "This value is required",
        			},
        			debttype: {
        				required: "This value is required"
        			},
        			busi_pro_info_type: {
        				required: "This value is required"
        			},
                	busproInfo:{
                    	required:"This value is required",
                    }
        		},
         	submitHandler: function(form) {
        		 	// $("#b2cApp1 #next").prop("disabled", true);
        				 return false;
        	}

        }); 
            
        if(e.view.params.param ==='editMode' && sessionStorage.getItem("LoanAppBIEditMode")==='1')
        {   
            app.loginService.viewModel.showloder();
            var dataS = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem("urlMobAppApiLoan"),
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: { apiaction:"getloanappinfo",cust_id:localStorage.getItem("userID"),fid:localStorage.getItem("fid")}
                	}
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
                        app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in getloanappinfo api.');
                    },
            });
            dataS.fetch(function(){

                EditFormData = this.data();  
                manageData = EditFormData['0']['results'];
                app.loansetting.viewModel.setBIeditForm(manageData);
                sessionStorage.setItem("LoanAppBIEditMode",'1');
                sessionStorage.setItem("LoanAppCIEditMode",'1');
                sessionStorage.setItem("LoanAppPIEditMode",'1');
                sessionStorage.setItem("LoanAppFPEditMode",'1');  
                
            });
        }

        },
        setBIeditForm:function(data)
        {
            var that = this;
            
            that.set("legal_business_name",data['findetails']['orgname']);
            that.set("dba_name",data['findetails']['dbaname']);
            that.set("street_no",(data['findetails']['civic']!== '0') ? data['findetails']['civic'] : "");
            
            that.set("street_name",data['findetails']['baddr']);
            that.set("apt_suite_unit",data['findetails']['street1']);
            that.set("select_state",(data['findetails']['state']!== '0') ? data['findetails']['state'] : "");
            createCityCmbFirstEdit(data['findetails']['state'] ,data['findetails']['cityid']);
            that.set("select_city",data['findetails']['cityid']);
            
            that.set("zip_code",data['findetails']['zipcode']);
            that.set("mobile_number",data['findetails']['businessphone']);
            that.set("select_b_l_s",data['findetails']['blegal']);
            that.set("industry",(data['findetails']['loanParentIndustry']!== '0') ? data['findetails']['loanParentIndustry'] : "");
            displayorgCategoryEdit(data['findetails']['loanParentIndustry'],data['findetails']['loanIndustry']);
            that.set("sub_industry",data['findetails']['loanIndustry']);
            
            if(data['findetails']['dbs_month'] === null || data['findetails']['dbs_year'] === null || data['findetails']['revenue'] === null || data['findetails']['operatingexp'] === null)
            {
                $("#yettostart").prop("checked",true);
                that.set("select_buss_s_m","");
                that.set("select_buss_s_y","");
                that.set("average_annual_revenue","");
                that.set("buss_operating_expenses","");
                
                $('#dbs_month').prop("disabled","disabled");
                $('#dbs_year').prop("disabled","disabled");
                $('#revenue').prop("disabled","disabled");
                $('#operatingexp').prop("disabled","disabled");
            }
            else
            {
                $("#yettostart").prop("checked",false);
                that.set("select_buss_s_m",(data['findetails']['dbs_month']!== '0') ? data['findetails']['dbs_month'] : "");
                that.set("select_buss_s_y",(data['findetails']['dbs_year']!== '0') ? data['findetails']['dbs_year'] : "");
                var annual_revenue = app.loansetting.viewModel.setCommaNumber(data['findetails']['revenue']);
                var operating_expenses = app.loansetting.viewModel.setCommaNumber(data['findetails']['operatingexp']);
                that.set("average_annual_revenue",(annual_revenue!== '0') ? annual_revenue : "");
                that.set("buss_operating_expenses",(operating_expenses!== '0') ? operating_expenses : "");
                
                $('#dbs_month').removeAttr("disabled");
                $('#dbs_year').removeAttr("disabled");
                $('#revenue').removeAttr("disabled","disabled");
                $('#operatingexp').removeAttr("disabled","disabled");
            }
            var n = data['findetails']['collateral'].split(',');
            if($.inArray( "Credit Card Receivables", n ) !== -1)
            {
               acceptcard = 'Yes'; 
            }
            else
            {
               acceptcard = 'No'; 
            }
            
            if($('.crditaccep:radio[value="'+acceptcard+'"]').val() === 'Yes')
            {
                $('#credit_show').show();
                $('.mercPr').show();
                var d = data['findetails']['cc_firstprocess_date'].split('-');
                $('.crditaccep:radio[value="'+acceptcard+'"]').prop("checked",true);
                that.set("datefirstProcessed_month",(Number(d[1])!== 0) ? Number(d[1]) : "");
                that.set("datefirstProcessed_day",(d[2]!== '00') ? d[2] : "");
                that.set("datefirstProcessed_year",(d[0]!== '0000') ? d[0] : "");
                that.set("c_c_card_processor",data['findetails']['creditcardproc']);
                that.set("merchant_id",(data['findetails']['merchantid']!== '0') ? data['findetails']['merchantid'] : "");
                
                var MAmountsList1=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_lastmonth_sale']);
                var MTicketsList1=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_lastmonth_transaction']);
                
                var MAmountsList2=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_1month_ago_sale']);
                var MTicketsList2=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_1month_ago_transaction']);
                
                var MAmountsList3=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_2month_ago_sale']);
                var MTicketsList3=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_2month_ago_transaction']);
                
                var MAmountsList4=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_3month_ago_sale']);
                var MTicketsList4=app.loansetting.viewModel.setCommaNumber(data['findetails']['cc_3month_ago_transaction']);
                that.set("MonthlyVolumeAmountsList1",(MAmountsList1!== '0') ? MAmountsList1 : "");
                that.set("MonthlyVolumeTicketsList1",(MTicketsList1!== '0') ? MTicketsList1 : "");
                that.set("MonthlyVolumeAmountsList2",(MAmountsList2!== '0') ? MAmountsList2 : "");
                that.set("MonthlyVolumeTicketsList2",(MTicketsList2!== '0') ? MTicketsList2 : "");
                that.set("MonthlyVolumeAmountsList3",(MAmountsList3!== '0') ? MAmountsList3 : "");
                that.set("MonthlyVolumeTicketsList3",(MTicketsList3!== '0') ? MTicketsList3 : "");
                that.set("MonthlyVolumeAmountsList4",(MAmountsList4!== '0') ? MAmountsList4 : "");
                that.set("MonthlyVolumeTicketsList4",(MTicketsList4!== '0') ? MTicketsList4 : "");
            }
            else
            {
                $('#credit_show').hide();
                $('.crditaccep:radio[value="'+acceptcard+'"]').prop("checked",true);
                that.set("datefirstProcessed_month","");
                that.set("datefirstProcessed_day","");
                that.set("datefirstProcessed_year","");
                that.set("c_c_card_processor","");
                that.set("merchant_id","");
                that.set("MonthlyVolumeAmountsList1","");
                that.set("MonthlyVolumeTicketsList1","");
                that.set("MonthlyVolumeAmountsList2","");
                that.set("MonthlyVolumeTicketsList2","");
                that.set("MonthlyVolumeAmountsList3","");
                that.set("MonthlyVolumeTicketsList3","");
                that.set("MonthlyVolumeAmountsList4","");
                that.set("MonthlyVolumeTicketsList4","");
            }
            
            if($('.businf:radio[value="'+data['findetails']['busi_pro_info_type']+'"]').val() === 2 || $('.businf:radio[value="'+data['findetails']['busi_pro_info_type']+'"]').val() === '2')
            {
                $("#outstandingMortagageDiv").hide();
                $('#busInfobx').show();
                $('#busInfobx2').hide();
                $('.businf:radio[value="'+data['findetails']['busi_pro_info_type']+'"]').prop("checked",true);
               
            }
            else
            {
                $('#busInfobx2').show();
                $('#busInfobx').hide();
                $('.businf:radio[value="'+data['findetails']['busi_pro_info_type']+'"]').prop("checked",true);
                var b_m_rent= app.loansetting.viewModel.setCommaNumber(data['findetails']['busi_month_rent']);
                that.set("monthly_rent",(b_m_rent!== '0') ? b_m_rent : "");
                that.set("landlord_name",data['findetails']['busi_landlord']);
                that.set("contact_number",data['findetails']['busi_cont_number']);
            }
           
            
            if($('.busimort:radio[value="'+data['findetails']['busi_out_mort_type']+'"]').val() === 1 || $('.busimort:radio[value="'+data['findetails']['busi_out_mort_type']+'"]').val() === '1')
            {
                $('.busimort:radio[value="'+data['findetails']['busi_out_mort_type']+'"]').prop("checked",true);
                $("#outstandingMortagageDiv").show();
                that.set("mortgage_bank",data['findetails']['busi_mort_bank']);
                var b_o_bal=app.loansetting.viewModel.setCommaNumber(data['findetails']['busi_out_balance']);
                var m_m_amount=app.loansetting.viewModel.setCommaNumber(data['findetails']['busi_month_mort_amount']);
                
                that.set("outs_bal",(b_o_bal!== '0') ? b_o_bal : "");
                that.set("month_mort_amount",(m_m_amount!== '0') ? m_m_amount : "");
            }
            else
            {
                $('.busimort:radio[value="'+data['findetails']['busi_out_mort_type']+'"]').prop("checked",true);
                $("#outstandingMortagageDiv").hide();
            }
            
            if($('.outDebt:radio[value="'+data['findetails']['debttype']+'"]').val() === 'Yes')
            {   
                var index;
                $('.outDebt:radio[value="'+data['findetails']['debttype']+'"]').prop("checked",true);
                var totalDiv = data['findetails']['finloan_details'].length;
                for(index=1;index<=totalDiv;index++)
                { 
                    $('#outsta_debt').show();
                    $("#add-form").trigger('click');
                    var debtTypeval = data['findetails']['finloan_details'][index-1]['debttype'];
                    var yeardisbursedval =  data['findetails']['finloan_details'][index-1]['yeardisbursed'];
                    var debtTypeText = $("#debttype"+index+" option[value='"+debtTypeval+"']").val();
                    
                    $("#debttype"+index+" option[value='"+debtTypeval+"']").prop("selected",true);
                    app.loansetting.viewModel.createInput(index,index);
                    
                    $("#yeardisbursed"+index+" option[value='"+yeardisbursedval+"']").prop("selected",true);  
                    
                    
                    var txtOutCreditVal = app.loansetting.viewModel.setCommaNumber(Number(data['findetails']['finloan_details'][index-1]['outstanding']).toString());
                    var txtInterestCreditVal = Number(data['findetails']['finloan_details'][index-1]['interestrate']);
                    var txtPerYearCreditVal =data['findetails']['finloan_details'][index-1]['interesttime'];
                    var tpcompanyVal = data['findetails']['finloan_details'][index-1]['tpcompany'];
                    var ocadvanceVal = app.loansetting.viewModel.setCommaNumber(Number(data['findetails']['finloan_details'][index-1]['funded_amt']).toString());
                    var funded_termVal = Number(data['findetails']['finloan_details'][index-1]['term']);
                    var collateraltypeVal = data['findetails']['finloan_details'][index-1]['collateral'];  
                    var txtOutAmountTermVal =app.loansetting.viewModel.setCommaNumber(Number(data['findetails']['finloan_details'][index-1]['outstandingamount']).toString());
                    var txtInterestTermVal = Number(data['findetails']['finloan_details'][index-1]['termintrate']);
                    var txtPaymentModeTermVal = data['findetails']['finloan_details'][index-1]['termpaymentmode'];
                    //var txtTermVal =data['findetails']['finloan_details'][index-1]['term'];
                    var txtFrequncyTermVal = data['findetails']['finloan_details'][index-1]['frequency'];
                    var txtAmountTermVal = app.loansetting.viewModel.setCommaNumber(Number(data['findetails']['finloan_details'][index-1]['principleamount']).toString());
                    var txtYearTermVal = data['findetails']['finloan_details'][index-1]['terminttime'];
                    
                    viewFModel.set("yeardisbursed"+index,yeardisbursedval);
                    if(debtTypeText === "Business Credit Card")
                    {   
                        viewFModel.set("txtOutCredit"+index,(txtOutCreditVal!== '0') ? txtOutCreditVal : "");
                        viewFModel.set("txtInterestCredit"+index,(txtInterestCreditVal!== 0) ? txtInterestCreditVal : "");
                        viewFModel.set("txtPerYearCredit"+index,txtPerYearCreditVal);
                    }
                    
                    if(debtTypeText === "Cash Advance")
                    {
                        viewFModel.set("tpcompany"+index,tpcompanyVal);
                        viewFModel.set("ocadvance"+index,(ocadvanceVal!== '0') ? ocadvanceVal : "");
                        viewFModel.set("funded_term"+index,(funded_termVal!== 0) ? funded_termVal : "");
                    }
                    
                    if(debtTypeText === "Line of credit")
                    {
                        viewFModel.set("collateraltype"+index,collateraltypeVal);
                        viewFModel.set("txtOutCredit"+index,(txtOutCreditVal!== '0') ? txtOutCreditVal : "");
                        viewFModel.set("txtInterestCredit"+index,(txtInterestCreditVal!== 0) ? txtInterestCreditVal : "");
                        viewFModel.set("txtPerYearCredit"+index,txtPerYearCreditVal);
                    }
                    
                    if(debtTypeText === "Term loan")
                    {
                        viewFModel.set("collateraltype"+index,collateraltypeVal);
                        viewFModel.set("txtOutAmountTerm"+index,(txtOutAmountTermVal!== '0') ? txtOutAmountTermVal : "");
                        viewFModel.set("txtInterestTerm"+index,(txtInterestTermVal!== 0) ? txtInterestTermVal : "");
                        viewFModel.set("txtPaymentModeTerm"+index,txtPaymentModeTermVal);
                        viewFModel.set("txtTerm"+index,(funded_termVal!== 0) ? funded_termVal : "");
                        viewFModel.set("txtFrequncyTerm"+index,txtFrequncyTermVal);
                        viewFModel.set("txtAmountTerm"+index,(txtAmountTermVal!== '0') ? txtAmountTermVal : "");
                        viewFModel.set("txtYearTerm"+index,txtYearTermVal);
                    }
                }
                
            }
            else
            {
                $('.outDebt:radio[value="'+data['findetails']['debttype']+'"]').prop("checked",true);
            } 
            var colArr = data['findetails']['collateral'].split(',');
            $.each(colArr, function( index, value ) {

                if($.isNumeric(index))
                {
                    if(value ==='Real Estate')
                    that.set("real_state",true);
                    if(value==='Inventory')
                    that.set("inventory",true);
                    if(value==='Equipment')
                    that.set("equip_finance",true);
                    if(value==='Accounts Receivables') 
                    that.set("account_rece",true);
                }
                    

            });
            app.loansetting.viewModel.SetCurrentfidStatus();
 
        },
        getForm:function(index, action) {
            
            return $('<div class="rw_lin addons clearfix" id="debt' + index + '"><p class="imp40">' + app.loansetting.viewModel.createDebtType(index) + '</p><p class="imp40">' + app.loansetting.viewModel.createYear(index) + '</p><p><a class="rem_col" href="javascript:void(0);" id="remove-form' + index + '" data-index="' + index + '">Remove</a></p></div><div id="loan_' + index + '"></div>');
        },
        createDebtType:function(NumOfDiv) {
            var str = '';
            str = "<select name='debttype" + NumOfDiv + "' class='IN5 debtclass' title='Select Debt Type' id='debttype" + NumOfDiv + "' onChange='javascript:app.loansetting.viewModel.createInput(" + NumOfDiv + ", " + NumOfDiv + ")' data-bind='value: debttype"+NumOfDiv+"' title='Select Debt Type'><option value=''>Select Debt Type</option><option value='Business Credit Card'>Business Credit Card</option><option value='Cash Advance'>Cash Advance</option><option value='Line of credit'>Line of credit</option><option value='Term loan'>Term loan</option></select>";
            return str;
        },
        createYear:function(yearid) {
            var str;
            str = "<select name='yeardisbursed" + yearid + "' id='yeardisbursed" + yearid + "' data-bind='value: yeardisbursed"+yearid+"' title='Select Disbursed Year' class='IN5'>";
            str +='<option value="">Select Disbursed Year</option>';
            for (i=1970; i <= 2020;i++) {
            	str +='<option value=' + i + '>' + i + '</option>';
            }
            str +='</select>';
            return str;
        },
        createInput:function(value,NumOfDiv) {
            
            value = $("#debttype"+NumOfDiv).val().trim();
            viewFModel['debttype'+NumOfDiv] = value;
            var str='';
            if(value==='Term loan') {
                    str +='<div class="rw_lin  addons_det clearfix lineofcred">\
                    <p class="imp40 clearfix">\
                    '+app.loansetting.viewModel.createCollateral(NumOfDiv)+'\
                    </p>\
                    <div class="clear"></div>\
                    <p class="imp40">\
                    <input type="text" class="IN5 mb15 number" placeholder="Original Loan Amount ($)" name="txtAmountTerm'+NumOfDiv+'" id="txtAmountTerm'+NumOfDiv+'" data-bind="value: txtAmountTerm'+NumOfDiv+'" original-title="Original Loan Amount $">\
                    </p>\
                    <p class="imp40">\
                    <input type="text" class="IN5 number" placeholder="Outstanding Loan Amount ($)" name="txtOutAmountTerm'+NumOfDiv+'" id="txtOutAmountTerm'+NumOfDiv+'" data-bind="value: txtOutAmountTerm'+NumOfDiv+'" original-title="Outstanding Loan Amount $">\
                    </p>\
                    <div class="clear"></div>\
                    <p class="imp40">\
                    <input type="text" name="txtInterestTerm'+NumOfDiv+'" id="txtInterestTerm'+NumOfDiv+'" data-bind="value: txtInterestTerm'+NumOfDiv+'" maxlength="5" placeholder="Interest Rate (%)" class="IN5 mb15" original-title="Interest Rate (%)">\
                    </p>\
                    <p class="imp40">\
                    <select name="txtYearTerm'+NumOfDiv+'" id="txtYearTerm'+NumOfDiv+'" data-bind="value: txtYearTerm'+NumOfDiv+'" class="IN5" title="Interest Rate Year(s)">\
                    <option value="1" selected="">Year(s)</option>\
                    <option value="2">Half-year</option>\
                    <option value="4">Quarter</option>\
                    <option value="12">Month</option>\
                    <option value="52">Week</option>\
                    <option value="365">Day</option>\
                    </select>\
                    </p>\
                    <div class="clear"></div>\
                    <p class="imp40">\
                    <select class="IN4" name="txtPaymentModeTerm'+NumOfDiv+'" id="txtPaymentModeTerm'+NumOfDiv+'" data-bind="value: txtPaymentModeTerm'+NumOfDiv+'" original-title="Select Payment Schedule">\
                    <option value="">Payment Schedule</option>\
                    <option value="1">Annually</option>\
                    <option value="2">semi-annually</option>\
                    <option value="4">quarterly</option>\
                    <option value="12">monthly</option>\
                    <option value="52">weekly</option>\
                    <option value="365">daily</option>\
                    </select>\
                    </p>\
                    <p class="imp40">\
                    <input type="text" class="IN4" name="txtTerm'+NumOfDiv+'" id="txtTerm'+NumOfDiv+'" data-bind="value: txtTerm'+NumOfDiv+'" placeholder="Term" original-title="Term">\
                    </p>\
                    <p class="imp40">\
                    <select name="txtFrequncyTerm'+NumOfDiv+'" id="txtFrequncyTerm'+NumOfDiv+'" data-bind="value: txtFrequncyTerm'+NumOfDiv+'" class="IN4" original-title="Term Year(s)">\
                    <option value="1" selected="">Year(s)</option>\
                    <option value="2">Half-year(s)</option>\
                    <option value="4">Quarter(s)</option>\
                    <option value="12">Month(s)</option>\
                    <option value="52">Week(s)</option>\
                    <option value="365">Day(s)</option>\
                    </select>\
                    </p>\
                    </div>';
 
                
            } else if(value==='Cash Advance') {
                    str +='<div class="rw_lin  addons_det clearfix cash_advns">\
                    <p class="imp40">\
                    <input type="text" class="IN5" placeholder="Funding Company" name="tpcompany'+NumOfDiv+'" id="tpcompany'+NumOfDiv+'" data-bind="value:tpcompany'+NumOfDiv+'" original-title="Funding Company">\
                    </p>\
                    <p class="imp40">\
                    <input type="text" class="IN5 number" placeholder="Funded Amount ($)" name="ocadvance'+NumOfDiv+'" id="ocadvance'+NumOfDiv+'" data-bind="value:ocadvance'+NumOfDiv+'" original-title="Funded Amount ($)">\
                    </p>\
                    ';
                    str +='<p class="imp40 select_caterm"><select class="IN5 debtclass valid" title="Select Term (Months)" name="funded_term'+NumOfDiv+'" id="funded_term'+NumOfDiv+'" data-bind="value:funded_term'+NumOfDiv+'">';
                    str +='<option value="">Select Term (Months)</option>';
                    for(var term=1; term< 301; term++){
                        var noyears = '';
                        if(term%12 === 0 ) {
                            if(term === 12){
                            	noyears = ': 1Year'; 
                            } else {
                            	var cyears = term/12;
                            	noyears = ': '+cyears+'Years';                     
                            }                  
                    	}
                        if(noyears !==''){
                            //noyears = noyears.bold();
                            	var bstyle = 'style="font-weight:bold;" ';
                            	str +='<option value="'+term+'" '+bstyle+'>'+term+' '+noyears+'</option>';
                        } else {
                            str +='<option value="'+term+'">'+term+'</option>';
                        }
                    }
                    str +='</select></p>';
                    str +='</div>';
			} else if(value==='Business Credit Card') {
                    str +='<div class="rw_lin addons_det clearfix debt_crecrd">\
                    <p class="imp40">\
                    <input type="text" placeholder="Outstanding Loan Amount ($)" name="txtOutCredit'+NumOfDiv+'" id="txtOutCredit'+NumOfDiv+'" data-bind="value:txtOutCredit'+NumOfDiv+'" class="IN4 number" original-title="Outstanding Loan Amount ($)">\
                    </p>\
                    <p class="imp40">\
                    <input type="text" placeholder="Interest Rate (%)" name="txtInterestCredit'+NumOfDiv+'" id="txtInterestCredit'+NumOfDiv+'" data-bind="value:txtInterestCredit'+NumOfDiv+'" maxlength="5" class="IN4" original-title="Interest Rate (%)">\
                    </p>\
                    <p class="imp40">\
                    <select name="txtPerYearCredit'+NumOfDiv+'" id="txtPerYearCredit'+NumOfDiv+'" data-bind="value:txtPerYearCredit'+NumOfDiv+'" class="IN4" original-title="Interest Rate Year(s)">\
                    <option value="1" selected="">Year(s)</option>\
                    <option value="2">Half-year</option>\
                    <option value="4">Quarter</option>\
                    <option value="12">Month</option>\
                    <option value="52">Week</option>\
                    <option value="365">Day</option>\
                    </select>\
                    </p>\
                    </div>';
		
 		} else if(value==='Line of credit') {
                    str +='<div class="rw_lin  addons_det clearfix lineofcred">\
                    <p class="imp40 clearfix">\
                    '+app.loansetting.viewModel.createCollateral(NumOfDiv)+'\
                    </p>\
                    <div class="clear"></div>\
                    <p class="imp40">\
                    <input type="text" placeholder="Outstanding Loan Amount ($)" name="txtOutCredit'+NumOfDiv+'" id="txtOutCredit'+NumOfDiv+'" data-bind="value:txtOutCredit'+NumOfDiv+'" class="IN4 number" original-title="Outstanding Loan Amount ($)">\
                    </p>\
                    <p class="imp40">\
                    <input type="text" placeholder="Interest Rate (%)" name="txtInterestCredit'+NumOfDiv+'" id="txtInterestCredit'+NumOfDiv+'" data-bind="value:txtInterestCredit'+NumOfDiv+'" class="IN4" maxlength="5" original-title="Interest Rate (%)">\
                    </p>\
                    <p class="imp40">\
                    <select name="txtPerYearCredit'+NumOfDiv+'" id="txtPerYearCredit'+NumOfDiv+'" data-bind="value:txtPerYearCredit'+NumOfDiv+'" class="IN4" original-title="Interest Rate Year(s)">\
                    <option value="1" selected="">Year(s)</option>\
                    <option value="2">Half-year</option>\
                    <option value="4">Quarter</option>\
                    <option value="12">Month</option>\
                    <option value="52">Week</option>\
                    <option value="365">Day</option>\
                    </select>\
                    </p>\
                    </div>';
  		} else if(value==='') {
                    document.getElementById('loan_'+NumOfDiv).style.display='none';
                    str='';
          }
            document.getElementById('loan_'+NumOfDiv).innerHTML =str;
            app.loansetting.viewModel.addBindOutDebtVar(NumOfDiv);

            // Added by  Later
            if(value!=='') {
            	document.getElementById('loan_'+NumOfDiv).style.display='block';
            }
        
            if(value==="Term loan") {

                $("#collateraltype"+NumOfDiv).rules("add", {
                	required: true,
                	messages: {
                		required: "This value is required"
                		
                	}
                });
                $("#txtAmountTerm"+NumOfDiv).rules("add", {
                	required: true,
                	number: true,
                	messages: {
                		required: "This value is required",
                		number: "Please enter digit only"
                		
                	}
                });
                $("#txtOutAmountTerm"+NumOfDiv).rules("add", {
                	required: true,
                	number: true,
                	messages: {
                		required: "This value is required",
                		number: "Please enter digit only"
                		
                	}
                });

                $("#txtTerm"+NumOfDiv).rules("add", {
                	required: true,
                	number:true,
                	messages: {
                		required: "This value is required",
                		number: "Please enter digit only"
                		
                	}
                });
                $("#txtInterestTerm"+NumOfDiv).rules("add", {
                	required: true,
                	number:true,
                	messages: {
                		required: "This value is required",
                		number: "Please enter digit only"
                		
                	}
                });

                $("#txtPaymentModeTerm"+NumOfDiv).rules("add", {
                	required: true,
                	messages: {
                		required: "This value is required"
                		
                	}
                });
 		 
			}
		
			if(value==="Cash Advance") {
                $("#tpcompany"+NumOfDiv).rules("add", {
                    required: true,
                    messages: {
                    required: "This value is required"
                    }
                });
                $("#ocadvance"+NumOfDiv).rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    required: "This value is required",
                    number: "Please enter digit only"
                    }
                }); 

                $("#funded_term"+NumOfDiv).rules("add", {
                    required: true,
                    messages: {
                    required: "This value is required"
                    }
                });

       	 }
			if(value==="Business Credit Card" || value==="Line of credit") {
				if(value!=='Business Credit Card') {
            		$("#collateraltype"+NumOfDiv).rules("add", {
            			required: true,
            			messages: {
            				required: "This value is required"
            			}
            		});
				}
        		$("#txtOutCredit"+NumOfDiv).rules("add", {
        			required: true,
        			number: true,
        			messages: {
        				required: "This value is required",
        				number: "Please enter digit only"
        				
        			}
        		});
        		$("#txtInterestCredit"+NumOfDiv).rules("add", {
        			required: true,
        			number: true,
        			messages: {
        				required: "This value is required",
        				number: "Please enter digit only"
        			}
        		});
			} 
            
            },
            createCollateral:function (NumOfDiv) {
                str='';
                str='<select name="collateraltype'+NumOfDiv+'" id="collateraltype'+NumOfDiv+'" data-bind="value: collateraltype'+NumOfDiv+'" class="IN5 mb15" original-title="Select Collateral"><option value="">Select Collateral</option><option value="Real Estate">Real Estate</option><option value="Equipment">Equipment</option><option value="Account Receivables">Account Receivables</option><option value="Inventory">Inventory</option><option value="Credit Cards Receivables">Credit Cards Receivables</option><option value="Business">Business</option><option value="None">None</option></select>';
                return str;
            },
        	creditCardValidate:function()
        	{
                $("#datefirstProcessed_month").rules("add", {
                    required: true,
                    messages: {
                    required: "This value is required"
                }
                });
                $("#datefirstProcessed_day").rules("add", {
                    required: true,
                    messages: {
                    required: "This value is required"
                }
                });
                $("#datefirstProcessed_year").rules("add", {
                    required: true,
                    messages: {
                    required: "This value is required"
                }
                });

                $("#creditcardproc").rules("add", {
                    required: true,
                    messages: {
                    required: "This value is required"
                }
                });
                $("#merchantid").rules("add", {
                    required: true,
                    number: true,
                    minlength:9,
                    messages: {
                        required: "This value is required",
                        number: "This value is required",
                        minlength: "Please enter only 9 digit merchant id"
                    }
                });

                $("#MonthlyVolumeAmountsList1").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    required: "This value is required",
                    number: "Please enter digits only"
                }
                });
                $("#MonthlyVolumeTicketsList1").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                	}
                });

                $("#MonthlyVolumeAmountsList2").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                    }
                });
                $("#MonthlyVolumeTicketsList2").rules("add", {
               	 required: true,
                	number: true,
                    messages: {
                   	 required: "This value is required",
                    	number: "Please enter digits only"
                    }
                });
                $("#MonthlyVolumeAmountsList3").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                    }
                });
                $("#MonthlyVolumeTicketsList3").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                        required: "This value is required",
                        number: "Please enter digits only"
                    }
                });
                $("#MonthlyVolumeAmountsList4").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                    }
                });
                $("#MonthlyVolumeTicketsList4").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                    }
                });
                $("#busi_mort_bank").rules("add", {
                    required: true,
                    messages: {
                    	required: "This value is required"
              	  }
				});
                
                $("#busi_out_balance").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                     }
                });
                $("#busi_month_mort_amount").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                        required: "This value is required",
                        number: "Please enter digits only"
                    }
                });
                $("#busi_month_rent").rules("add", {
                    required: true,
                    number: true,
                    messages: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                    }
				});
                $("#busi_cont_number").rules("add", {
                	phoneUS: true,
                	messages: {
                		phoneUS: "Please enter us phone number"
                	}
                });
                $("#busi_out_mort_type").rules("add", {
                	required: true,
                	messages: {
                		required: "This value is required"
                	}
                });
                
        	},
            loanAppCIpage:function() {
            	apps.navigate("views/loanAppCI.html");
            },
            loanAppPIpage:function() {
            	apps.navigate("views/loanAppPI.html");
            },
            loanAppFPpage:function() {
            	apps.navigate("views/loanAppFP.html");
            },
        setHiddenField:function(index)
        {
                var that =this;
                that.set("totbusinessDebtYesDiv",index);
        },
        setHiddenFieldDeleteIds:function(ids)
        {
            
            var that =this;
            var alreadysavedel = that.get("deleteIds");
            if(alreadysavedel === '')
            {
                 nowsavedel = ids;
            }
            else
            {
             	nowsavedel = alreadysavedel+','+ids;
            }
            that.set("deleteIds",nowsavedel);
        },
        	
		loanAppBISubmit:function(e){
            
            // apps.navigate('views/loanAppCI.html');
            
            var data = e.button.data();
            alert(data.name);
            
            dataParam =  {};
            
            /*if(e.sender.element.context.dataset.name === "Next")
            {
                var status = $("#B2cAppForms").valid();
                if(status === false)
                return status;  
                dataParam['business_act'] = 'Next';
                alert("Next click");
            }
            else
            {
                dataParam['business_act'] ='Save_Exit';
                alert("save click");
            }*/
            
            
            /********VKM**********/
            
            if(data.name === "Next")
            {
                var status = $("#B2cAppForms").valid();
                if(status === false)
                return status;  
                dataParam['business_act'] = 'Next';
               // apps.navigate('views/loanAppCI.html');
            }
            else
            {
                dataParam['business_act'] ='Save_Exit';
            }
            
            //apps.navigate('views/loanAppCI.html'); 
            var that = this;
            totbusinessDebtYesDiv = that.get("totbusinessDebtYesDiv");
			deleteIds = that.get("deleteIds");
			dataParam['apiaction']='loanappstep2';
			dataParam['cust_id']=localStorage.getItem("userID");
            dataParam['fid']=(localStorage.getItem("fid") !== '') ?  localStorage.getItem("fid") : '';
            dataParam['type']='';
            dataParam['frmname']='b2cApp2';
            legal_business_name 				 	= that.get("legal_business_name").trim();
            dataParam['orgname']				 	= legal_business_name;

            dbaName					 		 	= that.get("dba_name").trim(),
            dataParam['dbaname']				 	= dbaName;

            streetNo							 	= that.get("street_no").trim(),
            dataParam['civic']		    		   = streetNo;

            streetName				   		    = that.get("street_name").trim(),
            dataParam['baddr']  	      		   = streetName;

            aptSuiteUnit			    		 	= that.get("apt_suite_unit").trim(),
            dataParam['street1']	    		     = aptSuiteUnit;

            selectState				 		     = that.get("select_state").trim(),
            dataParam['state']  	      		   = selectState;

            selectCity				    		   = that.get("select_city").trim(),
            dataParam['cmbCity']	   			  = selectCity;

            zipCode	 				  		   = that.get("zip_code").trim(),
            dataParam['zipcode']				 	= zipCode;

            mobileNumber						 	= that.get("mobile_number").trim(),
            dataParam['businessphone']			   = mobileNumber;

            select_BLS					 		  = that.get("select_b_l_s").trim(),
            dataParam['blegal']					  = select_BLS;

            industry								 = that.get("industry").trim(),
            dataParam['orgtype']		  		   = industry;

            subIndustry							  = that.get("sub_industry").trim(),
            dataParam['orgcategory']				 = subIndustry;   


            dnb_dun_no			  			    = that.get("dnb_dun_no").trim(),
            dataParam['dnb_dun_no']	  		   = dnb_dun_no;
                						
            collateral=[];
            
            realState					   = that.get("real_state");
            if(realState === true)
            collateral.push('Real Estate');
            
            inventor			     	   = that.get("inventory");
            if(inventor === true)
            collateral.push('Inventory');
            
            equipFinance				    = that.get("equip_finance");
            if(equipFinance === true)
            collateral.push('Equipment');

            account_RECE		            = that.get("account_rece");
            if(account_RECE === true)
            collateral.push('Accounts Receivables');  
            
			dataParam['collateral'] =collateral;
            //for Checkbox yettostart
           
            if($("#yettostart").is(':checked'))
            {
                yettostart							  = that.get("yettostart"),
                dataParam['yettostart']				 = yettostart;   
                dataParam['dbs_month']		= "";
                dataParam['dbs_year']         = "";
                dataParam['revenue']		  = "";
                dataParam['operatingexp']     = "";
            }
            else
            {
                dataParam['yettostart']	   = '';

                select_BSM  				  = that.get("select_buss_s_m").trim(),
                dataParam['dbs_month']	    = select_BSM;

                select_BSY  			      = that.get("select_buss_s_y").trim(),
                dataParam['dbs_year']		 = select_BSY;

                avgAnnualRevenue   		   = that.get("average_annual_revenue").trim(),
                dataParam['revenue']		  = avgAnnualRevenue;

                bussOperatExpen 			  = that.get("buss_operating_expenses").trim(),
                dataParam['operatingexp']	 = bussOperatExpen;
            }
                
            
            //for Business Accept credit card

            if(document.getElementById('acceptcard').checked)
            {
                acceptCardYES	  					  = that.get("acceptcard_yes"),
                dataParam['acceptcard']				  = acceptCardYES;

                DFProcessed_Month  		 			 = that.get("datefirstProcessed_month"),
                dataParam['datefirstProcessed_month']	= DFProcessed_Month;

                DFProcessed_Day    					  = that.get("datefirstProcessed_day"),
                dataParam['datefirstProcessed_day']	  = DFProcessed_Day;

                DFProcessed_Year   		 			 = that.get("datefirstProcessed_year"),
                dataParam['datefirstProcessed_year']	 = DFProcessed_Year;

                Cur_city_card_pro  					  = that.get("c_c_card_processor").trim(),
                dataParam['creditcardproc']			  = Cur_city_card_pro;

                merchantID 	    					  = that.get("merchant_id").trim(),
                dataParam['merchantid']				  = merchantID;

                MonthlyVolumeAmountsList1   			 = that.get("MonthlyVolumeAmountsList1"),
                dataParam['MonthlyVolumeAmountsList1']   = MonthlyVolumeAmountsList1;

                MonthlyVolumeTicketsList1   			 = that.get("MonthlyVolumeTicketsList1").trim(),
                dataParam['MonthlyVolumeTicketsList1']   = MonthlyVolumeTicketsList1;

                MonthlyVolumeAmountsList2  			  = that.get("MonthlyVolumeAmountsList2"),
                dataParam['MonthlyVolumeAmountsList2']   = MonthlyVolumeAmountsList2;

                MonthlyVolumeTicketsList2   			 = that.get("MonthlyVolumeTicketsList2").trim(),
                dataParam['MonthlyVolumeTicketsList2']   = MonthlyVolumeTicketsList2;

                MonthlyVolumeAmountsList3   			 = that.get("MonthlyVolumeAmountsList3"),
                dataParam['MonthlyVolumeAmountsList3']   = MonthlyVolumeAmountsList3;

                MonthlyVolumeTicketsList3  			  = that.get("MonthlyVolumeTicketsList3").trim(),
                dataParam['MonthlyVolumeTicketsList3']   = MonthlyVolumeTicketsList3;

                MonthlyVolumeAmountsList4  			  = that.get("MonthlyVolumeAmountsList4"),
                dataParam['MonthlyVolumeAmountsList4']   = MonthlyVolumeAmountsList4;

                MonthlyVolumeTicketsList4  			  = that.get("MonthlyVolumeTicketsList4").trim(),
                dataParam['MonthlyVolumeTicketsList4']   = MonthlyVolumeTicketsList4;

            }
            else
            {   
                acceptCardNO							 = that.get("acceptcard_no"),
                dataParam['acceptcard']				  = acceptCardNO;
                dataParam['datefirstProcessed_month']	= "";
                dataParam['datefirstProcessed_day']	  = "";
                dataParam['datefirstProcessed_year']	 = "";
                dataParam['creditcardproc']			  = "";
                dataParam['merchantid']				  = "";
                dataParam['MonthlyVolumeAmountsList1']   = "";
                dataParam['MonthlyVolumeTicketsList1']   = "";
                dataParam['MonthlyVolumeAmountsList2']   = "";
                dataParam['MonthlyVolumeTicketsList2']   = "";
                dataParam['MonthlyVolumeAmountsList3']   = "";
                dataParam['MonthlyVolumeTicketsList3']   = "";
                dataParam['MonthlyVolumeAmountsList4']   = "";
                dataParam['MonthlyVolumeTicketsList4']   = "";
            }
            
            
        	//business have outstanding debt
        	if($(".outDebt[type='radio']:checked").val()==='Yes')
            {
                debttypeYES			    			  = that.get("debttype_yes"),
            	dataParam['debttype']					= debttypeYES;
            
				for(var i=1; i<=totbusinessDebtYesDiv;i++)
                {
                    if(deleteIds.indexOf(i.toString()) === -1)
                    {   
						dataParam['debttype'+i] = viewFModel.get('debttype'+i);
                        dataParam['yeardisbursed'+i]=viewFModel.get('yeardisbursed'+i);
                        switch(viewFModel.get('debttype'+i))
                        {
                            case 'Business Credit Card':
                            			
                            			 dataParam['txtOutCredit'+i]=viewFModel.get('txtOutCredit'+i);
                       				  dataParam['txtInterestCredit'+i]=viewFModel.get('txtInterestCredit'+i);
                            		 	dataParam['txtPerYearCredit'+i]=viewFModel.get('txtPerYearCredit'+i); 
                          
                            			 dataParam['tpcompany'+i]="";
                                         dataParam['ocadvance'+i]="";
                                         dataParam['funded_term'+i]="";
                                         dataParam['collateraltype'+i]="";
                                         dataParam['txtAmountTerm'+i]=""; 
                                         dataParam['txtOutAmountTerm'+i]="";
                                         dataParam['txtInterestTerm'+i]="";
                                         dataParam['txtPaymentModeTerm'+i]="";
                                         dataParam['txtYearTerm'+i]="";
                                         dataParam['txtTerm'+i]=""; 
                                         dataParam['txtFrequncyTerm'+i]="";
                            		break;
                            
                            case 'Cash Advance':
                            		 	dataParam['tpcompany'+i]=viewFModel.get('tpcompany'+i);
                            			 dataParam['ocadvance'+i]=viewFModel.get('ocadvance'+i);
                            			 dataParam['funded_term'+i]=viewFModel.get('funded_term'+i);
                            			 
                            			 dataParam['txtOutCredit'+i]="";
                       				  dataParam['txtInterestCredit'+i]="";
                            		 	dataParam['txtPerYearCredit'+i]="";            
                                         dataParam['collateraltype'+i]="";
                                         dataParam['txtAmountTerm'+i]=""; 
                                         dataParam['txtOutAmountTerm'+i]="";
                                         dataParam['txtInterestTerm'+i]="";
                                         dataParam['txtPaymentModeTerm'+i]="";
                                         dataParam['txtYearTerm'+i]="";
                                         dataParam['txtTerm'+i]=""; 
                                         dataParam['txtFrequncyTerm'+i]="";
                            
                            		break;
                            
                            case 'Line of credit':
                            			 dataParam['collateraltype'+i]=viewFModel.get('collateraltype'+i);
                            			 dataParam['txtOutCredit'+i]=viewFModel.get('txtOutCredit'+i);
                            			 dataParam['txtInterestCredit'+i]=viewFModel.get('txtInterestCredit'+i);
                            			 dataParam['txtPerYearCredit'+i]=viewFModel.get('txtPerYearCredit'+i);    
                            
                            			 dataParam['funded_term'+i]="";
                                         dataParam['tpcompany'+i]="";
                            			 dataParam['ocadvance'+i]="";
                                         dataParam['txtAmountTerm'+i]=""; 
                                         dataParam['txtOutAmountTerm'+i]="";
                                         dataParam['txtInterestTerm'+i]="";
                                         dataParam['txtPaymentModeTerm'+i]="";
                                         dataParam['txtYearTerm'+i]="";
                                         dataParam['txtTerm'+i]=""; 
                                         dataParam['txtFrequncyTerm'+i]="";
                            		break;
                            
                             case 'Term loan':
                            			 dataParam['collateraltype'+i]=viewFModel.get('collateraltype'+i);
                            			 dataParam['txtAmountTerm'+i]=viewFModel.get('txtAmountTerm'+i); 
                            			 dataParam['txtOutAmountTerm'+i]=viewFModel.get('txtOutAmountTerm'+i);
                            			 dataParam['txtInterestTerm'+i]=viewFModel.get('txtInterestTerm'+i);
                            			 dataParam['txtYearTerm'+i]=viewFModel.get('txtYearTerm'+i);
                            			 dataParam['txtPaymentModeTerm'+i]=viewFModel.get('txtPaymentModeTerm'+i);
                            			 dataParam['txtTerm'+i]=viewFModel.get('txtTerm'+i); 
                            			 dataParam['txtFrequncyTerm'+i]=viewFModel.get('txtFrequncyTerm'+i);
                            
                            			 dataParam['txtOutCredit'+i]="";
                            			 dataParam['txtInterestCredit'+i]="";
                            			 dataParam['txtPerYearCredit'+i]=""; 
                            			 dataParam['funded_term'+i]="";
                                         dataParam['tpcompany'+i]="";
                            			 dataParam['ocadvance'+i]="";
                            		break;
                            
                            default:
                            		//alert("sorry");
                            		break;
                        }
                                               
                    }
                }
            }
            else if($(".outDebt[type='radio']:checked").val()==='No')
            {
                debttypeNO			  			     = that.get("debttype_no"),
           	 dataParam['debttype']					= debttypeNO;
            }
            else
            {
                
           	 dataParam['debttype']					= '';

            }
            dataParam['totbusinessDebtYesDiv']=totbusinessDebtYesDiv; 
            dataParam['deleteIds']=deleteIds;
            
            //business property information
            if(document.getElementById('busi_pro_info_type').checked)
            {
                busproInfo_owned		  			   = that.get("busproInfo_owned"),
                dataParam['busi_pro_info_type']		  = busproInfo_owned;

                if(document.getElementById('busi_out_mort_type').checked)
                {
                    busi_OutMortTtype_yes		  		 = that.get("busi_out_mort_type_yes"),
                    dataParam['busi_out_mort_type']		 = busi_OutMortTtype_yes;

                    mortgageBANK			   			 = that.get("mortgage_bank").trim(),
                    dataParam['busi_mort_bank']			 = mortgageBANK;

                    outStandingBAL		     		     = that.get("outs_bal").trim(),
                    dataParam['busi_out_balance']		   = outStandingBAL;

                    monthMortageAMT   	      			= that.get("month_mort_amount").trim(),
                    dataParam['busi_month_mort_amount']	 = monthMortageAMT;
                }
                else
                {
                    busi_OutMortTtype_no		  		  = that.get("busi_out_mort_type_no"),
                    dataParam['busi_out_mort_type']		 = busi_OutMortTtype_no;

                    dataParam['busi_mort_bank']			=	"";
                    dataParam['busi_out_balance']  		=	"";
                    dataParam['busi_month_mort_amount']	=	"";
                }
                 dataParam['busi_month_rent']			= '';           
                 dataParam['busi_landlord']			  = '';
                 dataParam['busi_cont_number']		   = '';
            }
            else
        	{
                busproInfo_leased	   				 = that.get("busproInfo_leased"),
                dataParam['busi_pro_info_type']		  = busproInfo_leased;

                monthlyRENT			     			= that.get("monthly_rent").trim(),
                dataParam['busi_month_rent']			= monthlyRENT;

                landlord_NAME			   			= that.get("landlord_name").trim(),
                dataParam['busi_landlord']			  = landlord_NAME;

                contact_NUM			  			   = that.get("contact_number").trim(),
                dataParam['busi_cont_number']		   = contact_NUM;
                dataParam['busi_mort_bank']			=	"";
                dataParam['busi_out_balance']  		=	"";
                dataParam['busi_month_mort_amount']	=	"";
                
            }
            
            app.loginService.viewModel.showloder();
            var dataSource = new kendo.data.DataSource({
                transport: {
                read: {
                    url: localStorage.getItem("urlMobAppApiLoan"),
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: dataParam
            	}
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
                app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in loanappstep2 api.');
            },

            });
            dataSource.fetch(function(){

                alert("API");
                var data = this.data();
                app.loginService.viewModel.hideloder();
                if(data[0]['results']['faultcode'] === 1 || data[0]['results']['faultcode'] === "1")
                {
                    if(dataParam['business_act'] === "Next")
                    {
                       // $msg= "Business Information submitted successfully";
                       // app.loginService.viewModel.mobileNotification($msg,'info');
                       
                        localStorage.setItem("fid",data[0]['results']['fid']);
                        if(sessionStorage.getItem("setprefilStatus")==='false')
                        {
                             sessionStorage.setItem("setprefilStatus",'true');
                        }
                        else
                        {
                            sessionStorage.setItem("setprefilStatus",'false2');
                            
                        }
                        app.loansetting.viewModel.SetCurrentfidStatus();
                        apps.navigate('views/loanAppCI.html');
                    }
                    else
                    {
                       // $msg= "Business Information submitted successfully";
                        //localStorage.setItem("fid",data[0]['results']['fid']);
                       // app.loginService.viewModel.mobileNotification($msg,'info');
                    	app.loansetting.viewModel.resetLoanAppBIForm();
                        apps.navigate('#tabstrip-home');
                    }

                }
                else if(data[0]['results']['faultcode'] === 0 || data[0]['results']['faultcode'] === "0")
                {
                    $msg= "Business Information not submitted successfully.";
                    app.loginService.viewModel.mobileNotification($msg,'info'); 
                    return;
                }
                else if(data[0]['results']['faultcode'] === 3 || data[0]['results']['faultcode'] === "3")
                {
                    $msg= "Please enter all fields.";
                    app.loginService.viewModel.mobileNotification($msg,'info');
                    return;
                }
                else{
					$msg= "Server not responding properly,Please try again";
					app.loginService.viewModel.mobileNotification($msg,'info');
                    return;
                }            

                });

            },
            addOutDebtVar:function(num)
            {
                
                viewFModel['debttype'+num] ='';
                viewFModel['yeardisbursed'+num] ='';
                viewFModel['txtOutCredit'+num] ='';
                viewFModel['txtInterestCredit'+num] ='';
                viewFModel['txtPerYearCredit'+num] =1;
                viewFModel['tpcompany'+num] ='';
                viewFModel['ocadvance'+num] ='';
                viewFModel['funded_term'+num] ='';
                viewFModel['collateraltype'+num] ='';
                viewFModel['txtAmountTerm'+num] ='';
                viewFModel['txtOutAmountTerm'+num] ='';
                viewFModel['txtInterestTerm'+num] ='';
                viewFModel['txtYearTerm'+num] =1;
                viewFModel['txtPaymentModeTerm'+num] ='';
                viewFModel['txtTerm'+num] ='';
                viewFModel['txtFrequncyTerm'+num] =1;

            },
            addBindOutDebtVar:function(num)
            {
				kendo.bind($("#debttype"+num), viewFModel);
                kendo.bind($("#yeardisbursed"+num), viewFModel);
                kendo.bind($("#txtOutCredit"+num), viewFModel);
                kendo.bind($("#txtInterestCredit"+num), viewFModel);
                kendo.bind($("#txtPerYearCredit"+num), viewFModel);
                kendo.bind($("#tpcompany"+num), viewFModel);
                kendo.bind($("#ocadvance"+num), viewFModel);
                kendo.bind($("#funded_term"+num), viewFModel);
                kendo.bind($("#collateraltype"+num), viewFModel);
                kendo.bind($("#txtAmountTerm"+num), viewFModel);
                kendo.bind($("#txtOutAmountTerm"+num), viewFModel);
                kendo.bind($("#txtInterestTerm"+num), viewFModel);
                kendo.bind($("#txtYearTerm"+num), viewFModel);
                kendo.bind($("#txtPaymentModeTerm"+num), viewFModel);
                kendo.bind($("#txtTerm"+num), viewFModel);
                kendo.bind($("#txtFrequncyTerm"+num), viewFModel);

            },
        	deleteOutDebtVar:function(num)
            {
                
                delete  viewFModel['debttype'+num];
                delete viewFModel['yeardisbursed'+num];
                delete viewFModel['txtOutCredit'+num];
                delete viewFModel['txtInterestCredit'+num];
                delete viewFModel['txtPerYearCredit'+num];
                delete viewFModel['tpcompany'+num];
                delete viewFModel['ocadvance'+num];
                delete viewFModel['funded_term'+num];
                delete viewFModel['collateraltype'+num];
                delete viewFModel['txtAmountTerm'+num] ;
                delete viewFModel['txtOutAmountTerm'+num];
                delete viewFModel['txtInterestTerm'+num];
                delete viewFModel['txtYearTerm'+num];
                delete viewFModel['txtPaymentModeTerm'+num];
                delete viewFModel['txtTerm'+num];
                delete viewFModel['txtFrequncyTerm'+num];

            },
            resetLoanAppBIForm:function()
			{
                var that = this;
                localStorage.setItem("fid",'');
                sessionStorage.setItem("setprefilStatus",'false');
                $("#tabstrip-loanapp-bi").find(".km-scroll-container").css("-webkit-transform", "");
                $("#tabstrip-loanapp-ci").find(".km-scroll-container").css("-webkit-transform", "");
                $('#credit_show,#outsta_debt,#busInfobx,#busInfobx2').hide();
                $("input[type=radio]" ).attr( "checked",false);
                that.set("legal_business_name",'');
                that.set("dba_name",'');
                that.set("street_no",'');
                that.set("street_name",'');
                that.set("apt_suite_unit",'');
                that.set("select_state",'');
                that.set("select_city",'');
                that.set("zip_code","");
                that.set("mobile_number",(localStorage.getItem("userMobile") !== '') ?  localStorage.getItem("userMobile") : '');
                that.set("select_b_l_s","");
                that.set("industry","");
                that.set("sub_industry","");
                that.set("select_buss_s_m","");
                that.set("select_buss_s_y","");
                that.set("yettostart",1);
                that.set("average_annual_revenue","");
                that.set("buss_operating_expenses",""); 
                that.set("acceptcard_yes",'Yes');
                that.set("acceptcard_no",'No');
                that.set("datefirstProcessed_month","");
                that.set("datefirstProcessed_day","");
                that.set("datefirstProcessed_year","");
                that.set("c_c_card_processor","");
                that.set("merchant_id","");
                that.set("MonthlyVolumeAmountsList1","");
                that.set("MonthlyVolumeTicketsList1","");
                that.set("MonthlyVolumeAmountsList2","");
                that.set("MonthlyVolumeTicketsList2","");
                that.set("MonthlyVolumeAmountsList3","");
                that.set("MonthlyVolumeTicketsList3","");
                that.set("MonthlyVolumeAmountsList4","");
                that.set("MonthlyVolumeTicketsList4","");
                that.set("debttype_yes",'Yes');
                that.set("debttype_no",'No');
                that.set("selectdebttype","");
                that.set("selDisbursed","");
                that.set("busproInfo_owned",2);
                that.set("busproInfo_leased",1);
                that.set("outstandingMort_yes",1);
                that.set("outstandingMort_no",0);
                that.set("mortgage_bank","");
                that.set("outs_bal","");
                that.set("month_mort_amount","");
                that.set("monthly_rent","");
                that.set("landlord_name","");
                that.set("contact_number","");
                that.set("real_state","");
                that.set("inventory","");
                that.set("equip_finance","");
                that.set("account_rece","");
                that.set("currntControl",0);
                that.set("totbusinessDebtYesDiv","");
                that.set("deleteIds"," ");
                that.set("dnb_dun_no","");
                that.set("busi_out_mort_type_yes",1);
                that.set("busi_out_mort_type_no",0);
                that.set("debttype","");
                that.set("currentfidStatus",false);
                if(typeof index === 'undefined')
                {
                	index = 0;
                }
                for(index; index>0 ; index--){
                    kendo.unbind($('#debt'+index));
                    kendo.unbind($('#loan_'+index));
                    $('#debt'+index).remove();
                    $('#loan_'+index).remove();
                }
                $('#currntControl').val(0);
                $('#cmbCity').html('<option value="" selected="selected">Select State</option>');
                $('#dbs_month').removeAttr("disabled");
                $('#dbs_year').removeAttr("disabled");

                $('#revenue').removeAttr("disabled","disabled");
                $('#operatingexp').removeAttr("disabled","disabled");
                kendo.unbind($("#outsta_debt"));
				viewFModel = kendo.observable();            
            },
            SetCurrentfidStatus:function()
            {
            	var that = this;
            	that.set("currentfidStatus",true);
            },
            setCommaNumber:function(val)
            {
                var num = val.replace(/[^0-9]+/g, '').replace(/,/gi, "").split("").reverse().join("");     
                var num2 =  app.scheduleService.viewModel.RemoveRougeChar(num.replace(/(.{3})/g,"$1,").split("").reverse().join(""));
                return num2;								
            },
        
            loanAppBIBTN:function()
            {
                alert("done");
            }

    });
   
    app.loansetting = {
        viewModel: new loanViewModal()	
    };
})(window);
