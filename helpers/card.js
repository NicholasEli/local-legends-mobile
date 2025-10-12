export const placeholders = function ({ num = 3 }) {
	return Array.from({ length: Math.abs(num) }, (_, i) => i + 1).map((i) => ({
		_id: null
	}));
};
