import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
		fontFamily: 'League-Gothic-Condensed',
		fontSize: 28,
		lineHeight: 28,
		color: theme_variables.secondary,
		textTransform: 'uppercase'
	};

	const date_styles = {
		fontFamily: 'League-Gothic',
		color: '#000000',
		textTransform: 'uppercase',
		textAlign: 'center'
	};

	if (!event) return <></>;

	return (
		<Link
			href={`/event/${event._id}`}
			style={{
				width: width_ratio,
				position: 'relative',
				overflow: 'hidden',
				borderRadius: 20,
				backgroundColor: '#ffffff',
				borderColor: '#ffffff',
				borderWidth: 2
			}}
		>
			<View>
				<View
					style={{
						position: 'absolute',
						top: theme_variables.gap,
						right: theme_variables.gap / 2,
						zIndex: 3
					}}
				>
					{event.stream.playing && <CardTag text="Live Stream" />}
					{!event.stream.playing && event.athletes.length > 0 && (
						<CardTag text="Live Results" backgroundColor={theme_variables.secondary} />
					)}
				</View>
				<Image
					source={{ uri: event.banner.url }}
					style={{
						width: width_ratio,
						height: width_ratio,
						position: 'relative',
						zIndex: 1
					}}
				/>
			</View>
			<View
				style={{
					width: width_ratio,
					height: 96,
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					paddingLeft: theme_variables.gap,
					paddingRight: theme_variables.gap
				}}
			>
				<Text style={text_styles}>{event.name}</Text>
				<Text
					style={{
						...text_styles,
						fontSize: 10,
						lineHeight: 10,
						color: theme_variables.gray900,
						fontFamily: 'inherit'
					}}
				>
					{event.address.city} {event.address.state}
				</Text>
				<View
					style={{
						maxWidth: 120,
						position: 'absolute',
						top: theme_variables.gap / 2,
						right: theme_variables.gap / 2,
						zIndex: 2
					}}
				>
					<Text
						style={{
							...date_styles,
							fontSize: 64,
							lineHeight: 64
						}}
					>
						{dayjs(event.date.start).format('DD')}
					</Text>
					<Text
						style={{
							...date_styles,
							marginTop: -8,
							fontSize: 24,
							lineHeight: 24
						}}
					>
						{dayjs(event.date.start).format('MMM')}
					</Text>
				</View>
			</View>
		</Link>
	);
}
