import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Image, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import RunTimer from './RunTimer.jsx';
import Run from './Run.jsx';
import theme_variables from '../../helpers/theme-variables.js';
import { get_users } from '../../api/users.js';
import { is_event_complete, get_event_standings } from '../../helpers/event.js';
import { get_active_heat } from '../../helpers/heat.js';

const Events = new Mongo.Collection('events');

const avatar_dims = theme_variables.gap * 4;
const heat_title_styles = {
  fontSize: 32,
  color: '#fff',
  textTransform: 'uppercase',
  fontFamily: theme_variables.gothic
};

function Heats({ user, event, live_event, loading }) {
  const [athletes, setAthletes] = useState([]);

  /** UI **/
  const ComingUp = function () {
    return (
      <>
        <View
          style={{
            width: '100%',
            display: 'flex',
            padding: theme_variables.gap,
            ...theme_variables.flex_between
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
              gap: theme_variables.gap,
              ...theme_variables.flex_row
            }}
          >
            {athletes.map((athlete, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: avatar_dims,
                    height: avatar_dims,
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 100,
                    overflow: 'hidden',
                    backgroundColor: '#fff'
                  }}
                >
                  <Image
                    style={{
                      width: avatar_dims,
                      height: avatar_dims
                    }}
                    resizeMode="cover"
                    source={{
                      uri: athlete.profile.avatar
                        ? athlete.profile.avatar.url
                        : theme_variables.logo
                    }}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  };

  const ActiveHeat = function ({ heat, timer = true }) {
    return (
      <>
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
          <Text style={heat_title_styles}>
            {event.labels.heat}
            {heat.name ? `: ${heat.name}` : `: ${heat.heat}`}
          </Text>

          {timer && (
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
              <View
                style={{
                  ...theme_variables.flex_center,
                  gap: theme_variables.gap / 4
                }}
              >
                <MaterialCommunityIcons name="scoreboard" size={16} color="#fff" />
                <Text
                  style={{
                    fontSize: 16,
                    textTransform: 'uppercase',
                    fontFamily: theme_variables.gothic,
                    color: '#fff'
                  }}
                >
                  Remaining {event.labels.run} time
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* Runs */}
        <ScrollView
          style={{
            width: '100%',
            flex: 1
          }}
        >
          {heat.runs.map((runs, index) => {
            if (runs.athlete) {
              return <Run key={index} event={live_event} heat={heat} runs={runs} />;
            }
          })}
        </ScrollView>
      </>
    );
  };

  const EventComplete = function () {
    const heats = get_event_standings(live_event, athletes);

    return (
      <>
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
          <Text style={{ ...heat_title_styles, fontSize: 36 }}>Final</Text>
        </View>

        {/* Heats */}
        <ScrollView
          style={{
            width: '100%',
            flex: 1
          }}
        >
          {heats.map((heat) => {
            return <ActiveHeat key={heat.id} heat={heat} timer={false} />;
          })}
        </ScrollView>
      </>
    );
  };

  useEffect(() => {
    (async () => {
      const athlete_ids = event.athletes
        .filter((athlete) => athlete.athlete_id)
        .map((athlete) => athlete.athlete_id);

      const req_athletes = await get_users(athlete_ids);

      setAthletes(req_athletes);
    })();
  }, []);

  if (loading) return <Text>Loading…</Text>;

  const event_complete = is_event_complete(live_event);
  const heat = get_active_heat(live_event, athletes);

  return (
    <View
      style={{
        marginTop: theme_variables.gap * 3,
        flex: 1,
        ...theme_variables.flex_column
      }}
    >
      {!event_complete && heat && <ActiveHeat heat={heat} />}
      {!event_complete && !heat && <ComingUp />}
      {event_complete && <EventComplete />}
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
