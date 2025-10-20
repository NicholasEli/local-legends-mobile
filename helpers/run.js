/** Returns highest run score
 * @param {object} event - event object
 * @param {object} runs - athlete object of runs
 * @return {string|decimal} returns highest single point run or highest judge score
 */
export const get_highest_run = function (event, runs) {
	if (!runs || (runs && !runs.runs.length)) return 0;

	if (event.judges.length > 0) {
		let score = 0;
		runs.runs.forEach((run) => {
			for (const judge_key in run.judges) {
				const judge = run.judges[judge_key];
				const judge_score = parseFloat(judge.score);
				if (judge_score > score) score = judge_score;
			}
		});

		return score.toFixed(2);
	}

	const score = Math.max(...runs.runs.map((run) => parseFloat(run.score)));
	return score.toFixed(2);
};

/** Returns highest run score
 * @param {object} event - event object
 * @param {object} runs - athlete object of runs
 * @return {string|decimal} returns point based run or average of all runs
 */
export const get_average_run = function (event, runs) {
	if (!runs || (runs && !runs.runs.length)) return 0;

	if (event.judges.length > 0) {
		let score = 0;

		runs.runs.forEach((run) => {
			const run_average = parseFloat(run.score) / event.judges.length;
			if (parseFloat(run.score) > 0) score = score + run_average;
		});

		if (score > 0) score = score / runs.runs.length;

		return score.toFixed(2);
	}

	const total = runs.runs.reduce((acc, cur) => {
		const score = parseFloat(cur.score) + acc;

		return score;
	}, 0);

	return parseFloat(total / runs.runs.length).toFixed(2);
};
