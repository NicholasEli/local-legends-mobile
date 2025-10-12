export const aggregate_heats = function (heats) {
	if (!heats) return [];

	const _heats = Object.entries(heats).map(([heat_key, heat_value]) => {
		return {
			...heat_value,
			heat: heat_key
		};
	});

	return _heats;
};
