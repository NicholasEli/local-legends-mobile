import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Dimensions, Image, Text, View } from 'react-native';
import theme_variables from '../../helpers/theme-variables.js';

export default function AthleteCard({ user }) {
	if (!user) return <></>;

	return (
		<Link
			href={`/athlete/${user._id}`}
			style={{
				width: theme_variables.gap * 4,
				height: theme_variables.gap * 4,
				paddingTop: 2,
				paddingLeft: 4
			}}
		>
			<View
				style={{
					width: theme_variables.gap * 3.5,
					height: theme_variables.gap * 3.5,
					position: 'relative',
					top: 8,
					left: 8,
					backgroundColor: '#fff',
					borderWidth: 1,
					borderRadius: 100,
					borderColor: '#fff',
					borderRadius: 100,
					...theme_variables.box_shadow
				}}
			>
				<Image
					resizeMode="cover"
					source={{
						uri: user.profile.avatar ? user.profile.avatar.url : theme_variables.logo
					}}
					style={{
						width: '100%',
						height: '100%',
						position: 'relative',
						overflow: 'hidden',
						borderRadius: 100
					}}
				/>
			</View>
		</Link>
	);
}
