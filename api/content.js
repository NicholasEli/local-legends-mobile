import config from '../config.js';

export const get_content = async function () {
	let req = await fetch(`${config.api_url}/api/content`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};
