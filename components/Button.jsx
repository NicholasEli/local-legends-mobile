import { Pressable } from 'react-native';
import theme_variables from '../helpers/theme-variables.js';

const Button = function ({ children, callback, backgroundColor = '#000000' }) {
	return (
		<Pressable
			onClick={callback}
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				gap: theme_variables.gap / 2,
				paddingTop: theme_variables.gap / 2,
				paddingBottom: theme_variables.gap / 2,
				paddingLeft: theme_variables.gap * 2,
				paddingRight: theme_variables.gap * 2,
				borderRadius: theme_variables.border_radius,
				color: '#ffffff',
				backgroundColor
			}}
		>
			{children}
		</Pressable>
	);
};

export default Button;
