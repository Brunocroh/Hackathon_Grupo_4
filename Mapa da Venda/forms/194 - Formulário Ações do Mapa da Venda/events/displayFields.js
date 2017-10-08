function displayFields(form, customHTML) {
	var activity = getValue('WKNumState');
	if (activity == 3 || activity == 0) {
		customHTML.append('<script>');
		customHTML
				.append('$(\'*[name="resultadoAcao"]\').css(\'display\', \'none\');var closers = $(\'*[name="resultadoAcao"]\').closest(\'.form-field\').find(\'input, textarea, select\');var hideDiv = true;$.each(closers, function(i, close) {if (close.style.display != \'none\' && close.type != \'hidden\') {hideDiv = false;}});if (hideDiv == true) {$(\'*[name="resultadoAcao"]\').closest(\'.form-field\').css(\'display\', \'none\');}');
		customHTML.append('</script>');
		customHTML.append('<script>');
		customHTML
				.append('$(\'*[name="resultadoAcao"]\').closest("li").hide()');
		customHTML.append('</script>');
	}
	
	if (activity == 3 || activity == 0) {
		form.setValue('resultadoAcao', '1');
	}	
		
	if (activity == 4) {
		customHTML.append('<script>');
		customHTML
				.append('$(\'*[name="resultadoAcao"]\').css(\'display\', \'none\');var closers = $(\'*[name="resultadoAcao"]\').closest(\'.form-field\').find(\'input, textarea, select\');var hideDiv = true;$.each(closers, function(i, close) {if (close.style.display != \'none\' && close.type != \'hidden\') {hideDiv = false;}});if (hideDiv == true) {$(\'*[name="resultadoAcao"]\').closest(\'.form-field\').css(\'display\', \'none\');}');
		customHTML.append('</script>');
		customHTML.append('<script>');
		customHTML
				.append('$(\'*[name="resultadoAcao"]\').closest("li").hide()');
		customHTML.append('</script>');
	}
	if (activity == 10) {
		customHTML.append('<script>');
		customHTML
				.append('$(\'*[name="resultadoAcao"]\').css(\'display\', \'none\');var closers = $(\'*[name="resultadoAcao"]\').closest(\'.form-field\').find(\'input, textarea, select\');var hideDiv = true;$.each(closers, function(i, close) {if (close.style.display != \'none\' && close.type != \'hidden\') {hideDiv = false;}});if (hideDiv == true) {$(\'*[name="resultadoAcao"]\').closest(\'.form-field\').css(\'display\', \'none\');}');
		customHTML.append('</script>');
		customHTML.append('<script>');
		customHTML
				.append('$(\'*[name="resultadoAcao"]\').closest("li").hide()');
		customHTML.append('</script>');
	}
}