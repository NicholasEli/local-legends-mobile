import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Image, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import RunTimer from './RunTimer.jsx';
import { get_users } from '../../api/users.js';
import theme_variables from '../../helpers/theme-variables.js';
import { get_active_heat } from '../../helpers/heat.js';
import { hex_to_rgb } from '../../helpers/utils.js';

const avatar_dims = theme_variables.gap * 4;

const athlete_name_styles = {
  color: '#000000',
  textTransform: 'uppercase',
  fontSize: 25,
  fontFamily: theme_variables.gothic
};

export default function Run({ event, heat, runs }) {
  const { width, height } = Dimensions.get('window');
  const { hometown, socials, avatar } = runs.athlete.profile.athlete;

  const run_total = function () {
    let max = 100;
    if (event?.enabled?.max_score) max = event.enabled.max_score;

    return max;
  };

  const calc_spectator_votes = function () {
    if (!heat) return 0;

    let total_votes = 0;
    if (!heat.total_votes) {
      total_votes = 0;
    } else {
      total_votes = heat.total_votes;
    }

    if (total_votes == 0) return 0;

    total_votes = Math.ceil(runs.votes / total_votes);

    return total_votes;
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
          alignItems: 'center',
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
            borderWidth: 1,
            borderRadius: 100,
            overflow: 'hidden'
          }}
        >
          {avatar?.url && (
            <Image
              style={{
                width: avatar_dims,
                height: avatar_dims
              }}
              resizeMode="cover"
              source={{ uri: avatar.url }}
            />
          )}
          {!avatar?.url && (
            <Image
              style={{
                width: avatar_dims,
                height: avatar_dims
              }}
              resizeMode="cover"
              source={{ uri: theme_variables.logo }}
            />
          )}
        </View>
        <View>
          <Text style={athlete_name_styles}>{runs.athlete.profile.firstname}</Text>
          <Text style={athlete_name_styles}>{runs.athlete.profile.lastname}</Text>
          <Text
            style={{
              color: theme_variables.gray600,
              textTransform: 'uppercase',
              fontSize: 15,
              fontFamily: theme_variables.gothic
            }}
          >
            {hometown.city}, {hometown.state}
          </Text>
          <View
            style={{
              width: '75%',
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
              const size = 15;

              if (url) {
                if (social == 'website') {
                  return (
                    <Link key={index} href={url}>
                      <MaterialCommunityIcons name="web" size={size} color={runs.color} />
                    </Link>
                  );
                }

                if (social == 'x') {
                  return (
                    <Link key={index} href={url}>
                      <FontAwesome5 name="twitter" size={size} color={runs.color} />
                    </Link>
                  );
                }

                return (
                  <Link key={index} href={url}>
                    <FontAwesome5 name={social} size={size} color={runs.color} />
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
        <Text
          style={{
            fontSize: 60,
            textAlign: 'center',
            fontFamily: theme_variables.gothic_condensed,
            color: theme_variables.secondary
          }}
        >
          {parseFloat(runs.total).toFixed(2)}
        </Text>
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
              <View
                key={index}
                style={{
                  width: '100%'
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: theme_variables.gothic,
                    textTransform: 'uppercase'
                  }}
                >
                  {event.labels.run}: {run.run}
                </Text>
                <View
                  style={{
                    height: 20,
                    marginTop: theme_variables.gap / 3,
                    backgroundColor: theme_variables.gray200
                  }}
                >
                  <View
                    style={{
                      width: `${percentage}%`,
                      height: 20,
                      backgroundColor: theme_variables.primary
                    }}
                  />
                </View>
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
                fontSize: 15,
                fontFamily: theme_variables.gothic,
                textTransform: 'uppercase',
                color: theme_variables.yellow500
              }}
            >
              Spectator Votes
            </Text>
            <View
              style={{
                height: 20,
                marginTop: theme_variables.gap / 3,
                backgroundColor: theme_variables.gray200
              }}
            >
              <View
                style={{
                  width: `${calc_spectator_votes()}%`,
                  height: 20,
                  backgroundColor: theme_variables.yellow500
                }}
              />
            </View>
          </View>
        )}
      </View>

      {/* Bottom */}
      <View
        style={{
          width: '100%',
          height: 20,
          paddingLeft: theme_variables.gap,
          paddingRight: theme_variables.gap
        }}
      >
        <LinearGradient
          colors={['#ffffff', hex_to_rgb(runs.color)]}
          locations={[0, 0.75]}
          start={{ x: 0.75, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ width, height: 20, position: 'absolute', zIndex: 1 }}
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
                    fontSize: 15,
                    color: '#ffffff',
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
