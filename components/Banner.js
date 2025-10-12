import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, Text, View } from 'react-native';
import theme_variables from '../helpers/theme-variables.js';

export default function Banner({ title, subtitle, uri = theme_variables.banner }) {
	const { width, height } = Dimensions.get('window');
	const ratio = width * theme_variables.ratio_16_9;

	const text_styles = {
		fontFamily: 'League-Gothic-Condensed',
		fontSize: 36,
		lineHeight: 36,
		color: '#ffffff',
		textTransform: 'uppercase'
	};

	return (
		<View
			style={{
				width,
				height: ratio,
				position: 'relative',
				overflow: 'hidden',
				borderBottomWidth: 2,
				borderBottomColor: theme_variables.primary
			}}
		>
			<LinearGradient
				colors={['transparent', 'rgba(0,28,57,0.95)']}
				locations={[0, 0.75]}
				start={{ x: 0.8, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={{ width, height: ratio, position: 'absolute', zIndex: 2 }}
			/>
			<View
				style={{
					width: width - theme_variables.gap,
					position: 'absolute',
					left: theme_variables.gap,
					bottom: theme_variables.gap - 4,
					zIndex: 3
				}}
			>
				{title && <Text style={text_styles}>{title}</Text>}
				{subtitle && <Text style={text_styles}>{subtitle}</Text>}
			</View>
			<Link href="/events" style={{ position: 'relative', zIndex: '1' }}>
				<Image
					source={{ uri: uri }}
					style={{
						width,
						height: ratio
					}}
				/>
			</Link>
		</View>
	);
}
