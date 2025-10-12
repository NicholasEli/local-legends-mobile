import config from '../config.js';

export const get_users = async function (ids) {
	if (!ids || (ids && !ids.length)) return [];

	let req = await fetch(`${config.api_url}/api/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(ids)
	});

	req = await req.json();

	return req;
};
