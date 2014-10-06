(function (global) {
    var loanAppViewModal,
        app = global.app = global.app || {};

    loanAppViewModal = kendo.data.ObservableObject.extend({
        username: "",
        postApp:0,
        endedApp:0,
        savedApp:0,
        loanApa:0,
        postAppList:[],
        endedAppList:[],
        savedAppList:[],
        loanApaList:[],
        postAppTab:true,
        endedAppTab:false,
        savedAppTab:false,
        loanApaTab:false,
        showrefreshLoan:true,
        
        show:function()
        {

          /*  $("#tabstrip").kendoTabStrip({
                        animation:  {
                            open: {
                                duration:10,
                                effects: "fadeIn"
                            }
                        }
                    });
            */
        
            app.loginService.viewModel.showloder();  
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://sandbox.biz2services.com/mobapp/api/loanapp',
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: { apiaction:"manageapp",cust_id:localStorage.getItem("userID")} // search for tweets that contain "html5"
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
                },
            });
            dataSource.fetch(function(){
                var that = this;
                var data = that.data();
                app.loginService.viewModel.hideloder(); 
                if(data[0]['results']['faultcode']===1 && data[0]['results']['faultmsg']==='success')
                {
                     app.loanApp.viewModel.setManageStatus(data[0]['results']['results']);
                }    

            });
            app.loanApp.viewModel.postAppClick();
       },
        applyFreshLoan:function(e)
        {
            app.loginService.viewModel.application(e);  
        },
        setManageStatus:function(data)
        {
            var that = this;
            $.each(data, function( index, value ) {
            	
                if(value['apptype']==='posted')
                {
                    that.set('postApp',value['appcount']);
                    that.set('postAppList',value['appdetails']);
                    
                }
                if(value['apptype']==='saved')
                {
                  that.set('savedApp',value['appcount']);
                  that.set('savedAppList',value['appdetails']);
                }
                if(value['apptype']==='ended')
                {
                    that.set('endedApp',value['appcount']);
                    that.set('endedAppList',value['appdetails']);
                }
                if(value['apptype']==='loanApa')
                {
                    that.set('loanApa',value['appcount']);
                    that.set('loanApaList',value['appdetails']);
                    
                }
        	});   
          
        },
        postAppClick:function(e)
        {
            var that=this;
            $('#tabstrip ul li').removeClass('k-state-active');
            $('#tabstrip ul li.postd_icn').addClass('k-state-active');
            that.set('postAppTab',true);
            that.set('endedAppTab',false);
            that.set('savedAppTab',false);
            that.set('loanApaTab',false);
        },
        endedAppClick:function(e)
        {
            var that=this;
            $('#tabstrip ul li').removeClass('k-state-active');
            $('#tabstrip ul li.end_icon').addClass('k-state-active');
            that.set('postAppTab',false);
            that.set('endedAppTab',true);
            that.set('savedAppTab',false);
            that.set('loanApaTab',false);
        },
        savedAppClick:function(e)
        {
            var that=this;
            $('#tabstrip ul li').removeClass('k-state-active');
            $('#tabstrip ul li.sevd_icon').addClass('k-state-active');
            that.set('postAppTab',false);
            that.set('endedAppTab',false);
            that.set('savedAppTab',true);
            that.set('loanApaTab',false);
        },
        loanApaClick:function(e)
        {
            var that=this;
            $('#tabstrip ul li').removeClass('k-state-active');
            $('#tabstrip ul li.lon_icon').addClass('k-state-active');
            that.set('postAppTab',false);
            that.set('endedAppTab',false);
            that.set('savedAppTab',false);
            that.set('loanApaTab',true);
        },
        refreshViewLoan:function()
        {
            app.loanApp.viewModel.setShowrefreshLoanFalse();
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://sandbox.biz2services.com/mobapp/api/loanapp',
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: { apiaction:"manageapp",cust_id:localStorage.getItem("userID")} // search for tweets that contain "html5"
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
                },
            });
            dataSource.fetch(function(){
                var that = this;
                var data = that.data(); 
                if(data[0]['results']['faultcode']===1 && data[0]['results']['faultmsg']==='success')
                {
                     app.loanApp.viewModel.setManageStatus(data[0]['results']['results']);
                     app.loanApp.viewModel.setShowrefreshLoanTrue();
                }    

            });
        },
        setShowrefreshLoanFalse:function()
        {
            var that = this;
            that.set("showrefreshLoan",false);
        },
        setShowrefreshLoanTrue:function()
        {
            var that = this;
            that.set("showrefreshLoan",true);
        }

        
    });
   
    app.loanApp = {
        viewModel: new loanAppViewModal()	
    };
})(window);
