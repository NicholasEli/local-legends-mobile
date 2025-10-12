import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, Text, View } from 'react-native';
import theme_variables from '../../helpers/theme-variables.js';

export default function AthleteCard({ user, full_width }) {
	const { width, height } = Dimensions.get('window');
	let width_ratio = 320;
	if (full_width) width_ratio = width - theme_variables.gap * 2;

	if (!user) return <></>;
	return (
		<Link
			href={`/athlete/${user._id}`}
			style={{
				width: width_ratio,
				borderRadius: 10,
				backgroundColor: '#ffffff',
				overflow: 'hidden',
				borderColor: '#ffffff',
				borderWidth: 2
			}}
		>
			<View
				style={{
					width: width_ratio,
					paddingTop: theme_variables.gap / 2,
					paddingBottom: theme_variables.gap / 2,
					paddingLeft: theme_variables.gap / 2,
					paddingRight: theme_variables.gap / 2,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
					gap: theme_variables.gap
				}}
			>
				<Image
					source={{
						uri: user.profile.avatar ? user.profile.avatar.url : theme_variables.logo
					}}
					style={{
						width: 64,
						height: 64,
						borderRadius: 100,
						borderWidth: 2,
						borderColor: theme_variables.primary
					}}
				/>
				<View
					style={{
						width: width_ratio - 64 - theme_variables.gap * 2
					}}
				>
					<Text
						style={{
							fontFamily: 'League-Gothic-Condensed',
							fontSize: 28,
							lineHeight: 28,
							color: theme_variables.secondary
						}}
					>
						{user.profile.firstname} {user.profile.lastname}
					</Text>
					<Text
						style={{
							fontSize: 10,
							lineHeight: 10,
							color: theme_variables.gray900,
							fontFamily: 'inherit',
							textTransform: 'uppercase'
						}}
					>
						{user.profile.athlete.hometown.city}, {user.profile.athlete.hometown.state}
					</Text>
				</View>
			</View>
		</Link>
	);
}
