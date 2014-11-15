(function(global){
    var DocumentPendingModel,
        app = global.app = global.app || {};
    
    DocumentPendingModel = kendo.data.ObservableObject.extend({
        show:function(e)
        {
            var appid = e.view.params.appid;
            matchid = e.view.params.matchid;
            console.log(appid);
               console.log(matchid);
               console.log(e);
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
        },
        UploadExisting:function()
        {
            apps.navigate("views/document_attach.html");
        },
        gobackMatchesPage:function()
        {
            apps.navigate("views/matches.html");
        }
    });
    app.documentService ={
        viewModel:new DocumentPendingModel()
    };
})(window);