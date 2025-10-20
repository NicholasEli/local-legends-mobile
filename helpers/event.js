import { aggregate_heats } from './heats.js';
import { aggregate_runs } from './runs.js';

/**
 * Determines if event is complete
 * @param {object} event - Unaggregated event object
 */
export const is_event_complete = function (event) {
	const num_of_heats = Object.keys(event.heats);

	if (num_of_heats.length > 0) {
		const complete_heats = Object.keys(event.heats)
			.map((key) => {
				const _heat = event.heats[key];

				return _heat.complete;
			})
			.filter((h) => h == true).length;
		if (complete_heats == num_of_heats.length) return true;
	}

	return false;
};

/**
 * Get all heat and run standings
 * @param {object} event - Unaggregated event object
 * @param {array} athletes - array of athlete user objects
 * @return Array of event heats and runs (sorted by hightest score)
 */
export const get_event_standings = function (event, athletes) {
	if (!event) return [];

	const heats = aggregate_heats(event.heats).map((heat) => {
		const runs = aggregate_runs(heat, athletes).sort((a, b) => b.total - a.total);
		return {
			...heat,
			runs
		};
	});

	return heats;
};
