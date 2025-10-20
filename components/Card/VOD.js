import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Dimensions, Image, Text, View } from 'react-native';
import CardTag from '../../components/CardTag.jsx';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import theme_variables from '../../helpers/theme-variables.js';
import dayjs from 'dayjs';

export default function VODCard({ vod, full_width, owned, color }) {
	const { width, height } = Dimensions.get('window');
	let width_ratio = 320;
	if (width < 352) width_ratio = width - theme_variables.gap * 2;
	if (full_width) width_ratio = width - theme_variables.gap * 2;

	const height_ratio = width_ratio * theme_variables.ratio_16_9;

	const text_styles = {
		fontFamily: 'League-Gothic',
		fontSize: 20,
		lineHeight: 24,
		color: color ? color : '#ffffff',
		textTransform: 'uppercase'
	};

	const icon_styles = {
		position: 'absolute',
		bottom: theme_variables.gap / 1.25,
		right: theme_variables.gap / 2,
		zIndex: 2
	};

	if (!vod) return <></>;

	return (
		<View
			style={{
				width: width_ratio,
				height: height_ratio,
				position: 'relative',
				borderRadius: theme_variables.border_radius,
				...theme_variables.box_shadow
			}}
		>
			<Link
				href={vod.href || `/video-on-demand/${vod._id}`}
				style={{
					flex: 1,
					borderRadius: theme_variables.border_radius,
					overflow: 'hidden'
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
						colors={['transparent', theme_variables.secondary]}
						locations={[0, 0.9]}
						start={{ x: 0, y: 0 }}
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
					<BlurView
						intensity={2}
						style={{
							width: width_ratio - theme_variables.gap,
							position: 'absolute',
							left: theme_variables.gap / 2,
							bottom: theme_variables.gap / 2,
							zIndex: 3,
							padding: theme_variables.gap / 2,
							backgroundColor: 'rgba(255, 255, 255, 0.5)',
							borderRadius: theme_variables.border_radius
						}}
					>
						{vod.created_at && (
							<Text style={{ ...text_styles, fontSize: 16, lineHeight: 16 }}>
								Release Date {dayjs(vod.created_at).format('MM.DD.YYYY')}
							</Text>
						)}
						<Text style={text_styles} numberOfLines={1}>
							{vod.title}
						</Text>
						{vod.created_at && (
							<View style={icon_styles}>
								<FontAwesome name="play-circle" size={32} color="#ffffff" />
							</View>
						)}
					</BlurView>
					<Image
						source={{
							uri: vod.banner ? vod.banner.url : 'https://locallegends.live/placeholder-banner.png'
						}}
						style={{
							width: width_ratio,
							height: height_ratio
						}}
					/>
				</View>
			</Link>
		</View>
	);
}
