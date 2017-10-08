<#attempt>

<#include "/fdwt_template/resources/js/ftl/params-tema.ftl">

<#assign parametros = "'zoomClientes': '${zoomClientes!5}'">

<#assign params = "{" + tema + ", " + parametros + "}">
<div id="MapaGuerra_${instanceId}"
     class="super-widget wcm-widget-class fluig-style-guide fdwt-style-guide"
     data-params="MapaGuerra.instance(${params})">
    
    <section class="fdwt-container fdwt-container_${instanceId}">
    	<div id="fdwt-content" class="opacity-0">
	    	<#include "/fdwt_template/resources/js/ftl/view-header.ftl">
			<div id="collapse_${instanceId}" class="panel-collapse collapse in">
				<div class="content">
					<div class="row">
				        <div class="col-md-3">
				        	<div class="row">
						        <div class="col-md-12 form-group">
							        <lable for="slRepresentante">Representante</lable>
							        <select id="slRepresentante" name="slRepresentante" class="form-control" data-view-changeRepresentante>
							        	<option value=""></option>
							        </select>
							    </div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
							        <lable for="slRange">Filtro</lable>
							        <select id="slRange" name="slRange" class="form-control" data-view-changeRange>
							        	<option value=""></option>
							        	<option value="30">30</option>
							        	<option value="60">60</option>
							        </select>
							    </div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
							        <lable for="slTamanho">Area de atuação</lable>
							        <div class="panel-group" id="accordionArea">
									    <div class="panel panel-default">
									        <div class="panel-heading">
									            <h4 class="panel-title">
									                <a class="collapse-icon collapsed" data-toggle="collapse" data-parent="#accordionArea" href="#collapseOne">
									                	&nbsp;
									                </a>
									            </h4>
									        </div>
									        <div id="collapseOne" class="panel-collapse collapse">
									            <div class="panel-body" id="areaAtuacaoList">
								                </div>
									        </div>
									    </div>
									</div>
							    </div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
							        <lable for="slTamanho">Tamanho</lable>
							        <div class="panel-group" id="accordionTamanho">
									    <div class="panel panel-default">
									        <div class="panel-heading">
									            <h4 class="panel-title">
									                <a class="collapse-icon collapsed" data-toggle="collapse" data-parent="#accordionTamanho" href="#collapseTwo">
									                	&nbsp;
									                </a>
									            </h4>
									        </div>
									        <div id="collapseTwo" class="panel-collapse collapse">
									            <div class="panel-body" id="tamanhoList">
									            	<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanhoTodos" value="0" data-view-checkTamanhoTodos>Todos</label>
													</div>
									            	<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="1" data-view-checkTamanho>De 1 à 4</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="2" data-view-checkTamanho>De 5 à 9</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="3" data-view-checkTamanho>De 10 à 19</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="4" data-view-checkTamanho>De 20 à 49</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="5" data-view-checkTamanho>De 50 à 99</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="6" data-view-checkTamanho>De 100 à 249</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="7" data-view-checkTamanho>De 250 à 499</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="8" data-view-checkTamanho>De 500 à 999</label>
													</div>
													<div class="checkbox">
													    <label><input type="checkbox" class="checkTamanho" value="9" data-view-checkTamanho>De 1000 à 10000000</label>
													</div>
								                </div>
									        </div>
									    </div>
									</div>
							    </div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
							        <lable for="slTipoCliente">Tipo de Cliente</lable>
							        <select id="slTipoCliente" name="slTipoCliente" class="form-control" data-view-changeTipoCliente>
							        	<option value="1">Nossos Clientes</option>
							        	<option value="2">Novos Clientes</option>
							        	<option value="3">Nossos Clientes + Novos Clientes</option>
							        </select>
							    </div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
							        <lable for="txtNomeCampanha">Nome da Campanha</lable>
							        <input type="text" id="txtNomeCampanha" class="form-control"></input>
							    </div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
							        <button type="button" class="btn btn-primary" class="form-control" data-toggle="button" id="btnIniciarCampanha" data-view-iniciarCampanha>Iniciar Campanha</button>
							    </div>
							</div>
				        </div>
				        <div class="col-md-9">
							<section id="google-map" class="gmap" style="height: 456px;"></section>
							<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyDTmEWjcmSUco-dpbyiZ3oPHUHTNOORDKk"></script>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<#include "/fdwt_template/resources/js/ftl/view-tema.ftl">

<#recover>
	<#include "/social_error.ftl">
</#attempt> 