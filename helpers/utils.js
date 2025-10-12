export const hex_to_rgb = function (hex, opacity = 1) {
	// Remove '#' if present
	hex = hex.replace('#', '');

	// Expand shorthand (#RGB → #RRGGBB)
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((c) => c + c)
			.join('');
	}

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
