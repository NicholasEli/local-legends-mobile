import theme_variables from './theme-variables.js';

export const button_styles = ({ width = '100%', backgroundColor = theme_variables.primary }) => {
	return {
		width,
		paddingTop: theme_variables.gap / 2,
		paddingBottom: theme_variables.gap / 2,
		paddingLeft: theme_variables.gap * 2,
		paddingRight: theme_variables.gap * 2,
		backgroundColor,
		borderRadius: 10,
		borderColor: 'transparent'
	};
};

export const button_text_styles = ({
	fontSize = 20,
	fontFamily = theme_variables.gothic,
	textTransform = 'uppercase',
	textAlign = 'center',
	color = '#ffffff'
}) => {
	return {
		fontSize,
		fontFamily,
		textTransform,
		textAlign,
		color
	};
};
