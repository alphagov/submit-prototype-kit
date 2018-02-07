(function (document, window) {
	var status = {
		show: function () {
			var classes = this.elm.className.split(' ');
			
			classes.splice(classes.indexOf('status-hidden'), 1);
			this.elm.className = classes.join(' ');

			return this;
		},
		hide: function () {
			var classes = this.elm.className.split(' ');
			
			classes.push('status-hidden');
			this.elm.className = classes.join(' ');

			return this;
		},
		set: function (message) {
			this.elmText.nodeValue = message;

			return this;
		},
		init: function () {
			this.elm = document.createElement('div');
			this.elmWrapper = document.createElement('div');
			this.elm.className = 'status';
			this.elmWrapper.className = 'status-wrapper';
			this.elm.setAttribute('role', 'region');
			this.elm.setAttribute('aria-live', 'polite');
			this.elmText = document.createTextNode('');
			this.elmWrapper.appendChild(this.elm);
			this.elm.appendChild(this.elmText);

			document.getElementsByTagName('body')[0].appendChild(this.elmWrapper);
			this.hide();

			return this;
		}
	};

	document.Editor.status = status;

})(document, window);
