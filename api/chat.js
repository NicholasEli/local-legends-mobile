import config from '../config.js';

export const set_chat_message = async function ({ token, event_id, text, vote }) {
	if (!token || !event_id) return null;
	if (!text && !vote) return null;

	let req = await fetch(`${config.api_url}/api/chat?event_id=${event_id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'meteor-login-token': token
		},
		body: JSON.stringify({ text, vote })
	});

	req = await req.json();

	return req;
};
