import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, Text, View } from 'react-native';
import theme_variables from '../../helpers/theme-variables.js';

export default function PlaceholderCard({ full_width = false }) {
	const { width, height } = Dimensions.get('window');
	let width_ratio = 320;
	if (width < 352) width_ratio = width - theme_variables.gap * 2;
	if (full_width) width_ratio = width - theme_variables.gap * 2;

	const height_ratio = width_ratio * theme_variables.ratio_16_9;

	const text_styles = {
		fontFamily: 'League-Gothic-Condensed',
		fontSize: 28,
		lineHeight: 28,
		color: '#ffffff',
		textTransform: 'uppercase'
	};

	return (
		<View
			style={{
				width: width_ratio,
				height: height_ratio,
				position: 'relative',
				overflow: 'hidden',
				borderRadius: 20,
				borderWidth: 2,
				borderColor: '#ffffff',
				backgroundColor: theme_variables.secondary
			}}
		>
			<View
				style={{
					width: width_ratio,
					height: height_ratio,
					position: 'relative'
				}}
			>
				<LinearGradient
					colors={['transparent', 'rgba(0,28,57,0.95)']}
					locations={[0, 0.75]}
					start={{ x: 0.8, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={{ width: width_ratio, height: height_ratio, position: 'absolute', zIndex: 2 }}
				/>
				<Image
					source={{ uri: theme_variables.logo }}
					style={{
						width: width_ratio,
						height: height_ratio,
						opacity: 0.5
					}}
				/>
			</View>
		</View>
	);
}
