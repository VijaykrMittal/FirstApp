(function(global){
    var documentAttachModel,
        app = global.app = global.app || {};
    
    documentAttachModel = kendo.data.ObservableObject.extend({
        innerdocsAttachPage:false,
        showrefreshLoading:false,
        show:function()
        {
            if(typeof docsBackAttachHistory === 'undefined')
            {
                docsBackAttachHistory=[0];
            }
           
            app.documentAttach.viewModel.getDoumentsList();
        },
        getDoumentsList:function()
        {
            var that = this;
            
            if(docsBackAttachHistory[docsBackAttachHistory.length-1] === 0)
            {
                parentId=0;   
                that.set('innerdocsAttachPage',false);
            }
            else
            { 
                parentId=docsBackAttachHistory[docsBackAttachHistory.length-1];  
                that.set('innerdocsAttachPage',true);
            }
            
            app.loginService.viewModel.showloder();
            $("#document-attach").find(".km-scroll-container").css("-webkit-transform", "translate3d(0px, 0px, 0px)");
            var dataSource = new kendo.data.DataSource({         
            transport: {
            read: {
                url: localStorage.getItem("urlMobAppApiFolder"),
                type:"POST",
                dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:parentId} // search for tweets that contain "html5"
            }
            },
            schema: {
            data: function(data)
            {   var docsArray = [];
                if(data['results']['faultcode']===1)
                {
                    $.each( data['results']['DocLists'], function( i, val ) {

                        if(data['results']['DocLists'][i]['name']==='Shared Files'){
                             sharedFiles =val;
                        }
                        else if(data['results']['DocLists'][i]['name']==='Shared Folders' ){
                             sharedFolders =val;
                        }
                        else{
                            docsArray.push(val);
                        } 
            		});
                }
            	return [docsArray];
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
                app.documentAttach.viewModel.existingDocumentList(data);
            });
        },
        refreshView:function()
        {
            var that = this;
            that.set("showrefreshLoading", true);
            app.documentAttach.viewModel.getDoumentsList();
        },
        existingDocumentList:function(docsData)
        {
            var that = this;
            that.set("showrefreshLoading", false);
            var template = kendo.template($("#documentList-template").html());
            var data = docsData;
            var result = template(data); //Execute the template
            if(data[0].length===0){
                result +='<tr><td>No file & folder exists!</td></tr>';
                
                $("#documentList").html(result); //Append the result
                kendo.bind($("#documentList"), app.documentAttach.viewModel);
            }
            else
            {
                $("#documentList").html(result); //Append the result
                kendo.bind($("#documentList"), app.documentAttach.viewModel);
                
            }
            
            app.loginService.viewModel.hideloder();
       
        },
        getFileExtension:function(filename)
        {
           // console.log(filename);
            var ext = /^.+\.([^.]+)$/.exec(filename);
            return ext === null ? "" : ext[1];
        },
        uploadDocumentData:function()
        {
            alert("upload");
        },
        attachDocumentData:function()
        {
            alert("attach");
        },
        getInnerDocs:function(e)
        {
            var parentId =e.currentTarget.dataset.id;
            docsBackAttachHistory.push(parentId);
            app.documentAttach.viewModel.getDoumentsList();
            
        },
        goBackLastPage:function()
        {
            docsBackAttachHistory.pop();
            app.documentAttach.viewModel.getDoumentsList();
        },
        getImage:function() {
            
            navigator.camera.getPicture(app.documentAttach.viewModel.uploadPhoto, function(message) {
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
            console.log('call');
            apps.navigate('views/internalFileUpload.html');
        },
        uploadPhoto:function(imageURI) {
            alert(imageURI);
            var options = new FileUploadOptions();
            console.log(options);
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            console.log(options);
            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";
 
            options.params = params;
            options.chunkedMode = false;
            console.log(options);
            var ft = new FileTransfer();
            console.log(options);
           ft.upload(imageURI, encodeURI("http://sandbox.biz2services.com/mobapp/api/folder"), app.documentAttach.viewModel.winUpload, app.documentAttach.viewModel.failUpload, options);
            console.log('sssss');
        },
 
        winUpload:function(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            alert(r.response);
        },
 
        failUpload:function(error) {
            alert("An error has occurred: Code = "+error.code);
        },
        goToDocpending:function()
        {
            apps.navigate('views/documentPending.html'); 
        }
        
        
    });
    app.documentAttach = {
      viewModel:new documentAttachModel()  
    };
})(window);