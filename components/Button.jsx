import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme_variables from '../helpers/theme-variables.js';

const Button = function ({ children, gradient = false, callback = null, styles = {} }) {
	return (
		<Pressable
			onPress={callback}
			style={{
				width: '100%',
				position: 'relative',
				...theme_variables.box_shadow,
				...theme_variables.flex_center,
				borderRadius: theme_variables.border_radius,
				...styles
			}}
		>
			{gradient && (
				<LinearGradient
					// colors={['#7b4397', '#dc2430']}
					colors={['#780206', '#061161']}
					start={{ x: 0.25, y: 1 }}
					end={{ x: 1, y: 0 }}
					style={{
						width: '100%',
						height: '100%',
						flex: 1,
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 1,
						borderRadius: theme_variables.border_radius,
						overflow: 'hidden'
					}}
				/>
			)}
			<View
				style={{
					position: 'relative',
					zIndex: 2,
					...theme_variables.padding,
					...theme_variables.padding_half_vertical
				}}
			>
				{children}
			</View>
		</Pressable>
	);
};

export default Button;
