Ext.define('pxp.store.FuncionarioCargos', {
    extend: 'Ext.data.Store',
    
    requires: [
       'Ext.data.proxy.Memory',
       'Ext.util.Sorter',
       'pxp.model.FuncionarioCargo'
    ],
    
    config: {
	    autoLoad: false,
	    simpleSortMode: true,
	    remoteFilter: true,
	    pageSize: 20,
	    model: 'pxp.model.FuncionarioCargo' ,
	    successProperty: 'success',
	    
	  },
	 initialize: function(){
	   var me = this;
       me.setProxy({
	        type: 'ajax',
	        headers: pxp.apiRest.genHeaders(),
	        useDefaultXhrHeader:false,
	        url: pxp.apiRest._url('pxp/lib/rest/organigrama/Funcionario/listarFuncionarioCargo'),
	        reader : {
		        type : 'json',
		        rootProperty : 'datos',
		        totalProperty: 'total'
		    }
	    });
    } 

});

