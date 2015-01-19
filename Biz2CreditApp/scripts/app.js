(function (global) {
        app = global.app = global.app || {};
    
        // Handle device back button tap
        var onBackKeyDown = function(e) {
        if(apps.view()['element']['0']['id']==='tabstrip-login'|| apps.view()['element']['0']['id']==='tabstrip-home'){
            e.preventDefault();
            navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            if (confirmed === true || confirmed === 1) {
                app.analyticsService.viewModel.monitorStop("User exit by Device Backbutton");
            	navigator.app.exitApp();
            }

            }, 'Biz2Credit', 'Yes,No');
        }
        else if(apps.view()['element']['0']['id']==='tabstrip-docs' && app.documentsetting.viewModel.showfilter === true)
        {
        	app.documentsetting.viewModel.set("showfilter", false);
        }
        else if(apps.view()['element']['0']['id']==='tabstrip-loanapp-bi'|| apps.view()['element']['0']['id']==='tabstrip-loanapp-ci'|| apps.view()['element']['0']['id']==='tabstrip-loanapp-pi'|| apps.view()['element']['0']['id']==='tabstrip-loanapp-fp'|| apps.view()['element']['0']['id']==='tabstrip-matches' || apps.view()['element']['0']['id']==='tabstrip-docs' || apps.view()['element']['0']['id']==='tabstrip-movedocs' || apps.view()['element']['0']['id']==='tabstrip-file-export' || apps.view()['element']['0']['id']==='document-pending')
        {
        	e.preventDefault();
        }
        else if(apps.view()['element']['0']['id']==='tabstrip-sign-up' || apps.view()['element']['0']['id']==='tabstrip-forgot-pass')
        {
        	apps.navigate("#tabstrip-login");
        }
        else
        { 
            $("#tabstrip-mess-fourth").data("kendoMobileModalView").close();
            $("#tabstrip-mess-dynamic").data("kendoMobileModalView").close();
            $("#tabstrip-mess-third").data("kendoMobileModalView").close();
            $("#tabstrip-mess-two").data("kendoMobileModalView").close();
            $("#tabstrip-mess-one").data("kendoMobileModalView").close();
            apps.navigate("#:back");
            
        }
    };
    
    
    var Keyboardisoff = function() {
      $("#tabstrip-sign-up").find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px)");
        
    };

    var onDeviceReady = function(e) {
        feedback.initialize('20b40210-8a67-11e4-aa3f-45a9d1e73d19');
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString('#99cc00');
        document.addEventListener('backbutton', onBackKeyDown, false);
        document.addEventListener("hidekeyboard", Keyboardisoff, false);
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        window.connectionInfo = new ConnectionApp();
		window.connectionInfo.checkConnection();
       
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(oncallback);
        }
        else
        {
            app.analyticsService.viewModel.setAnalyticMonitor();
        }
        navigator.splashscreen.hide();
    };
    
    var oncallback = function(position)
    {
        var latitude = position.coords.latitude,
            longitude = position.coords.longitude;
        app.analyticsService.viewModel.setAnalyticMonitor(latitude,longitude);
    };
   
    var onPause = function(e){
        app.analyticsService.viewModel.trackFeature("Detect Status.App is running in background");
        app.analyticsService.viewModel.monitorStop();
    };
    
    var onResume = function(){ 
        app.analyticsService.viewModel.monitorStart();
        app.analyticsService.viewModel.trackFeature("Detect Status.App is running in foreground");
        var loginStatus = localStorage.getItem("isLoggedIn");

        if(loginStatus === 'true' || loginStatus === true)
        {
            app.analyticsService.viewModel.setInstallationInfo(localStorage.getItem("userEmail"));
        }
        else
        {
            app.analyticsService.viewModel.setInstallationInfo("Anonymous User");
        }
       
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);
    function ConnectionApp() {
	}
 
    ConnectionApp.prototype = { 	
    	checkConnection: function() {
    			if(typeof navigator.connection.type !== "undefined")
                {
                    var networkState = navigator.connection.type;
                    var states = {};
                    states[Connection.UNKNOWN] = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI] = 'WiFi connection';
                    states[Connection.CELL_2G] = 'Cell 2G connection';
                    states[Connection.CELL_3G] = 'Cell 3G connection';
                    states[Connection.CELL_4G] = 'Cell 4G connection';
                    states[Connection.CELL] = 'Cell generic connection';
                    states[Connection.NONE] = 'No network connection';
                    if (states[networkState] === 'No network connection') {
                        return false;
                    }
                }
                
                return true;
    	},
        
    }
    
    
    /*Telerik Analytics*/
   
    
    if(localStorage.getItem("isLoggedIn") === 'true')
    {        
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-home",skin: "flat"}); 
    }
    else
    {
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-login",skin: "flat"});
    }
   /* 
    localStorage.setItem("urlMobAppApiFolder","https://www.biz2services.com/mobapp/api/folder/");
    localStorage.setItem("urlMobAppApiFile","https://www.biz2services.com/mobapp/api/file/");
    localStorage.setItem("urlMobAppApiUser","https://www.biz2services.com/mobapp/api/user/");
    localStorage.setItem("urlMobAppApiLoan","https://www.biz2services.com/mobapp/api/loanapp/");
    // anatytic change in live mode
    // change itia is 340
   */
    
    localStorage.setItem("urlMobAppApiFolder","http://sandbox.biz2services.com/mobapp/api/folder/");
    localStorage.setItem("urlMobAppApiFile","http://sandbox.biz2services.com/mobapp/api/file/");
    localStorage.setItem("urlMobAppApiUser","http://sandbox.biz2services.com/mobapp/api/user/");
    localStorage.setItem("urlMobAppApiLoan","http://sandbox.biz2services.com/mobapp/api/loanapp/");
   
    
})(window);