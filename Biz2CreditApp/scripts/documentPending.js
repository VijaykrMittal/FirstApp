(function(global){
    var DocumentPendingModel,
        app = global.app = global.app || {};
    
    DocumentPendingModel = kendo.data.ObservableObject.extend({
        show:function(e)
        {
            var appid = e.view.params.appid;
            matchid = e.view.params.matchid;

            /*Upload Document Toggle*/
            $(".documentList .wrap-content h2").unbind('.myPlugin');
            $(".documentList .wrap-content .row .name a").unbind(".myPlugin");
            
            $(".documentList .wrap-content h2").on("click.myPlugin", function() {                                    
                $(this).next(".rows").slideToggle();
                $(this).toggleClass("off");
            });

            $(".documentList .wrap-content .row .name a").on("click.myPlugin", function() {
                $(this).parents('.row').next(".filesBlock").slideToggle();	
            });
            
            
            var dataSource = new kendo.data.DataSource({
                    transport: {
                        
                        read: {
                            url: localStorage.getItem("urlMobAppApiLoan"),
                            type:"POST",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            data: { apiaction:'reqdocuments',matchid:82945,cust_id:94351,appid:70397} // search for tweets that contain "html5"
                        }
                        
                    },
                    schema: {
                        data: function(data)
                        {
                            console.log(data);
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
                    var data = that.view(); 
                    console.log(data);
                    apps.hideLoading();
                    if(data[0]['results']['faultcode']===1 && data[0]['results']['faultmsg']==='success')
                    {
                         app.documentService.viewModel.loadRequirementDocs(data['0']['results']['ReqDocs']);
                         
                    }
                });
            
            
        },
        UploadExisting:function()
        {
            apps.navigate("views/document_attach.html");
        },
        gobackMatchesPage:function()
        {
                var fid = sessionStorage.getItem("matchesPageFid");
                app.loginService.viewModel.showloder();  
                var dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: localStorage.getItem("urlMobAppApiLoan"),
                            type:"POST",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            data: { apiaction:"getmatchlists",cust_id:localStorage.getItem("userID"),fid:fid} // search for tweets that contain "html5"
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
                    apps.hideLoading();
                    if(data[0]['results']['faultcode']===1 && data[0]['results']['faultmsg']==='success')
                    {
                         app.homesetting.viewModel.setMatches(data['0']['results']['matchrows']);
                         apps.navigate("#views/matches.html");
                    }
                });
        },
        loadRequirementDocs:function(data)
        {
            var template = kendo.template($("#requiredocs-template").html());
            console.log(data);
            console.log(template);
           
            var result = template(data); //Execute the template
             console.log(result);
             $("#requireDocsList").html(result);
           // kendo.bind($("#requireDocsList"), app.documentService.viewModel);
            
        }
        
    });
    app.documentService ={
        viewModel:new DocumentPendingModel()
    };
})(window);