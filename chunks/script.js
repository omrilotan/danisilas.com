window.addEventListener('DOMContentLoaded', function() {
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
			nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			nodes.contactme.parentNode.insertBefore(nodes.error, nodes.contactme);
		});
	}

	function serialise(form) {
		return [].reduce.call(
			form,
			function(accumulator, item) {
				if (item.value) {
					accumulator[item.name] = item.value;
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
});
