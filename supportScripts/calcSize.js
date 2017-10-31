(function () {
	var baseStyles = {
		position: 'relative',
		display: 'block',
		width: '100%',
		height: '50px',
		border: 'none',
		overflow: 'hidden',
		margin: '32px auto',
	};
	var container = document.currentScript.parentNode.querySelector('[data-app="container"]');
	var iframe = container.querySelector('iframe#interactiveiframe');
	var deviceWidths = {
		mobile: iframe.getAttribute('data-widthmobile'),
		desktop: iframe.getAttribute('data-widthdesktop'),
	};
	var deviceHeights = {
		mobile: iframe.getAttribute('data-heightmobile'),
		desktop: iframe.getAttribute('data-heightdesktop'),
	};
	Object.keys(baseStyles).forEach(function (s) {
		iframe.style[s] = baseStyles[s];
	});
	var updateIframe = function () {
		var device = container.offsetWidth > deviceWidths.mobile ? 'desktop' : 'mobile';
		var ratio = deviceHeights[device] / deviceWidths[device];
		iframe.style.width = Math.min(container.offsetWidth, deviceWidths[device]) + 'px';
		iframe.style.height = Math.min((ratio * container.offsetWidth), deviceHeights[device]) + 'px';
	};
	var resizeTimeout = null;
	var handleResize = function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function () {
			updateIframe();
		}, 500);
	};
	updateIframe();
	window.addEventListener('resize', handleResize);
	document.addEventListener('DOMContentLoaded', updateIframe);
}());
