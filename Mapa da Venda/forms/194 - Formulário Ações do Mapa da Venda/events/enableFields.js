function enableFields(form) {
	var activity = getValue('WKNumState');
	if (activity > 3) {
		form.setEnabled('codCampanha', false);
		form.setEnabled('telefone', false);
		form.setEnabled('celular', false);
		form.setEnabled('nrDiasSemVenda', false);
		form.setEnabled('tamanhoFunc', false);
		form.setEnabled('checkInLatitude', false);
		form.setEnabled('checkLongitude', false);
		form.setEnabled('codCliente', false);
		form.setEnabled('razaoSocial', false);
		form.setEnabled('nomeFantasia', false);
		form.setEnabled('cnpj', false);
		form.setEnabled('atividade', false);
		form.setEnabled('logradouro', false);
		form.setEnabled('numero', false);
		form.setEnabled('bairro', false);
		form.setEnabled('CEP', false);
		form.setEnabled('cidade', false);
		form.setEnabled('estado', false);
		form.setEnabled('latitude', false);
		form.setEnabled('longitude', false);
		form.setEnabled('tpCliente', false);
		form.setEnabled('vlVendas', false);
		form.setEnabled('cnae', false);
		form.setEnabled('cnaeDescricao', false);
		form.setEnabled('codRep', false);
		form.setEnabled('nmRep', false);
	}
}