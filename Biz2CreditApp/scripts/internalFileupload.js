(function (global,$) {
    var fileUploadtViewModel,
        app = global.app = global.app || {};

    fileUploadtViewModel = kendo.data.ObservableObject.extend({
        expDocs:[],
        historyPath:[],
        exportInnerPage:false,
        filedocumentShow:function(e)
        {
            alert("filedocumentShow");
            app.fileuploadsetting.viewModel.historyPath=[];
            app.fileuploadsetting.viewModel.getFileSystem();
            
        },
        getFileSystem:function()
        {
            alert("getfilesystem");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem){ // success get file system
               	 root = fileSystem.root;
                	app.fileuploadsetting.viewModel.listDir(root);
                }, 
                function(evt){ // error get file system
                	console.log("File System Error: "+evt.target.error.code);
                }
            );		
        },
        listDir:function(directoryEntry){

            console.log(directoryEntry);
            alert("ly list directory");
            alert(directoryEntry.fullPath);
             alert(directoryEntry.isDirectory);
             alert(directoryEntry.isFile);
             alert(directoryEntry.name);
            alert(directoryEntry.nativeURL);
            
            if(app.fileuploadsetting.viewModel.historyPath[app.fileuploadsetting.viewModel.historyPath.length-1] !== directoryEntry.name){
            	app.fileuploadsetting.viewModel.historyPath.push(directoryEntry.name);
            }
            if(typeof $("#dirContentUpload").data("kendoMobileListView") !=='undefined')
            {
            	$("#dirContentUpload").data("kendoMobileListView").destroy();
            }
            if(app.fileuploadsetting.viewModel.historyPath.length === 1)
            {
                $('#tabstrip-file-upload .inner-docs-back').addClass("hidedocsback");
                $('#tabstrip-file-upload .inner-docs-back span').addClass("hidedocsback");
            }
            else
            {
                $('#tabstrip-file-upload .inner-docs-back').removeClass("hidedocsback");
                $('#tabstrip-file-upload .inner-docs-back span').removeClass("hidedocsback");
            }
            app.loginService.viewModel.showloder(); // show loading message
            currentDir = directoryEntry; // set current directory
            directoryEntry.getParent(function(par){ // success get parent
            parentDir = par; // set parent directory
            	if( currentDir.name === root.name) app.fileuploadsetting.viewModel.setExportRootPage();
            	}, function(error){ // error get parent
            		console.log('Get parent error: '+error.code);
            	});

            var directoryReader = directoryEntry.createReader();
            //console.log(directoryReader)
            directoryReader.readEntries(function(entries){
            var dirContent = $('#dirContentUpload');
            dirContent.empty();
            var dirArr = new Array();
            var filsArr = new Array();
            for(var i=0; i<entries.length; ++i){ // sort entries
                
                var newdirArr = new Array();
                newdirArr.fullPath= entries[i].fullPath;
                newdirArr.isFile= entries[i].isFile;
                newdirArr.name= entries[i].name;
                newdirArr.nativeURL= entries[i].nativeURL;
                newdirArr.isDirectory= entries[i].isDirectory;
                
            	if(newdirArr.name[0] !== '.' && newdirArr.isDirectory===true) dirArr.push(newdirArr);
                if(newdirArr.name[0] !== '.' && newdirArr.isDirectory!==true) filsArr.push(newdirArr);
                
            }
            dirArr.sort(function(obj1, obj2) {
                var aName = obj1.name.toLowerCase();
                var bName = obj2.name.toLowerCase();
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            });
            filsArr.sort(function(obj1, obj2) {
                var aName = obj1.name.toLowerCase();
                var bName = obj2.name.toLowerCase();
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            });   
            $.merge( dirArr, filsArr );  
                 
            app.fileuploadsetting.viewModel.setExportDocs(dirArr);
                
            app.loginService.viewModel.hideloder(); // hide loading message
            }, function(error){
            	console.log('listDir readEntries error: '+error.code);

            });
        },
        getActiveItem:function(name)
        {   
            activeItem ='';
            if(currentDir !== null ){
                currentDir.getDirectory(name, {create:false},
                    function(dir){ // success find directory
                    	activeItem = dir;
                        app.fileuploadsetting.viewModel.listDir(activeItem);
                    }, 
                    function(error){ // error find directory
                    	console.log('Unable to find directory: '+error.code);
                    }
                );
            }
 
        },
		getActivePitem:function(name)
        {   
            activePitem ='';
            if(currentDir !== null ){
                currentDir.getParent(name, {create:false},
                    function(dir){ // success find directory
                    	activePitem = dir;
                        app.fileuploadsetting.viewModel.listDir(activePitem);
                    }, 
                    function(error){ // error find directory
                    	console.log('Unable to find directory: '+error.code);
                    }
                );
            }
 
        },
        setExportDocs:function(data)
        {
            var that = this;
            that.set("expDocs", data);
            if(typeof $(".dirContentUpload").data("kendoMobileListView") !=='undefined' )
            {
                $(".dirContentUpload").data("kendoMobileListView").destroy();
            }
            $(".dirContentUpload").kendoMobileListView({
                dataSource: app.fileuploadsetting.viewModel.expDocs,
                template: $("#docs-upload-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                  	tap: function (e) { 
                            if(e.touch.initialTouch.dataset.id==="folder")
                            {
                                app.fileuploadsetting.viewModel.setExportInnerPage();
                                app.fileuploadsetting.viewModel.getActiveItem(e.touch.initialTouch.dataset.name);

                            }
                            if(e.touch.initialTouch.dataset.id==="files")
                            {
                                var fileNativeUrl = e.touch.initialTouch.dataset.url;
                                app.fileuploadsetting.viewModel.uploadFileToServer(fileNativeUrl);
                            }
                          

                	},
                
            });
            $("#tabstrip-file-upload").find(".km-scroll-container").css("-webkit-transform", "");
            
        },
        backDocslistPage:function(e)
        {
            apps.navigate('views/documentPending.html'); 
        },
        gobackFileExportPage:function(e)
        {
             app.fileuploadsetting.viewModel.historyPath.pop(currentDir.name);
             app.fileuploadsetting.viewModel.listDir(parentDir);
        },
        
        thisFileUpload:function(e)
        {
            
            if($('#dirContentUpload input[type=checkbox]').is(":checked") === true)
            {
                var path = [];
                $('#dirContentUpload input[type=checkbox]:checked').each(function(i){
                    path[i] = $(this).val();
                    
                });
                
            }
            else
            {
                navigator.notification.confirm('Please select files for uploading', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        $('#dirContentUpload input[type=checkbox').focus();
                    }
                }, 'Notification','OK');

            }
           app.fileuploadsetting.viewModel.uploadMultiFiles(path);
            
        },
        setExportInnerPage:function()
        {
            var that = this;
            that.set("exportInnerPage", true);  
        },
        setExportRootPage:function()
        {
            var that = this;
            that.set("exportInnerPage", false);  
        },
        getMimeType:function(file_URI)
        {
            mimeType ='';
            window.resolveLocalFileSystemURL(file_URI, function(fileEntry) {
                fileEntry.file(function(filee) {
                        options.mimeType= filee.type; //THIS IS MIME TYPE
                    }, function() {
                        alert('error getting MIME type');
                });
            }, app.fileuploadsetting.viewModel.getMimeTypeOnError);
            return;
        },
        getMimeTypeOnError:function()
        {
            console.log('Fail to getMIME type');
        },
        uploadFileToServer:function(imageURI) {
            //alert(imageURI);

            try {
                    pb.value(0);
                    var docsid = sessionStorage.getItem("docsid");
                    var docstype = sessionStorage.getItem("docstype");
                    var appid = sessionStorage.getItem("matchesPageFid");
                    var matchid = sessionStorage.getItem("IteriaMatchid");
                    var custid = localStorage.getItem("userID");
                    options = new FileUploadOptions();

                    options.fileKey="file";
                    var fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                    
                    options.fileName =fileName;
                    app.documentService.viewModel.setUploadFileName(options.fileName);
                    app.fileuploadsetting.viewModel.getMimeType(imageURI);
                    
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
                   ftUpload.upload(imageURI, localStorage.getItem("urlMobAppApiLoan"), app.documentService.viewModel.winUpload, app.documentService.viewModel.failUpload, options , true);
            }
            catch(e)
            {
                console.log("Error in File uploading:="+e);
                app.analyticsService.viewModel.trackException(e,'FileUpload.Error in file uploading');
            }
        },
    
        
    });
    app.fileuploadsetting = {
        
		viewModel: new fileUploadtViewModel(),     	
    };
 
})(window,jQuery);