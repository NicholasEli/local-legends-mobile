import Meteor from '@meteorrn/core';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import auth from '../api/auth.js';
import theme_variables from '../helpers/theme-variables.js';
import { input_styles } from '../helpers/input.js';
import { get_auth_token, set_auth_token } from '../helpers/auth.js';
import { button_styles, button_text_styles } from '../helpers/button.js';

const types = [
  {
    id: 'athlete',
    label: 'Athlete',
    description: 'Join upcoming events and sell video content',
    styles: {
      width: '48%',
      backgroundColor: theme_variables.primary
    }
  },
  {
    id: 'spectator',
    label: 'Spectator',
    description: 'View live events, support local athletes and shops',
    styles: {
      width: '48%',
      backgroundColor: theme_variables.secondary
    }
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Promote, manage and live stream events',
    styles: {
      width: '100%',
      backgroundColor: '#000000'
    }
  }
];

export default function Signup() {
  const router = useRouter();

  const [signup, setSignup] = useState({
    email: '',
    password: '',
    type: 'athlete'
  });

  const submit = async function () {
    if (!signup.email) {
      alert('Email Address is requried');
      return;
    }

    if (!signup.password) {
      alert('Password is required');
      return;
    }

    if (signup.type == 'organization') {
      alert('Organization accounts must be created at www.locallegends.live');
      return;
    }

    const req = await auth.signup({
      email: signup.email,
      password: signup.password,
      type: signup.type
    });

    if (req.error) {
      alert(req.error);
      return;
    }

    if (!req?.token) {
      alert('Something went wrong');
      return;
    }

    await set_auth_token(req.token);

    const user = await auth.user(req.token);
    if (!user?._id) {
      alert('Something went wrong.');
      return;
    }

    if (signup.type == 'athlete') {
      router.push(`/athlete/${user._id}`);
      return;
    }

    if (signup.type == 'spectator') {
      router.push(`/spectator/${user._id}`);
      return;
    }

    router.push('/');
  };

  useEffect(() => {
    (async () => {
      const token = await get_auth_token();
      if (!token) return;

      const user = await auth.user(token);
      if (!user?._id) return;

      if (user.profile.athlete) {
        router.push(`/athlete/${user._id}`);
        return;
      }

      if (user.profile.spectator) {
        router.push(`/spectator/${user._id}`);
        return;
      }

      router.push('/');
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme_variables.gap,
        backgroundColor: '#ffffff'
      }}
    >
      {signup.type != 'organization' && (
        <View>
          <Text
            style={{
              color: theme_variables.primary,
              fontSize: 30,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Create Your Account
          </Text>
          <Text
            style={{
              color: theme_variables.gray900,
              fontSize: 20,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Access Videos On Demand And Participate In Live Events
          </Text>
        </View>
      )}

      {signup.type == 'organization' && (
        <View>
          <Text
            style={{
              color: theme_variables.primary,
              fontSize: 30,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Just One Second...
          </Text>
          <Text
            style={{
              color: theme_variables.gray900,
              fontSize: 15,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Shops and Organizations accounts are managed from our web platform.
          </Text>
          <Text
            style={{
              color: theme_variables.gray900,
              fontSize: 15,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Click the button below or visit locallegends.live to create your organization account.
          </Text>
        </View>
      )}

      {signup.type != 'organization' && (
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <Text
            style={{
              width: '100%',
              marginTop: theme_variables.gap,
              color: theme_variables.gray900,
              fontSize: 15,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              textAlign: 'left'
            }}
          >
            Required(*)
          </Text>

          <TextInput
            style={{ ...input_styles, marginTop: theme_variables.gap }}
            inputMode="email"
            keyboardType="email-address "
            autoCapitalize="none"
            placeholder="Email Address*"
            onChangeText={(value) => setSignup({ ...signup, email: value })}
          />

          <TextInput
            style={{ ...input_styles, marginTop: theme_variables.gap }}
            inputMode="text"
            autoCapitalize="none"
            placeholder="Password*"
            onChangeText={(value) => setSignup({ ...signup, password: value })}
          />
        </View>
      )}

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme_variables.gap / 2,
          marginTop: theme_variables.gap
        }}
      >
        {types.map((type) => {
          const active = signup.type == type.id;
          return (
            <View
              key={type.id}
              style={{
                ...button_styles({
                  width: type.styles.width,
                  backgroundColor: active ? type.styles.backgroundColor : theme_variables.gray200
                })
              }}
            >
              <Pressable onPress={() => setSignup({ ...signup, type: type.id })}>
                <Text
                  style={{
                    ...button_text_styles({}),
                    color: active ? '#ffffff' : theme_variables.gray900
                  }}
                >
                  {type.label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View
        style={{
          marginTop: theme_variables.gap
        }}
      >
        {types.map((type) => {
          const active = signup.type == type.id;

          if (active)
            return (
              <Text key={type.id} style={{}}>
                {type.description}
              </Text>
            );
        })}
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme_variables.gap * 2
        }}
      >
        <Text
          style={{
            color: theme_variables.gray900
          }}
        >
          Already have an account?{' '}
        </Text>
        <Link
          href="/login"
          style={{
            color: theme_variables.primary
          }}
        >
          Login
        </Link>
      </View>

      {signup.type != 'organization' && (
        <View style={{ ...button_styles({}), marginTop: theme_variables.gap }}>
          <Pressable onPress={submit}>
            <Text style={{ ...button_text_styles({}) }}>Submit</Text>
          </Pressable>
        </View>
      )}

      {signup.type == 'organization' && (
        <View style={{ ...button_styles({}), marginTop: theme_variables.gap }}>
          <Link href="https://www.locallegends.live/signup?type=organization">
            <Text style={{ ...button_text_styles({}) }}>www.locallegends.live</Text>
          </Link>
        </View>
      )}
    </View>
  );
}
