let count = 0;

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
		success: document.createElement('h3'),
		failed: document.createElement('h3'),
		contactme: contactme
	};
	nodes.error.className = 'error';
	nodes.error.appendChild(document.createTextNode('Something went wrong, please try again.'));
	nodes.amend.className = 'error';
	nodes.amend.appendChild(document.createTextNode('Please fill out name and contact method.'));
	nodes.waiting.appendChild(document.createTextNode('Thank you'));
	nodes.success.appendChild(document.createTextNode('I will return to you shortly'));
	nodes.failed.appendChild(document.createTextNode('Sorry, the form was not sent.'));
	var contactLink = document.createElement('a');
	contactLink.setAttribute('href', '#address')
	contactLink.appendChild(document.createTextNode('Please try a different contact method.'));
	nodes.failed.appendChild(document.createElement('br'))
	nodes.failed.appendChild(contactLink);

	nodes.contactme.onsubmit = function(event) {
		event.preventDefault();

		nodes.error.parentNode && nodes.error.parentNode.removeChild(nodes.error);
		nodes.amend.parentNode && nodes.amend.parentNode.removeChild(nodes.amend);
		nodes.contactme.parentNode.replaceChild(nodes.waiting, nodes.contactme);

		var data = serialise(nodes.contactme);
		data.subject = 'Message from danisilas.com'

		if (!data.name || !data.contact) {
			nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			nodes.contactme.parentNode.insertBefore(nodes.amend, nodes.contactme);
			return;
		}

		data.date = new Date().toUTCString();

		fetch(
				nodes.contactme.action,
				{
					headers: {'Content-Type': 'application/json; charset=utf-8'},
					method: 'POST',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					redirect: 'follow',
					referrer: 'no-referrer',
					body: JSON.stringify(data)
				}
		).then(function (response) {
			if (!response.ok) {
				throw new Error('Request failed');
			}
			nodes.waiting.parentNode.replaceChild(nodes.success, nodes.waiting);
		}).catch(function (err) {
			if (count > 3) {
				nodes.waiting.parentNode.replaceChild(nodes.failed, nodes.waiting);
				return
			}

			const error = new Error('Failed to send contact form');
			setTimeout(function() { throw error; });

			nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			nodes.contactme.parentNode.insertBefore(nodes.error, nodes.contactme);
			count++
		});
	}

	function serialise(form) {
		return [].reduce.call(
				form,
				(accumulator, {name, value}) => value ? Object.assign(
					accumulator,
					{ [name]: value.trim() }
				) : accumulator,
				{}
			);
	}

	[].forEach.call(
		document.querySelectorAll('a[href^="#"]'),
		replaceAnchorBehaviour
	);

	replaceAnchorBehaviour(contactLink);
}

function replaceAnchorBehaviour(anchor) {
	anchor.addEventListener('click', function(event) {
		event.preventDefault();

		var destination = document.querySelector('[name="' + anchor.getAttribute('href').replace('#', '') + '"]');

		destination.scrollIntoView({behavior: 'smooth'});
	});
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
