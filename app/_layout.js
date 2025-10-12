import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from '../components/Navigation';
import theme_variables from '../helpers/theme-variables.js';
import { useFonts } from 'expo-font';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'League-Gothic': require('../assets/fonts/LeagueGothic-Regular.otf'),
    'LeagueGothic-Italic': require('../assets/fonts/LeagueGothic-Italic.otf'),
    'League-Gothic-Condensed': require('../assets/fonts/LeagueGothic-CondensedRegular.otf')
  });

  useEffect(() => {
    Meteor.connect('ws://localhost:3000/websocket');
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme_variables.primary }}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme_variables.secondary,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ActivityIndicator size="large" color={theme_variables.primary} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme_variables.primary }}>
        <View style={{ flex: 1, backgroundColor: theme_variables.secondary }}>
          <Navigation />
          <Slot />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
