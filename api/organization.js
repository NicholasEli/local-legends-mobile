import config from '../config.js';

export const get_organization = async function ({ id, slug }) {
	if (!slug && !id) return null;

	let req = await fetch(`${config.api_url}/api/organization?id=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const set_organization_follow = async function ({ id, user_id }) {
	if (!id) return null;
	if (!user_id) return null;

	let req = await fetch(`${config.api_url}/api/organization?id=${id}&follower=${user_id}`, {
		method: 'POST'
	});

	req = await req.json();

	return req;
};
