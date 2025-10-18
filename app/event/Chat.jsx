import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	Pressable,
	ScrollView,
	View,
	Image,
	Text,
	StyleSheet
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
//import Chat from '@codsod/react-native-chat';
import Chat from '../../libs/Chat';
import Toast from 'react-native-toast-message';
import { set_chat_message } from '../../api/chat.js';
import { get_users } from '../../api/users.js';
import { get_auth_token } from '../../helpers/auth.js';
import { get_active_heat } from '../../helpers/heat.js';
import theme_variables from '../../helpers/theme-variables.js';

const Events = new Mongo.Collection('events');
const ChatCollection = new Mongo.Collection('chat');

function Messages({ live_event, event, user, chat, loading }) {
	const { width, height } = Dimensions.get('window');

	const [active, setActive] = useState(false);
	const [athletes, setAthletes] = useState([]);

	const set_message = async function (value) {
		if (!value) return null;

		const token = await get_auth_token();
		if (!token) {
			Alert.alert('Account Required', 'You must be logged in to participate', [
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Login/Sign Up', onPress: () => router.push('/login') }
			]);
			return;
		}

		if (!user?.profile?.firstname) {
			let url = `/athlete/${user._id}`;
			if (user.profile.spectator) url = `/spectator/${user._id}`;

			Alert.alert('Account Details Required', 'First and last name are required', [
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Update Profile', onPress: () => router.push(url) }
			]);
			return;
		}

		const req = await set_chat_message({ token, event_id: event._id, text: value });

		if (!req) return alert('Something went wrong.');
		if (req.error) return alert(req.error);
	};

	const vote = async function (athlete) {
		if (!athlete) return null;

		const token = await get_auth_token();
		if (!token) {
			Alert.alert('Account Required', 'You must be logged in to participate', [
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Login/Sign Up', onPress: () => router.push('/login') }
			]);
			return;
		}

		const req = await set_chat_message({
			token,
			event_id: event._id,
			vote: {
				id: athlete._id,
				firstname: athlete.profile.firstname,
				lastname: athlete.profile.lastname,
				avatar: athlete.profile.avatar
			}
		});

		if (!req) return alert('Something went wrong.');
		if (req.error) return alert(req.error);

		Toast.show({
			type: 'success',
			text1: 'Boom!',
			text2: `Your vote was cast for ${athlete.profile.firstname} ${athlete.profile.lastname}`,
			backgroundColor: '#000000',
			textColor: theme_variables.yellow500,
			iconColor: theme_variables.yellow500,
			iconSize: 24,
			progressBarColor: theme_variables.yellow500,
			theme: 'dark',
			closeIcon: 'times-circle',
			closeIconFamily: 'FontAwesome'
		});
	};

	const can_vote = function () {
		const heat = get_active_heat(live_event, athletes);

		if (!heat?.display_public_votes) return false;
		if (!live_event.enabled.voting) return false;

		let has_voted = false;
		Object.keys(heat.athletes).forEach((key) => {
			const athlete = heat.athletes[key];
			if (athlete.public_votes[user._id]) has_voted = true;
		});

		if (has_voted) return false;

		return true;
	};

	const message = function (item) {
		const obj = {
			_id: item._id,
			text: item.text,
			createdAt: item.created_at,
			user: {
				_id: item.profile.id,
				name: item.profile.nickname,
				avatar: item.profile.avatar ? item.profile.avatar : theme_variables.logo
			}
		};

		if (item?.vote?.athlete?.id) {
			obj.vote = item.vote;
			obj.text = `+1 ${item.vote.athlete.firstname} ${item.vote.athlete.lastname}`;
		}

		return obj;
	};

	const chat_user = function () {
		return user
			? {
					_id: user._id,
					name: `${user.profile.firstname} ${user.profile.lastname}`
				}
			: null;
	};

	useEffect(() => {
		(async () => {
			const athlete_ids = live_event.athletes
				.filter((athlete) => athlete.athlete_id)
				.map((athlete) => athlete.athlete_id);

			const req_athletes = await get_users(athlete_ids);

			setAthletes([...req_athletes]);
		})();
	}, []);

	return (
		<>
			<View
				style={{
					width: 50,
					height: 50,
					position: 'absolute',
					right: theme_variables.gap,
					bottom: theme_variables.gap,
					zIndex: 2,
					...theme_variables.flex_center,
					backgroundColor: theme_variables.primary,
					borderRadius: 100,
					borderWidth: 1,
					borderColor: '#ffffff'
				}}
			>
				<Pressable onPress={() => setActive(true)}>
					<Ionicons name="chatbubble-ellipses-outline" size={30} color="#ffffff" />
				</Pressable>
			</View>

			{active && (
				<View
					style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 4,
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						backgroundColor: '#ffffff'
					}}
				>
					<View style={{ zIndex: 2 }}>
						<Toast />
					</View>

					{can_vote() && (
						<View
							style={{
								width: '100%',
								height: theme_variables.gap * 4,
								backgroundColor: '#000000',
								borderTopWidth: 2,
								borderBottomWidth: 2,
								borderColor: theme_variables.yellow500
							}}
						>
							<LinearGradient
								colors={['#333333', '#000000']}
								locations={[0, 0.75]}
								start={{ x: 0.75, y: 0 }}
								end={{ x: 0, y: 1 }}
								style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
							/>
							<Carousel
								loop
								width={width}
								height={theme_variables.gap * 4}
								style={{
									position: 'relative',
									zIndex: 2
								}}
								autoPlay
								data={athletes}
								autoPlayInterval={5000}
								scrollAnimationDuration={500}
								renderItem={({ item }) => (
									<View
										style={{
											width: width - theme_variables.gap * 2,
											height: theme_variables.gap * 3,
											...theme_variables.padding_half_horizontal,
											marginTop: theme_variables.gap / 2.5,
											marginLeft: theme_variables.gap,
											...theme_variables.flex_center,
											textAlign: 'center',
											backgroundColor: theme_variables.yellow500,
											borderRadius: 100,
											borderWidth: 2,
											borderColor: '#000000'
										}}
									>
										<Pressable
											style={{
												width: '100%',
												...theme_variables.flex_row,
												gap: theme_variables.gap / 2
											}}
											onPress={() => vote(item)}
										>
											<View
												style={{
													width: theme_variables.gap * 2.5,
													height: theme_variables.gap * 2.5,
													overflow: 'hidden',
													backgroundColor: '#ffffff',
													borderRadius: 100,
													borderWidth: 1,
													borderColor: '#000000'
												}}
											>
												<Image
													style={{
														width: '100%',
														height: '100%'
													}}
													source={{
														uri: item.profile.avatar
															? item.profile.avatar.url
															: theme_variables.logo
													}}
												/>
											</View>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														color: '#000000',
														fontFamily: theme_variables.gothic_italic,
														fontSize: 12,
														textTransform: 'uppercase'
													}}
												>
													Cast Your Vote For
												</Text>
												<Text
													style={{
														color: '#000000',
														fontFamily: theme_variables.gothic_italic,
														fontSize: 20
													}}
												>
													{item.profile.firstname} {item.profile.lastname}
												</Text>
											</View>
										</Pressable>
									</View>
								)}
							/>
						</View>
					)}
					<Chat
						messages={chat.map((item) => message(item))}
						user={chat_user()}
						setMessages={(val) => set_message(val)}
						themeColor={theme_variables.primary}
						themeTextColor="white"
						showSenderAvatar={false}
						showReceiverAvatar={true}
						inputBorderColor={theme_variables.primary}
						backgroundColor="#fff"
						inputBackgroundColor="white"
						placeholder="Enter Your Message"
						placeholderColor={theme_variables.gray600}
						showEmoji={true}
						timeContainerColor={theme_variables.secondary}
						timeContainerTextColor="white"
					/>
					<View
						style={{
							width: '100%',
							height: 40,
							backgroundColor: theme_variables.secondary
						}}
					>
						<Pressable
							onPress={() => setActive(false)}
							style={{
								flex: 1,
								...theme_variables.flex_center
							}}
						>
							<Text
								style={{
									fontSize: 15,
									fontFamily: theme_variables.gothic,
									color: '#ffffff',
									textAlign: 'center',
									textTransform: 'uppercase'
								}}
							>
								Close Chat
							</Text>
							<Ionicons name="close-sharp" size={20} color="#ffffff" />
						</Pressable>
					</View>
				</View>
			)}
		</>
	);
}

export default function EventRoute({ event, user }) {
	const params = useLocalSearchParams();
	const { id } = params;

	const Chat = withTracker(() => {
		const event_handle = Meteor.subscribe('event.get', { _id: id });
		const chat_handle = Meteor.subscribe('chat.messages.event.get', { event_id: id });

		return {
			loading: !event_handle.ready() && !chat_handle.ready(),
			event,
			user,
			chat: ChatCollection.find({ event_id: id }).fetch().reverse(),
			live_event: Events.findOne({ _id: id })
		};
	})(Messages);

	return <Chat />;
}
