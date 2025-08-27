// Andoni Garcia's Markov Babbler in JS. 2014

// =====================================================================
// ========================== File Parsing =============================
// =====================================================================

// Credit to Eric Bidelman
// http://www.html5rocks.com/en/tutorials/file/dndfiles/
function handleFileSelect(evt){
	var files = evt.target.files;
	for(var i = 0, f; f = files[i]; i++){
		if(!f.type.match('text.*')){
			continue;
		}
		var reader = new FileReader();
		reader.onload = (function(theFile){
			return function(e){
				insertFile(fileToParsableText(e.target.result));
			};
		})(f);

		reader.readAsText(f);
	}
}

function fileToParsableText(contents){
	var textArr = contents.split(" ");
	return textArr;
}