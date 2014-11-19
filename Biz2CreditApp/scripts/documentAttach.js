(function(global){
    var documentAttachModel,
        app = global.app = global.app || {};
    
    documentAttachModel = kendo.data.ObservableObject.extend({
        uploadDocumentTab:true,
        existingDocumentTab:false,
        innerdocsAttachPage:false,
        show:function()
        {

            /*Upload Buutton*/
            
            $("#uploadify").kendoUpload({
            async: {
            saveUrl: "/Simulator/saveHandler.php",
            removeUrl: "remove"
            },
            localization:{
            select:"Browse123..."
            }
            });
            
            docsBackAttachHistory=[0];
            app.documentAttach.viewModel.getDoumentsList();
            app.documentAttach.viewModel.uploadDocumentClick();
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
                    var sharedFiles ="";
                    var sharedFolders ="";
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
                    if(sharedFiles !== '' && sharedFolders !=='')
                    {
                    	docsArray.unshift(sharedFiles,sharedFolders);
                    }
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
                app.documentAttach.viewModel.uploadDocumentList(data);
            });
        },
        existingDocumentList:function(docsData)
        {

            var template = kendo.template($("#documentList-template").html());
            var data = docsData;
            var result = template(data); //Execute the template
            if(data[0].length===0){
                result='<tr data-bind="visible:innerdocsAttachPage"><td><a data-bind="click:goBackLastPage,visible:innerdocsAttachPage">Back</a></td></tr>';
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
        uploadDocumentList:function(docsData)
        {
           // console.log(docsData);
            var template = kendo.template($("#dropdownList-template").html());

            //Create some dummy data
            var data = docsData;

            var result = template(data); //Execute the template
            $("#dropdownList").html(result); //Append the result
        },
        getFileExtension:function(filename)
        {
           // console.log(filename);
            var ext = /^.+\.([^.]+)$/.exec(filename);
            return ext === null ? "" : ext[1];
        },
        uploadDocumentClick:function()
        {
            var that=this;
            $('#tabstrip ul li').removeClass('k-state-active');
            $('#tabstrip ul li.postd_icn').addClass('k-state-active');
            that.set('uploadDocumentTab',true);
            that.set('existingDocumentTab',false);
        },
        existingDocumentClick:function()
        {
            var that=this;
            $('#tabstrip ul li').removeClass('k-state-active');
            $('#tabstrip ul li.end_icon').addClass('k-state-active');
            that.set('uploadDocumentTab',false);
            that.set('existingDocumentTab',true);
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
        }
        
    });
    app.documentAttach = {
      viewModel:new documentAttachModel()  
    };
})(window);