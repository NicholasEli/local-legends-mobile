import { useEffect, useState, useRef } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
import Banner from '../../components/Banner.js';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import RenderHtml from 'react-native-render-html';
import { get_vod_preview, get_vod_full } from '../../api/video-on-demand.js';
import { get_purchase } from '../../api/purchase.js';
import auth from '../../api/auth.js';
import { get_user } from '../../api/user.js';
import theme_variables from '../../helpers/theme-variables.js';
import { rating } from '../../helpers/vod.js';
import { get_auth_token } from '../../helpers/auth.js';
import dayjs from 'dayjs';

export default function VOD() {
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
    height: 60
  };

  const rating_styles = {
    fontSize: 20,
    fontFamily: theme_variables.gothic,
    color: '#ffffff',
    textTransform: 'uppercase'
  };

  const like_styles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000000'
  };

  const like_container_styles = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme_variables.gap / 2,
    paddingTop: theme_variables.gap / 2,
    paddingBottom: theme_variables.gap / 2,
    paddingLeft: theme_variables.gap,
    paddingRight: theme_variables.gap,
    backgroundColor: '#000000',
    borderRadius: theme_variables.border_radius
  };

  const like_text_styles = {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: theme_variables.gothic,
    textTransform: 'uppercase',
    textAlign: 'center'
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
      'Purcahse VOD',
      'VODs can be purchased through your account on www.locallegends.live',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase VOD',
          onPress: () => Linking.openURL(`https://locallegends.live/video-on-demand/${preview._id}`)
        }
      ]
    );
  };

  /** UI **/
  const Player = function ({ uri, poster_uri }) {
    const player = useVideoPlayer(uri);

    return (
      <View
        style={{
          borderColor: theme_variables.primary,
          borderBottomWidth: 2,
          backgroundColor: '#000000',
          borderColor: theme_variables.primary,
          borderBottomWidth: 2
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
    );
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
    <>
      <LinearGradient
        colors={['rgba(56, 57, 51, 1)', 'rgba(24, 24, 27, 1)']}
        locations={[0, 0.75]}
        start={{ x: 0.8, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ width, height, position: 'absolute', zIndex: 1 }}
      />
      <View style={{ flex: 1, position: 'relative', zIndex: 2 }}>
        {vod && <Player uri={vod.src.url} poster_uri={vod.poster.url} />}
        {!vod && (
          <Image
            source={{ uri: obj.poster.url }}
            style={{
              width,
              height: width * theme_variables.ratio_16_9,
              backgroundColor: '#000000',
              borderColor: theme_variables.primary,
              borderBottomWidth: 2
            }}
          />
        )}
        {/* Title */}
        <View
          style={{
            width,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_variables.gap,
            ...theme_variables.padding,
            paddingBottom: 0
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: avatar_styles.width,
              height: avatar_styles.height,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: theme_variables.primary,
              backgroundColor: '#ffffff',
              overflow: 'hidden'
            }}
          >
            {!user && preview?.credit?.avatar && (
              <Image style={avatar_styles} source={{ uri: preview.credit.avatar }} />
            )}
            {user?.profile?.avatar && (
              <Image style={avatar_styles} source={{ uri: user.profile.avatar.url }} />
            )}
            {!user?.profile?.avatar && (
              <Image style={avatar_styles} source={{ uri: theme_variables.logo }} />
            )}
          </View>

          {/* Title / Rating */}
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontFamily: theme_variables.gothic,
                color: '#ffffff'
              }}
            >
              {obj.title}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...rating_styles, color: theme_variables.green300 }}>
                {rating(obj)} {'% Rating'}
              </Text>
              <Text style={rating_styles}> | </Text>
              <Text style={rating_styles}>{dayjs(obj.created_at).format('MMMM DD, YYYY')}</Text>
            </View>
          </View>
        </View>

        {/* Like / Dislike */}
        <View
          style={{
            width,
            display: 'flex',
            flexDirection: 'row',
            gap: theme_variables.gap,
            marginTop: theme_variables.gap * 2,
            ...theme_variables.padding_horizontal
          }}
        >
          <Pressable style={like_styles}>
            <View style={like_container_styles}>
              <Text style={{ ...like_text_styles, color: theme_variables.red500 }}>Dislike</Text>
              <Entypo name="thumbs-down" size={20} color={theme_variables.red500} />
            </View>
          </Pressable>

          <Pressable style={like_styles}>
            <View style={like_container_styles}>
              <Text style={{ ...like_text_styles, color: theme_variables.yellow500 }}>Like</Text>
              <Entypo name="thumbs-up" size={20} color={theme_variables.yellow500} />
            </View>
          </Pressable>
        </View>

        {/* Purchase Button */}

        {user?._id != current_user?._id && (
          <>
            {obj.price > 0 && purchase?._id && (
              <View style={btn_container}>
                <View
                  style={{
                    ...btn_styles,
                    borderColor: theme_variables.green500
                  }}
                >
                  <Text style={{ ...btn_text, color: theme_variables.green500 }}>Owned</Text>
                </View>
              </View>
            )}

            {obj.price > 0 && !purchase?._id && (
              <View style={btn_container}>
                <Pressable onPress={() => purchase_vod()}>
                  <View
                    style={{
                      ...btn_styles,
                      borderColor: theme_variables.green500
                    }}
                  >
                    <Text style={{ ...btn_text, color: theme_variables.green500 }}>
                      Purchase ${(obj.price / 100).toFixed(2)}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
          </>
        )}

        {/* Presented By */}
        <View style={btn_container}>
          <View
            style={{
              ...btn_styles,
              borderColor: '#ffffff'
            }}
          >
            {user && (
              <Link href={`/athlete/${user._id}`}>
                <Text style={btn_text}>
                  Presented By: {user.profile.firstname} {user.profile.lastname}
                </Text>
              </Link>
            )}

            {!user && obj.credit && <Text style={btn_text}>Presented By: {obj.credit.name}</Text>}
          </View>
        </View>

        {/* Description */}

        <ScrollView
          style={{
            width: width - theme_variables.gap * 2,
            maxHeight: 160,
            marginLeft: theme_variables.gap,
            marginTop: theme_variables.gap * 2,
            borderBottomWidth: 2,
            borderColor: theme_variables.primary
          }}
        >
          {obj?.description && (
            <Text
              style={{
                color: '#ffffff'
              }}
            >
              {obj.description}
            </Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}
