import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Pressable, Image, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import theme_variables from '../helpers/theme-variables.js';

export default function Banner({
	href,
	callback,
	title,
	subtitle,
	uri = theme_variables.banner,
	styles = {},
	linear_gradient = true
}) {
	const { width, height } = Dimensions.get('window');
	const ratio = width * theme_variables.ratio_16_9;

	const container_styles = {
		position: 'relative',
		zIndex: 2,
		paddingTop: theme_variables.gap,
		...theme_variables.box_shadow,
		...theme_variables.flex_center
	};

	const title_size = 36;
	const text_styles = {
		fontFamily: 'League-Gothic',
		fontSize: title_size,
		lineHeight: 36,
		color: '#ffffff',
		textTransform: 'uppercase'
	};

	const icon_styles = {
		position: 'absolute',
		bottom: theme_variables.gap,
		right: theme_variables.gap,
		zIndex: 2
	};

	const Content = function () {
		return (
			<View
				style={{
					width: width - theme_variables.gap * 2,
					height: ratio,
					position: 'relative',
					overflow: 'hidden',
					borderRadius: theme_variables.border_radius,
					...styles
				}}
			>
				{linear_gradient && (
					<LinearGradient
						colors={['transparent', theme_variables.secondary]}
						locations={[0, 0.9]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
						style={{ width, height: ratio, position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}
					/>
				)}
				<View
					style={{
						width: width - theme_variables.gap,
						position: 'absolute',
						left: theme_variables.gap,
						bottom: theme_variables.gap - 4,
						zIndex: 3
					}}
				>
					{subtitle && <Text style={{ ...text_styles, fontSize: 20 }}>{subtitle}</Text>}
					{title && <Text style={text_styles}>{title}</Text>}
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

				{title && (
					<View style={icon_styles}>
						<FontAwesome name="play-circle" size={title_size} color="#ffffff" />
					</View>
				)}
			</View>
		);
	};

	if (href) {
		return (
			<View style={container_styles}>
				<Link href={href}>
					<Content />
				</Link>
			</View>
		);
	}

	if (callback) {
		return (
			<View style={container_styles}>
				<Pressable callback={callback}>
					<Content />
				</Pressable>
			</View>
		);
	}

	return <Content />;
}
