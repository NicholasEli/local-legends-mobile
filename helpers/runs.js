export const aggregate_runs = function (heat, athletes = [], guest_athletes = []) {
	if (!heat?.athletes || (heat && !Object.keys(heat.athletes).length)) return [];

	return Object.entries(heat.athletes).map(([athlete_key, athlete_value]) => {
		let color = null;
		const athlete = [...athletes, ...guest_athletes].find((athlete) => {
			if (athlete._id == athlete_key || athlete.guest_id == athlete_key) {
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
