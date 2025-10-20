import Meteor from '@meteorrn/core';
import { useNavigation, useRouter, Link, useSegments, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { Dimensions, View, Pressable, Image, Text } from 'react-native';
import auth from '../api/auth.js';
import theme_variables from '../helpers/theme-variables.js';
import { get_auth_token } from '../helpers/auth.js';
import routes from '../helpers/routes.js';

const blur_styles = {
	width: 40,
	height: 40,
	zIndex: 2,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden'
};

export default function Navigation() {
	const segments = useSegments();
	const router = useRouter();
	const path = usePathname();
	const { width } = Dimensions.get('window');

	const [user, setUser] = useState(null);
	const [back_btn, setBackBtn] = useState(false);

	const redirect_back = function () {
		if (!user) {
			router.back();
			return;
		}

		if (path.indexOf('/athlete/') > -1 || path.indexOf('/spectator/') > -1) {
			router.push('/');
			return;
		}

		router.back();
	};

	const redirect_to_auth = async function () {
		const token = await get_auth_token();
		if (!token) {
			setUser(null);
			router.push('/login');
			return;
		}

		if (!user) {
			router.push('/login');
			return;
		}

		if (user.profile.athlete) {
			router.push(`/athlete/${user._id}`);
			return;
		}

		if (user.profile.spectator) {
			router.push(`/spectator/${user._id}`);
			return;
		}

		router.push('/');
	};

	const display_account_btn = function () {
		if (path.indexOf('athlete') > -1) return false;
		if (path.indexOf('spectator') > -1) return false;

		return true;
	};

	useEffect(() => {
		(async () => {
			if (user) return;

			const token = await get_auth_token();
			if (!token) return;

			const req_user = await auth.user(token);

			if (!req_user?._id) return;

			setUser(req_user);
		})();
	}, [segments]);

	return (
		<View
			style={{
				width,
				position: 'relative',
				zIndex: 2,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: '#000',
				...theme_variables.padding_half
			}}
		>
			<View style={{ ...blur_styles }}>
				{router.canGoBack() && (
					<Pressable onPress={() => redirect_back()}>
						<Entypo name="chevron-small-left" size={32} color="#fff" />
					</Pressable>
				)}
			</View>

			<Pressable
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: theme_variables.gap / 2
				}}
				onPress={() => router.push('/')}
			>
				<Image width={30} height={30} source={{ uri: theme_variables.logo_light }} />
			</Pressable>

			<View style={{ ...blur_styles }}>
				{display_account_btn() && (
					<Pressable onPress={redirect_to_auth}>
						<MaterialCommunityIcons name="lightning-bolt" size={24} color="#fff" />
					</Pressable>
				)}
			</View>
		</View>
	);
}
