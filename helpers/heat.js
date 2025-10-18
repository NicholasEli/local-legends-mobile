import { aggregate_heats } from './heats.js';
import { aggregate_runs, sort_runs } from './runs.js';

export const get_active_heat = function (event, athletes = []) {
	if (!event) return null;

	const heats = aggregate_heats(event.heats);
	const active_heat = heats.find((heat) => {
		if (heat.active && !heat.complete) return heat;
	});

	if (!active_heat) return null;

	let runs = aggregate_runs(active_heat, athletes);
	runs = sort_runs(event, runs);

	active_heat.runs = runs;

	return active_heat;
};
