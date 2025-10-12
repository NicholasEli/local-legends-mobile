import config from '../config.js';

export const get_athlete = async function ({ id, slug }) {
	if (!slug && !id) return null;

	let req = await fetch(`${config.api_url}/api/athlete?id=${id}`, {
		method: 'GET'
	});

	req = await req.json();

	return req;
};

export const set_athlete_follow = async function ({ id, user_id }) {
	if (!id) return null;
	if (!user_id) return null;

	let req = await fetch(`${config.api_url}/api/athlete?id=${id}&follower=${user_id}`, {
		method: 'POST'
	});

	req = await req.json();

	return req;
};
