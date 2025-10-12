export const create_filename = function (current_filename) {
	if (!current_filename || typeof current_filename !== 'string') {
		throw new Error('Invalid filename');
	}

	// Extract the extension (including dot), e.g. ".jpg", ".mp4"
	const match = current_filename.match(/(\.[a-zA-Z0-9]+)$/);

	// Default to empty string if no extension found
	const extension = match ? match[1].toLowerCase() : '';

	// Generate unique filename
	const unique_id = Random.id();

	return `${unique_id}${extension}`;
};
