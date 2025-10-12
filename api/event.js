import config from '../config.js';

export const get_event = async function ({ id }) {
	if (!id) return null;

	let req = await fetch(`${config.api_url}/api/event?id=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};
