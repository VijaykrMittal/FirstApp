(function(global){
    var IteriaModel,
        app = global.app = global.app || {};
    
    IteriaModel = kendo.data.ObservableObject.extend({
        custid:localStorage.getItem("userID"),
        appid:'',
        matchID:'',
        hnowners:'',
        loanpro_auth:1,
        authorization:1,
        show:function(e)
        {
            if(typeof viewIModel === 'undefined')
            {
                viewIModel = kendo.observable();
            }
            $("input[type=checkbox]" ).attr( "checked",false);
            var appid = sessionStorage.getItem("matchesPageFid");
            matchid = sessionStorage.getItem("IteriaMatchid");
            app.loginService.viewModel.showloder();
            var dataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:localStorage.getItem("urlMobAppApiLoan"),
                        type:"POST",
                        dataType: "json",
                        data:{apiaction:"getownersbyappid",appid:appid}
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
                	function () {apps.navigate("#:back");}, "Notification", 'OK');
                    app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in getownersbyappid api.');
                },
            });
            dataSource.fetch(function(){
                
                Data = this.data();
                app.loginService.viewModel.hideloder();
                var data = Data[0]['results']["ownerList"];
                if(Data[0]['results']['faultcode'] === 1 || Data[0]['results']['faultcode'] === '1')
                {
                    
                    var ownerDiv = Data[0]['results']["ownerList"]['length'];
                    html = '';
                    $('#controlField').html('');
                    
                    totaldivs = ownerDiv;
                    
                    for(c=1;c<=totaldivs;c++){
                        
                        app.iteriaService.viewModel.addDynamicBind(c);
                        html='<div class="field">'
                        html+='<div class="own_name">Please enter <span class="caps">'+Data[0]['results']["ownerList"][c-1]['own_fname']+'<span>\'s social security number</div>';
                        html+='<input type="text" id="own_ssno'+c+'" name="own_ssno'+c+'"  class="IN3" data-bind="value:own_ssno'+c+'"  title="Enter your Social Security Number"  maxlength="9"/>';
                        html+='<input type="hidden" id="own_percent'+c+'" name="own_percent'+c+'" data-bind="value:own_percent'+c+'" value="" />';
                        html+='<input type="hidden" id="hown_ssno'+c+'" name="hown_ssno'+c+'" data-bind="value:hown_ssno'+c+'" value="" />';
                        html+='<input type="hidden" id="hown_ssnoedit'+c+'" name="hown_ssnoedit'+c+'" data-bind="value:hown_ssnoedit'+c+'"/>';
                        if(c === totaldivs)
                        {
                            html+='<a class="que_hint">&nbsp;</a>';
                            html+='</div>';
                            html+='<div class="tooltip" > <span class="tpar"></span>';
                            html+='<div><h6>Why do I need to enter my Social Security Number (SSN)?</h6>';
                            html+='<p>Virtually all lenders need a SSN in order to process a loan application. They will use it to obtain a credit report on your business and verify certain information to avoid complications such as fraud. &nbsp;Once verified, the lender will then be able to generate loan offers with exact terms for you to review. &nbsp;Not only is this a necessary step, but it will also allow them to give you the best rates possible. &nbsp;</p>';
                            html+='<p style="color:#8CBB01;"><b>Note</b>: As part of our privacy policy, Biz2Credit does not store your SSN.  Feel free to reach out to a loan specialist if you have any questions.</p>';
                            html+='</div></div>';
                        }
                        else
                        {
                            html+='</div>';
                        }
                       
                        $('#controlField').append(html);
                         /*Tooltip*/
                        $(".que_hint").kendoTooltip({
                            autoHide: false,
                            width: 300,
                            showOn: "click",
                            callout: false,
                            content: function(e) {
                                console.log(e);
                                return e.target.context.parentNode.nextElementSibling.innerHTML;
                            }
                        });
                        app.iteriaService.viewModel.addBindDynamicIteria(c);
                        
                    }
                    app.iteriaService.viewModel.setOwnerData(data,matchid);
                }
                else
                {
                    $msg= "Something is wrong.Please try again.";
                    app.loginService.viewModel.mobileNotification($msg,'info');
                    apps.navigate("#:back");
                }
            });
            
            $(".reld_info").kendoTooltip({
                autoHide: false,
                width: 300,
                showOn: "click",
                callout: false,
                position: "top",
                content: function(e) {
                    return e.target.context.parentNode.nextElementSibling.innerHTML;
                }
            });
        },
        
        setOwnerData:function(data,matchid)
        {
            dataParam={};
            var that = this;
            var totaldivs = Data[0]['results']["ownerList"]['length'];
            for(i=0;i<totaldivs;i++)
            {
                viewIModel.set('hown_ssno'+(i+1),data[i]['own_ssno']);
                var str = $.trim(data[i]['own_ssno']);
                var res = str.substring(6);
                viewIModel.set('hown_ssnoedit'+(i+1),'******'+res);
                viewIModel.set('own_percent'+(i+1),data[i]['own_percent']);
            }
            that.set("appid",data[0]['caseid']);
            that.set("hnowners",data.length);
            that.set("matchID",matchid);
            //that.set("custid",data.length);
        },
        
        validationssn:function()
        {
            var nowners =  document.getElementById("hnowners").value; 
            if(!app.iteriaService.viewModel.getssn(nowners))
            {                        
                return false;
            }
            else if(!$("#authorization").is(':checked')) 
            {
                navigator.notification.alert("Please accept the agreement.",
                function () { }, "Notification", 'OK');
                $('#authorization').focus();
                return false;
            }
            else if(!$("#loanpro_auth").is(':checked')) 
            {
                navigator.notification.alert("Please accept the loan process agreement.",
                function () { }, "Notification", 'OK');
                $('#loanpro_auth').focus();
                return false;
            }	

        },
        getssn:function(nowners)
        {
            var vflag = 1;
            
            for(var c =1; c<=nowners; c++)
            {
                var varown_ssno = document.getElementById("own_ssno"+c).value;
                var varown_ssnoedit = document.getElementById("hown_ssnoedit"+c).value;
                var varown_percent = parseInt(document.getElementById("own_percent"+c).value);
                if($.trim(varown_ssno)==="" && c===1 ) 
                {
                    navigator.notification.alert("Please enter owner social security number.",
                    function () { }, "Notification", 'OK');
                    document.getElementById("own_ssno"+c).focus();
                    vflag = 0;
                    break;
                }           
                else if((varown_ssno.length!==9 && c===1)) 
                {
                    navigator.notification.alert("Please enter 9-digit owner social security number.",
                    function () { }, "Notification", 'OK');
                    document.getElementById("own_ssno"+c).focus();
                    vflag = 0;
                    break;
                }
                else if(varown_ssno !== varown_ssnoedit &&  !$.isNumeric(varown_ssno) && c === 1) 
                {	  
                    navigator.notification.alert("Please enter only numbers in owner social security number field.",
                    function () { }, "Notification", 'OK');
                    document.getElementById("own_ssno"+c).focus();
                    vflag = 0;
                    break;
                }            
                else if(c !== 1 &&  varown_ssno.trim()==="" && varown_percent > 20 ) 
                {

                    navigator.notification.alert("Please enter owner social security number.",
                    function () { }, "Notification", 'OK');
                    document.getElementById("own_ssno"+c).focus();
                    vflag = 0;
                    break;
                }  
                else if(c!==1 && varown_ssno.length!==9 && varown_ssno.trim()!=="" ) 
                {	  
                    navigator.notification.alert("Please enter 9-digit owner social security number.",
                    function () { }, "Notification", 'OK');
                    document.getElementById("own_ssno"+c).focus();
                    vflag = 0;
                    break;
                }  
                else if(varown_ssno !== varown_ssnoedit && (!$.isNumeric(varown_ssno) && c!==1 && varown_ssno.trim()!=="")) 
                {	  
                    navigator.notification.alert("Please enter only numbers in owner social security number field.",
                    function () { }, "Notification", 'OK');
                    document.getElementById("own_ssno"+c).focus();
                    vflag = 0;
                    break;
                }  
            }  

            if(vflag === 1) 
            {
                return true;
            } 
            else 
            {
                return false;
            }

        },
        submitSSNValue:function()
        {
            
            var status = app.iteriaService.viewModel.validationssn();
            if(status === false)
            return status;
            
            dataParam={};
            var that = this;
            dataParam['apiaction'] = 'saveadditionalinfo';
            dataParam['custid'] = localStorage.getItem("userID");
            dataParam['appid'] = that.get("appid");
            dataParam['matchID'] = that.get("matchID");
            dataParam['hnowners'] = that.get("hnowners");
            for(i=1;i<=totaldivs;i++)
            {
                dataParam['own_ssno'+i]=viewIModel.get('own_ssno'+i);
                dataParam['own_percent'+i]=viewIModel.get('own_percent'+i);
                dataParam['hown_ssno'+i]=viewIModel.get('hown_ssno'+i);
                dataParam['hown_ssnoedit'+i]=viewIModel.get('hown_ssnoedit'+i);
            }
                  
            if(!window.connectionInfo.checkConnection()){
                    navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.iteriaService.viewModel.submitSSNValue();
                	}

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else{
                
                apps.showLoading();
                var dataSource = new kendo.data.DataSource({
                transport: {
                read: {
                        url: localStorage.getItem("urlMobAppApiLoan"),
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: dataParam // search for tweets that contain "html5"
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
                     app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in saveadditionalinfo api.');
                },

                });
                dataSource.fetch(function(){
                    
                	var data = this.data();
                    apps.hideLoading();
                	if(data[0]['results']['faultcode'] === 1)
                    {
                         //console.log(data);
                    	 app.iteriaService.viewModel.appToNavigate();
                    }
                    else
                    {
                        $msg= "Something is wrong.Please try again.";
                        app.loginService.viewModel.mobileNotification($msg,'info');
                        return false;
                    }
                });  
            }
            
            //app.iteriaService.viewModel.appToNavigate();
        },
        appToNavigate:function()
        {
            apps.navigate("views/documentPending.html");
        },
        addDynamicBind:function(num)
        {

            viewIModel['own_ssno'+num] ='';
            viewIModel['own_percent'+num] ='';
            viewIModel['hown_ssno'+num] ='';
            viewIModel['hown_ssnoedit'+num] ='';
        },
        addBindDynamicIteria:function(num)
        {
			kendo.bind($("#own_ssno"+num), viewIModel);
            kendo.bind($("#own_percent"+num), viewIModel);
            kendo.bind($("#hown_ssno"+num), viewIModel);
            kendo.bind($("#hown_ssnoedit"+num), viewIModel);
            
        },
    });
    app.iteriaService = {
        viewModel:new IteriaModel()
    };
})(window);