(function (global) {
    var getStartBizAnalyzerViewModal,
        app = global.app = global.app || {};

    getStartBizAnalyzerViewModal = kendo.data.ObservableObject.extend({
        
        show:function()
        {

        },

    });
   
    app.gsBizAnalyzer = {
       viewModel: new getStartBizAnalyzerViewModal()	
    };
})(window);