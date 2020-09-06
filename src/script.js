if (document.readyState === 'complete') {
	utiliseForm();
} else {
	window.addEventListener('DOMContentLoaded', utiliseForm, { once: true });
}

if (window.scrollY > window.innerHeight) {
	loadMap();
} else {
	window.addEventListener('scroll', loadMap, { once: true });
}

function utiliseForm() {
	var nodes = {
		error: document.createElement('p'),
		amend: document.createElement('p'),
		waiting: document.createElement('p'),
		success: document.createElement('p'),
		contactme: contactme
	};
	nodes.error.className = 'error';
	nodes.error.appendChild(document.createTextNode('Something went wrong, please try again.'));
	nodes.amend.className = 'error';
	nodes.amend.appendChild(document.createTextNode('Please fill out name and contact method.'));
	nodes.waiting.appendChild(document.createTextNode('Thank you'));
	nodes.success.appendChild(document.createTextNode('I will return to you shortly'));

	nodes.contactme.onsubmit = function(event) {
		event.preventDefault();

		nodes.error.parentNode && nodes.error.parentNode.removeChild(nodes.error);
		nodes.amend.parentNode && nodes.amend.parentNode.removeChild(nodes.amend);
		nodes.contactme.parentNode.replaceChild(nodes.waiting, nodes.contactme);

		var data = serialise(nodes.contactme);

		if (!data.name || !data.contact) {
			nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			nodes.contactme.parentNode.insertBefore(nodes.amend, nodes.contactme);
			return;
		}

		data.date = new Date().toUTCString();

		fetch(
				nodes.contactme.action + queryfy(data)
		).then(function (response) {
			nodes.waiting.parentNode.replaceChild(nodes.success, nodes.waiting);
		}).catch(function (error) {
			// TODO: Temporarily disabling error message (triggered by CORS)
			// Resolve by switching form provider
			nodes.waiting.parentNode.replaceChild(nodes.success, nodes.waiting);
			// nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			// nodes.contactme.parentNode.insertBefore(nodes.error, nodes.contactme);
		});
	}

	function serialise(form) {
		return [].reduce.call(
			form,
			function(accumulator, item) {
				if (item.value) {
					accumulator[item.name] = item.value.trim();
				}
				return accumulator;
			},
			{}
		);
	}

	var entries = {
		name: 'entry.1419581890',
		contact: 'entry.367634920',
		message: 'entry.1892559927',
		date: 'entry.1624056495',
	};
	function queryfy(data) {
		return Object.keys(entries).reduce(
			function (accumulator, key) {
				accumulator.push(
					[entries[key], encodeURIComponent(data[key])].join('=')
				);
				return accumulator;
			},
			[]
		).join('&');
	}

	[].forEach.call(
		document.querySelectorAll('a[href^="#"]'),
		function (target) {
			target.addEventListener('click', function(event) {
				event.preventDefault();

				var destination = document.querySelector('[name="' + target.getAttribute('href').replace('#', '') + '"]');

				destination.scrollIntoView({behavior: 'smooth'});
			});
		}
	);
}

function loadMap() {
	const frame = document.createElement('iframe');
	[
		[ 'title', 'My Office Location' ],
		[ 'width', '100%' ],
		[ 'height', '100%' ],
		[ 'src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.7957283073088!2d-0.1435368157730345!3d51.590307079648746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3e977d91b5%3A0xf02ada7628d85293!2sDan%20I%20Silas%20Chartered%20Surveyor!5e0!3m2!1siw!2sil!4v1594805579242!5m2!1siw!2sil' ],
		[ 'frameborder', '0'] ,
		[ 'scrolling', 'no'] ,
		[ 'marginheight', '0'] ,
		[ 'marginwidth', '0']
	].forEach(
		([ prop, value ]) => frame.setAttribute(prop, value)
	);
	document.querySelector('footer').appendChild(frame);
}
