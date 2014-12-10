(function (global,$) {
    var fileUploadtViewModel,
        app = global.app = global.app || {};

    fileUploadtViewModel = kendo.data.ObservableObject.extend({
        expDocs:[],
        historyPath:[],
        exportInnerPage:false,
        filedocumentShow:function(e)
        {
            app.fileuploadsetting.viewModel.historyPath=[];
            app.fileuploadsetting.viewModel.getFileSystem();
            
        },
        getFileSystem:function()
        {
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
                //console.log(entries)
            for(var i=0; i<entries.length; ++i){ // sort entries
                var newdirArr = new Array();
                newdirArr.fullPath= entries[i].fullPath;
                newdirArr.isFile= entries[i].isFile;
                newdirArr.name= entries[i].name;
                newdirArr.nativeURL= entries[i].nativeURL;
                newdirArr.isDirectory= entries[i].isDirectory;
                
            	if(newdirArr.name[0] !== '.' ) dirArr.push(newdirArr);
            }
                
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
            $("#dirContentUpload").kendoMobileListView({
                dataSource: app.fileuploadsetting.viewModel.expDocs,
                template: $("#docs-upload-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                  	tap: function (e) { 
                            if(e.touch.initialTouch.dataset.id==="folder")
                            {
                            app.fileuploadsetting.viewModel.setExportInnerPage();
                            app.fileuploadsetting.viewModel.getActiveItem(e.touch.initialTouch.innerText);

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
        uploadMultiFiles:function(path) {
            myUploadFiles =path;
            myUploadFilesCount=path.length;
            var docsid = sessionStorage.getItem("docsid");
            var docstype = sessionStorage.getItem("docstype");
            var appid = sessionStorage.getItem("matchesPageFid");
            var matchid = sessionStorage.getItem("IteriaMatchid");
            var custid = localStorage.getItem("userID");
            
            $("#tabstrip-multiupload-file").data("kendoMobileModalView").open();
            $(".docsUploadMulti").html("");
            pbMulti =[];
            optionsMulti=[];
            paramsMulti=[];
            ftUploadMulti=[];
            for (var j = 0; j < path.length; j++) {
                
                html = '';
                html+='<div class="flNmUpldwrapAll flNmUpldwrapAll-'+j+' clearfix">';
                html+='<div class="flNmUpldwrap">';
                html+='<div class="flNmUpldMulti">file name</div>';
                html+='<div id="profileCompleteness-'+j+'" class="uploadBarMulti" style="width:100%; height:5px;"></div>';
                html+='</div>';
                html+='<div id="uploadProcess" class="cancelUpld" data-process="'+j+'" data-bind="click:transferFileAbort">Cancel</div>';
                html+='</div>';
                $(".docsUploadMulti").append(html);
                
                pbMulti[j] = $("#profileCompleteness-"+j).kendoProgressBar({
                                                                    type: "chunk",
                                                                    chunkCount: 100,
                                                                    min: 0,
                                                                    max: 100,
                                                                    value: 0
                                                                }).data("kendoProgressBar");

                optionsMulti[j] = new FileUploadOptions();

                optionsMulti[j].fileKey="file";
                optionsMulti[j].fileName=path[j].substr(path[j].lastIndexOf('/')+1);
                app.fileuploadsetting.viewModel.getMimeType(path[j],j);
                paramsMulti[j] = new Object();
                paramsMulti[j].apiaction="uploaddocuments";
                paramsMulti[j].docid = docsid;
                paramsMulti[j].doctype = docstype;
                paramsMulti[j].appid = appid;
                paramsMulti[j].matchid = matchid;
                paramsMulti[j].custid = custid;
                paramsMulti[j].filekey = j;
                paramsMulti[j].format = "json";
                optionsMulti[j].params = paramsMulti[j];
                optionsMulti[j].chunkedMode = false;
                optionsMulti[j].headers = {
                    Connection: "close"
                };
                pbMulti[j].value(0);
                console.log(window);
                ftUploadMulti[j] = new FileTransfer();
                ftUploadMulti[j].onprogress = function(progressEvent) {
                	if (progressEvent.lengthComputable) {
                		var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                		pbMulti[j].value(perc);
                        
                	}else{
                	    pbMulti[j].value('');
                        
                	}
                };
                ftUploadMulti[j].upload(path[j], 'http://google.com', app.fileuploadsetting.viewModel.winUpload, app.fileuploadsetting.viewModel.failUpload, optionsMulti[j] , true);
            }
            console.log(path);
            console.log(encodeURI(path[j]));
            if(path.length > 1)
            {
                html = '<div id="uploadProcess" class="cancelUpld" data-bind="click:transferFileAbortAll">All Cancel</div>';
                $(".docsUpload").append(html);  
            }
            kendo.bind($(".docsUpload"), app.fileuploadsetting.viewModel);
        },
        winUpload:function(r) {
            
            console.log(r);
            filekey =0;//give by response
            myUploadFilesCount--;
            $(".flNmUpldwrapAll-"+filekey).remove();
            if(myUploadFilesCount === 0)
            {
                //$("#tabstrip-multiupload-file").data("kendoMobileModalView").close();

            }
        },

        failUpload:function(error) {
            
            errorFileName = error.source.substr(error.source.lastIndexOf('/')+1);
            navigator.notification.confirm('Some error occured with uploading', function (confirmed) {
            if (confirmed === true || confirmed === 1) {
                myUploadFilesCount--;
                var key = $.inArray( error.source, myUploadFiles);
                console.log(error);
                console.log('failUpload'+key);
                ftUploadMulti[key].abort();
                $(".flNmUpldwrapAll-"+key).remove();
                if(myUploadFilesCount===0)
                {
                    //$("#tabstrip-multiupload-file").data("kendoMobileModalView").close(); 
                }
            }

            }, errorFileName, 'Yes,No');
            
            
           
        },
        transferFileAbort:function(e)
        {
            var currentProcess = e.currentTarget.dataset.process;
            ftUploadMulti[currentProcess].abort();
            $(".flNmUpldwrapAll-"+currentProcess).remove();
            myUploadFilesCount--;
            if(myUploadFilesCount===0)
            {
                $("#tabstrip-multiupload-file").data("kendoMobileModalView").close(); 
            }
            
        },
        getMimeType:function(file_URI,j)
        {
            mimeType ='';
            window.resolveLocalFileSystemURL(file_URI, function(fileEntry) {
                fileEntry.file(function(filee) {
                        optionsMulti[j].mimeType = filee.type; //THIS IS MIME TYPE
                    }, function() {
                        alert('error getting MIME type');
                });
            }, app.fileuploadsetting.viewModel.getMimeTypeOnError);
            return;
        },
        getMimeTypeOnError:function()
        {
            console.log('Fail to getMIME type');
        }
    
        
    });
    app.fileuploadsetting = {
        
		viewModel: new fileUploadtViewModel(),     	
    };
 
})(window,jQuery);