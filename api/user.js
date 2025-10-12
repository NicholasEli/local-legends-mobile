import config from '../config.js';

export const get_user = async function (id) {
	if (!id) return null;
	let req = await fetch(`${config.api_url}/api/user?id=${id}`, {
		method: 'GET'
	});

	if (!req.ok) return null;

	req = await req.json();

	return req;
};

export const update_user = async function ({ user, token }) {
	if (!user._id || !token) return null;

	let req = await fetch(`${config.api_url}/api/user`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'meteor-login-token': token
		},
		body: JSON.stringify({ user })
	});

	if (!req.ok) return null;
	if (req.error) return null;

	req = await req.json();

	return req;
};
