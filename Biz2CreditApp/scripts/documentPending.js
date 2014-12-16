(function(global){
    var DocumentPendingModel,
        app = global.app = global.app || {};
    
    DocumentPendingModel = kendo.data.ObservableObject.extend({
        userName:(localStorage.getItem("userFName") !== '') ?  localStorage.getItem("userFName") : '',
        uploadFileName:'',
        iosDeviceAction:true,
        show:function(e)
        { 
            var appid = sessionStorage.getItem("matchesPageFid");
            matchid = sessionStorage.getItem("IteriaMatchid");

            /*Upload Document Toggle*/
            $(".km-scroll-container").css("-webkit-transform", "");
            $(".documentList .wrap-content h2").unbind('.myPlugin');
            $(".requiredocs-name").unbind(".myPlugin");
            pb = $("#profileCompleteness").kendoProgressBar({
                type: "chunk",
                chunkCount: 100,
                min: 0,
                max: 100,
                value: 0
            }).data("kendoProgressBar");
            
            app.loginService.viewModel.showloder();
            var dataSource = new kendo.data.DataSource({
                    transport: {
                        
                        read: {
                            url: localStorage.getItem("urlMobAppApiLoan"),
                            type:"POST",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            data: { apiaction:'reqdocuments',matchid:matchid,cust_id:localStorage.getItem("userID"),appid:appid}
                           //data: { apiaction:'reqdocuments',matchid:82795,cust_id:localStorage.getItem("userID"),appid:70386}
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
                        app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in reqdocuments api.');
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
                    else
                    {
                        $msg= "Something is wrong.Please try again.";
                        app.loginService.viewModel.mobileNotification($msg,'info');
                        apps.navigate("#:back");
                    }
                });
           
            
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
                        app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in getmatchlists(documentpending page) api.');
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
                  //  html+=  data[i].docName;
                    html+= '<a id="dispalyFiles" class="'+data[i].id+'">'+data[i].docName+'</a>';
                }else{
                    html+= '<a id="dispalyFiles" class="'+data[i].id+'">'+data[i].docName+'<span>('+data[i].DocFileDetails.length+')</span></a>';
                }           
               
                html+= '</div>';
                 
                html+='</div>';
                if(data[i].b2cdocid === "148" || data[i].b2cdocid === 148) {
                   // html+= '<div class="text1"><span class="text2"><a class="esignAnchor" data-bind="click:sendEsignDocs,visible:sendEsignDocsStatus">Send esign document</a><a  class="esignAnchor" data-bind="click:resSendEsignDocs,invisible:sendEsignDocsStatus">Resend esign document</a></span></div>';
                    html+= '<div class="text1"><span class="docuploaded"><a data-downurl="'+data[i].wetsignpdf+'" data-bind="click:downloadWetSignatureFile" data-role="button">Download document for wet signature</a></span></div>';
                }
                html+= '<div class="filesBlock" id="'+data[i].id+'">';
                if(data[i].DocFileDetails !==false) { 
                    fileData =data[i].DocFileDetails;
                    
                    for (var j = 0; j < fileData.length; j++) {
                        html+='<div class="sub-row clearfix">'; 
                        html+='<div class="file-iconjpg"></div><div class="file-name">'+fileData[j].name+'</div><div class="buttonSet"><a data-fid="'+fileData[j].file_id+'" data-downurl="'+DnldUrl+fileData[j].encyptedID+'" data-filename="'+fileData[j].name+'" data-bind="click:downloadAttachFile" class="downloadBtn" data-role="button">Download</a>&nbsp;&nbsp;<a title="Delete" data-bind="click:deleteDownloadAttachFileConfirm" data-id="'+fileData[j].id+'" data-docsid="'+fileData[j].file_id+'" data-role="button" class="DeleteIC">&nbsp;</a></div>';
                        html+='</div>';
                    }
                   
                }
                                html+= '<div class="upload"> <a data-role="button"  data-docsid="'+data[i].b2cdocid+'" data-docstype="'+data[i].b2cdocflag+'" data-bind="click:setuploadParams" class="active appDocFile">Upload New Documents</a></div>';
                html+='</div>';

                
            }
            $("#requireDocsList").html(html);
            kendo.bind($("#requireDocsList"), app.documentService.viewModel);
            if(data[0].b2cdocid === "148" || data[0].b2cdocid === 148) {
                
                //app.documentService.viewModel.setSendEsignDocsStatus(data);//default esign set status
                
            }

             $(".requiredocs-name a").on("click.myPlugin", function() {
                var id=  $(this).attr('class');
                $('#'+id).slideToggle();
                $(this).parents('.row').toggleClass("off");
                 
            });
            
            app.documentService.viewModel.setDeviceAction();
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

            	}, 'Notification', 'Yes,No');
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
                        app.analyticsService.viewModel.trackException(e,'Api Call.Unable to get response in deletedocument api.');
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
                    else
                    {
                        $msg= "File was not deleted successfully.";
                        app.loginService.viewModel.mobileNotification($msg,'info'); 
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
        },
        getImage:function() {
            
            navigator.camera.getPicture(app.documentService.viewModel.uploadPhoto, function(message) {
                    alert('get picture failed');
                    },{
                    quality: 50, 
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                }
            );
            
 
        },
        getOtherFiles:function()
        {
            apps.navigate('views/internalFileUpload.html');
        },
        uploadPhoto:function(imageURI) {
            
            try {
  
                    pb.value(0);

                    if (imageURI.substring(0, 21)==="content://com.android") {
                        photo_split = imageURI.split("%3A");
                        imageURI = "content://media/external/images/media/" + photo_split[1];
                    }

                    var docsid = sessionStorage.getItem("docsid");
                    var docstype = sessionStorage.getItem("docstype");
                    var appid = sessionStorage.getItem("matchesPageFid");
                    var matchid = sessionStorage.getItem("IteriaMatchid");
                    var custid = localStorage.getItem("userID");
                    var options = new FileUploadOptions();

                    options.fileKey="file";
                    var fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                    if(fileName.indexOf('.') === -1)
                    {
                      fileName =fileName+'.jpg';
                    }
                    options.fileName =fileName;
                    app.documentService.viewModel.setUploadFileName(options.fileName);
                    options.mimeType="image/jpeg";
                    var params = new Object();
                    params.apiaction="uploaddocuments";
                    params.docid = docsid;
                    params.doctype = docstype;
                    params.appid = appid;
                    params.matchid = matchid;
                    params.custid = custid;
                    params.filekey = 0;
                    params.format = "json";
                    
                    options.params = params;
                    options.chunkedMode = false;
                    options.headers = {
                        Connection: "close"
                    };
                    
                    $("#tabstrip-upload-file").data("kendoMobileModalView").open();
                    statusDom = document.querySelector('#status');
                    ftUpload = new FileTransfer();
                    ftUpload.onprogress = function(progressEvent) {
                    	if (progressEvent.lengthComputable) {
                    		var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    		pb.value(perc);
                            
                    	}else{
                    	    pb.value('');
                            
                    	}
                    };
                   ftUpload.upload(imageURI, 'http://sandbox.biz2services.com/mobapp/api/loanapp', app.documentService.viewModel.winUpload, app.documentService.viewModel.failUpload, options , true);
            } catch (e) {
                
                    console.log("Error in File uploading:="+e);
                    app.analyticsService.viewModel.trackException(e,'FileUpload.Error in file uploading');
            }
            
            
            
            
        },
 
        winUpload:function(r) {
            
            $("#tabstrip-upload-file").data("kendoMobileModalView").close();
            //pb.value(0);
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            apps.navigate("views/documentPending.html");
           // alert(r.response);
        },
 
        failUpload:function(error) {
            app.documentService.viewModel.transferFileAbort();
            alert("An error has occurred: Code = "+error.code);
        },
        transferFileAbort:function()
        {
           ftUpload.abort(); 
           $("#tabstrip-upload-file").data("kendoMobileModalView").close();
          // pb.value(0);
        },
        setUploadFileName:function(uplpadFileName)
        {
            var that =this;
            that.set("uploadFileName",uplpadFileName);
        },
        setuploadParams:function(e)
        {
            var docsid = e.sender.element.context.dataset.docsid;
            var docstype = e.sender.element.context.dataset.docstype;
            sessionStorage.setItem("docsid",docsid);
            sessionStorage.setItem("docstype",docstype);
            $("#inboxActions").data("kendoMobileActionSheet").open(e.event.currentTarget);
        },
        setDeviceAction:function()
        {
            that =this;
            if(device.platform=== 'iOS')
            {
               that.set("iosDeviceAction",false);
            }
            else
            {
                that.set("iosDeviceAction",true); 
            }
            kendo.bind($("#inboxActions"), app.documentService.viewModel);
        }
      
       

        
    });
    app.documentService ={
        viewModel:new DocumentPendingModel()
    };
})(window);