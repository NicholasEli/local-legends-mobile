import config from '../config.js';

export const set_event_registration = async function ({
	token,
	event_id,
	consentee_agreed,
	parental_approval
}) {
	if (!token || !event_id) return null;

	let req = await fetch(`${config.api_url}/api/event-registration?event_id=${event_id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'meteor-login-token': token
		},
		body: JSON.stringify({ consentee_agreed, parental_approval })
	});

	req = await req.json();

	return req;
};
