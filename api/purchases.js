import config from '../config.js';

export const get_purchases = async function ({ token }) {
	if (!token) return null;

	let req = await fetch(`${config.api_url}/api/purchases`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'meteor-login-token': token
		}
	});

	req = await req.json();

	return req;
};
