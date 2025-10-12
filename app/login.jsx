import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import auth from '../api/auth.js';
import theme_variables from '../helpers/theme-variables.js';
import { input_styles } from '../helpers/input.js';
import { get_auth_token, set_auth_token } from '../helpers/auth.js';
import { button_styles, button_text_styles } from '../helpers/button.js';

export default function Login() {
  const router = useRouter();

  const [login, setLogin] = useState({
    email: '',
    password: ''
  });

  const submit = async function () {
    if (!login.email) {
      alert('Email Address is requried');
      return;
    }

    if (!login.password) {
      alert('Password is required');
      return;
    }

    const req = await auth.login({ email: login.email, password: login.password });

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
      alert('User not found');
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

  useEffect(() => {
    (async () => {
      const token = await get_auth_token();
      if (!token) return;

      const user = await auth.user(token);
      if (!user?._id) return;

      router.push(`/athlete/${user._id}`);
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
      <Text
        style={{
          color: theme_variables.primary,
          fontSize: 30,
          fontFamily: theme_variables.gothic,
          textTransform: 'uppercase',
          textAlign: 'center'
        }}
      >
        Login
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
        Access Your Account
      </Text>
      <TextInput
        inputMode="email"
        keyboardType="email-address "
        autoCapitalize="none"
        style={{ ...input_styles, marginTop: theme_variables.gap }}
        placeholder="Email Address"
        onChangeText={(value) => setLogin({ ...login, email: value })}
        placeholderTextColor="#000000"
      />
      <TextInput
        inputMode="text"
        autoCapitalize="none"
        style={{ ...input_styles, marginTop: theme_variables.gap }}
        placeholder="Password"
        onChangeText={(value) => setLogin({ ...login, password: value })}
        placeholderTextColor="#000000"
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme_variables.gap
        }}
      >
        <Text
          style={{
            color: theme_variables.gray900
          }}
        >
          Don't have an account?{' '}
        </Text>
        <Link
          href="/signup"
          style={{
            color: theme_variables.primary
          }}
        >
          Sign Up
        </Link>
      </View>

      <View style={{ ...button_styles({}), marginTop: theme_variables.gap * 2 }}>
        <Pressable onPress={submit}>
          <Text style={{ ...button_text_styles({}) }}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}
