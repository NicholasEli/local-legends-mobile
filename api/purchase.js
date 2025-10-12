import config from '../config.js';

export const get_purchase = async function ({ token, vod_id }) {
	if (!token) return null;
	if (!vod_id) return null;

	let url = `${config.api_url}/api/purchase`;
	if (vod_id) url += `?vod=${vod_id}`;

	let req = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'meteor-login-token': token
		}
	});

	req = await req.json();

	return req;
};
