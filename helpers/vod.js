export const rating = function (vod) {
	let value = 0;

	if (!vod) return 0;
	const total_likes = Object.keys(vod.likes).length;
	const total_dislikes = Object.keys(vod.dislikes).length;

	if (total_likes == 0 && total_dislikes == 0) return 0;

	let total = total_likes + total_dislikes;
	value = parseInt((total_likes / total) * 100);

	return value;
};
