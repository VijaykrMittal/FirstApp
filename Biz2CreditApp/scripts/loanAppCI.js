(function (global) {
    var loanCIViewModal,
        app = global.app = global.app || {};

    loanCIViewModal = kendo.data.ObservableObject.extend({
		currentfid:(localStorage.getItem("fid") !== '') ?  localStorage.getItem("fid") : '',
        Owner_FirstName:(localStorage.getItem("userFName") !== '') ?  localStorage.getItem("userFName") : '',
        Owner_LastName:(localStorage.getItem("userLName") !== '') ?  localStorage.getItem("userLName") : '',
        Owner_email:(localStorage.getItem("userEmail") !== '') ?  localStorage.getItem("userEmail") : '',
        Owner_JobTitle:'',
        Owner_Civic:'',
        Owner_StreetAddress:'',
        state_user:'',
        cmbCity:'',
        OwnZipCode:'',
        owner_month:'',
        owner_day:'',
        owner_year:'',
        own_percent:'',
        ownercurrntControl:0,
        totownerDiv:0,
        ownerdeleteIds:'',
        aredyownerdeleteIds:'',
        deldbownerids:'',
        own_id0:'',
        isCheckScore0:'',
        creditScore0:'',
        reasonlscore0:'',
        primaryOwner:'',
        show:function(e) {
            
            try
            {
                blegal = "";   
                var str ="";
            }
            catch(ex)
            {
                alert(ex.name+" : "+ex.message);   
            }
            
            var dataModel = app.loansetting.viewModel;
            
            e.sender.reload=false;
            e.view.reload=false;
            
            $(".km-native-scroller").scrollTop(0);
            
            if(sessionStorage.getItem("setprefilStatus").trim()==='true' && sessionStorage.getItem("LoanAppCIEditMode") ==='0')
            {
                autocreateCityCmb(app.loansetting.viewModel.select_state , '');
            }
            
            $("#add-ownerForm").unbind(".myPlugin");
            
            if(blegal === '' || blegal !== dataModel.select_b_l_s)
            {
                blegal = dataModel.select_b_l_s;
               
                str += '<option value="">Select Job Title</option>';

                if(blegal === 'Sole Proprietorship'){
                	str += '<option value="Sole Proprietor">Sole Proprietor</option>';
                }
                else if(blegal === 'Corporation' || blegal === 'Non Profit Corp'){
                    str += '<option value="Assistant Treasurer">Assistant Treasurer</option>';
                    str += '<option value="Chief Accounting Officer">Chief Accounting Officer</option>';
                    str += '<option value="Chief Executive Officer">Chief Executive Officer</option>';
                    str += '<option value="Chief Financial Officer">Chief Financial Officer</option>';            
                    str += '<option value="Chief Operating Officer">Chief Operating Officer</option>';
                    str += '<option value="Director">Director</option>';
                    str += '<option value="General Manager">General Manager</option>';
                    str += '<option value="Owner">Owner</option>';            
                    str += '<option value="President">President</option>';
                    str += '<option value="Treasurer">Treasurer</option>';
                    str += '<option value="Vice President">Vice President</option>';

                }
                else if(blegal === 'Partnership'){
                	str += '<option value="Partner">Partner</option>';
                }
                else if(blegal === 'Limited Partnership'){
                	str += '<option value="General Partner">General Partner</option>';
                	str += '<option value="Limited Partner">Limited Partner</option>';
                }
                else if(blegal === 'Limited Liability Company'){
                	str += '<option value="Managing Member">Managing Member</option>';
                	str += '<option value="Member">Member</option>';
                }


                $("#OwnJobTitle").html('');
                $("#OwnJobTitle").append(str);
            }
            
            var DateDiff = { 
                inDays: function(d1, d2) {
                    var t2 = d2.getTime();
                    var t1 = d1.getTime();

                    return parseInt((t2-t1)/(24*3600*1000));
                },

                inWeeks: function(d1, d2) {
                    var t2 = d2.getTime();
                    var t1 = d1.getTime();

                    return parseInt((t2-t1)/(24*3600*1000*7));
                },

                inMonths: function(d1, d2) {
                    var d1Y = d1.getFullYear();
                    var d2Y = d2.getFullYear();
                    var d1M = d1.getMonth();
                    var d2M = d2.getMonth();

                    return (d2M+12*d2Y)-(d1M+12*d1Y);
                },

                inYears: function(d1, d2) {
                	return d2.getFullYear()-d1.getFullYear();
                }
            }
            
            $.validator.addMethod("zipcodeUS", function(value, element) {
            	return this.optional(element) || /\d{5}-\d{4}$|^\d{5}$/.test(value);
            });
            
            $.validator.addMethod("loginRegex", function(value, element) {
           	 return this.optional(element) || /^[a-z0-9\-\s]+$/i.test(value);
            });
            
            $.validator.addMethod("ownerPercent", function(value, element) {

                var strdeldivids = "";
                var totaldivs = $("#totownerDiv").val();
                var deldivids = $("#ownerdeleteIds").val();
                var adelids = $("#aredyownerdeleteIds").val();

                //alert(totaldivs+" : "+deldivids+" : "+adelids);

                if(deldivids !=='' && adelids !=='')
                {
              	  strdeldivids = deldivids+","+adelids;
                }
                else if(deldivids !=='' && adelids === '')
                {
               	 strdeldivids = deldivids;
                }
                else if(deldivids ==='' && adelids !== '')
                {
               	 strdeldivids = adelids;
                } 
                else 
                {
               	  strdeldivids = "";
                }

                if(totaldivs >0) 
                {
                    var total_per = 0;
                    for( var c=1; c<=totaldivs; c++)
                    {                                    
                        if(strdeldivids !=='') 
                        {
                            if(!strdeldivids.match(c)) 
                            {
                                if(parseInt($('#own_percent'+c).val()) >0) 
                                {
                                total_per = total_per + (parseInt($('#own_percent'+c).val()));
               				 }
              			  }
              		  } 
                        else 
                        {
                            if(parseInt($('#own_percent'+c).val()) >0) 
                            {
                          	  total_per = total_per + (parseInt($('#own_percent'+c).val()));
                            }     
                		}
              	  }                              
               	 total_per = total_per + (parseInt($('#own_percent').val()));                                
                }                           
                if(total_per > 100) { return false;	} else { return true; }                            
            });
            
            $.validator.addMethod("dobminor", function(value, element) {       			 
                var mm = $("#owner_month").val();
                var dd = $("#owner_day").val();
                var yy = $("#owner_year").val();
                var sdate = yy+"-"+mm+"-"+dd;
                var edate = $("#current_sdtae").val();

                if(mm !=='' && dd !=='' && yy!==''){ 
                   var d1 = new Date(sdate);
                   var d2 = new Date(edate);                            
                   //var nofYears = DateDiff.inYears(d1, d2);
                   var nofDays = DateDiff.inDays(d1, d2);
                   if(nofDays < 6574){                  
                       return false;
                   } else {
                       return true;
                   }
                } else {
                   return false;
                }     
        	});
            $.validator.addMethod("ownerUemail", function(value, element) {
                var totaldivs = parseInt($('#totownerDiv').val());                
                var emails = new Array();   
                var stremails = "";                
                
                for(var c=0; c<=totaldivs; c++){ 
                    if(c===0) {
                        var index='';
                    } else {
                        var index = c;
                    }            
                    if($("#email"+index).length) {
                        var cemail = $("#email"+index).val();
                        var ctname = element.name;
                        var ctid      = "email"+index;                       
                        if(cemail !== '' && ctname !== ctid){                            
                            stremails+= cemail+",";
                        }
                    }       
                }
                
                var strlength = parseInt(stremails.length)-1;                
                stremails = stremails.substring(0,strlength);
                var no_occ = stremails.indexOf(value); 

                if(no_occ>=0){
                    return false;
                }else {
                    return true;
                }
       	 });
            
            $("#b2cApp1").validate({
                rules: {
                    OwnerFirstName: {
                    	loginRegex: true, 
                    	required: true
                    },
                    OwnerLastName: { 
                    	loginRegex: true, 
                    	required: true 
                    },
                    email: { 
                    	email: true, 
                        ownerUemail: true,
                    	required: true 
                    },
                    OwnJobTitle: {  
                    	required: true 
                    },
                    OwnerCivic: { 
                    	required: true,
                    	number : true
                    },
                    OwnerStreetAddress: {
                    	required: true
                    },
                    state_user: {
                    	required: true
                    },
                    cmbCity_user: {
                    	required: true
                    },
                    OwnZipCode: {
                    	required: true,
                    	zipcodeUS: true
                    },
                    owner_year: {
                    	required: true,
                    },
                    owner_month: {
                    	required: true
                    },
                    owner_day: {
                    	required: true
                    },                        
                    own_percent: {
                    	required: true
                    }

                },
                messages: {
                    OwnerFirstName: {
                    	loginRegex: "Letters, numbers,space or underscores only please",
                    	required: "This value is required"

                    },
                    OwnerLastName: {
                    	loginRegex: "Letters, numbers,space or underscores only please",
                    	required: "This value is required"

                    },
                    email: {
                        email: "Please enter valid email",
                        required: "This value is required",
                        ownerUemail: "Please enter unique email for each owner"
                    },

                    OwnJobTitle: {
                   	 required: "This value is required"
                    },
                    OwnerCivic: {
                    	required: "This value is required",
                    	number: "Please enter digits only"
                    },
                    OwnerStreetAddress: {
                    	required: "This value is required"
                    },
                    cmbCity_user: {
                    	required: "This value is required"
                    },
                    state_user: {
                    	required: "This value is required"
                    },
                    OwnZipCode: {
                    	required: "This value is required",
                    	zipcodeUS: "Please enter valid zipcode"

                    },
                    owner_year: {
                    	required:  "This value is required",
                    },
                    owner_month: {
                    	required: "This value is required"                                        
                    },
                    owner_day: {
                    	required: "This value is required"                                        
                    },
                    own_percent: {
                    	required: "This value is required"
                    }
                },
                submitHandler: function(form) {
                	// $("#b2cApp1 #next").prop("disabled", true);
                	return false;
                }
            });
            
            var addownerForm = $("#add-ownerForm");
            var index = $('#totownerDiv').val(); 
            
			
            if(typeof viewCModel === 'undefined')
            {
                viewCModel = kendo.observable();
            }
            
           
            
            if(device.platform==="Win32NT")
            {
                $("#myBTN").click(function(){
                    alert("ok owner");
                });
            }
            
            
            addownerForm.on("click.myPlugin", function() {
                
                app.loanAppCI.viewModel.addDynamicOwner(++index);
                var form = app.loanAppCI.viewModel.getownerForm(index);
                app.loanAppCI.viewModel.setHiddenField(index);
                var tot= parseInt($('#ownercurrntControl').val())+1;
                $('#ownercurrntControl').val(tot);
                $("#row_owners").append(form);
                app.loanAppCI.viewModel.addBindDynamicOwner(index);
                var ownerFlag = app.loanAppCI.viewModel.checkownerFlag();
                

                $("#OwnerFirstName"+index).rules("add", {
                loginRegex: true,
                    messages: {
                        loginRegex: "Letters, numbers,space or underscores only please",
                    }
                });

                $("#OwnerFirstName"+index).rules("add", {
                    required: true,
                    messages: {
                        required: "This value is required"
                    }
                });

                $("#OwnerLastName"+index).rules("add", {
                    loginRegex: true,
                    messages: {
                        loginRegex: "Letters, numbers,space or underscores only please",
                    }
                });



                $("#OwnerLastName"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });               

                $("#email"+index).rules("add", {
                email: true,
                messages: {
                email: "Please enter valid email"
                }
                });
                $("#email"+index).rules("add", {
                ownerUemail: true,
                messages: {
                ownerUemail: "Please enter unique email for each owner"
                }
                });

                $("#email"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#OwnJobTitle"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                }); 

                $("#OwnerCivic"+index).rules("add", {
                number : true,
                required: true,
                messages: {
                    number: "Please enter digits only",
                    required: "This value is required"
                }
                });
                
                $("#OwnerStreetAddress"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#own_state"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });                

                $("#own_city"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#OwnZipCode"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#OwnZipCode"+index).rules("add", {
                number : true,
                messages: {
                number: "Please enter digits only"
                }
                });

                $("#owner_month"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#owner_day"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#owner_year"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#own_percent"+index).rules("add", {
                required: true,
                messages: {
                required: "This value is required"
                }
                });

                $("#own_percent"+index).rules("add", {
                ownerPercent: true,
                messages: {
                ownerPercent: "Ownership % should be less than or equal to 100"
                }
                });
               

                //var totalOutstanding=0;               
                $("#remove-ownerform"+index).on("click", function(e) { 
                    alert("remove button");
                    var clickIndex = $(this).data("index");             /*--------------VKM-----------------*/
                    //var clickIndex = data.dataset.index;
                    var strdelownids = $("#deldbownerids").val(); 
                    var aredyodeleteIds = $("#aredyownerdeleteIds").val();
                    var downid = parseInt(viewCModel['own_id'+clickIndex]);

                    if(downid>0){
                    strdelownids = strdelownids+downid+","; 
                    aredyodeleteIds = aredyodeleteIds+index+",";
                    app.loanAppCI.viewModel.setDeldbownerids(strdelownids);
                    app.loanAppCI.viewModel.setAredyownerdeleteIds(aredyodeleteIds);
                    $("#deldbownerids").val(strdelownids);
                    $("#aredyownerdeleteIds").val(aredyodeleteIds);
                    }
                    var currentIndex = $(this).data( "index" );                   
                    $("#adddowner" + currentIndex).remove();			
                    $('#ownercurrntControl').val($('#ownercurrntControl').val()-1);

                    var newstrdeldivs = $("#ownerdeleteIds").val(); 
                    newstrdeldivs = newstrdeldivs+currentIndex+',';                                            
                    $("#ownerdeleteIds").val(newstrdeldivs);
                    app.loanAppCI.viewModel.setHiddenFieldDeleteIds(newstrdeldivs);
                    var ownerFlag = app.loanAppCI.viewModel.checkownerFlag();
                    app.loanAppCI.viewModel.deleteOutDebtVar();
                    $("#tabstrip-loanapp-ci").find(".km-scroll-container").css("-webkit-transform", "");
                    
                });

            });
            if(sessionStorage.getItem("LoanAppCIEditMode") ==='1')
            {
                sessionStorage.setItem("LoanAppBIEditMode",'0');
                sessionStorage.setItem("LoanAppCIEditMode",'0');
                app.loanAppCI.viewModel.setCIeditForm();
            }

        },
        setCIeditForm:function(e){
           
            var that =this;
            var data =manageData;
            var dataModel = app.loansetting.viewModel;
            alert(dataModel.select_b_l_s);
            if(typeof data['findetails']['owner_details']  !== "undefined")
            {
                
                   // app.loginService.viewModel.showloder();
                    keyindex=1;
                
                    $.each(data['findetails']['owner_details'], function( index, value ) {
                        alert("my own number "+value['own_no']);
                        if(value['own_no']===1 || value['own_no']==='1')
                        {
                            pownemail = value['own_email'];
                        }
                        if(value['own_no']===1 || value['own_no']==='1')
                        {
                            /*var jobTitleRequest = value['own_jobtitle'];
                            if(data['findetails']['blegal'] === dataModel.select_b_l_s)
                            {
                                $("#OwnJobTitle option[value='"+jobTitleRequest+"']").prop("selected",true); 
                                that.set("Owner_JobTitle",jobTitleRequest);
                            }
                            else
                            {
                                $("#OwnJobTitle option[value='']").prop("selected",true); 
                            }
                            
                            that.set("Owner_FirstName",value['own_fname']);
                            that.set("Owner_LastName",value['own_lname']);
                            that.set("Owner_email",value['own_email']);
                            
                            that.set("Owner_Civic",(value['own_civic']!== '0') ? value['own_civic'] : "");
                            that.set("Owner_StreetAddress",value['own_street']);

                            that.set("state_user",(value['own_state']!== '0') ? value['own_state'] : "");

                            createCityCmbEdit('',(value['own_state']!== '0') ? value['own_state'] : "" , value['own_city']);

                            that.set("cmbCity",value['own_city']);

                            that.set("OwnZipCode",value['own_zip']);
                            var oDob = value['own_dob'].split('-');
                            
                            that.set("owner_month",(Number(oDob[1])!== 0) ? Number(oDob[1]) : "");
                            that.set("owner_day",(oDob[2]!== '00') ? oDob[2] : "");

                            that.set("owner_year",(oDob[0]!== '0000') ? oDob[0] : "");
                            that.set("own_percent",(value['own_percent']!== '0') ? value['own_percent'] : "");

                            that.set("own_id0",value['id']);
                            that.set("creditScore0",value['credittype']);
                            that.set("isCheckScore0",value['check_credit_score']);
                            that.set("reasonlscore0",value['low_rpt_reason']);*/
                            
                        }
                       else
                        {
                           $("#add-ownerForm").trigger('click');
                            console.log("own no "+value['own_fname']);
                            try
                            {
                                viewCModel.set("OwnerFirstName"+keyindex,(value['own_fname']!== 'undefined') ? value['own_fname'] : "");
                            }
                            catch(ex)
                            {
                                alert(ex.message);
                            }
                              
                         /* viewCModel.set("OwnerLastName"+keyindex,(value['own_lname']!== '') ? value['own_lname'] : "");
                            viewCModel.set("email"+keyindex,(value['own_email']!== 'undefined') ? value['own_email'] : "");
                            //viewCModel.set("OwnJobTitle"+index,(EditFormData['0']['OwnJobTitle'+index]!== 'undefined') ? EditFormData['0']['OwnJobTitle'+index] : "");
                            viewCModel.set("OwnerCivic"+keyindex,(value['own_civic']!== '0') ? value['own_civic'] : "");
                            viewCModel.set("OwnerStreetAddress"+keyindex,(value['own_street']!== 'undefined') ? value['own_street'] : "");
                            viewCModel.set("own_state"+keyindex,(value['own_state']!== '0') ? value['own_state'] : "");
                            createCityCmbEdit(keyindex,(value['own_state']!== '0') ? value['own_state'] : "" , value['own_city']);
                            viewCModel.set("own_city"+keyindex,(value['own_city']!== 'undefined') ? value['own_city'] : "");
                            viewCModel.set("OwnZipCode"+keyindex,(value['own_zip']!== 'undefined') ? value['own_zip'] : "");
                            var own_DOB = value['own_dob'].split('-');
                            viewCModel.set("owner_month"+keyindex,(Number(own_DOB[1])!== 0) ? Number(own_DOB[1]) : "");
                            viewCModel.set("owner_day"+keyindex,(own_DOB[2]!== '00') ? own_DOB[2] : "");
                            viewCModel.set("owner_year"+keyindex,(own_DOB[0]!== '0000') ? own_DOB[0] : "");
                            
                            viewCModel.set("own_percent"+keyindex,(value['own_percent']!== '0') ? value['own_percent'] : "");
                            viewCModel.set("own_id"+keyindex,(value['id']!== 'undefined') ? value['id'] : "");
                            viewCModel.set("isCheckScore"+keyindex,(value['check_credit_score']!== 'undefined') ? value['check_credit_score'] : "");
                            viewCModel.set("creditScore"+keyindex,(value['credittype']!== 'undefined') ? value['credittype'] : "");
                            viewCModel.set("reasonlscore"+keyindex,(value['low_rpt_reason']!== 'undefined') ? value['low_rpt_reason'] : "");
                            if(data['findetails']['blegal'] === dataModel.select_b_l_s)
                            {
                                viewCModel.set("OwnJobTitle"+keyindex,value['own_jobtitle']);
                                $("#OwnJobTitle"+keyindex+" option[value='"+value['own_jobtitle']+"']").prop("selected",true);
                            }
                            else
                            {
                                $('#OwnJobTitle'+keyindex+' option[value=""]').prop("selected",true);
                            }*/
                            alert(typeof(viewCModel['OwnerLastName'+keyindex]));
                             console.log(typeof(viewCModel['OwnerLastName'+keyindex]));
                            keyindex++;
                        }
                    	
                	});      

                    totownerDiv = that.get("totownerDiv");
                    var total_per = 0; 
                    for(var c=0; c<=totownerDiv; c++){ 
                        if(c===0) {
                            var index='';
                        } 
                        else {
                            var index = c;
                        }            
                        if($("#own_percent"+index).length) {
                            if(parseInt($('#own_percent'+index).val()) >0) {
                                total_per = total_per + (parseInt($('#own_percent'+index).val()));
                            }                                         
                        }

                    } 
                    if(total_per >=100){
                        $('#add-ownerForm').hide();
                    } else {
                        app.loanAppCI.viewModel.checkownerFlag();
                    }
                    ownerpValidate();
                    that.set("primaryOwner",pownemail);
                    $("#cmbowners option[value='"+pownemail+"']").prop("selected", true); 
            }
        },
        getownerForm:function(index) {
            return $('\
            <div class="rw_lin addons  clearfix" id="adddowner'+ index+'"><p class="imp40">'+app.loanAppCI.viewModel.createFormfields(index)+'</p><p><a class="rem_col" href="javascript:void(0);" id="remove-ownerform' + index + '" data-index="' + index + '">Remove</a></p></div>');
		},
        createFormfields:function (NumOfDiv) {
            
            //var value = $("#divId"+NumOfDiv).val().trim();
           // alert(value);
            var dataModel = app.loansetting.viewModel;
            var blegal = dataModel.select_b_l_s;
            var str="<div class='rws rw1 clearfix' ><div class='lftit'>Applicant/Owner</div>";
            str += "<p><input type='text' class='IN1' name='OwnerFirstName"+NumOfDiv+"' id='OwnerFirstName"+NumOfDiv+"' data-bind='value:OwnerFirstName"+NumOfDiv+"' orignal-title='First Name' placeholder='First Name' value='' /></p>";
            str += "<p><input type='text' class='IN1' name='OwnerLastName"+NumOfDiv+"' id='OwnerLastName"+NumOfDiv+"' data-bind='value:OwnerLastName"+NumOfDiv+"' orignal-title='Last Name' placeholder='Last Name' value='' />";
            str += "<input type='hidden'  name='own_id"+NumOfDiv+"' id='own_id"+NumOfDiv+"'  value='' />";
            str += "<input type='hidden'  name='isCheckScore"+NumOfDiv+"' id='isCheckScore"+NumOfDiv+"'  value='' />";
            str += "<input type='hidden'  name='creditScore"+NumOfDiv+"' id='creditScore"+NumOfDiv+"'  value='' />";
            str += "<input type='hidden'  name='reasonlscore"+NumOfDiv+"' id='reasonlscore"+NumOfDiv+"'  value='' />";
            str += '</p></div>';
            str += '<div class="rws rw1 clearfix"><div class="lftit">Email</div>';
            str += "<p><input type='text' class='IN1'  onblur='javascript:ownerpValidate();' name='email"+NumOfDiv+"' id='email"+NumOfDiv+"' data-bind='value:email"+NumOfDiv+"' original-title='Email Address' placeholder='Email Address' value='' /></p>";
            str += "<p><select class='IN1' name='OwnJobTitle"+NumOfDiv+"' id='OwnJobTitle"+NumOfDiv+"' data-bind='value:OwnJobTitle"+NumOfDiv+"' original-title='Job Title'>";
            str += '<option value="">Select Job Title</option>';

            if(blegal === 'Sole Proprietorship'){
            	str += '<option value="Sole Proprietor">Sole Proprietor</option>';
            }
            else if(blegal === 'Corporation' || blegal === 'Non Profit Corp'){
                str += '<option value="Assistant Treasurer">Assistant Treasurer</option>';
                str += '<option value="Chief Accounting Officer">Chief Accounting Officer</option>';
                str += '<option value="Chief Executive Officer">Chief Executive Officer</option>';
                str += '<option value="Chief Financial Officer">Chief Financial Officer</option>';            
                str += '<option value="Chief Operating Officer">Chief Operating Officer</option>';
                str += '<option value="Director">Director</option>';
                str += '<option value="General Manager">General Manager</option>';
                str += '<option value="Owner">Owner</option>';            
                str += '<option value="President">President</option>';
                str += '<option value="Treasurer">Treasurer</option>';
                str += '<option value="Vice President">Vice President</option>';

            }
            else if(blegal === 'Partnership'){
            	str += '<option value="Partner">Partner</option>';
            }
            else if(blegal === 'Limited Partnership'){
            	str += '<option value="General Partner">General Partner</option>';
            	str += '<option value="Limited Partner">Limited Partner</option>';
            }
            else if(blegal === 'Limited Liability Company'){
            	str += '<option value="Managing Member">Managing Member</option>';
            	str += '<option value="Member">Member</option>';
            }        
            str += '</select></p></div>';

            str += '<div class="rws rw2 clearfix"><div class="lftit">Home Address</div><div class="rwfil aut clearfix"><div class="rw_lin clearfix">'; 
            str += "<p><input maxlength='15' type='text' class='IN1 ipsm1' name='OwnerCivic"+NumOfDiv+"' id='OwnerCivic"+NumOfDiv+"' data-bind='value:OwnerCivic"+NumOfDiv+"' orignal-title='Street No.' placeholder='Street No.' value='' /></p>";
            str += "<p><input type='text' class='IN1 ipsm1' name='OwnerStreetAddress"+NumOfDiv+"' id='OwnerStreetAddress"+NumOfDiv+"' data-bind='value:OwnerStreetAddress"+NumOfDiv+"' orignal-title='Street Name/Apt/Suite/Unit' placeholder='Street Name/Apt/Suite/Unit' value='' /></p>";
            str += '<div class="clear"></div></div>';

            str += "<div class='rw_lin clearfix'><p id='ownerState"+NumOfDiv+"'>\
            "+app.loanAppCI.viewModel.createStateCmb(NumOfDiv)+"\
            <select name='own_state"+NumOfDiv+"' id='own_state"+NumOfDiv+"' data-bind='value:own_state"+NumOfDiv+"'><option value=''>Select State</option></select></p>";
            str += "<p id='ownerCity"+NumOfDiv+"'>\
            <select class='IN1b ipsm3' name='own_city"+NumOfDiv+"' id='own_city"+NumOfDiv+"' data-bind='value:own_city"+NumOfDiv+"' original-title='Select City'><option value=''>Select City</option></select></p>";

            str += "<p><input maxlength='5' type='text' class='IN1 ipsm1 zipcod' name='OwnZipCode"+NumOfDiv+"' data-bind='value:OwnZipCode"+NumOfDiv+"' id='OwnZipCode"+NumOfDiv+"' maxlength='5' orignal-title='Zip Code' placeholder='Zip Code' value='' maxlength='5' /></p>";
            str += '</div></div></div>';

            str += '<div class="clear"></div>';

            str += '<div class="rws rw2 clearfix"><div class="lftit">Date of Birth</div><div class="rwfil aut clearfix">';
            str += "<p>\
            "+app.loanAppCI.viewModel.createDobMonth(NumOfDiv)+"\
            </p>";
            str += "<p>\
            "+app.loanAppCI.viewModel.createDobDay(NumOfDiv)+"\
            </p>";
            str += "<p>\
            "+app.loanAppCI.viewModel.createDobYear(NumOfDiv)+"\
            </p>";
            str += '</div></div>';
            str += '<div class="rws rw4 clearfix"><div class="lftit">Ownership Percentage</div><div class="rwfil aut clearfix">';
            str += "<p>\
            "+app.loanAppCI.viewModel.createOwnership(NumOfDiv)+"\
            </p>";
            str += '</div></div>';
            return str;
		},
        createStateCmb:function (NumOfDiv) {       
           var str='';        
            $('#ownerState'+NumOfDiv+'').after('<div id="loader"></div>');
            $('#own_city'+NumOfDiv+'').attr("disabled","disabled"); 
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/jos_state.json",
                        type:"GET",
                        dataType: "json",
                    }
            },
            filter: { field: "countryid", operator: "eq", value: 253 }
            });
            dataSource.fetch(function(){
                var view = dataSource.view();
                var html='<option value="" selected="selected">Select State</option>';
                $.each(view, function( index, value ) {
                	html+='<option value="'+value['id']+'">'+value['state']+'</option>';
            	});

                str = "<select name='own_state"+NumOfDiv+"' id='own_state"+NumOfDiv+"' class='IN1b ipsm1' data-bind='value:own_state"+NumOfDiv+"' original-title='Select State' onChange='javascript:createCityCmb(this.value, "+NumOfDiv +")'>"+html+"</select>";                    
                $('#ownerState'+NumOfDiv+'').html(str); 
                $('#own_city'+NumOfDiv+'').removeAttr("disabled","disabled");
                kendo.bind($("#own_state"+NumOfDiv), viewCModel);
                return str;                

            });
            
            
		},
        createDobMonth:function(NumOfDiv) {
            var str='';
            str ="<select name='owner_month"+NumOfDiv+"' id='owner_month"+NumOfDiv+"' data-bind='value:owner_month"+NumOfDiv+"' original-title='Month' class='IN1b ipsm1'>";
            str +='<option value="">Month</option>';
            var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");        
            //var mlength = months.length;
            for(var i=1; i<=12;i++){
                if(i<10){
                	mval = '0'+i;
                } else {
                	mval = i; 
                } 
                var index = i-1;
                str +='<option value="'+mval+'">'+months[index]+'</option>';
            }
            str +='</select>';
            return str;
		},
        createDobDay:function(NumOfDiv) {
            var str='';
            str ="<select name='owner_day"+NumOfDiv+"' id='owner_day"+NumOfDiv+"' data-bind='value:owner_day"+NumOfDiv+"' original-title='Day' class='IN1b ipsm1'>";
            str +='<option value="">Day</option>';        
            for(var i=1; i<=31;i++){
            if(i<10){
            	dval = '0'+i;
            } else {
            	dval = i; 
            } 
            str +='<option value="'+dval+'">'+dval+'</option>';
            }
            str +='</select>';
            return str;
		},
        createDobYear:function (NumOfDiv) {
        var str='';
        str ="<select name='owner_year"+NumOfDiv+"' id='owner_year"+NumOfDiv+"' data-bind='value:owner_year"+NumOfDiv+"' original-title='Year' class='IN1b ipsm1'>";
        str +='<option value="">Year</option>';        
        for(i=1914; i<=2014;i++){          
        	str +='<option value="'+i+'">'+i+'</option>';
        }
        str +='</select>';
        return str;
        },
        createOwnership:function (NumOfDiv){
            var str='';
            str ="<select name='own_percent"+NumOfDiv+"' id='own_percent"+NumOfDiv+"' data-bind='value:own_percent"+NumOfDiv+"' original-title='Ownership Percentage' onchange='javascript:ownerpValidate()' class='IN1b ipsm3'>";
            str +='<option value="">Ownership Percentage</option>';        
            for(i=100; i>=1;i--){          
            str +='<option value="'+i+'">'+i+'</option>';
            }
            str +='</select>';
            return str; 
        },
        checkownerFlag:function (){
            var totdivs = $('#totownerDiv').val();
            var adivs = $('#aredyownerdeleteIds').val();
            var newdivs = $('#ownerdeleteIds').val();

            if(adivs !=='' || newdivs !=='') {
            	var strdivs   = '';   

                if(totdivs >0 && adivs!=='' && adivs!==',' && newdivs!=='' && newdivs!==',' ){
                	strdivs = adivs+newdivs;
                }
                if(totdivs >0 && adivs!=='' && adivs!==',' && newdivs===''){
                	strdivs = adivs;
                }
                if(totdivs >0 && newdivs!=='' && newdivs!==',' && adivs===''){
                	strdivs = newdivs;
                }
                var strlength = parseInt(strdivs.length)-1;
                strdivs = strdivs.substring(0,strlength);
                var strdivarr = strdivs.split(",");
                var totdeldivs = strdivarr.length;    
                actualown = parseInt(totdivs - totdeldivs)+1;
            } 
            else 
            {
                actualown = parseInt(totdivs)+1;
            }      
            //alert(totdivs+" : "+adivs+" : "+newdivs+"   ="+actualown);
            if(actualown >= 6){
            	$('#add-ownerForm').hide();
            }else {
            	$('#add-ownerForm').show();
            }
		},
        setHiddenField:function(index)
        {
                var that =this;
                that.set("totownerDiv",index);
        },
        setHiddenFieldDeleteIds:function(ids)
        {
                var that =this;
                that.set("ownerdeleteIds",ids);
        },
        setDeldbownerids:function(ids)
        {
                var that =this;
                that.set("deldbownerids",ids);
        },
        setAredyownerdeleteIds:function(ids)
        {
                var that =this;
                that.set("aredyownerdeleteIds",ids);
        },
        loanAppCISubmit:function(e){
           //apps.navigate('views/loanAppPI.html');
            alert("loanAppCI");
            var data = e.button.data();
            dataParam =  {};
            if(data.name === "Next")
            {
                
                var status = $("#b2cApp1").valid();
                $("#tabstrip-loanapp-ci").find(".km-scroll-container").css("-webkit-transform", "");
                if(status === false)
                {
                    return false;
                } 
                dataParam['contact_act'] = 'Next';
                alert(dataParam['contact_act']);
            }
            else
            {
           	 dataParam['contact_act'] ='Save_Exit';
                alert("save exit");
            }
            var that = this;
            dataParam['apiaction']='loanappstep1';
			ownerFName = that.get("Owner_FirstName").trim();
			ownerLName = that.get("Owner_LastName").trim(); 
            emailAdd   = that.get("Owner_email").trim();
            jobTitle   = that.get("Owner_JobTitle");
            streetNo   = that.get("Owner_Civic").trim();
            streetName = that.get("Owner_StreetAddress").trim();
            ownerState = that.get("state_user");
            ownerCity  = that.get("cmbCity");
            dobDay     = that.get("owner_day");
            dobMonth   = that.get("owner_month");
            dobYear    = that.get("owner_year");
            ownerZip   = that.get("OwnZipCode").trim();
            ownPercent = that.get("own_percent");
            totownerDiv = that.get("totownerDiv");
            ownerdeleteIds = that.get("ownerdeleteIds");
            aredyownerdeleteIds = that.get("aredyownerdeleteIds");
            deldbownerids = that.get("deldbownerids");
            own_id0 = that.get("own_id0");
            primaryOwner = that.get("primaryOwner");
            if(primaryOwner !== '')
            {
              dataParam['cmbowners'] = primaryOwner;
            }
            
            dataParam['cust_id'] = localStorage.getItem("userID");
            dataParam['fid'] = localStorage.getItem("fid");
			dataParam['type'] = '';
			dataParam['frmname'] = 'b2cApp1';
            dataParam['email']  = emailAdd;
            dataParam['OwnJobTitle'] = jobTitle;
            dataParam['OwnerHomePhone'] = '';
            dataParam['OwnerFirstName'] = ownerFName;
            dataParam['OwnerLastName'] = ownerLName;
            dataParam['OwnerCivic'] = streetNo;
            dataParam['OwnerStreetAddress'] = streetName;
            dataParam['state_user'] = ownerState;
            dataParam['cmbCity_user'] = ownerCity;
            dataParam['owner_year'] = dobYear;
            dataParam['owner_month'] = dobMonth;
            dataParam['owner_day'] = dobDay; 
            dataParam['OwnZipCode'] = ownerZip;
            dataParam['own_percent'] = ownPercent;
            dataParam['own_id0'] = own_id0;
            dataParam['aredyownerdeleteIds'] = aredyownerdeleteIds;
            dataParam['ownerdeleteIds'] = ownerdeleteIds;
            dataParam['deldbownerids'] = deldbownerids;
            dataParam['totownerDiv'] = totownerDiv;
            
            
            for(var i=1; i<=totownerDiv;i++)
            {
                if(ownerdeleteIds.indexOf(i.toString()) === -1)
                {  
                    dataParam['email'+i]=viewCModel.get('email'+i);
                    dataParam['OwnJobTitle'+i]=viewCModel.get('OwnJobTitle'+i);
                    dataParam['OwnerHomePhone'+i] = '';
                    dataParam['OwnerFirstName'+i]=viewCModel.get('OwnerFirstName'+i);
                    dataParam['OwnerLastName'+i]=viewCModel.get('OwnerLastName'+i);
                    dataParam['OwnerCivic'+i]=viewCModel.get('OwnerCivic'+i);
                    dataParam['OwnerStreetAddress'+i]=viewCModel.get('OwnerStreetAddress'+i);
                    dataParam['own_state'+i]=viewCModel.get('own_state'+i);
                    dataParam['own_city'+i]=viewCModel.get('own_city'+i);
                    dataParam['owner_year'+i]=viewCModel.get('owner_year'+i);
                    dataParam['owner_month'+i]=viewCModel.get('owner_month'+i);
                    dataParam['owner_day'+i]=viewCModel.get('owner_day'+i);
                    dataParam['OwnZipCode'+i]=viewCModel.get('OwnZipCode'+i);
                    dataParam['own_percent'+i]=viewCModel.get('own_percent'+i);
                    dataParam['own_id'+i]=viewCModel.get('own_id'+i);
					
                }
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
                app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in loanappstep1 api.');
            },

            });
            dataSource.fetch(function(){
                var data = this.data();
                app.loginService.viewModel.hideloder();
                
                if(data[0]['results']['faultcode'] === 1 || data[0]['results']['faultcode'] === "1")
                {
                    if(dataParam['contact_act'] === "Next")
                    {
                        //  $msg= "Contact Information submitted successfully";
                        //  app.loginService.viewModel.mobileNotification($msg,'info');
                        alert("Loan App CI Next");
                        sessionStorage.setItem("setprefilStatus",'false2');
                        app.loanAppCI.viewModel.manageHiddenField(data[0]['results']['onwerids']);
                        apps.navigate('views/loanAppPI.html');
                    }
                    else
                    {
                        //  $msg= "Contact Information submitted successfully";
                        //  app.loginService.viewModel.mobileNotification($msg,'info');
                        app.loansetting.viewModel.resetLoanAppBIForm();
                        app.loanAppCI.viewModel.resetLoanAppCIForm();
                        apps.navigate('#tabstrip-home');
                    }

                }
                else if(data[0]['results']['faultcode'] === 0 || data[0]['results']['faultcode'] === "0")
                {
                    $msg= "Contact Information not submitted successfully.";
                    app.loginService.viewModel.mobileNotification($msg,'info'); 
                    return;
                }
                else if(data[0]['results']['faultcode'] === 3 || data[0]['results']['faultcode'] === "3")
                {
                    $msg= "Please enter all fields.";
                    app.loginService.viewModel.mobileNotification($msg,'info');
                    return;
                }
                else
                {
                    $msg= "Server not responding properly,Please try again";
                    app.loginService.viewModel.mobileNotification($msg,'info');
                    return;
                } 
            });
       },
        addDynamicOwner:function(num)
        {

            viewCModel['OwnerFirstName'+num] ='';
            viewCModel['OwnerLastName'+num] ='';
            viewCModel['email'+num] ='';
            viewCModel['OwnJobTitle'+num] ='';
            viewCModel['OwnerCivic'+num] ='';
            viewCModel['OwnerStreetAddress'+num] ='';
            viewCModel['own_state'+num] ='';
            viewCModel['own_city'+num] ='';
            viewCModel['OwnZipCode'+num] ='';
            viewCModel['owner_month'+num] ='';
            viewCModel['owner_day'+num] ='';
            viewCModel['owner_year'+num] ='';
            viewCModel['own_percent'+num] ='';
            viewCModel['own_id'+num] ='';
            viewCModel['isCheckScore'+num] ='';
            viewCModel['creditScore'+num] ='';
            viewCModel['reasonlscore'+num] ='';

        },
        addBindDynamicOwner:function(num)
        {
			kendo.bind($("#OwnerFirstName"+num), viewCModel);
            kendo.bind($("#OwnerLastName"+num), viewCModel);
            kendo.bind($("#email"+num), viewCModel);
            kendo.bind($("#OwnJobTitle"+num), viewCModel);
            kendo.bind($("#OwnerCivic"+num), viewCModel);
            kendo.bind($("#OwnerStreetAddress"+num), viewCModel);
            kendo.bind($("#own_state"+num), viewCModel);
            kendo.bind($("#own_city"+num), viewCModel);
            kendo.bind($("#OwnZipCode"+num), viewCModel);
            kendo.bind($("#owner_month"+num), viewCModel);
            kendo.bind($("#owner_day"+num), viewCModel);
            kendo.bind($("#owner_year"+num), viewCModel);
            kendo.bind($("#own_percent"+num), viewCModel);
            kendo.bind($("#own_id"+num), viewCModel);
            kendo.bind($("#isCheckScore"+num), viewCModel);
            kendo.bind($("#creditScore"+num), viewCModel);
            kendo.bind($("#reasonlscore"+num), viewCModel);
            
        },
        deleteOutDebtVar:function(num)
        {
            
            delete viewCModel['OwnerFirstName'+num];
            delete viewCModel['OwnerLastName'+num];
            delete viewCModel['email'+num];
            delete viewCModel['OwnJobTitle'+num];
            delete viewCModel['OwnerCivic'+num];
            delete viewCModel['OwnerStreetAddress'+num];
            delete viewCModel['own_state'+num];
            delete viewCModel['own_city'+num];
            delete viewCModel['OwnZipCode'+num];
            delete viewCModel['owner_month'+num] ;
            delete viewCModel['owner_day'+num];
            delete viewCModel['owner_year'+num];
            delete viewCModel['own_percent'+num];
            delete viewCModel['own_id'+num];
            delete viewCModel['isCheckScore'+num];
            delete viewCModel['creditScore'+num];
            delete viewCModel['reasonlscore'+num];
        },
        manageHiddenField:function(data)
        {
            alert("manageHiddenFields");
            alert(data['0']);
			app.loanAppCI.viewModel.own_id0=data['0'];
           
            $.map( data, function( val, index ) {
                if(index !== 0)
                {
                    alert("own id"+index);
                    console.log("own id"+index);
                    viewCModel['own_id'+index]=val;
                }
            });
          
            
            
        },
        resetLoanAppCIForm:function()
        {           
        	var that = this;
			localStorage.setItem("fid",'');
        	that.set("Owner_FirstName",(localStorage.getItem("userFName") !== '') ?  localStorage.getItem("userFName") : '');
        	that.set("Owner_LastName",(localStorage.getItem("userLName") !== '') ?  localStorage.getItem("userLName") : '');
        	that.set("Owner_email",(localStorage.getItem("userEmail") !== '') ?  localStorage.getItem("userEmail") : '');
        	that.set("Owner_JobTitle","");
        	that.set("Owner_Civic","");
        	that.set("Owner_StreetAddress","");
        	that.set("state_user","");
        	that.set("cmbCity","");
        	that.set("cmbCity","");
        	that.set("OwnZipCode","");
        	that.set("owner_month","");
        	that.set("owner_day","");
        	that.set("owner_year","");
        	that.set("own_percent","");
            that.set("primaryOwner","");
        	that.set("ownercurrntControl",0);
            oindex = that.get("totownerDiv");
            for(oindex; oindex>0 ; oindex--){
                    kendo.unbind($('#adddowner'+oindex));
                	kendo.unbind($('#ownercscore'+oindex));
                    $('#adddowner'+oindex).remove();
                    $('#ownercscore'+oindex).remove();
                }
            kendo.unbind($('#ownercscore0'));
            $('#ownercscore0').remove();
        	that.set("ownerdeleteIds","");
        	that.set("deldbownerids","");
        	that.set("own_id0","");
        	that.set("creditScore0","");
        	that.set("reasonlscore0","");
        	that.set("isCheckScore0","");
            that.set("totownerDiv",oindex);
            $('#own_city').html('<option value="" selected="selected">Select State</option>');
            viewCModel = kendo.observable();
            $('#add-ownerForm').show();
        }
    });
   
    app.loanAppCI = {
        viewModel: new loanCIViewModal()	
    };
})(window);
