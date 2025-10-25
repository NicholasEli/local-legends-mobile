import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Dimensions, Image, Text, View } from 'react-native';
import CardTag from '../../components/CardTag.jsx';
import theme_variables from '../../helpers/theme-variables.js';
import dayjs from 'dayjs';

export default function EventCard({ event, full_width = false }) {
	const { width, height } = Dimensions.get('window');
	let width_ratio = 320;
	if (width < 352) width_ratio = width - theme_variables.gap * 2;
	if (full_width) width_ratio = width - theme_variables.gap * 2;

	const text_styles = {
		maxWidth: '90%',
		fontFamily: theme_variables.gothic,
		fontSize: 20,
		lineHeight: 20,
		color: '#fff',
		textTransform: 'uppercase'
	};

	const date_styles = {
		fontFamily: theme_variables.gothic,
		textTransform: 'uppercase',
		textAlign: 'center',
		color: '#fff'
	};

	if (!event) return <></>;

	return (
		<Link
			href={event?.href ? event.href : `/event/${event._id}`}
			style={{
				paddingTop: theme_variables.gap,
				paddingBottom: theme_variables.gap
			}}
		>
			<View
				style={{
					width: width_ratio,
					backgroundColor: theme_variables.secondary,
					borderRadius: theme_variables.border_radius,
					...theme_variables.box_shadow
				}}
			>
				<View
					style={{
						width: '100%',
						height: '100%',
						position: 'relative',
						overflow: 'hidden',
						borderRadius: theme_variables.border_radius
					}}
				>
					<View
						style={{
							width: '100%',
							height: width_ratio,
							overflow: 'hidden'
						}}
					>
						<Image
							resizeMode="cover"
							source={{ uri: event?.poster ? event.poster.url : theme_variables.banner }}
							style={{
								width: '100%',
								height: '100%'
							}}
						/>
					</View>
					<BlurView
						intensity={2}
						style={{
							width: width_ratio - theme_variables.gap,
							position: 'absolute',
							bottom: theme_variables.gap,
							left: theme_variables.gap / 2,
							padding: theme_variables.gap / 2,
							backgroundColor: 'rgba(255, 255, 255, 0.5)',
							borderRadius: theme_variables.border_radius
						}}
					>
						<Text
							style={{
								...text_styles,
								fontSize: 10,
								lineHeight: 15,
								fontFamily: 'inherit'
							}}
						>
							{event.sport}
						</Text>

						<Text style={{ ...text_styles, marginTop: 2 }} numberOfLines={1}>
							{event.name}
						</Text>
						{event?.address?.city && event?.address?.state && (
							<Text
								style={{
									...text_styles,
									fontSize: 10,
									lineHeight: 10,
									fontFamily: 'inherit'
								}}
							>
								{event.address.city} {event.address.state}
							</Text>
						)}
						{event?.date?.start && (
							<View
								style={{
									maxWidth: 120,
									position: 'absolute',
									top: '25%',
									right: theme_variables.gap,
									zIndex: 2,
									borderBottomLeftRadius: theme_variables.gap,
									borderBottomRightRadius: theme_variables.gap,
									overflow: 'hidden'
								}}
							>
								<Text
									style={{
										...date_styles,
										fontSize: 40,
										lineHeight: 40
									}}
								>
									{dayjs(event.date.start).format('DD')}
								</Text>
								<Text
									style={{
										...date_styles,
										marginTop: -8,
										fontSize: 20,
										lineHeight: 20
									}}
								>
									{dayjs(event.date.start).format('MMM')}
								</Text>
							</View>
						)}
					</BlurView>
				</View>
			</View>
		</Link>
	);
}
