// TRY TO UNDERSTAND AT YOUR OWN RISK

$('.code-input').on('input', function () {
	let lineNo = this.value.substr(0, this.selectionStart).split(/\r?\n|\r/).length;
	$('#count').text(lineNo)
})

;let MicroCode = (function(){
	return {
		init: function(inputSel, outputSel, languageSel){
			this.focusInput(inputSel);
			this.listenForInput(inputSel);
			this.listenForLanguage(languageSel, '.code-output', inputSel);
			this.renderOutput(outputSel, $(inputSel)[0].value);
			this.listenerForScroll(inputSel, outputSel);
		},

		listenForInput: function(inputSel){
			const self = this;

			$(inputSel).on('input keydown', function(key){
				const input = this,
					selStartPos = input.selectionStart,
					inputVal = input.value;

				if(key.keyCode === 9){
					input.value = inputVal.substring(0, selStartPos) + "    " + inputVal.substring(selStartPos, input.value.length);
					input.selectionStart = selStartPos + 4;
					input.selectionEnd = selStartPos + 4;
					key.preventDefault();
				}

				self.renderOutput('.code-output', this.value);
			});

			Prism.highlightAll();
		},

		listenForLanguage: function(languageSel, outputSel, inputSel){
			const self = this;
			$(languageSel).on('change', function(){
				$('code', outputSel)
					.removeClass()
					.addClass('language-' + this.value)
					.removeAttr('data-language');

				$(outputSel)
					.removeClass()
					.addClass('code-output language-' + this.value);

				$(inputSel)
					.val('');

				$('code', outputSel)
					.html('');

				self.focusInput(inputSel);
			});
		},

		listenerForScroll: function(inputSel, outputSel){
			$(inputSel).on('scroll', function(){
				console.log(this.scrollTop);
				$(outputSel)[0].scrollTop = this.scrollTop;
			});
		},

		renderOutput: function(outputSel, value){
			$('code', outputSel)
				.html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
					.replace(/>/g, "&gt;") + "\n");

			Prism.highlightAll();
		},

		focusInput: function(inputSel){
			const input = $(inputSel);

			input.focus();

			input[0].selectionStart = input[0].value.length;
			input[0].selectionEnd = input[0].value.length;
		}
	}
})();

MicroCode.init('.code-input', '.code-output', '.code-select');

// Yet another example of my horrible coding...

function saveTextAsFile() {
	const textToWrite = document.getElementsByClassName('code-output').innerHTML;
	const textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
	let fileNameToSaveAs;
	if (document.getElementsByClassName('language').value === 'javascript') {
		fileNameToSaveAs = "serenity.js";
	}
	else if (document.getElementsByClassName('language').value === 'markup') {
		fileNameToSaveAs = "serenity.html";
	}
	else if (document.getElementsByClassName('language').value === 'php') {
		fileNameToSaveAs = "serenity.php";
	}
	else {
		fileNameToSaveAs = "serenity.html";
	}

	const downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null) {
		// Chrome allows the link to be clicked without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	} else {
		// Firefox requires the link to be added to the DOM before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

const button = document.getElementById('save');
button.addEventListener('click', saveTextAsFile);

function destroyClickedElement(event) {
	// remove the link from the DOM
	document.body.removeChild(event.target);
}
