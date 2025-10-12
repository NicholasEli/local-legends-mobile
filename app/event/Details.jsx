import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  Alert,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  Button,
  View,
  Image,
  Text
} from 'react-native';
import EJSON from 'ejson';
import RenderHtml from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { set_event_registration } from '../../api/event-registration.js';
import { get_auth_token } from '../../helpers/auth.js';
import theme_variables from '../../helpers/theme-variables.js';
import { button_styles, button_text_styles } from '../../helpers/button.js';
import dayjs from 'dayjs';

const title_styles = {
  fontWeight: 700,
  color: theme_variables.primary,
  textTransform: 'uppercase'
};

const date_styles = {
  color: theme_variables.gray900,
  fontSize: 20,
  fontFamily: theme_variables.gothic,
  textTransform: 'uppercase'
};

const action_button_styles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme_variables.gap
};

const registration_button_styles = {
  width: '95%',
  maxWidth: 320,
  marginTop: theme_variables.gap
};

export default function Details({ event, organization, user }) {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  const [display_registration, setDisplayRegistration] = useState(false);
  const [registration, setRegistration] = useState({
    consentee_agreed: false,
    parental_approval: false
  });

  const register = async function () {
    if (!user) {
      Alert.alert('Account Required', 'You must have an athlete account to register', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login/Sign Up', onPress: () => router.push('/signup') }
      ]);

      return;
    }

    if (event?.registration?.waiver && !registration.consentee_agreed) {
      alert('Must agree to terms and conditions');
      return;
    }

    if (!user?.profile?.athlete) {
      return alert('Must be an athlete account to register');
    }

    if (
      !user.profile.firstname ||
      !user.profile.lastname ||
      !user.profile.athlete?.gender ||
      !user.profile.athlete.dob
    ) {
      return alert('Please add first name, last name, sex and date of birth to your account.');
    }

    const token = await get_auth_token();
    if (!token) {
      Alert.alert('Account Required', 'You must have an athlete account to register', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login/Sign Up', onPress: () => router.push('/signup') }
      ]);
      return;
    }

    const req = await set_event_registration({
      token,
      event_id: event._id,
      consentee_agreed: registration.consentee_agreed,
      parental_approval: registration.parental_approval
    });

    if (!req) return alert('Something went wrong.');
    if (req.error) return alert(req.error);

    setDisplayRegistration(false);

    Toast.show({
      type: 'success',
      text1: 'Registered',
      text2: 'Your registration has been sent'
    });
  };

  return (
    <>
      <View style={{ zIndex: 10 }}>
        <Toast />
      </View>
      <View
        style={{
          flex: 1,
          padding: theme_variables.gap
        }}
      >
        <ScrollView>
          <Text
            style={{
              color: theme_variables.primary,
              fontSize: 30,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase'
            }}
          >
            {event.name}
          </Text>
          {event?.date?.start && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <Text style={date_styles}>{dayjs(event.date.start).format('MMMM DD')}</Text>

              {event?.date?.end && (
                <Text style={date_styles}>
                  {' - '}
                  {dayjs(event.date.end).format('MMMM DD, YYYY')}
                </Text>
              )}
            </View>
          )}

          {event.sport && (
            <Text
              style={{
                color: theme_variables.gray900,
                fontSize: 15,
                fontFamily: theme_variables.gothic,
                textTransform: 'uppercase'
              }}
            >
              {event.sport}
            </Text>
          )}

          {event.description && (
            <View style={{ marginTop: theme_variables.gap }}>
              <RenderHtml
                contentWidth={width}
                source={{ html: event.description }}
                tagsStyles={{
                  body: { color: theme_variables.gray900 },
                  h1: {
                    ...title_styles,
                    fontSize: 25
                  },
                  h2: {
                    ...title_styles,
                    fontSize: 24
                  },
                  h3: {
                    ...title_styles,
                    fontSize: 23
                  },
                  h4: {
                    ...title_styles,
                    fontSize: 22
                  },
                  h5: {
                    ...title_styles,
                    fontSize: 21
                  },
                  h6: {
                    ...title_styles,
                    fontSize: 20
                  },
                  p: { color: theme_variables.gray900 },
                  li: { color: theme_variables.gray900 }
                }}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme_variables.gap,
          padding: theme_variables.gap
        }}
      >
        {event.address.street && event.address.state && event.address.city && (
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${event.address.street},+${event.address.state},+${event.address.city}+${event.address.postal_code}`}
            style={{
              ...button_styles({ backgroundColor: theme_variables.gray200 })
            }}
          >
            <Text style={{ ...button_text_styles({ color: theme_variables.gray900 }) }}>
              Open In Google Maps
            </Text>
          </Link>
        )}

        {organization?.profile?.organization?.socials?.website && (
          <View
            style={{
              ...button_styles({})
            }}
          >
            <Link href={organization.profile.organization.socials.website}>
              <View style={action_button_styles}>
                <Text style={button_text_styles({})}>{organization.profile.organization.name}</Text>
                <MaterialCommunityIcons name="web" size={20} color="#ffffff" />
              </View>
            </Link>
          </View>
        )}

        {event?.enabled?.registration && (
          <>
            <View
              style={{
                ...button_styles({}),
                backgroundColor: theme_variables.secondary
              }}
            >
              <Pressable onPress={() => setDisplayRegistration(true)} style={action_button_styles}>
                <Text style={button_text_styles({})}>Registration</Text>
                <AntDesign name="plus" size={20} color="#ffffff" />
              </Pressable>
            </View>

            <Modal
              animationType="slide"
              visible={display_registration}
              onRequestClose={() => setDisplayRegistration(false)}
            >
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: theme_variables.gap
                }}
              >
                <Text
                  style={{
                    width: '100%',
                    fontSize: 30,
                    fontFamily: theme_variables.gothic,
                    color: theme_variables.primary,
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}
                >
                  Event Registration
                </Text>

                <View
                  style={{
                    ...button_styles({}),
                    ...registration_button_styles,
                    backgroundColor: registration.parental_approval
                      ? theme_variables.primary
                      : theme_variables.gray200
                  }}
                >
                  <Pressable
                    onPress={() =>
                      setRegistration({
                        ...registration,
                        parental_approval: !registration.parental_approval
                      })
                    }
                    style={action_button_styles}
                  >
                    <Text
                      style={{
                        ...button_text_styles({}),
                        color: registration.parental_approval ? '#ffffff' : theme_variables.gray600
                      }}
                    >
                      I am under 18 with parental consent
                    </Text>
                  </Pressable>
                </View>

                {event?.registration?.waiver && (
                  <View
                    style={{
                      ...button_styles({}),
                      ...registration_button_styles,
                      backgroundColor: registration.consentee_agreed
                        ? theme_variables.secondary
                        : theme_variables.gray200
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        setRegistration({
                          ...registration,
                          consentee_agreed: !registration.consentee_agreed
                        })
                      }
                      style={action_button_styles}
                    >
                      <Text
                        style={{
                          ...button_text_styles({}),
                          color: registration.consentee_agreed ? '#ffffff' : theme_variables.gray600
                        }}
                      >
                        I agree to the terms and conditions
                      </Text>
                    </Pressable>
                  </View>
                )}

                {event?.registration?.waiver && registration.consentee_agreed && (
                  <View
                    style={{
                      width: '100%',
                      marginTop: theme_variables.gap
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: theme_variables.gap / 2
                      }}
                    >
                      <FontAwesome5
                        name="check-circle"
                        size={20}
                        color={theme_variables.green300}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: theme_variables.gothic,
                          color: theme_variables.green300
                        }}
                      >
                        Terms And Conditions
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        marginTop: theme_variables.gap,
                        backgroundColor: theme_variables.gray200
                      }}
                    />
                  </View>
                )}

                {event?.registration?.waiver && !registration.consentee_agreed && (
                  <View
                    style={{
                      width: '100%',
                      height: 100,
                      padding: theme_variables.gap / 2,
                      marginTop: theme_variables.gap,
                      borderWidth: 1,
                      borderColor: theme_variables.gray200
                    }}
                  >
                    <ScrollView>
                      <RenderHtml
                        contentWidth={width}
                        source={{ html: event.registration.waiver }}
                        tagsStyles={{
                          body: { color: theme_variables.gray900 },
                          h1: {
                            ...title_styles,
                            fontSize: 23
                          },
                          h2: {
                            ...title_styles,
                            fontSize: 22
                          },
                          h3: {
                            ...title_styles,
                            fontSize: 21
                          },
                          h4: {
                            ...title_styles,
                            fontSize: 20
                          },
                          h5: {
                            ...title_styles,
                            fontSize: 19
                          },
                          h6: {
                            ...title_styles,
                            fontSize: 18
                          },
                          p: { color: theme_variables.gray900 },
                          li: { color: theme_variables.gray900 }
                        }}
                      />
                    </ScrollView>
                  </View>
                )}

                <View
                  style={{
                    ...button_styles({}),
                    ...registration_button_styles,
                    backgroundColor: theme_variables.green500
                  }}
                >
                  <Pressable onPress={register} style={action_button_styles}>
                    <Text
                      style={{
                        ...button_text_styles({})
                      }}
                    >
                      Submit
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={{
                    ...button_styles({}),
                    ...registration_button_styles,
                    backgroundColor: theme_variables.gray200
                  }}
                >
                  <Pressable
                    onPress={() => setDisplayRegistration(false)}
                    style={action_button_styles}
                  >
                    <Text
                      style={{
                        ...button_text_styles({}),
                        color: theme_variables.gray900
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </>
  );
}
