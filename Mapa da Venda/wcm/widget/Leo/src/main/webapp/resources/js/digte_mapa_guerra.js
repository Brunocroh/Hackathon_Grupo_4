var MapaGuerra = SuperWidget.extend({
    dsRepresentante: 'representante',
    dsCliente: 'cliente',
    dsCNAE: 'cnae',
    dsCampanha: 'acoesMapaVenda',
    arrLojas: [],
    zoomClientes: null,
    clientes: null,
    cnaes: [],
    representante: null,
    clientesMap: [],
    arrayTamanhos: [],
    arrayCnae: [],
    arrayCampanha: [],
    xmlWorkflowEngineService: {
        "startProcess": "",
	},
    
    bindings: {
        local: {
            'edit-save': ['click_saveSettings'],
            'view-changeRepresentante' : ['change_selectRepresentante'],
            'view-changeTipoCliente' : ['change_changeTipoCliente'],
            'view-iniciarCampanha' : ['click_clickIniciarCampanha'],
            'view-checkTamanho' : ['click_checkTamanho'],
            'view-checkTamanhoTodos' : ['click_checkTamanhoTodos'],
            'view-changeRange' : ['change_changeRange']
        }
    },
    
    init : function() {
        this.fdwt = Object.create(Fdwt);
        this.fdwt.instanceId = this.instanceId;
        this.fdwt.loadDatasetFactory();
        this.fdwt.loadMustache();
        this.fdwt.init(this);

        if (this.isEditMode) {
            this.eMode();
        }
        else {
        	this.loadXmlFiles();
        	this.vMode();
            this.fdwt.hideLoading();
        }
    },
    
    /******/
    /*EDIT*/
    /******/
    saveSettings: function() {
        var args = this.fdwt.getTemaData();
        args.zoomClientes = $('#zoomClientes',this.sGetContext()).val();
        var _result = WCMSpaceAPI.PageService.UPDATEPREFERENCES({ async: false }, this.instanceId, args);

        if (_result) {
            FLUIGC.toast({
                title: '',
                message: 'As configurações foram gravadas com sucesso.',
                type: 'success'
            });
        }
        else {
            FLUIGC.toast({
                title: '',
                message: 'Erro, as configurações não foram gravadas.',
                type: 'danger'
            });
        }
    },
    eMode: function() {
        
    },

    /******/
    /*VIEW*/
    /******/
    vLoadMap: function() {
        var _this = this;
        var numeroZoom = parseInt(_this.zoomClientes);
        
        _this.clientesMap = [];
        _this.arrayCampanha = [];
        
        var tipoCliente = $('#slTipoCliente', _this.sGetContext()).val();
        
        var representanteMap = {};
        
        if (_this.representante != null) {
        	
        	representanteMap = {
				        			latitude: _this.representante.latitude,
				                	longitude: _this.representante.longitude,
				                    html: '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+ _this.representante.nmRep +'</h4></div>',
				                    icon: _this.getIconColor("")
        						}
        	
        	_this.clientesMap.push(representanteMap);
        	
        	
        	if (tipoCliente == "1" || tipoCliente == "3") {
        		_this.loadClientesByRepresentante();
        	}
        	
        	if (tipoCliente == "2" || tipoCliente == "3") {
        		_this.loadNaoClientes();
        	}
        }
                
       var meuMapa = jQuery('#google-map').gMap({

            maptype: 'ROADMAP',
            markers: _this.clientesMap,
            doubleclickzoom: false,
            controls: {
                panControl: true,
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false
            },
            latitude: representanteMap.latitude,
        	longitude: representanteMap.longitude,
        	zoom: numeroZoom
        });
    },
    
    loadClientesByRepresentante: function() {
    	var _this = this;
    	var idRepresentante = $('#slRepresentante', _this.sGetContext()).val();
    	var range = $('#slRange', _this.sGetContext()).val();
    	    	
    	var cCli = [];
		var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
    	var c2 = DatasetFactory.createConstraint('codRep', idRepresentante, idRepresentante, ConstraintType.MUST);
    	cCli.push(c1,c2);
    	
    	var dataset = DatasetFactory.getDataset(_this.dsCliente, null, cCli, null);

        if (dataset != undefined && dataset.values.length > 0) {
        	$(dataset.values).each(function(index, el){
        		if ((_this.arrayTamanhos.length == 0 || _this.arrayTamanhos.indexOf(el.tamanhoFunc) >= 0) && (range == "" || parseInt(el.nrDiasSemVenda) > parseInt(range)) && (_this.arrayCnae.length == 0 || _this.arrayCnae.indexOf(el.cnae) >= 0)) {
        			_this.arrayCampanha.push(el);
        			
        			_this.clientesMap.push({
                    	latitude: el.latitude,
                    	longitude: el.longitude,
                        html: '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+el.nomeFantasia+'</h4></div>',
                        icon: _this.getIconColor("2")
                    });
        		}
        	});
        }
        
    },
    
    loadNaoClientes: function() {
    	var _this = this;
    	var idRepresentante = $('#slRepresentante', _this.sGetContext()).val();
    	    	
    	var clientes = [];
    	
    	var strTamanhos = "";
    	var strCnaes = "";
    	
    	$(_this.arrayTamanhos).each(function(index, el){
    		strTamanhos += ("&tamanho=" + el);
    	}); 
    	
    	$(_this.arrayCnae).each(function(index, el){
    		strCnaes += ("&cnaes=" + el);
    	}); 
    	    	
    	jQuery.ajax({
            url: 'http://158.69.57.234/rest/leads/listar?latitude=' + _this.representante.latitude.toString() + '&longitude=' + _this.representante.longitude.toString() + '&distancia=' + _this.representante.raio.toString() + strTamanhos + strCnaes,
            success: function (result) {
            	clientes = result;
            },
            async: false
        });
    	    	
    	$(clientes).each(function(index, el){
    		_this.arrayCampanha.push(el);
    		
    		var nome = el.nomeFantasia == null || el.nomeFantasia == 'null' ? el.razaoSocial : el.nomeFantasia;
    		
    		_this.clientesMap.push({
            	latitude: el.latitude,
            	longitude: el.longitude,
                html: '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+nome+'</h4></div>',
                icon: _this.getIconColor("1")
            });
    	});
    },
    
    loadRepresentantes: function() {
    	var _this = this;
    	
    	var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
        var dataset = DatasetFactory.getDataset(_this.dsRepresentante, null, [c1], ["nmRep"]);

        if (dataset != undefined && dataset.values.length > 0) {
            for (var i = 0; i < dataset.values.length; i++) {
            	var $option = $("<option>", {
					"value": dataset.values[i].codRep,
					"text": dataset.values[i].nmRep
				});
				
				$('#slRepresentante', _this.sGetContext()).append($option);
            }
        }
    },
    
    loadCNAEList: function() {
    	var _this = this;
    	
    	$('#areaAtuacaoList', _this.sGetContext()).html("");
        
        var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
    	var dsCnae = DatasetFactory.getDataset(_this.dsCNAE, null, [c1], ["cnaeDescricao"]);

    	if (dsCnae != undefined && dsCnae.values.length > 0) {
    		_this.cnaes = dsCnae.values;
    		
    		var $div = $("<div>", {
				"class": "checkbox"
			});
        	
        	var $label = $("<label>");
        	var $check = $("<input>", {
				"value": "0",
				"type": "checkbox",
				"class": "checkAreaTodos" 
			});
        	
        	$label.append($check);
        	$label.append("Todos");
        	$div.append($label);
        	
        	$('#areaAtuacaoList', _this.sGetContext()).append($div);
    		
    		for (var i = 0; i < dsCnae.values.length; i++) {
        		
        		
        		var $div = $("<div>", {
					"class": "checkbox"
				});
            	
            	var $label = $("<label>");
            	var $check = $("<input>", {
					"value": dsCnae.values[i].cnae,
					"type": "checkbox",
					"class": "checkCnae" 
				});
            	
            	$label.append($check);
            	$label.append(dsCnae.values[i].cnaeDescricao);
            	$div.append($label);
            	
            	$('#areaAtuacaoList', _this.sGetContext()).append($div);
            }
        }
    	
    },
    
    getIconColor: function(cliente) {
    	
    	var urlIcon = "";
    	
    	if (cliente == "") {
    		urlIcon = "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png";
    	}
    	else if (cliente == "1") {
    		urlIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    	}
    	else if (cliente == "2") {
    		urlIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    	}
    	
    	var icon = {
				image: urlIcon,
				iconsize: [26, 46],
				iconanchor: [12,46]
			};
    	
    	/*
    	 * http://maps.google.com/mapfiles/ms/icons/blue-dot.png
    	 * http://maps.google.com/mapfiles/ms/icons/red-dot.png
    	 * http://maps.google.com/mapfiles/ms/icons/purple-dot.png
    	 * http://maps.google.com/mapfiles/ms/icons/yellow-dot.png
    	 * http://maps.google.com/mapfiles/ms/icons/green-dot.png
    	 */
    	
    	return icon;
    },
        
    selectRepresentante: function(el) {
    	var _this = this;
    	
    	var idRepresentante = $('#slRepresentante', _this.sGetContext()).val();
    	
    	if (el.value != "") {
    		var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
        	var c2 = DatasetFactory.createConstraint('codRep', idRepresentante, idRepresentante, ConstraintType.MUST);
            var dataset = DatasetFactory.getDataset(_this.dsRepresentante, null, [c1, c2], ["nmRep"]);

            if (dataset != undefined && dataset.values.length > 0) {
            	_this.representante = dataset.values[0];
            }
        }
        else {
        	_this.representante = null;
        }
    	    	
    	_this.vLoadMap();
    },
    
    changeTipoCliente: function(el) {
    	var _this = this;
    	
    	_this.vLoadMap();
    },
    
    changeRange: function(el) {
    	var _this = this;
    	
    	_this.vLoadMap();
    },
    
    vMode: function() {
    	var _this = this;
    	this.loadRepresentantes();
    	this.loadCNAEList();
    	
    	$(document).on('click', '.checkCnae', function() {
    		_this.arrayCnae = [];
    		
    		$('.checkCnae:checked', _this.sGetContext()).each(function(){
        		_this.arrayCnae.push($(this).val());
        	});
    		
    		if ($('.checkCnae:checked', _this.sGetContext()).length == $('.checkCnae', _this.sGetContext()).length) {
        		$('.checkAreaTodos', _this.sGetContext()).prop("checked", true);
        	}
        	else {
        		$('.checkAreaTodos', _this.sGetContext()).prop("checked", false);
        	}
    		
    		_this.vLoadMap();
    	});
    	
    	$(document).on('click', '.checkAreaTodos', function(el) {
    		_this.arrayCnae = [];
    		
    		if ($(el.target).prop("checked") == true) {
        		$('.checkCnae', _this.sGetContext()).prop("checked", true);
        		
        		$('.checkCnae', _this.sGetContext()).each(function(){
            		_this.arrayCnae.push($(this).val());
            	});
        	}
        	else {
        		$('.checkCnae', _this.sGetContext()).prop("checked", false);
        	}
    		    		
    		_this.vLoadMap();
    	});
    	
    	
    	
    	this.vLoadMap();
    },
    
    clickIniciarCampanha: function(el) {
    	var _this = this;
        
    	var nomeCampanha = $('#txtNomeCampanha', _this.sGetContext()).val();
    	var idRepresentante = $('#slRepresentante', _this.sGetContext()).val();
    	    	
    	if (idRepresentante == "") {
    		FLUIGC.toast({
                title: "",
                message: "Selecione o representante",
                type: "info"
            });
    		
    		return null;
    	}
    	
    	if (nomeCampanha == "") {
    		FLUIGC.toast({
                title: "",
                message: "Informe o nome da Campanha",
                type: "info"
            });
    		
    		return null;
    	}
    	
    	if (_this.arrayCampanha.length == 0) {
    		FLUIGC.toast({
                title: "",
                message: "Selecione ao menos um cliente para iniciar a campanha",
                type: "info"
            });
    		
    		return null;
    	}
    	
    	
    	
		FLUIGC.message.confirm({
            message: "Deseja realmente iniciar a campanha " + nomeCampanha,
            title: "",
            labelYes: "Sim",
            labelNo: "Cancelar"
        }, 
        function (result, el, ev) {
            if (result) {
            	FLUIGC.toast({
                    title: "",
                    message: "Campanha Iniciada",
                    type: "info"
                });
            	
            	_this.startProcess();
            	_this.limpaFiltros();
            }
        });
    	
    },

    checkTamanho: function() {
    	var _this = this;
    
    	_this.arrayTamanhos = [];
    	
    	$('.checkTamanho:checked', _this.sGetContext()).each(function(){
    		_this.arrayTamanhos.push($(this).val());
    	});
    	
    	if ($('.checkTamanho:checked', _this.sGetContext()).length == $('.checkTamanho', _this.sGetContext()).length) {
    		$('.checkTamanhoTodos', _this.sGetContext()).prop("checked", true);
    	}
    	else {
    		$('.checkTamanhoTodos', _this.sGetContext()).prop("checked", false);
    	}
    	
    	_this.vLoadMap();
    },
    
    checkTamanhoTodos: function(el) {
    	var _this = this;
    
    	_this.arrayTamanhos = [];
    	
    	if ($(el).prop("checked") == true) {
    		$('.checkTamanho', _this.sGetContext()).prop("checked", true);
    		
    		$('.checkTamanho:checked', _this.sGetContext()).each(function(){
        		_this.arrayTamanhos.push($(this).val());
        	});
    	}
    	else {
    		$('.checkTamanho', _this.sGetContext()).prop("checked", false);
    	}
    	
    	_this.vLoadMap();
    },
    
    checkAreaTodos: function(el) {
    	var _this = this;
    
    	if ($(el).prop("checked") == true) {
    		$('.checkCnae', _this.sGetContext()).prop("checked", true);
    	}
    	else {
    		$('.checkCnae', _this.sGetContext()).prop("checked", false);
    	}
    	
    	_this.vLoadMap();
    },
        
    startProcess: function() {
    	var _this = this;
    	
    	var nomeCampanha = $('#txtNomeCampanha', _this.sGetContext()).val();
    	var codCampanha = "";
    	var cnaeDescricao = "";
    	
    	var cCamp = [];
		var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
		cCamp.push(c1);
    	var dataset = DatasetFactory.getDataset(_this.dsCampanha, null, cCamp, ['codCampanha']);

        if (dataset != undefined && dataset.values.length > 0) {
        	codCampanha = dataset.values[dataset.values.length - 1].codCampanha;
        	codCampanha = (parseInt(codCampanha) + 1).toString();
        }
        else {
        	codCampanha = "1";
        }
    	
    	$(_this.arrayCampanha).each(function(ind, campanha) {
    		
    		var cnaeDescricao = "";
    		
    		if (_this.cnaes.length > 0) {
            	$(_this.cnaes).each(function(index, el){
            		if (el.cnae == campanha.cnae) {
            			cnaeDescricao = el.cnaeDescricao;
            		}
            	});
            }
    		
    		_this.xmlWorkflowEngineService["startProcess"].find("companyId").text( WCMAPI.getTenantId() );
        	_this.xmlWorkflowEngineService["startProcess"].find("processId").text("Mapa para a Venda");
            _this.xmlWorkflowEngineService["startProcess"].find("choosedState").text("4");
            _this.xmlWorkflowEngineService["startProcess"].find("comments").text(nomeCampanha);
            _this.xmlWorkflowEngineService["startProcess"].find("userId").text("fluig");
            _this.xmlWorkflowEngineService["startProcess"].find("[name=nmCampanha]").text(nomeCampanha);
            _this.xmlWorkflowEngineService["startProcess"].find("[name=codCampanha]").text(codCampanha);
            
            if (campanha.tpCliente != undefined && campanha.tpCliente != null) {
            	_this.xmlWorkflowEngineService["startProcess"].find("[name=CEP]").text(campanha.CEP);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=bairro]").text(campanha.bairro);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=celular]").text(campanha.celular);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cidade]").text(campanha.cidade);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cnae]").text(campanha.cnae);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cnaeDescricao]").text(cnaeDescricao);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cnpj]").text(campanha.cnpj);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=codCliente]").text(campanha.codCliente);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=codRep]").text(campanha.codRep);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=estado]").text(campanha.estado);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=latitude]").text(campanha.latitude);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=logradouro]").text(campanha.logradouro);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=longitude]").text(campanha.longitude);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=nmRep]").text(_this.representante.nmRep);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=nomeFantasia]").text(campanha.nomeFantasia);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=nrDiasSemVenda]").text(campanha.nrDiasSemVenda);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=numero]").text(campanha.numero);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=razaoSocial]").text(campanha.razaoSocial);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=tamanhoFunc]").text(campanha.tamanhoFunc);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=telefone]").text(campanha.telefone);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=tpCliente]").text(campanha.tpCliente);
            }
            else {
            	_this.xmlWorkflowEngineService["startProcess"].find("[name=CEP]").text(campanha.CEP);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=bairro]").text(campanha.bairro);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=celular]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cidade]").text(campanha.cidade);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cnae]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cnaeDescricao]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=cnpj]").text(campanha.cnpj);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=codCliente]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=codRep]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=estado]").text(campanha.estado);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=latitude]").text(campanha.latitude);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=logradouro]").text(campanha.logradouro);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=longitude]").text(campanha.longitude);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=nmRep]").text(_this.representante.nmRep);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=nomeFantasia]").text(campanha.nomeFantasia);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=nrDiasSemVenda]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=numero]").text(campanha.numero);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=razaoSocial]").text(campanha.razaoSocial);
                _this.xmlWorkflowEngineService["startProcess"].find("[name=tamanhoFunc]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=telefone]").text("");
                _this.xmlWorkflowEngineService["startProcess"].find("[name=tpCliente]").text("Novo");
            }
            
            
            
            
            WCMAPI.Create({
                async: true,
                url: WCMAPI.serverURL + "/webdesk/ECMWorkflowEngineService?wsdl",
                contentType: "text/xml; charset=utf-8",
                dataType: "xml",
                data: _this.xmlWorkflowEngineService["startProcess"][0],
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("Falha ao iniciar Campanha");
                    console.error("---- jqXHR: " + jqXHR);
                    console.error("---- textStatus: " + textStatus);
                    console.error("---- errorThrown: " + errorThrown);
                },
                success: function(dados) {
                    console.log("Sucesso ao iniciar Campanha");
                },
            });
    	});
    },
    
    limpaFiltros: function() {
    	var _this = this;
    	
    	$('#slRepresentante', _this.sGetContext()).val("");
    	$('#slRange', _this.sGetContext()).val("");
    	$('.checkCnae', _this.sGetContext()).prop("checked", false);
    	$('.checkAreaTodos', _this.sGetContext()).prop("checked", false);
    	$('.checkTamanho', _this.sGetContext()).prop("checked", false);
    	$('.checkTamanhoTodos', _this.sGetContext()).prop("checked", false);
    	$('#slTipoCliente', _this.sGetContext()).val("1");
    	$('#txtNomeCampanha', _this.sGetContext()).val("");
    	
    	$('.collapse-icon.up', _this.sGetContext()).click();
    	
    	_this.representante = null;
    	
    	_this.vLoadMap();
    },
    
    /********/
    /*SHARED*/
    /********/
    sGetContext: function() {
        if (!this.context) {
            this.context = $('#MapaGuerra_' + this.instanceId);
        }
        
        return this.context;
    },
    
    loadXmlFiles: function() {      
        var _this = this;
        
        $.each([
            "ECMWorkflowEngineService_startProcess.xml"
        ], function (key, file) {
            var method = file.split(".")[0].split("_").reverse()[0];
            
            $.ajax({
                dataType: "xml",
                success: function(xml) {
                    _this.xmlWorkflowEngineService[method] = $(xml);
                },
                url: "/digte_mapa_guerra/resources/js/xmls/" + file
            });
        });
    }
}); 