import config from '../config.js';

export const get_event = async function ({ id }) {
	if (!id) return null;

	let req = await fetch(`${config.api_url}/api/event?id=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const set_event_subscription = async function ({ id, user_id }) {
	if (!id) return null;
	if (!user_id) return null;

	let req = await fetch(`${config.api_url}/api/event?id=${id}&user=${user_id}`, {
		method: 'POST'
	});

	req = await req.json();

	return req;
};
