import config from '../config.js';

export const get_utils = async function () {
	try {
		let req_heats = await fetch(`${config.api_url}/utils/heats.js`);
		req_heats = await req_heats.text();
		req_heats = eval(req_heats);

		let req_heat = await fetch(`${config.api_url}/utils/heat.js`);
		req_heat = await req_heat.text();
		req_heat = eval(req_heat);

		let req_runs = await fetch(`${config.api_url}/utils/runs.js`);
		req_runs = await req_runs.text();
		req_runs = eval(req_runs);

		let req_run = await fetch(`${config.api_url}/utils/run.js`);
		req_run = await req_run.text();
		req_run = eval(req_run);

		const utils = {
			Heats: { ...req_heats },
			Heat: { ...req_heat },
			Runs: { ...req_runs },
			Run: { ...req_run }
		};

		return utils;
	} catch (err) {
		console.clear();
		console.error(err);
	}
};
