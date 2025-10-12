import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Image, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RunTimer from './RunTimer.jsx';
import Run from './Run.jsx';
import theme_variables from '../../helpers/theme-variables.js';
import { get_users } from '../../api/users.js';
import { get_active_heat } from '../../helpers/heat.js';

const Events = new Mongo.Collection('events');

const heat_title_styles = {
  fontSize: 40,
  color: theme_variables.primary,
  // textShadowColor: 'rgba(193, 40, 65, 1)',
  // textShadowOffset: { width: 0, height: 0 },
  // textShadowRadius: 5,
  // letterSpacing: 1,
  textTransform: 'uppercase',
  fontFamily: theme_variables.gothic
};

const athlete_name_styles = {
  color: '#000000',
  textTransform: 'uppercase',
  fontSize: 30,
  fontFamily: theme_variables.gothic
};

function Heats({ user, event, live_event, loading }) {
  const [athletes, setAthletes] = useState([]);
  const [guest_athletes, setGuestAthletes] = useState([]);

  useEffect(() => {
    (async () => {
      const athlete_ids = event.athletes
        .filter((athlete) => athlete.athlete_id)
        .map((athlete) => athlete.athlete_id);

      const req_athletes = await get_users(athlete_ids);
      const req_guest_athletes = event.athletes.filter((athlete) => athlete.guest_id);

      setAthletes(req_athletes);
      setGuestAthletes(req_guest_athletes);
    })();
  }, []);

  if (loading) return <Text>Loading…</Text>;

  const heat = get_active_heat(live_event, athletes, guest_athletes);

  if (!heat || (heat && heat.runs.length == 0)) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme_variables.gap
          }}
        >
          <Text style={heat_title_styles}>Coming Up</Text>
        </View>
        <ScrollView
          style={{
            width: '100%',
            padding: theme_variables.gap
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: theme_variables.gap
            }}
          >
            {athletes.map((athlete, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#ffffff',
                    borderColor: theme_variables.primary,
                    borderWidth: 1,
                    borderRadius: 100,
                    overflow: 'hidden'
                  }}
                >
                  {athlete.profile?.avatar?.url && (
                    <Image
                      style={{
                        width: 80,
                        height: 80
                      }}
                      resizeMode="cover"
                      source={{ uri: athlete.profile.avatar.url }}
                    />
                  )}
                  {!athlete.profile?.avatar?.url && (
                    <Image
                      style={{
                        width: 80,
                        height: 80
                      }}
                      source={{ uri: theme_variables.logo }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#ffffff'
      }}
    >
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme_variables.gap
        }}
      >
        {heat.name && (
          <Text style={heat_title_styles}>
            {heat.complete ? 'Final' : event.labels.heat}: {heat.name}
          </Text>
        )}

        {!heat.name && (
          <Text style={heat_title_styles}>
            {heat.complete ? 'Final' : event.labels.heat}: {heat.heat}
          </Text>
        )}

        {/* Title */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <RunTimer
            time={heat.timer.time}
            start={heat.timer.start}
            seconds={heat.timer.seconds}
            onComplete={() => null}
          />
          <Text
            style={{
              fontSize: 15,
              textTransform: 'uppercase',
              fontFamily: theme_variables.gothic
            }}
          >
            Remaining {event.labels.run} time
          </Text>
        </View>
      </View>
      {/* Runs */}
      <ScrollView
        style={{
          width: '100%',
          flex: 1
        }}
      >
        {heat.runs.map((runs, index) => {
          if (!runs.athlete) return <></>;

          return <Run key={index} event={live_event} heat={heat} runs={runs} />;
        })}
      </ScrollView>
    </View>
  );
}

export default function EventRoute({ event, user }) {
  const params = useLocalSearchParams();
  const { id } = params;

  const Standings = withTracker(() => {
    const handle = Meteor.subscribe('event.get', { _id: id });

    return {
      loading: !handle.ready(),
      event,
      user,
      live_event: Events.findOne({ _id: id })
    };
  })(Heats);

  return <Standings />;
}
