import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as PushNotifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Navigation from '../components/Navigation';
import theme_variables from '../helpers/theme-variables.js';
import { useFonts } from 'expo-font';

PushNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export default function Layout() {
  const { width, height } = Dimensions.get('window');

  const [fontsLoaded] = useFonts({
    'League-Gothic': require('../assets/fonts/LeagueGothic-Regular.otf'),
    'LeagueGothic-Italic': require('../assets/fonts/LeagueGothic-Italic.otf'),
    'League-Gothic-Condensed': require('../assets/fonts/LeagueGothic-CondensedRegular.otf')
  });

  const Background = function () {
    return (
      <LinearGradient
        colors={[
          '#000',
          theme_variables.secondary,
          theme_variables.primary,
          theme_variables.secondary,
          '#000'
        ]}
        start={{ x: 0, y: 0.15 }}
        end={{ x: 0, y: 1 }}
        style={{
          width,
          height,
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
    );
  };

  useEffect(() => {
    Meteor.connect('ws://localhost:3000/websocket');
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Background />
          <View
            style={{ ...theme_variables.flex_center, flex: 1, position: 'relative', zIndex: 2 }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Background />
        <View style={{ flex: 1, position: 'relative', zIndex: 2 }}>
          <Navigation />
          <Slot />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
