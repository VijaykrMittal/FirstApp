(function(global){
    var DocumentPendingModel,
        app = global.app = global.app || {};
    
    DocumentPendingModel = kendo.data.ObservableObject.extend({
        show:function(e)
        { 
            var appid = sessionStorage.getItem("matchesPageFid");
            matchid = sessionStorage.getItem("IteriaMatchid");

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
                            data: { apiaction:'reqdocuments',matchid:matchid,cust_id:localStorage.getItem("userID"),appid:appid}
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
                    var data = that.view(); 
                    apps.hideLoading();
                    if(data[0]['results']['faultcode']===1 && data[0]['results']['faultmsg']==='success')
                    {
                         app.documentService.viewModel.loadRequirementDocs(data['0']['results']['ReqDocs'],data['0']['results']['DnldUrl']);
                         
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
        loadRequirementDocs:function(data,DnldUrl)
        {
            html = '';
            $("#requireDocsList").html(html);
            for (var i = 0; i < data.length; i++) { 
                html+= '<div class="row clearfix" ><div class="num"><span>'+(i+1)+'</span></div>';
                html+= '<div class="name requiredocs-name">';
                if(data[i].DocFileDetails===false) { 
                    html+=  data[i].docName;
                }else{
                    html+= '<a id="dispalyFiles">'+data[i].docName+'</a><span>('+data[i].DocFileDetails.length+')</span>';
                }           
                if(data[i].b2cdocid === "148" || data[i].b2cdocid === 148) {
                    html+=        '<div class="text1"><span class="text2"><a href="javascript:void(0);" id="esignAnchor" onclick="sendEmailToUsr()">Resend esign document</a></span></div><div><span class="docuploaded"><a data-downurl="'+data[i].wetsignpdf+'" data-bind="click:downloadWetSignatureFile" data-role="button">Download document for wet signature</a></span></div>';
                }
                html+= '</div>';
                html+= '<div class="upload"><a data-bind="click:UploadExisting" class="active appDocFile">Upload New/Select Existing</a></div>';
                html+='</div>';
                html+= '<div class="filesBlock">';
                if(data[i].DocFileDetails !==false) { 
                    fileData =data[i].DocFileDetails;
                    
                    for (var j = 0; j < fileData.length; j++) {
                        html+='<div class="sub-row clearfix">'; 
                        html+='<div class="file-iconjpg"></div><div class="file-name">'+fileData[j].name+'</div><div class="buttonSet"><a data-fid="'+fileData[j].file_id+'" data-downurl="'+DnldUrl+fileData[j].encyptedID+'" data-filename="'+fileData[j].name+'" data-bind="click:downloadAttachFile" class="downloadBtn" data-role="button">Download</a>&nbsp;&nbsp;<a title="Delete" data-bind="click:deleteDownloadAttachFileConfirm" data-id="'+fileData[j].id+'" data-docsid="'+fileData[j].file_id+'" data-role="button" class="DeleteIC">Delete</a></div>';
                        html+='</div>';
                    }
                   
                }
                html+='</div>';
            }
            $("#requireDocsList").html(html);
            kendo.bind($("#requireDocsList"), app.documentService.viewModel);
            
             $(".requiredocs-name").on("click.myPlugin", function() {
                 $(this).parent().next().slideToggle();	
            });
            
        },
        downloadAttachFile:function(e)
        {
            var params = e.sender.element.context.dataset;
            sessionStorage.currentFileId = params.fid;
            sessionStorage.downloadLink = params.downurl;
            sessionStorage.currentFileName = params.filename;
            fileName = $.trim(params.filename);
            folderName = "biz2docs";
            app.documentsetting.viewModel.downloadFile(fileName,folderName);
        },
        deleteDownloadAttachFileConfirm:function(e)
        {
            var params = e.sender.element.context.dataset;
            var mapid=params.id;
            var fileid=params.docsid;
 
            navigator.notification.confirm('Are you sure you wish to delete this file?', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentService.viewModel.deleteDownloadAttachFile(mapid,fileid);
            		}

            	}, 'Notification', 'OK');
        },
        deleteDownloadAttachFile:function(mapid,fileid)
        {
            app.loginService.viewModel.showloder();  
           
            var dataSource = new kendo.data.DataSource({
                    transport: {
                        
                        read: {
                            url: localStorage.getItem("urlMobAppApiLoan"),
                            type:"POST",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                           data: { apiaction:'deletedocument',mapid:mapid,cust_id:localStorage.getItem("userID"),fileid:fileid}
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
                    var data = that.view(); 
                    apps.hideLoading();
                    if(data[0]['results']['faultcode']===1 && $.trim(data[0]['results']['faultmsg'])==='success')
                    {
                        app.documentService.viewModel.show();
                         
                    }
                });
        },
        downloadWetSignatureFile:function(e)
        { 
            var params = e.sender.element.context.dataset;
            sessionStorage.downloadLink = params.downurl;
            sessionStorage.currentFileName = 'Credit_Review_Acknowledgement_'+sessionStorage.getItem("matchesPageFid")+'_'+sessionStorage.getItem("IteriaMatchid")+'.pdf';
            fileName = $.trim(sessionStorage.currentFileName);
            folderName = "biz2docs";
            app.documentsetting.viewModel.downloadFile(fileName,folderName);
        }
        
    });
    app.documentService ={
        viewModel:new DocumentPendingModel()
    };
})(window);