/** Returns highest run score
 * @param {object} event - event object
 * @param {object} runs - athlete object of runs
 * @return {string|decimal} returns highest single point run or highest judge score
 */
export const get_highest_run = function (event, runs) {
	if (!runs || (runs && !runs.runs.length)) return 0;

	if (event.judges.length > 0) {
		return 0;
	}

	const highest = Math.max(...runs.runs.map((run) => parseFloat(run.score)));
	return highest.toFixed(2);
};

/** Returns highest run score
 * @param {object} event - event object
 * @param {object} runs - athlete object of runs
 * @return {string|decimal} returns point based run or average of all runs
 */
export const get_average_run = function (event, runs) {
	if (!runs || (runs && !runs.runs.length)) return 0;

	const total = runs.runs.reduce((acc, cur) => {
		const score = parseFloat(cur.score) + acc;

		return score;
	}, 0);

	return parseFloat(total / runs.runs.length).toFixed(2);
};
