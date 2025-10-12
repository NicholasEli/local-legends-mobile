import Meteor from '@meteorrn/core';
import config from '../config.js';

const login = async function ({ email, password }) {
	if (!email || !password) return null;

	let req = await fetch(`${config.api_url}/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	if (!req.ok) {
		return { error: 'Please check username and password' };
	}

	req = await req.json();

	return req;
};

const signup = async function ({ email, password, type = 'athlete' }) {
	if (!email || !password) return null;

	let req = await fetch(`${config.api_url}/api/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password, type })
	});

	if (!req.ok) {
		return { error: 'Could not create account or account already exists' };
	}

	req = await req.json();

	return req;
};

const user = async function (token) {
	if (!token) return null;

	let req = await fetch(`${config.api_url}/api/auth`, {
		method: 'POST',
		headers: {
			'meteor-login-token': token
		}
	});

	if (!req?.ok) {
		return null;
	}

	req = await req.json();

	return req;
};

export default {
	signup,
	login,
	user
};
