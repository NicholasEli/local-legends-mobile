import config from '../config.js';

export const get_vod_preview = async function (id) {
	let req = await fetch(`${config.api_url}/api/video-on-demand?id=${id}&preview=true`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const get_vod_full = async function (id) {
	let req = await fetch(`${config.api_url}/api/video-on-demand?id=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};
