import config from '../config.js';

export const get_vod_previews = async function () {
	let req = await fetch(`${config.api_url}/api/videos-on-demand`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const get_athlete_vod_previews = async function ({ id }) {
	if (!id) return [];

	let req = await fetch(`${config.api_url}/api/videos-on-demand?athlete=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const get_purchased_vods = async function ({ token, vod_ids }) {
	if (!token) return [];

	let req = await fetch(`${config.api_url}/api/videos-on-demand`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'meteor-login-token': token
		},
		body: JSON.stringify({ vod_ids })
	});

	req = await req.json();

	return req;
};
