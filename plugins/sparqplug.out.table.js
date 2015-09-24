sparqplug.out.table = {type:"out","title":"Table Viewer","description":"View results in a table.","icon":"&#xf0ce;","css":"sparqplug.out.table.css"};
plugins['urn:sparqplug:sparqlenvironment.out.table:0.1'] = sparqplug.out.table;

sparqplug.out.table.load = function (selector) {
	$(selector).addClass('sparqplug-out-table');
}

sparqplug.out.table.updateUI = function (selector) {
	$(selector).empty();

	$.each(environment.latestResults,function (index, panelResults) {
		$.each(panelResults,function (index, resultObject) {
			var table = $('<table/>');
			var keys = Object.keys(resultObject.results[0]);
			var dataset = environment.getDatasetObject(resultObject.dataset);
			$.each(resultObject.results,function (index, row) {
				// Start Row
				var tr = $('<tr/>');
				$.each(row,function (key, values) {
					// Each Column
					td = $('<td />',{
						text: $.resolvePrefix(values.value,dataset)
					}).data('obj',values.value).click(function () {
						environment.triggerEvent('selectedObject',{'object':values.value});
						//environment.detailObject($(this).data('obj'));
					});
					tr.append(td);
				});
				table.append(tr);
			});
			var th = $('<tr/>');
			$.each(keys, function (index, key) {
				th.append('<th>'+key+'</th>');
			});
			table.prepend(th);
			$(selector).append(table);
		});
	});
}
