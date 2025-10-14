import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import EventCard from '../components/Card/Event.js';
import VODCard from '../components/Card/VOD.js';
import AthleteCard from '../components/Card/Athlete.js';
import PlaceholderCard from '../components/Card/Placeholder.js';
import theme_variables from '../helpers/theme-variables.js';

export default function Scroller({
	title,
	events,
	vods,
	athletes,
	placeholders,
	owned,
	marginTop = theme_variables.gap / 2,
	color
}) {
	const { width, height } = Dimensions.get('window');
	const ratio = width * theme_variables.ratio_16_9;

	const container_styles = {
		width,
		marginTop,
		paddingLeft: theme_variables.gap,
		position: 'relative'
	};

	const card_styles = {
		marginTop: theme_variables.gap,
		marginBottom: theme_variables.gap
	};

	const text_styles = {
		marginBottom: theme_variables.gap / 2,
		fontFamily: 'League-Gothic-Condensed',
		fontSize: 36,
		lineHeight: 36,
		color: '#ffffff',
		textTransform: 'uppercase'
	};

	let obj = null;
	if (events) obj = events;
	if (vods) obj = vods;
	if (athletes) obj = athletes;
	if (placeholders) obj = placeholders;

	return (
		<View style={container_styles}>
			{title && <Text style={text_styles}>{title}</Text>}

			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{events &&
					events.map((event, index) => (
						<View key={index} style={{ marginLeft: index > 0 ? theme_variables.gap : 0 }}>
							<EventCard event={event} color={color} />
						</View>
					))}

				{vods &&
					vods.map((vod, index) => (
						<View
							key={index}
							style={{
								...card_styles,
								marginLeft: index > 0 ? theme_variables.gap : 0
							}}
						>
							<VODCard vod={vod} owned={owned} color={color} />
						</View>
					))}

				{athletes &&
					athletes.map((athlete, index) => (
						<View key={index} style={{ marginLeft: index > 0 ? theme_variables.gap : 0 }}>
							<AthleteCard user={athlete} color={color} />
						</View>
					))}

				{placeholders &&
					placeholders.map((event, index) => (
						<View
							key={index}
							style={{
								...card_styles,
								marginLeft: index > 0 ? theme_variables.gap : 0
							}}
						>
							<PlaceholderCard color={color} />
						</View>
					))}
				{obj.length > 1 && (
					<View
						style={{
							...card_styles,
							width: theme_variables.gap * 2,
							height: '100%'
						}}
					/>
				)}
			</ScrollView>
		</View>
	);
}
