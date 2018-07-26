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

		var data = [].reduce.call(
			nodes.contactme,
			function(accumulator, item) {
				if (item.value) {
					accumulator[item.name] = item.value;
				}
				return accumulator;
			},
			{}
		);

		if (!data.name || !data.contact) {
			nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			nodes.contactme.parentNode.insertBefore(nodes.amend, nodes.contactme);
			return;
		}

		fetch(nodes.contactme.action, {
			headers: {'Content-Type': 'application/json; charset=utf-8'},
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			redirect: 'follow',
			referrer: 'no-referrer',
			body: JSON.stringify(data),
		}).then(function (response) {
			if (response.ok) {
				nodes.waiting.parentNode.replaceChild(nodes.success, nodes.waiting);
			} else {
				throw new Error(response.statusText);
			}
		}).catch(function (error) {
			nodes.waiting.parentNode.replaceChild(nodes.contactme, nodes.waiting);
			nodes.contactme.parentNode.insertBefore(nodes.error, nodes.contactme);
		});
	}
});
