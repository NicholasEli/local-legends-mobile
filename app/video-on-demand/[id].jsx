import { useEffect, useState, useRef } from 'react';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  Linking,
  ScrollView,
  Modal,
  View,
  Image,
  Text
} from 'react-native';
import EJSON from 'ejson';
import Banner from '../../components/Banner.js';
import Button from '../../components/Button.jsx';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import RenderHtml from 'react-native-render-html';
import auth from '../../api/auth.js';
import {
  get_vod_preview,
  get_vod_full,
  set_vod_like,
  set_vod_dislike
} from '../../api/video-on-demand.js';
import { set_athlete_follow } from '../../api/athlete.js';
import { set_organization_follow } from '../../api/organization.js';
import { get_purchase } from '../../api/purchase.js';
import { get_user } from '../../api/user.js';
import { rating } from '../../helpers/vod.js';
import { get_auth_token } from '../../helpers/auth.js';
import theme_variables from '../../helpers/theme-variables.js';
import dayjs from 'dayjs';

export default function VOD() {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const blur_view_animation = useRef(new Animated.Value(1)).current;

  const startFade = () => {
    Animated.timing(blur_view_animation, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true
    }).start();
  };

  const avatar_styles = {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#fff',
    backgroundColor: '#000',
    overflow: 'hidden'
  };

  const author_styles = {
    color: '#fff',
    fontSize: 20,
    fontFamily: theme_variables.gothic
  };

  const details_styles = {
    color: '#fff',
    fontSize: 12,
    lineHeight: 12
  };

  const btn_container = {
    width,
    display: 'flex',
    flexDirection: 'row',
    gap: theme_variables.gap,
    marginTop: theme_variables.gap,
    ...theme_variables.padding_horizontal
  };

  const btn_styles = {
    width: width - theme_variables.gap * 2,
    ...theme_variables.padding_half_vertical,
    ...theme_variables.padding_horizontal,
    borderWidth: 2,
    borderRadius: theme_variables.border_radius
  };

  const btn_text = {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: theme_variables.gothic,
    textTransform: 'uppercase',
    textAlign: 'center'
  };

  const params = useLocalSearchParams();

  const [current_user, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [vod, setVOD] = useState(null);
  const [purchase, setPurchase] = useState(null);
  const [prompt, setPrompt] = useState(true);

  const purchase_vod = function () {
    Alert.alert(
      'Access VOD',
      'VODs can be accessed through your account on www.locallegends.live',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Access VOD',
          onPress: () =>
            Linking.openURL(`https://locallegends.live/video-on-demand/${preview._id}?app=true`)
        }
      ]
    );
  };

  const like_vod = async function (obj) {
    if (!obj || !current_user) return null;

    const req_like = await set_vod_like(obj._id, current_user._id);

    let _vod = null;
    if (preview && !vod) _vod = EJSON.clone({ ...preview });
    if (vod) _vod = EJSON.clone({ ...vod });

    _vod.dislikes[current_user._id] = false;
    _vod.likes[current_user._id] = true;

    if (preview && !vod) setPreview(_vod);
    if (vod) setVOD(_vod);
  };

  const dislike_vod = async function (obj) {
    if (!obj || !current_user) return null;

    const req_dislike = await set_vod_dislike(obj._id, current_user._id);

    let _vod = null;
    if (preview && !vod) _vod = EJSON.clone({ ...preview });
    if (vod) _vod = EJSON.clone({ ...vod });

    _vod.dislikes[current_user._id] = true;
    _vod.likes[current_user._id] = false;

    if (preview && !vod) setPreview(_vod);
    if (vod) setVOD(_vod);
  };

  const follow = async function () {
    if (!user) return null;

    if (!current_user) {
      Alert.alert('Hold On...', 'You musted be logged in to follow others', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Access VOD',
          onPress: () => ({ text: 'Login/Sign Up', onPress: () => router.push('/signup') })
        }
      ]);
      return null;
    }

    let req_follow = null;
    if (user.profile.athlete) {
      req_follow = await set_athlete_follow({ id: user._id, user_id: current_user._id });
    }

    if (user.profile.organization) {
      req_follow = await set_organization_follow({ id: user._id, user_id: current_user._id });
    }

    if (req_follow != null) {
      const _user = EJSON.clone({ ...user });
      _user.profile.followers[current_user._id] = req_follow;
      setUser(_user);
      return req_follow;
    }

    return false;
  };

  /** UI **/
  const Player = function ({ uri, poster_uri }) {
    const player = useVideoPlayer(uri);

    return (
      <View
        style={{
          width: '100%',
          ...theme_variables.flex_center,
          ...theme_variables.box_shadow
        }}
      >
        <View
          style={{
            width: width - theme_variables.gap,
            borderRadius: theme_variables.border_radius,
            overflow: 'hidden'
          }}
        >
          <Animated.View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              opacity: blur_view_animation,
              pointerEvents: 'none'
            }}
          >
            <BlurView
              intensity={8}
              style={{
                width: '100%',
                height: '100%',
                ...theme_variables.flex_center,
                flexDirection: 'column',
                gap: theme_variables.gap,
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}
            >
              <Image
                style={{
                  width: 64,
                  height: 64
                }}
                source={{ uri: theme_variables.logo_light }}
              />
              <Text
                style={{
                  width: '100%',
                  color: '#ffffff',
                  fontSize: 20,
                  fontFamily: theme_variables.gothic,
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}
              >
                Click the here to start playing
              </Text>
            </BlurView>
          </Animated.View>

          <VideoView
            player={player}
            posterSource={{ uri: poster_uri }}
            allowsFullscreen
            nativeControls
            resizeMode="contain"
            style={{
              width: '100%',
              aspectRatio: 16 / 9
            }}
          />
        </View>
      </View>
    );
  };

  const Title = function () {
    return (
      <Text
        style={{
          fontSize: 32,
          fontFamily: theme_variables.gothic,
          color: '#ffffff'
        }}
      >
        {obj.title}
      </Text>
    );
  };

  const Avatar = function () {
    return (
      <View
        style={{
          width: avatar_styles.width,
          height: avatar_styles.height,
          ...theme_variables.box_shadow
        }}
      >
        {!user && preview?.credit?.avatar && (
          <Image style={avatar_styles} source={{ uri: preview.credit.avatar }} />
        )}
        {user?.profile?.avatar && (
          <Image style={avatar_styles} source={{ uri: user.profile.avatar.url }} />
        )}
        {user && !user?.profile?.avatar && (
          <Image style={avatar_styles} source={{ uri: theme_variables.logo_light }} />
        )}
      </View>
    );
  };

  const PresentedBy = function () {
    if (!user && obj.credit) {
      return <Text style={author_styles}>{obj.credit.name}</Text>;
    }

    if (user?.profile?.organization) {
      return <Text style={author_styles}>{user.profile.organization.name}</Text>;
    }

    if (user?.profile?.athlete) {
      return (
        <Link href={`/athlete/${user._id}`}>
          <Text style={author_styles}>
            {user.profile.firstname} {user.profile.lastname}
          </Text>
        </Link>
      );
    }

    return <Text style={author_styles}>Local Legends Live</Text>;
  };

  const Category = function ({ obj }) {
    return <>{obj?.sport && <Text style={details_styles}>{obj.sport}</Text>}</>;
  };

  const ReleaseDate = function ({ obj }) {
    return (
      <>
        {obj?.created_at && (
          <Text style={details_styles}>{dayjs(obj.created_at).format('MM.DD.YYYY')}</Text>
        )}
      </>
    );
  };

  const Duration = function ({ obj }) {
    if (!obj?.duration) return <></>;

    let total_time = 0;
    if (obj?.duration) total_time = parseInt(obj.duration);

    if (!total_time) return <></>;

    return (
      <View
        style={{
          ...theme_variables.flex,
          flexDirection: 'row',
          gap: theme_variables.gap / 2
        }}
      >
        <Text style={details_styles}>
          {total_time > 60 ? `${total_time / 60} Mins` : `${total_time} Secs`}
        </Text>
      </View>
    );
  };

  const Rating = function ({ obj }) {
    return (
      <BlurView
        intensity={5}
        style={{
          width: theme_variables.gap * 7,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.25)'
        }}
      >
        <Pressable
          onPress={() => dislike_vod(obj)}
          style={{
            ...theme_variables.padding_half,
            ...theme_variables.padding_horizontal
          }}
        >
          {current_user && (
            <>
              {obj.dislikes[current_user._id] && (
                <Ionicons name="thumbs-down-sharp" size={20} color="#fff" />
              )}
              {!obj.dislikes[current_user._id] && (
                <Feather name="thumbs-down" size={20} color="#fff" />
              )}
            </>
          )}

          {!current_user && <Ionicons name="thumbs-down-sharp" size={20} color="#fff" />}
        </Pressable>

        <View
          style={{
            width: 1,
            height: '75%',
            backgroundColor: '#fff'
          }}
        />

        <Pressable
          onPress={() => like_vod(obj)}
          style={{
            ...theme_variables.padding_half,
            ...theme_variables.padding_horizontal
          }}
        >
          {current_user && (
            <>
              {obj.likes[current_user._id] && (
                <Ionicons name="thumbs-up-sharp" size={20} color="#fff" />
              )}
              {!obj.likes[current_user._id] && <Feather name="thumbs-up" size={20} color="#fff" />}
            </>
          )}

          {!current_user && <Ionicons name="thumbs-up-sharp" size={20} color="#fff" />}

          {/*<Text style={details_styles}>{rating(obj)}%</Text>*/}
        </Pressable>
      </BlurView>
    );
  };

  const Follow = function () {
    return (
      <BlurView
        intensity={5}
        style={{
          width: theme_variables.gap * 7,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.25)'
        }}
      >
        <Pressable
          onPress={follow}
          style={{
            ...theme_variables.flex,
            ...theme_variables.padding_half,
            ...theme_variables.padding_horizontal,
            flexDirection: 'row',
            gap: theme_variables.gap / 2
          }}
        >
          {!current_user && (
            <>
              <Text
                style={{
                  color: '#fff'
                }}
              >
                Follow
              </Text>
              <AntDesign name="plus" size={theme_variables.gap} color="#ffffff" />
            </>
          )}

          {current_user && !user.profile.followers[current_user._id] && (
            <>
              <Text
                style={{
                  color: '#fff'
                }}
              >
                Follow
              </Text>
              <AntDesign name="plus" size={theme_variables.gap} color="#ffffff" />
            </>
          )}

          {current_user && user.profile.followers[current_user._id] && (
            <>
              <Text
                style={{
                  color: '#fff'
                }}
              >
                Following
              </Text>
              <AntDesign name="check" size={theme_variables.gap} color="#ffffff" />
            </>
          )}
        </Pressable>
      </BlurView>
    );
  };

  const PurchaseButton = function () {
    if (user?._id == current_user?._id) return <></>;

    if (obj.price > 0 && purchase?._id) {
      return (
        <Button>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontFamily: theme_variables.gothic,
              fontSize: 24
            }}
          >
            Owned
          </Text>
        </Button>
      );
    }

    if (obj.price > 0 && !purchase?._id) {
      return (
        <Button callback={purchase_vod} gradient={true}>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontFamily: theme_variables.gothic,
              fontSize: 24
            }}
          >
            Get Access
          </Text>
        </Button>
      );
    }

    return <></>;
  };

  useEffect(() => {
    (async () => {
      try {
        let req_purchase = null;
        let req_current_user = null;
        const token = await get_auth_token();
        if (token) {
          req_current_user = await auth.user(token);
          setCurrentUser(req_current_user);

          req_purchase = await get_purchase({
            token,
            vod_id: params.id
          });

          if (req_purchase?._id) setPurchase(req_purchase._id);
        }

        const req_vod_preview = await get_vod_preview(params.id);

        let req_user = null;
        if (req_vod_preview.user_id) {
          req_user = await get_user(req_vod_preview.user_id);
        }

        let req_vod_full = null;
        if (req_vod_preview.price <= 0) {
          req_vod_full = await get_vod_full(params.id);
        }

        if (req_vod_preview.price > 0 && req_purchase?._id) {
          req_vod_full = await get_vod_full(params.id);
        }

        if (req_vod_preview.user_id == req_current_user?._id) {
          req_vod_full = await get_vod_full(params.id);
        }

        setUser(req_user);
        setPreview(req_vod_preview);
        setVOD(req_vod_full);
        if (req_vod_full) startFade();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!vod && !preview) return <></>;

  let obj = vod;
  if (!vod) obj = preview;

  return (
    <View style={{ flex: 1, position: 'relative', zIndex: 2 }}>
      {vod && <Player uri={vod.src.url} poster_uri={vod.poster.url} />}
      {!vod && (
        <View
          style={{
            width: '100%',
            ...theme_variables.flex_center,
            ...theme_variables.box_shadow
          }}
        >
          <Image
            source={{ uri: obj.poster.url }}
            style={{
              width: width - theme_variables.gap,
              height: width * theme_variables.ratio_16_9,
              backgroundColor: '#000000',
              borderRadius: theme_variables.border_radius,
              overflow: 'hidden'
            }}
          />
        </View>
      )}
      {/* Title */}
      <View
        style={{
          width,
          display: 'flex',
          flexDirection: 'row',
          gap: theme_variables.gap,
          ...theme_variables.padding,
          paddingBottom: 0
        }}
      >
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Title />

          <View>
            <View
              style={{
                marginTop: theme_variables.gap / 2,
                ...theme_variables.flex,
                flexDirection: 'row',
                gap: theme_variables.gap / 2
              }}
            >
              <Category obj={obj} />
              {obj.created_at && (
                <>
                  <Text style={details_styles}>•</Text>
                  <ReleaseDate obj={obj} />
                </>
              )}

              {obj.duration && (
                <>
                  <Text style={details_styles}>•</Text>
                  <Duration obj={obj} />
                </>
              )}
            </View>
          </View>

          <View
            style={{
              marginTop: theme_variables.gap,
              ...theme_variables.flex,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme_variables.gap
            }}
          >
            <Avatar />
            <PresentedBy />
          </View>
        </View>
      </View>

      <View
        style={{
          ...theme_variables.flex,
          ...theme_variables.padding_horizontal,
          flexDirection: 'row',
          gap: theme_variables.gap,
          marginTop: theme_variables.gap
        }}
      >
        <Rating obj={obj} />
        {!obj.credit && <Follow />}
      </View>

      {obj.price > 0 && (
        <View
          style={{
            marginTop: theme_variables.gap,
            ...theme_variables.padding_horizontal,
            ...theme_variables.flex_center
          }}
        >
          <PurchaseButton />
        </View>
      )}

      {/* Description */}
      <ScrollView
        style={{
          width: width - theme_variables.gap * 2,
          maxHeight: 160,
          marginLeft: theme_variables.gap,
          marginTop: theme_variables.gap
        }}
      >
        <BlurView
          intensity={5}
          style={{
            backgroundColor: 'rgba(255, 255,255, 0.25)',
            borderRadius: theme_variables.border_radius,
            overflow: 'hidden',
            ...theme_variables.padding
          }}
        >
          {obj?.description && <Text style={{ color: '#ffffff' }}>{obj.description}</Text>}
        </BlurView>
      </ScrollView>
    </View>
  );
}
