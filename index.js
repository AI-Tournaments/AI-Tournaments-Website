'use strict'
function a(){
	var charCross = '✖';
	let _wrapper = document.getElementById('wrapper');
	var _noise;
	var _charsPerRow = 0;
	document.getElementById('header-title').innerHTML = document.title;
	calcSize();
	window.onresize = calcSize;
	play();
	addMessage('Work in progress', 'Sorry, nothing to see here at the moment.\nBut get back here soon™ because awesome stuff are coming!\nRead more about aitournaments.io over at <a href="https://github.com/AI-Tournaments" target="_blank">GitHub</a>.', true);
	function makeDragable(trigger, dragable=trigger){
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		trigger.onmousedown = dragMouseDown;
		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}
		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			dragable.style.top = (dragable.offsetTop - pos2) + 'px';
			dragable.style.left = (dragable.offsetLeft - pos1) + 'px';
		}
		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	function addMessage(header='', message='', center=false){
		let windowWrapper = document.createElement('div');
		windowWrapper.classList.add('window');
		let messageWrapper = document.createElement('div');
		messageWrapper.classList.add('border');
		windowWrapper.appendChild(messageWrapper);
		let cross = document.createElement('pre');
		cross.innerHTML = charCross;
		cross.classList.add('cross-close');
		cross.onclick = () => {
			windowWrapper.parentNode.removeChild(windowWrapper);
		};
		windowWrapper.appendChild(cross);
		let headerDiv = document.createElement('pre');
		headerDiv.innerHTML = header;
		headerDiv.classList.add('header');
		headerDiv.classList.add('dragable');
		makeDragable(headerDiv, windowWrapper);
		messageWrapper.appendChild(headerDiv);
		let messageDiv = document.createElement('pre');
		messageDiv.classList.add('message');
		messageDiv.innerHTML = message;
		messageWrapper.appendChild(messageDiv);
		let longestLine = 0;
		let rows = message.split('\n');
		for(const row of rows){
			longestLine = Math.max(longestLine, strip(row).length);
		}
		longestLine += 4;
		if(center){
			windowWrapper.style.top = (_noise.length/2 - (rows.length+4)/2) + 'em';
			windowWrapper.style.left = (_charsPerRow/2 - longestLine/2)/2 + 'em';
		}
		document.body.appendChild(windowWrapper);
	}
	function calcSize(){
		_wrapper.className = 'force-new-row';
		let charsPerRow = 0;
		_wrapper.innerHTML = '0';
		let height = _wrapper.offsetHeight;
		while(_wrapper.offsetHeight === height){
			_wrapper.innerHTML = _wrapper.innerHTML + '0';
			charsPerRow++;
		}
		charsPerRow++;
		height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		let rows = 2;
		let charsOnFirstRow = _wrapper.innerHTML;
		while(_wrapper.offsetHeight < height){
			rows++;
			_wrapper.innerHTML = _wrapper.innerHTML + charsOnFirstRow;
		}
		_wrapper.className = '';
		initNoise(rows, charsPerRow);
	}
	function initNoise(rows, charsPerRow){
		_charsPerRow = charsPerRow;
		_noise = new Array(rows);
		for(let r = 0; r < rows; r++){
			let chars = '';
			for(let c = 0; c < charsPerRow; c++){
				if(Math.random() < .5){
					chars += '0';
				}else{
					chars += '1';
				}
			}
			_noise[r] = chars;
		}
	}
	function play(){
		_wrapper.innerHTML = parsToString(getNoise());
		window.requestAnimationFrame(play);
	}
	function getNoise(){
		let numberOfChanges = (_noise.length*_noise[0].length)/100;
		for(let c = 0; c < numberOfChanges; c++){
			let row = Math.floor(Math.random()*_noise.length);
			let index = Math.floor(Math.random() * _noise[row].length);
			let chars = _noise[row];
			let _char;
			if(Math.random() < .5){
				_char = '0';
			}else{
				_char = '1';
			}
			_noise[row] = chars.substr(0, index) + _char + chars.substr(index + 1);
		}
		return _noise.slice();
	}
	function parsToString(noise){
		let chars = '';
		for(let n = 0; n < noise.length; n++){
			if(0 < n){
				chars += '\n';
			}
			chars += noise[n];
		}
		return chars;
	}
	function strip(html){
		var output = '';
		do{
			var tempString = output;
			var element = document.createElement('div');
			element.innerHTML = html;
			output = element.textContent || element.innerText || '';
		}
		while(tempString !== output && output !== '');
		return output;
	}
}