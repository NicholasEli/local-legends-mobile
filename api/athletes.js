import config from '../config.js';

export const get_athletes = async function () {
	let req = await fetch(`${config.api_url}/api/athletes`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};
