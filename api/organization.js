import config from '../config.js';

export const get_organization = async function ({ id, slug }) {
	if (!slug && !id) return null;

	let req = await fetch(`${config.api_url}/api/organization?id=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};
