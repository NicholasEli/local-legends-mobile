/**
 * Returns heat runs as an array from highest to lowest score
 * @param { object } heat - heat object from aggregated heat
 * @param { array } athletes - array of event athletes
 * @return { array } runs for heat
 */
export const aggregate_runs = function (heat, athletes = []) {
	if (!heat?.athletes || (heat && !Object.keys(heat.athletes).length)) return [];

	return Object.entries(heat.athletes).map(([athlete_key, athlete_value]) => {
		let color = null;
		const athlete = [...athletes].find((athlete) => {
			if (athlete._id == athlete_key) {
				return athlete;
			}
		});

		const runs = Object.entries(athlete_value.runs).map(([key, value]) => {
			if (value.color && !color) color = value.color;
			value.run = key;
			return value;
		});

		const total = runs.reduce((acc, run) => parseFloat(acc) + parseFloat(run.score), 0);
		const obj = {
			heat: heat.heat,
			athlete,
			runs,
			color,
			total,
			votes: athlete_value.public_votes ? Object.keys(athlete_value.public_votes).length : 0
		};

		return obj;
	});
};

/**
 * Returns sorted runs based event settings
 * @param { object } event - event object
 * @param { array } runs - aggregared runs
 * @return { array } runs sorted by event settings
 */
export const sort_runs = function (event, runs = []) {
	if (!event) return [];

	if (event.judges.length == 0 && event.enabled.highest_score) {
		runs.sort((a, b) => {
			const A = Math.max(...a.runs.map((run) => parseFloat(run.score)));
			const B = Math.max(...b.runs.map((run) => parseFloat(run.score)));

			if (A > B) return -1;
			if (A < B) return 1;

			return 0;
		});
	}

	if (event.judges.length == 0 && !event.enabled.highest_score) {
		runs.sort((a, b) => {
			const A = parseFloat(a.total) / runs.length;
			const B = parseFloat(b.total) / runs.length;

			if (A > B) return -1;
			if (A < B) return 1;

			return 0;
		});
	}

	if (event.judges.length > 0 && event.enabled.highest_score) {
		runs.sort((a, b) => {
			const A = Math.max(...a.runs.map((run) => parseFloat(run.score)));
			const B = Math.max(...b.runs.map((run) => parseFloat(run.score)));

			if (A > B) return -1;
			if (A < B) return 1;

			return 0;
		});
	}

	if (event.judges.length > 0 && !event.enabled.highest_score) {
		runs.sort((a, b) => {
			let A = 0;
			a.runs.forEach((run) => (A = A + parseFloat(run.score) / event.judges.length));
			A = A / runs.length;

			let B = 0;
			b.runs.forEach((run) => (B = B + parseFloat(run.score) / event.judges.length));
			B = B / runs.length;

			if (A > B) return -1;
			if (A < B) return 1;

			return 0;
		});
	}

	return runs;
};
