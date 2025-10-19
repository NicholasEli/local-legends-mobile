import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import EJSON from 'ejson';
import Banner from '../../components/Banner.js';
import Scroller from '../../components/Scroller.js';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import theme_variables from '../../helpers/theme-variables.js';
import { placeholders } from '../../helpers/card.js';
import { get_auth_token, remove_auth_token } from '../../helpers/auth.js';
import { button_styles, button_text_styles } from '../../helpers/button.js';
import { input_styles } from '../../helpers/input.js';
import auth from '../../api/auth.js';
import { get_athlete } from '../../api/athlete.js';
import { get_users } from '../../api/users.js';
import { get_athlete_vod_previews, get_purchased_vods } from '../../api/videos-on-demand.js';
import { get_athlete_events } from '../../api/events.js';
import { get_purchases } from '../../api/purchases.js';
import { update_user } from '../../api/user.js';
import { set_athlete_follow } from '../../api/athlete.js';
import SPORTS from '../../types/SPORTS.js';
import SEX from '../../types/SEX.js';
import STANCE from '../../types/STANCE.js';
import SOCIALS from '../../types/SOCIALS.js';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export default function Athlete() {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const params = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [vods, setVODs] = useState([]);
  const [events, setEvents] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [details_modal, setDetailsModal] = useState(false);

  const avatar_width = width / 3;
  const avatar_styles = {
    width: avatar_width,
    height: avatar_width,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#000'
  };

  const avatar_img_styles = {
    width: avatar_width,
    height: avatar_width
  };

  const action_button_styles = {
    textTransform: 'uppercase',
    color: '#ffffff'
  };

  const label_styles = {
    color: theme_variables.primary,
    fontSize: 20,
    fontFamily: theme_variables.gothic,
    textTransform: 'uppercase'
  };

  const divider_styles = {
    width: '100%',
    height: 1,
    marginTop: theme_variables.gap * 2,
    marginBottom: theme_variables.gap * 2,
    backgroundColor: theme_variables.gray900
  };

  const set_image = async function (type = 'avatar') {
    if (!account) return null;
    if (user._id != account._id) return null;

    const _user = EJSON.clone(user);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access photos is required!');
      return null;
    }

    // Open gallery
    const img_req = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1
    });

    if (!img_req.canceled) {
      setLoading(true);

      const image = img_req.assets[0];
      const filename = `${type}-${new Date().getTime()}-${user._id}.jpg`;
      const body = Uint8Array.from(atob(image.base64), (c) => c.charCodeAt(0));

      if (type == 'avatar') {
        _user.profile.avatar = {
          name: filename,
          url: `https://locallegendslive.b-cdn.net/${filename}`,
          created_at: new Date()
        };
      } else {
        _user.profile.athlete.banner = {
          name: filename,
          url: `https://locallegendslive.b-cdn.net/${filename}`,
          created_at: new Date()
        };
      }

      let bunny_req = await fetch(`https://la.storage.bunnycdn.com/locallegendslive/${filename}`, {
        method: 'PUT',
        headers: {
          AccessKey: 'e69b8107-79ee-4e51-96597176edea-b891-429c',
          'Content-Type': 'application/octet-stream',
          Accept: 'application/json'
        },
        body
      });

      bunny_req = await bunny_req.json();

      const token = await get_auth_token();
      if (!token) {
        setLoading(false);
        return null;
      }

      const req = await update_user({ user: _user, token });

      if (!req || (req && !req._id)) {
        setLoading(false);
        alert('Error: Profile could not be updated');
        return null;
      }

      setUser(req);
      setLoading(false);

      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Your profile has been updated'
      });
    }
  };

  const set_profile_fields = function (key, value) {
    const _user = EJSON.clone(user);
    _user.profile[key] = value;
    setUser(_user);
  };

  const set_athlete_fields = function (key, value) {
    const _user = EJSON.clone(user);
    _user.profile.athlete[key] = value;
    setUser(_user);
  };

  const set_hometown_fields = function (key, value) {
    const _user = EJSON.clone(user);
    _user.profile.athlete.hometown[key] = value;
    setUser(_user);
  };

  const set_social_fields = function (key, value) {
    const _user = EJSON.clone(user);
    _user.profile.athlete.socials[key] = value;
    setUser(_user);
  };

  const update = async function () {
    setDetailsModal(false);
    setLoading(true);

    const token = await get_auth_token();
    if (!token) {
      setLoading(false);
      return null;
    }

    const req = await update_user({ user, token });
    if (!req || (req && !req._id)) {
      setLoading(false);
      alert('Error: Profile could not be updated');
      return null;
    }

    setUser(req);
    setLoading(false);
    Toast.show({
      type: 'success',
      text1: 'Updated',
      text2: 'Your profile has been updated'
    });
  };

  const location = function () {
    let city = '';
    let state = '';
    let country = '';
    let str = '';

    if (hometown.city) {
      const _city = hometown.city.toLowerCase();
      if (_city != 'city') city = hometown.city;
    }

    if (hometown.state) {
      const _state = hometown.state.toLowerCase();
      if (state != 'state') state = hometown.state;
    }

    if (hometown.country) {
      const _country = hometown.country.toLowerCase();
      if (country != 'country') country = hometown.country;
    }

    if (city) str += city;
    if (state) str += ` ${state}`;
    if (city && state) str += `, ${country}`;

    return str;
  };

  const follow = async function () {
    if (!account) {
      Alert.alert('Account Required', 'You must be logged in to follow this athlete', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login/Sign Up', onPress: () => router.push('/signup') }
      ]);
      return;
    }

    const follow_req = await set_athlete_follow({ id: user._id, user_id: account._id });

    const _user = EJSON.clone({ ...user });
    _user.profile.followers[account._id] = follow_req;
    setUser(_user);
  };

  const logout = async function () {
    await remove_auth_token();
    router.push('/');
  };

  const request_push_notification_permission = async () => {
    console.clear();
    const tokenListener = Notifications.addPushTokenListener((token) => {
      console.log('Device Push Token Listener:', token.data);
    });

    // Ask for permissions
    console.log('Ask Permissions');
    const { status: exiting_status } = await Notifications.getPermissionsAsync();
    let final_status = exiting_status;

    console.log('exiting_status');
    if (exiting_status !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      final_status = status;
    }

    console.log('final_status');
    if (final_status !== 'granted') {
      console.log('Push notification permission denied');
      return;
    }
    console.log('token');
    // Get the Expo push token
    const token = await Notifications.getDevicePushTokenAsync();
    console.log('Device Push Token:', token);

    // Optionally send the token to your server here
  };

  useEffect(() => {
    (async () => {
      const req_user = await get_athlete({ id: params.id });
      if (!req_user) return;

      if (req_user.profile.followers) {
        const req_followers = await get_users(Object.keys(req_user.profile.followers));
        setFollowers(req_followers);
      }

      const req_vods = await get_athlete_vod_previews({ id: params.id });
      setVODs(req_vods);

      const req_events = await get_athlete_events({ id: params.id });
      setEvents(req_events);

      const token = await get_auth_token();
      if (token) {
        const req_account = await auth.user(token);
        if (req_account?._id) {
          setAccount(req_account);
          //request_push_notification_permission();
        }

        const req_purchases = await get_purchases({ token });

        if (req_purchases && !req_purchases.error) {
          let purchased_vods = req_purchases
            .filter((purchase) => purchase.vod_id)
            .map((purchase) => purchase.vod_id);

          purchased_vods = await get_purchased_vods({ token, vod_ids: purchased_vods });

          setPurchases(purchased_vods);
        }
      }

      setUser(req_user);
    })();
  }, []);

  if (!user?.profile?.athlete) return <></>;

  let is_user = false;
  if (account && account._id == user._id) is_user = true;
  const { firstname, lastname, avatar } = user.profile;
  const { hometown, sport, gender, stance, bio, dob, socials } = user.profile.athlete;

  return (
    <>
      <View style={{ zIndex: 10 }}>
        <Toast />
      </View>
      {loading && (
        <BlurView
          intensity={5}
          style={{
            width,
            height,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.25)'
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </BlurView>
      )}
      <ScrollView style={{ flex: 1 }}>
        <Pressable style={{ position: 'relative ' }} onPress={() => set_image('banner')}>
          <View
            style={{
              backgroundColor: '#000',
              borderBottomWidth: 2,
              borderColor: '#fff'
            }}
          >
            <Banner
              uri={
                user.profile.athlete?.banner?.url
                  ? user.profile.athlete.banner.url
                  : theme_variables.banner
              }
              styles={{
                width: '100%',
                borderRadius: 0
              }}
              linear_gradient={false}
            />
          </View>
          {is_user && (
            <View
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                top: theme_variables.gap,
                right: theme_variables.gap,
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                borderColor: theme_variables.yellow500,
                borderWidth: 1,
                backgroundColor: '#000000'
              }}
            >
              <Pressable onPress={() => setDetailsModal(true)}>
                <AntDesign name="edit" size={20} color={theme_variables.yellow500} />
              </Pressable>
            </View>
          )}
        </Pressable>
        <View
          style={{
            position: 'relative',
            top: avatar_width * -0.5,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Avatar */}
          <View style={avatar_styles}>
            <Pressable onPress={() => set_image('avatar')}>
              {avatar && <Image style={avatar_img_styles} source={{ uri: avatar.url }} />}
              {!avatar && (
                <Image style={avatar_img_styles} source={{ uri: theme_variables.logo }} />
              )}
            </Pressable>
          </View>

          {/* Name */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme_variables.gap / 2,
              marginTop: theme_variables.gap
            }}
          >
            <Text style={{ fontFamily: 'League-Gothic', color: '#ffffff', fontSize: 40 }}>
              {firstname} {lastname}
            </Text>
          </View>

          {/* Location */}
          {location() && (
            <View
              style={{
                width,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme_variables.gap / 2
              }}
            >
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontFamily: 'League-Gothic',
                  color: '#ffffff',
                  fontSize: 20,
                  textAlign: 'center'
                }}
              >
                {location()}
              </Text>
            </View>
          )}

          {/* Socials */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: theme_variables.gap / 2,
              marginTop: theme_variables.gap / 2
            }}
          >
            {Object.keys(user.profile.athlete.socials).map((social, index) => {
              const url = user.profile.athlete.socials[social];
              const size = 20;

              if (url && social == 'website') {
                return (
                  <Link key={index} href={url}>
                    <MaterialCommunityIcons name="web" size={size} color="#fff" />
                  </Link>
                );
              }

              if (url && social == 'x') {
                return (
                  <Link key={index} href={url}>
                    <FontAwesome5 name="twitter" size={size} color="#fff" />
                  </Link>
                );
              }

              if (url) {
                return (
                  <Link key={index} href={url}>
                    <FontAwesome5 name={social} size={size} color="#fff" />
                  </Link>
                );
              }
            })}
          </View>

          {/* Bio */}
          {bio && (
            <View
              style={{
                marginTop: theme_variables.gap,
                paddingLeft: theme_variables.gap,
                paddingRight: theme_variables.gap
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: '#ffffff'
                }}
              >
                {bio}
              </Text>
            </View>
          )}

          {/* Actions */}
          {!is_user && account && (
            <View
              style={{
                width,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: theme_variables.gap
              }}
            >
              {!user.profile.followers[account._id] && (
                <Pressable
                  style={{
                    maxWidth: 160,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...button_styles({})
                  }}
                  onPress={() => follow()}
                >
                  <Text style={action_button_styles}>Follow</Text>
                  <AntDesign name="plus" size={theme_variables.gap} color="#ffffff" />
                </Pressable>
              )}

              {user.profile.followers[account._id] && (
                <Pressable
                  style={{
                    maxWidth: 160,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...button_styles({ backgroundColor: theme_variables.gray100 })
                  }}
                  onPress={() => follow()}
                >
                  <Text style={{ ...action_button_styles, color: theme_variables.gray600 }}>
                    Following
                  </Text>
                  <AntDesign
                    name="plus"
                    size={theme_variables.gap}
                    color={theme_variables.gray600}
                  />
                </Pressable>
              )}
            </View>
          )}

          {/* Uplaod Sell Get Paid */}
          {is_user && user.profile.athlete && (
            <View
              style={{
                width,
                marginTop: theme_variables.gap * 2,
                paddingLeft: theme_variables.gap,
                paddingRight: theme_variables.gap
              }}
            >
              <View
                style={{
                  padding: theme_variables.gap,
                  marginTop: theme_variables.gap,
                  backgroundColor: theme_variables.stripe,
                  borderRadius: 20
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontFamily: theme_variables.gothic,
                    fontSize: 24,
                    textTransform: 'uppercase'
                  }}
                >
                  Upload. Share. Grow.
                </Text>

                {!user.stripe_account_id && (
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 14,
                      lineHeight: 20
                    }}
                  >
                    Upload and share your video content across the Local Legends network. To manage
                    your creator account and publishing tools, please visit our website.
                  </Text>
                )}
                <Link
                  href="https://locallegends.live/login"
                  style={{
                    ...button_styles({ backgroundColor: 'transparent' }),
                    width: 140,
                    marginTop: theme_variables.gap,
                    borderColor: '#ffffff',
                    borderWidth: 1
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {!user.stripe_account_id && (
                      <Text style={{ ...button_text_styles({}) }}>Get Started</Text>
                    )}
                    {user.stripe_account_id && (
                      <Text style={{ ...button_text_styles({}) }}>Upload Content</Text>
                    )}
                  </View>
                </Link>
              </View>
            </View>
          )}

          {/* Purchases */}
          {is_user && purchases?.length > 0 && (
            <View
              style={{
                width,
                marginTop: theme_variables.gap * 2,
                paddingLeft: theme_variables.gap,
                paddingRight: theme_variables.gap
              }}
            >
              <Scroller
                title="Your Purchases"
                vods={purchases}
                owned={true}
                color={theme_variables.green500}
              />
            </View>
          )}

          {/* Videos On Demand */}
          <View
            style={{
              width,
              marginTop: theme_variables.gap * 2,
              paddingLeft: theme_variables.gap,
              paddingRight: theme_variables.gap
            }}
          >
            {vods.length > 0 && (
              <Scroller title={is_user ? 'Your Uploads' : 'Videos On Demand'} vods={vods} />
            )}
            {vods.length <= 0 && (
              <Scroller
                title={is_user ? 'Your Uploads' : 'Videos On Demand'}
                placeholders={placeholders({ num: 4 })}
              />
            )}
          </View>

          {/* Events */}
          <View
            style={{
              width,
              marginTop: theme_variables.gap * 2,
              paddingLeft: theme_variables.gap,
              paddingRight: theme_variables.gap
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontFamily: 'League-Gothic',
                color: '#ffffff',
                textTransform: 'uppercase'
              }}
            >
              Event History
            </Text>

            {events.length > 0 && <Scroller events={events} />}
            {events.length <= 0 && <Scroller placeholders={placeholders({ num: 4 })} />}
          </View>

          {/* Followers */}
          {followers && followers.length > 0 && (
            <View
              style={{
                width,
                marginTop: theme_variables.gap * 2,
                paddingLeft: theme_variables.gap,
                paddingRight: theme_variables.gap
              }}
            >
              <Text
                style={{
                  marginBottom: theme_variables.gap,
                  fontSize: 32,
                  fontFamily: 'League-Gothic',
                  color: '#ffffff',
                  textTransform: 'uppercase'
                }}
              >
                Followers
              </Text>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: theme_variables.gap
                }}
              >
                {followers.map((follower, index) => {
                  const width = theme_variables.gap * 4;
                  const height = theme_variables.gap * 4;
                  let uri = theme_variables.logo;

                  if (follower.profile.spectator || follower.profile.organization) {
                    return <></>;
                  }

                  if (follower.profile.avatar) {
                    uri = follower.profile.avatar.url;
                  }

                  return (
                    <Link
                      key={index}
                      href={`/athlete/${follower._id}`}
                      style={{
                        width,
                        height,
                        borderRadius: 100,
                        borderWidth: 1,
                        borderColor: theme_variables.primary,
                        overflow: 'hidden'
                      }}
                    >
                      <Image
                        source={{ uri }}
                        style={{
                          width,
                          height
                        }}
                      />
                    </Link>
                  );
                })}

                {is_user && followers.length == 0 && (
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'League-Gothic',
                      color: '#ffffff',
                      textTransform: 'uppercase'
                    }}
                  >
                    No followers yet
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Logout */}
          {is_user && (
            <View style={{ marginTop: theme_variables.gap * 2 }}>
              <View style={{ ...button_styles({}) }}>
                <Pressable onPress={() => logout()}>
                  <Text style={{ ...button_text_styles({}) }}>Logout</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Form */}
      <Modal
        animationType="slide"
        visible={details_modal}
        onRequestClose={() => {
          setDetailsModal(false);
        }}
      >
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 25
          }}
        >
          <ScrollView
            style={{
              width: '100%',
              flex: 1,
              padding: theme_variables.gap,
              paddingTop: 100
            }}
          >
            <Text style={{ ...label_styles }}>Profile Details</Text>

            <View
              style={{
                width: 260,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme_variables.gap / 2,
                marginTop: theme_variables.gap
              }}
            >
              <MaterialCommunityIcons name="camera-front-variant" size={24} color="black" />
              <Text>
                To edit your banner and profile pic, close this modal and tap each photo area.
              </Text>
            </View>

            <TextInput
              style={{ ...input_styles, color: '#000', marginTop: theme_variables.gap }}
              onChangeText={(value) => set_profile_fields('firstname', value)}
              value={firstname}
              placeholder="First Name"
              keyboardType="default"
              inputMode="text"
              placeholderTextColor={theme_variables.gray900}
            />

            <TextInput
              style={{ ...input_styles, color: '#000', marginTop: theme_variables.gap }}
              onChangeText={(value) => set_profile_fields('lastname', value)}
              value={lastname}
              placeholder="Last Name"
              keyboardType="default"
              inputMode="text"
              placeholderTextColor={theme_variables.gray900}
            />

            <TextInput
              editable
              style={{ ...input_styles, color: '#000', marginTop: theme_variables.gap }}
              onChangeText={(value) => set_athlete_fields('bio', value)}
              multiline
              numberOfLines={4}
              maxLength={400}
              value={bio}
              placeholder="Bio"
              placeholderTextColor={theme_variables.gray900}
            />

            <TextInput
              style={{ ...input_styles, color: '#000', marginTop: theme_variables.gap }}
              onChangeText={(value) => set_hometown_fields('city', value)}
              value={hometown.city}
              placeholder="City"
              keyboardType="default"
              inputMode="text"
              placeholderTextColor={theme_variables.gray900}
            />

            <TextInput
              style={{ ...input_styles, color: '#000', marginTop: theme_variables.gap }}
              onChangeText={(value) => set_hometown_fields('state', value)}
              value={hometown.state}
              placeholder="State/Province"
              keyboardType="default"
              inputMode="text"
              placeholderTextColor={theme_variables.gray900}
            />

            <TextInput
              onChangeText={(value) => set_hometown_fields('country', value)}
              style={{ ...input_styles, color: '#000', width: 75, marginTop: theme_variables.gap }}
              value={hometown.country}
              autoCapitalize="characters"
              maxLength={2}
              placeholder="US"
              keyboardType="default"
              inputMode="text"
              placeholderTextColor={theme_variables.gray900}
            />

            <View style={divider_styles} />

            <Text style={{ ...label_styles }}>Athletic Details</Text>

            <Dropdown
              style={{
                marginTop: theme_variables.gap,
                padding: theme_variables.gap,
                borderWidth: 1,
                borderColor: theme_variables.gray200
              }}
              data={Object.keys(SPORTS)
                .map((key) => {
                  const sport = SPORTS[key];
                  let label = sport.LABEL;
                  return { label, value: sport.VALUE };
                })
                .filter((item) => item.value)}
              maxHeight={150}
              labelField="label"
              valueField="value"
              placeholder={'Sport'}
              value={sport}
              onChange={(item) => set_athlete_fields('sport', item.value)}
            />

            <Dropdown
              style={{
                marginTop: theme_variables.gap,
                padding: theme_variables.gap,
                borderWidth: 1,
                borderColor: theme_variables.gray200
              }}
              data={Object.keys(STANCE)
                .map((key) => {
                  const stance = STANCE[key];
                  let label = stance.LABEL;
                  return { label, value: stance.VALUE };
                })
                .filter((item) => item.value)}
              maxHeight={180}
              labelField="label"
              valueField="value"
              placeholder={'Stance'}
              value={stance}
              onChange={(item) => set_athlete_fields('stance', item.value)}
            />

            <Dropdown
              style={{
                marginTop: theme_variables.gap,
                padding: theme_variables.gap,
                borderWidth: 1,
                borderColor: theme_variables.gray200
              }}
              data={Object.keys(SEX)
                .map((key) => {
                  const sex = SEX[key];
                  return { label: sex.LABEL, value: sex.VALUE };
                })
                .filter((item) => item.value)}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={'Sex'}
              value={gender}
              onChange={(item) => set_athlete_fields('gender', item.value)}
            />

            <Text
              style={{
                ...label_styles,
                marginTop: theme_variables.gap * 2,
                color: theme_variables.gray900,
                fontSize: 15
              }}
            >
              Date Of Birth
            </Text>

            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                mode="date"
                onChange={(event, date) => set_athlete_fields('dob', date)}
              />
            </View>

            <View style={divider_styles} />

            <Text style={{ ...label_styles }}>Socials</Text>

            {Object.keys(SOCIALS).map((key) => {
              const social = SOCIALS[key];

              return (
                <View
                  key={key}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <FontAwesome5 name={social.VALUE} size={20} color={theme_variables.gray900} />

                  <TextInput
                    style={{
                      ...input_styles,
                      color: '#000',
                      width: '90%',
                      marginTop: theme_variables.gap
                    }}
                    onChangeText={(value) => set_social_fields(social.VALUE, value)}
                    value={socials[social.VALUE]}
                    placeholder={key}
                    keyboardType="url"
                    inputMode="url"
                    autoCapitalize="none"
                    placeholderTextColor={theme_variables.gray900}
                  />
                </View>
              );
            })}

            <View style={divider_styles} />

            <View
              style={{
                ...button_styles({ backgroundColor: theme_variables.green300 })
              }}
            >
              <Pressable onPress={update}>
                <Text style={{ ...button_text_styles({}) }}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
