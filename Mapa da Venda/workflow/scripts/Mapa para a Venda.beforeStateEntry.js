function beforeStateEntry(sequenceId){
	
	
	if (sequenceId == 8) {

		hAPI.setCardValue('resultadoAcao', '1-Ação Não Realizada');
		
	}

	if (sequenceId == 6) {

		hAPI.setCardValue('resultadoAcao', '2-Ação Realizada Com Sucesso');

	}

	if (sequenceId == 14) {

		hAPI.setCardValue('resultadoAcao', '3-Ação Realizada Sem Sucesso');
		
	}
	
}