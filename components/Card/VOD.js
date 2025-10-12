import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, Text, View } from 'react-native';
import CardTag from '../../components/CardTag.jsx';
import theme_variables from '../../helpers/theme-variables.js';
import dayjs from 'dayjs';

export default function VODCard({ vod, full_width, owned, color }) {
	const { width, height } = Dimensions.get('window');
	let width_ratio = 320;
	if (width < 352) width_ratio = width - theme_variables.gap * 2;
	if (full_width) width_ratio = width - theme_variables.gap * 2;

	const height_ratio = width_ratio * theme_variables.ratio_16_9;

	const text_styles = {
		fontFamily: 'League-Gothic-Condensed',
		fontSize: 28,
		lineHeight: 28,
		color: color ? color : '#ffffff',
		textTransform: 'uppercase'
	};

	if (!vod) return <></>;

	return (
		<Link
			href={`/video-on-demand/${vod._id}`}
			style={{
				width: width_ratio,
				height: height_ratio,
				position: 'relative',
				overflow: 'hidden',
				borderRadius: 20,
				backgroundColor: '#ffffff',
				borderColor: color ? color : '#ffffff',
				borderWidth: 2
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
				<View
					style={{
						position: 'absolute',
						top: theme_variables.gap / 2,
						right: theme_variables.gap / 2,
						zIndex: 3
					}}
				>
					{/*<CardTag
						text={vod.price > 0 ? `$${(vod.price / 200).toFixed(2)}` : 'Free'}
						backgroundColor={vod.price > 0 ? theme_variables.green500 : theme_variables.secondary}
					/>*/}
				</View>
				<View
					style={{
						width: width_ratio - theme_variables.gap * 2,
						position: 'absolute',
						left: theme_variables.gap,
						bottom: theme_variables.gap - 4,
						zIndex: 3
					}}
				>
					<Text style={text_styles}>{vod.title}</Text>
					<Text style={{ ...text_styles, fontSize: 24, lineHeight: 24 }}>
						{dayjs(vod.created_at).format('MMM DD, YYYY')}
					</Text>
				</View>
				<Image
					source={{ uri: vod.poster.url }}
					style={{
						width: width_ratio,
						height: height_ratio
					}}
				/>
			</View>
		</Link>
	);
}
