var ERR_UNKNOWN_FILETYPE = new Error("ERR_UNKNOWN_FILETYPE: _import(String file, Object data)");
function _import (file, data = {}, onload = function(){}) {
	var script = {};
	if('type' in data) {
		script.type = data.type;
	} else {
		script.type = file.split('.')[file.split('.').length-1];
	}
	if('depends' in data) {
		for(var i = 0; i < data.depends.length; i++) {
			_import(data.depends[i]);
		}
	}
	script.xmlhttpreq = new XMLHttpRequest;
	script.xmlhttpreq.open("GET", file, false);
	script.xmlhttpreq.send(new Date().getTime());
	if(script.type == 'js') {
		script.tag = document.createElement('script');
		script.tag.src = file;
		document.head.appendChild(script.tag);
		onload();
		return script.tag;
	} else if(script.type == 'json') {
		onload(script.xmlhttpreq.responseText);
		return (eval('('+script.xmlhttpreq.responseText+')'));
		// return JSON.parse(script.xmlhttpreq.responseText);
	}
	throw ERR_UNKNOWN_FILETYPE;
};