import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import { BlurView } from 'expo-blur';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Image, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import RunTimer from './RunTimer.jsx';
import { get_users } from '../../api/users.js';
import theme_variables from '../../helpers/theme-variables.js';
import { get_active_heat, get_spectator_votes } from '../../helpers/heat.js';
import { get_highest_run, get_average_run } from '../../helpers/run.js';
import { hex_to_rgb } from '../../helpers/utils.js';

const avatar_dims = theme_variables.gap * 3.5;

const athlete_name_styles = {
  color: '#fff',
  textTransform: 'uppercase',
  fontSize: 24,
  fontFamily: theme_variables.gothic
};

export default function Run({ event, heat, runs }) {
  const { width, height } = Dimensions.get('window');
  const { avatar, athlete } = runs.athlete.profile;
  const { hometown, socials } = athlete;

  const run_total = function () {
    let max = 100;
    if (event?.enabled?.max_score) max = event.enabled.max_score;

    return max;
  };

  const get_details = function () {
    const details = runs.runs
      .map((run) => {
        const arr = run.details.map((d) => ({
          ...d,
          run: run.run
        }));

        return arr;
      })
      .flat();

    return details;
  };

  const location = function (hometown) {
    let city = '';
    let state = '';
    let country = '';
    let str = '';

    if (hometown.city) {
      const _city = hometown.city.toLowerCase();
      if (_city != 'city') city = hometown.city;
    }

    if (hometown.state) {
      const _state = hometown.state.toLowerCase();
      if (state != 'state') state = hometown.state;
    }

    if (hometown.country) {
      const _country = hometown.country.toLowerCase();
      if (country != 'country') country = hometown.country;
    }

    if (city) str += city;
    if (state) str += ` ${state}`;
    if (city && state) str += `, ${country}`;

    return str;
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme_variables.gap,
        flexWrap: 'wrap',
        marginTop: theme_variables.gap
      }}
    >
      {/* Left */}
      <View
        style={{
          width: width / 2,
          display: 'flex',
          flexDirection: 'row',
          gap: theme_variables.gap,
          paddingLeft: theme_variables.gap
        }}
      >
        <View
          style={{
            width: avatar_dims,
            height: avatar_dims,
            backgroundColor: '#ffffff',
            borderColor: runs.color,
            borderWidth: 2,
            borderRadius: 100,
            overflow: 'hidden'
          }}
        >
          <Image
            style={{
              width: avatar_dims,
              height: avatar_dims
            }}
            resizeMode="cover"
            source={{ uri: avatar ? avatar?.url : theme_variables.logo }}
          />
        </View>
        <View>
          <Text style={athlete_name_styles}>{runs.athlete.profile.lastname}</Text>
          <Text style={athlete_name_styles}>{runs.athlete.profile.firstname}</Text>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontSize: 14,
              fontFamily: theme_variables.gothic
            }}
          >
            {location(hometown)}
          </Text>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: theme_variables.gap / 2,
              gap: theme_variables.gap / 2
            }}
          >
            {Object.keys(socials).map((social, index) => {
              const url = socials[social];
              const size = 16;

              if (url) {
                if (social == 'website' || social == 'x') return <></>;

                return (
                  <Link key={index} href={url}>
                    <FontAwesome5 name={social} size={size} color="#fff" />
                  </Link>
                );
              }
            })}
          </View>
        </View>
      </View>

      {/* Right */}
      <View
        style={{
          width: width / 2 - theme_variables * 2,
          paddingRight: theme_variables.gap
        }}
      >
        <View
          style={{
            ...theme_variables.flex_center,
            gap: theme_variables.gap / 2
          }}
        >
          <MaterialIcons name="scoreboard" size={32} color="#fff" />
          <Text
            style={{
              fontSize: 48,
              textAlign: 'center',
              fontFamily: theme_variables.gothic_condensed,
              color: '#fff'
            }}
          >
            {event.enabled.highest_score && get_highest_run(event, runs)}
            {!event.enabled.highest_score && get_average_run(event, runs)}
          </Text>
        </View>
        <View
          style={{
            width: width / 2 - theme_variables.gap * 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {runs.runs.map((run, index) => {
            const score = Number(parseFloat(run.score).toFixed(2));
            const percentage = (score / run_total()) * 100;

            return (
              <View key={index} style={{ width: '100%', marginTop: theme_variables.gap / 2 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: theme_variables.gothic,
                    textTransform: 'uppercase',
                    color: '#fff'
                  }}
                >
                  {event.labels.run}: {run.run}
                </Text>
                <BlurView
                  intensity={10}
                  style={{
                    height: theme_variables.gap,
                    marginTop: theme_variables.gap / 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: '#fff',
                    overflow: 'hidden'
                  }}
                >
                  <View
                    style={{
                      width: `${percentage}%`,
                      height: theme_variables.gap,
                      backgroundColor: theme_variables.primary
                    }}
                  />
                </BlurView>
              </View>
            );
          })}
        </View>

        {heat.display_public_votes && (
          <View
            style={{
              width: width / 2 - theme_variables.gap * 2,
              marginTop: theme_variables.gap
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: theme_variables.gothic,
                textTransform: 'uppercase',
                color: theme_variables.yellow500
              }}
            >
              Spectator Votes
            </Text>
            <BlurView
              intensity={10}
              style={{
                height: theme_variables.gap,
                marginTop: theme_variables.gap / 3,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 100,
                borderWidth: 1,
                borderColor: theme_variables.yellow500,
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  width: `${get_spectator_votes(heat, runs)}%`,
                  height: theme_variables.gap,
                  backgroundColor: theme_variables.yellow500
                }}
              />
            </BlurView>
          </View>
        )}
      </View>

      {/* Bottom */}
      <View
        style={{
          width: '100%',
          height: 24,
          paddingLeft: theme_variables.gap,
          paddingRight: theme_variables.gap
        }}
      >
        <LinearGradient
          colors={['transparent', hex_to_rgb(runs.color)]}
          locations={[0, 0.75]}
          start={{ x: 0.75, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ width, height: 16, position: 'absolute', zIndex: 1 }}
        />

        <View style={{ position: 'relative', zIndex: 2 }}>
          <Carousel
            width={width}
            loop
            autoPlay
            scrollAnimationDuration={3000}
            data={get_details()}
            renderItem={({ item }) => {
              return (
                <Text
                  style={{
                    fontFamily: theme_variables.gothic,
                    fontSize: 12,
                    color: '#fff',
                    letterSpacing: 1
                  }}
                >
                  {event.labels.run} {item.run}: {item.label} - {item.value}
                </Text>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
}
