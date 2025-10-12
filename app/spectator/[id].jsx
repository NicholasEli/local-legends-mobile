import { useEffect, useState } from 'react';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import { BlurView } from 'expo-blur';
import EJSON from 'ejson';
import Banner from '../../components/Banner.js';
import Scroller from '../../components/Scroller.js';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import theme_variables from '../../helpers/theme-variables.js';
import { placeholders } from '../../helpers/card.js';
import { get_auth_token, remove_auth_token } from '../../helpers/auth.js';
import { button_styles, button_text_styles } from '../../helpers/button.js';
import { input_styles } from '../../helpers/input.js';
import auth from '../../api/auth.js';
import { get_user } from '../../api/user.js';
import { get_purchases } from '../../api/purchases.js';
import { get_purchased_vods } from '../../api/videos-on-demand.js';
import { update_user } from '../../api/user.js';

export default function Spectator() {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const params = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const set_profile_fields = function (key, value) {
    const _user = EJSON.clone(user);
    _user.profile[key] = value;
    setUser(_user);
  };

  const update = async function () {
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

  const logout = async function () {
    await remove_auth_token();
    router.push('/');
  };

  useEffect(() => {
    (async () => {
      const req_user = await get_user(params.id);
      if (!req_user) return;

      const token = await get_auth_token();

      if (token) {
        const req_purchases = await get_purchases({ token });

        if (req_purchases) {
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

  if (!user?.profile?.spectator) return <></>;
  const { firstname, lastname } = user.profile;

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
          <ActivityIndicator size="large" color={theme_variables.primary} />
        </BlurView>
      )}
      <ScrollView style={{ flex: 1, marginTop: theme_variables.gap * 2 }}>
        <View
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...theme_variables.padding_horizontal
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              textAlign: 'center'
            }}
          >
            First and last name are required to participate in live event chat and voting.
          </Text>

          {/* Name */}
          <TextInput
            style={{ ...input_styles, marginTop: theme_variables.gap, color: '#ffffff' }}
            onChangeText={(value) => set_profile_fields('firstname', value)}
            value={firstname}
            placeholder="First Name"
            keyboardType="default"
            inputMode="text"
            placeholderTextColor="#ffffff"
          />

          <TextInput
            style={{ ...input_styles, marginTop: theme_variables.gap, color: '#ffffff' }}
            onChangeText={(value) => set_profile_fields('lastname', value)}
            value={lastname}
            placeholder="Last Name"
            keyboardType="default"
            inputMode="text"
            placeholderTextColor="#ffffff"
          />

          <View
            style={{
              ...button_styles({
                backgroundColor: theme_variables.green300
              }),
              marginTop: theme_variables.gap
            }}
          >
            <Pressable onPress={update}>
              <Text style={{ ...button_text_styles({}) }}>Save</Text>
            </Pressable>
          </View>

          {/* Purchases */}
          {purchases?.length > 0 && (
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

          {/* Logout */}
          <View style={{ marginTop: theme_variables.gap * 2 }}>
            <View style={{ ...button_styles({}) }}>
              <Pressable onPress={() => logout()}>
                <Text style={{ ...button_text_styles({}) }}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
