const theme_variables = {
	gap: 16,
	ratio_16_9: 0.5625,
	border_radius: 8,
	blue100: '#e0e9f5',
	blue200: '#262a34',
	blue700: '#001c39',
	blue800: '#1d1d29',
	blue900: '#11121e',
	gray100: '#f5f5f5',
	gray200: '#e5e5e5',
	gray300: '#333333',
	gray400: '#18181b',
	gray600: '#2d2e32',
	gray650: '#666666',
	gray900: '#999',
	green300: '#32d296',
	green500: '#2ecc71',
	red100: '#ffe3e9',
	red500: '#c12841',
	yellow500: '#f1c40f',
	stripe: '#635bff',
	// color names
	primary: '#c12841',
	secondary: '#11121e',
	// font
	gothic: 'League-Gothic',
	gothic_italic: 'LeagueGothic-Italic',
	gothic_condensed: 'League-Gothic-Condensed',
	//logo
	logo: 'https://locallegends.live/logo.png',
	logo_light: 'https://locallegends.live/logo-light.png',
	banner: 'https://locallegends.live/placeholder-banner.png',
	// padding
	padding: {
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 16,
		paddingRight: 16
	},
	padding_half: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 8,
		paddingRight: 8
	},
	padding_horizontal: {
		paddingLeft: 16,
		paddingRight: 16
	},
	padding_vertical: {
		paddingTop: 16,
		paddingBottom: 16
	},
	padding_half_horizontal: {
		paddingLeft: 8,
		paddingRight: 8
	},
	padding_half_vertical: {
		paddingTop: 8,
		paddingBottom: 8
	},
	// flex
	flex_row: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	flex_center: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flex_between: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	box_shadow: {
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 3 },
		shadowOpacity: 0.75,
		shadowRadius: 3
	}
};

export default theme_variables;
