/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('pxp.controller.Interino', {
    extend: 'Ext.app.Controller',
    config: {
        profile: Ext.os.deviceType.toLowerCase(),
        
        models: [
            'pxp.model.Interino',
        ],
        stores: [
          // 'emsysMobile.store.Customers'
        ],

        refs: {
            interinolist: 'interinolist',
            interinotbar: 'interinotbar',
            interinoform:'interinoform'
        },

        control: {
            'interinolist': {
                select: 'onListTap',
                tap: 'onListTap'
            },
            'interinotbar #addinterino': {
                tap: 'onAddInterino'
            },
            'interinotbar #deleteinterino': {
                tap: 'onDeleteInterino'
            },
            
            'interinoform #interinoback':{
            	tap:'onBackInterinoList'
            },
            
            'interinoform #cargobutton':{
            	tap:'onTapCargo'
            },
            
            'interinoform #interinosave':{
            	tap:'onSaveInterino'
            },
            
            
            
            /*,
            'invoicedetaillist #idbarcodelist':{
            	 select: 'onDetailListTap',
            	 tap:'onDetailListTap'
            	
            },
            'invoicefilter #cusbutton':{
            	tap:'onTapCustomer'
            },
            'invoicefilter #containerbutton':{
            	tap:'onTapContainer'
            },
            'invoicefilter #clearfilter':{
            	tap:'onClearFilter'
            },
            'invoicefilter #applyfilter':{
            	tap:'onApplyFilter'
            },
            'invoicelocalfilter #backfilterinv':{
              	 tap:'onBackFilter'
              	
            },
            'invoicelocalfilter #searchlocalinvoice':{
              	 action:'onLocalFilter',
              	 clearicontap:'onClearLocalFilter'
              	
            },
            'invoicedetaillist #backInvoiceList':{
            	 tap:'onBackInvoiceList'
            	
            },
            'invoicebarcodelist #backInvoiceDetailList':{
            	 tap:'onBackInvoiceDetailList'
            	
            }*/
         } 
    },
    
   onAddInterino:function(){
   	    this.getInterinolist().hide();
     	//this.getInterinotbar().hide();
     	this.getInterinoform().show();
   },
   onBackInterinoList:function(){
    	this.getInterinolist().show();
     	//this.getInterinotbar().show();
     	this.getInterinoform().hide();
   },
    
   onListTap:function(){
    	alert('TAP ...')
   },
    
   onSaveInterino:function(){
    	pxp.app.showMask();
    	var me = this,
    	    params = {
                	id_cargo_suplente:  me.getInterinoform().down('#hiddenCargo').getValue(),
                	fecha_ini:  me.getInterinoform().down('#fecha_ini').getFormattedValue('d/m/Y'),
                	fecha_fin:  me.getInterinoform().down('#fecha_fin').getFormattedValue('d/m/Y'),
                	descripcion:'Desde la interface mobiile'
              };
              
              
    	Ext.Ajax.request({
		        
		        withCredentials: true,
	            useDefaultXhrHeader: false,
	            url: pxp.apiRest._url('pxp/lib/rest/organigrama/Interinato/asignarMiSuplente'),
		        params: params,
		        method: 'POST',
		        scope: me,
		        success: function(resp){
		           var Response = Ext.JSON.decode(resp.responseText);
		           pxp.app.hideMask();
		           Ext.Msg.alert('Info...', Response.ROOT.detalle.mensaje, Ext.emptyFn);
		           //mostrar y actualizar el panel de listado
		           me.onBackInterinoList(); 
		           me.getInterinolist().down('list').getStore().load({start:0,
															    	  limit:20,
															    	  page:1});
		        },
		        failure:function(resp){
                    var Response = Ext.JSON.decode(resp.responseText);
                    pxp.app.hideMask();
                    console.log(Response);
		            alert(Response.ROOT.detalle.mensaje)
                }
        });
    	
   }, 
   onDeleteInterino:function(){
    	
    	
    	var seltected = this.getInterinolist().down('list').getSelection();
    	
    	if(seltected.length == 0){
    	    Ext.Msg.alert('Info ...','Selecione una fila primero');
    	    return
    	}
    	
    	pxp.app.showMask();
    	
    	var me = this,
    	    params = {
                id_interinato:  seltected[0].data.id_interinato
              
              };
              
        pxp.app.showMask();      
    	Ext.Ajax.request({
		        
		        withCredentials: true,
	            useDefaultXhrHeader: false,
	            url: pxp.apiRest._url('pxp/lib/rest/organigrama/Interinato/eliminarInterinato'),
		        params: params,
		        method: 'POST',
		        scope: me,
		        success: function(resp){
		           var Response = Ext.JSON.decode(resp.responseText);
		           pxp.app.hideMask();
		           Ext.Msg.alert('Info...', Response.ROOT.detalle.mensaje, Ext.emptyFn);
		           //mostrar y actualizar el panel de listado
		           me.onBackInterinoList(); 
		           me.getInterinolist().down('list').getStore().load({start:0,
															    	  limit:20,
															    	  page:1});
		        },
		        failure:function(resp){
                    var Response = Ext.JSON.decode(resp.responseText);
                    pxp.app.hideMask();
                    alert(Response.ROOT.detalle.mensaje)
                }
        });
    	
    	
   }, 
    
    
   onTapCargo:function(){
    	var me = this;
    	
    	if(!me.cargocmp){
    		
    		var cmphiddenCargo = me.getInterinoform().down('#hiddenCargo'),
    		    cmpTextCargo =me.getInterinoform().down('#textCargo');
    		
    	    me.cargocmp = Ext.create('pxp.view.component.FuncionarioCargo',{
	    	   	'cmpHiddenCargo':cmphiddenCargo,
	    	   	'cmpTextCargo':cmpTextCargo,
	    	   	'displayColumn':'descripcion_cargo',
	    	   	'idColumn':'id_cargo'
    	   });
    	   
    	   Ext.Viewport.add(me.cargocmp);
    	}
    	
    	var fecha = me.getInterinoform().down('#fecha_ini').getFormattedValue('d/m/Y'),
    	    store = me.cargocmp.down('list').getStore();
    	
    	me.cargocmp.setBaseParams({'fecha':fecha});
    	
    	store.getProxy().setExtraParams({'fecha':fecha});
    	store.load({
    		start:0,
    		limit:20,
    		page:1
    		});
    	me.cargocmp.show();
    	
    },
    
    
    
    onClearFilter:function(){
    	var me = this,
	        Invoicelist=this.getInvoicelist(); 
	    
	    var storeInvoices = Ext.getStore('Invoices')
    	Invoicelist.mask()
    	this.getInvoicefilter().reset()
    	
    	storeInvoices.getProxy().setExtraParams({
			     'query':''
			});
    	
    	
    	storeInvoices.load({
    		start:0,
    		limit:20,
    		page:1,
    		callback:function(){
    		Invoicelist.unmask();
    	}})
    	
    }
    
});
