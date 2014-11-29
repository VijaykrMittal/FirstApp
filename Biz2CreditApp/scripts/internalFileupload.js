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
            if(typeof $("#dirContent").data("kendoMobileListView") !=='undefined')
            {
            	$("#dirContent").data("kendoMobileListView").destroy();
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
            directoryReader.readEntries(function(entries){
            var dirContent = $('#dirContent');
            dirContent.empty();
            var dirArr = new Array();
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
            $("#dirContent").kendoMobileListView({
                dataSource: app.fileuploadsetting.viewModel.expDocs,
                template: $("#docs-export-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                  	tap: function (e) { 

						app.fileuploadsetting.viewModel.setExportInnerPage();
						app.fileuploadsetting.viewModel.getActiveItem(e.touch.initialTouch.innerText);
                	},
                
            });
            $("#tabstrip-file-export").find(".km-scroll-container").css("-webkit-transform", "");
            
        },
        backDocslistPage:function(e)
        {
            apps.navigate('views/document_attach.html?parent='+app.documentsetting.viewModel.parentId); 
        },
        gobackFileExportPage:function(e)
        {
             app.fileuploadsetting.viewModel.historyPath.pop(currentDir.name);
             app.fileuploadsetting.viewModel.listDir(parentDir);
        },
        
        thisFileUpload:function(e)
        {
           
            console.log('upload call');

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
        
        
    });
    app.fileuploadsetting = {
        
		viewModel: new fileUploadtViewModel(),     	
    };
 
})(window,jQuery);