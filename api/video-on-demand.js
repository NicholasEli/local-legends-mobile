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

export const set_vod_like = async function (id, user_id) {
	if (!id || !user_id) return null;

	let req = await fetch(`${config.api_url}/api/video-on-demand?id=${id}&like=${user_id}`, {
		method: 'POST'
	});

	req = await req.json();

	return req;
};

export const set_vod_dislike = async function (id, user_id) {
	let req = await fetch(`${config.api_url}/api/video-on-demand?id=${id}&dislike=${user_id}`, {
		method: 'POST'
	});

	req = await req.json();

	return req;
};
