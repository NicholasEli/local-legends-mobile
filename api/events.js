import config from '../config.js';

export const get_events = async function () {
	let req = await fetch(`${config.api_url}/api/events`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const get_athlete_events = async function ({ id }) {
	if (!id) return [];

	let req = await fetch(`${config.api_url}/api/events?athlete=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};
