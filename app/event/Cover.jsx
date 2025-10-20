import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState, useEffect, useRef } from 'react';
import Daily, { DailyMediaView } from '@daily-co/react-native-daily-js';
import { Dimensions, Pressable, View, Image, Text } from 'react-native';
import Sponsors from './Sponsors.jsx';
import theme_variables from '../../helpers/theme-variables.js';
import { button_styles, button_text_styles } from '../../helpers/button.js';
import dayjs from 'dayjs';

export default function Cover({ event, organization }) {
  const { width, height } = Dimensions.get('window');

  const text_styles = {
    color: '#ffffff',
    textShadowColor: 'rgba(193, 40, 65, 1)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textTransform: 'uppercase'
  };

  const tabel_row = {
    width: '30%',
    ...theme_variables.flex_between,
    marginTop: theme_variables.gap,
    borderBottomWidth: 1,
    borderColor: theme_variables.gray200
  };

  const table_data1 = {
    width: 65,
    color: theme_variables.primary,
    fontSize: 20,
    fontFamily: theme_variables.gothic,
    textTransform: 'uppercase'
  };

  const table_data2 = {
    color: theme_variables.gray900,
    fontSize: 20,
    fontFamily: theme_variables.gothic,
    textTransform: 'uppercase'
  };

  const [playing, setPlaying] = useState(false);
  const [broadcaster, setBroadcaster] = useState(null);

  const call_object_ref = useRef(null);
  const play = function () {
    if (!event.stream.room.url) return null;
    if (!call_object_ref?.current) call_object_ref.current = Daily.createCallObject();

    // Join the room
    call_object_ref.current.join({
      url: event.stream.room.url,
      userName: 'Guest'
    });

    setPlaying(true);
  };

  const on_stream_start = function (event) {
    if (event.participant.local) return;
    setBroadcaster(event.participant);
  };

  useEffect(() => {
    if (!call_object_ref.current) return;

    call_object_ref.current.on('track-started', on_stream_start);

    return () => {
      call_object_ref.current.off('track-started', on_stream_start);
    };
  }, [playing]);

  //if (event?.stream?.room?.url && event.stream.playing)
  if (event?.stream?.room?.url) {
    return (
      <View
        style={{
          position: 'relative',
          flexDirection: 'column',
          flex: 1,
          backgroundColor: '#ffffff',
          borderColor: theme_variables.primary,
          borderTopWidth: 2
        }}
      >
        <View
          style={{
            width,
            height: width * theme_variables.ratio_16_9,
            position: 'relative',
            backgroundColor: '#000000',
            borderBottomWidth: 2,
            borderColor: theme_variables.primary
          }}
        >
          {!playing && (
            <Pressable
              onPress={() => play()}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 3
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 2,
                  ...theme_variables.flex_center,
                  marginTop: -40,
                  marginLeft: -40,
                  backgroundColor: '#ffffff',
                  borderRadius: 100,
                  borderWidth: 3,
                  borderColor: theme_variables.primary,
                  pointerEvents: 'none'
                }}
              >
                <FontAwesome name="play-circle" size={64} color={theme_variables.primary} />
              </View>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
                resizeMode="cover"
                source={{ uri: event?.poster ? event.poster.url : theme_variables.banner }}
              />
            </Pressable>
          )}
          {playing && broadcaster && (
            <View
              style={{
                position: 'relative',
                zIndex: 4,
                backgroundColor: '#000000'
              }}
            >
              <DailyMediaView
                videoTrack={broadcaster.videoTrack}
                audioTrack={broadcaster.audioTrack}
                mirror={false}
                zOrder={0}
                style={{ width, height: width * theme_variables.ratio_16_9 }}
              />
            </View>
          )}
        </View>

        {/* Title */}
        <View
          style={{
            ...theme_variables.flex_column,
            ...theme_variables.padding
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              color: '#000000'
            }}
          >
            {event.name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: theme_variables.gothic,
              textTransform: 'uppercase',
              color: theme_variables.gray900
            }}
          >
            {event.sport}
          </Text>

          {/* Buttons */}
          <View
            style={{
              ...theme_variables.flex_column,
              gap: theme_variables.gap,
              marginTop: theme_variables.gap
            }}
          >
            {organization?.profile?.organization.socials.website && (
              <Link
                href={organization.profile.organization.socials.website}
                style={{ ...button_styles({}) }}
              >
                <Text style={{ ...button_text_styles({}) }}>
                  Presented By: {organization.profile.organization.name}
                </Text>
              </Link>
            )}

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
          </View>

          {/* Table */}
          <View
            style={{
              width: width - theme_variables.gap * 2,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: theme_variables.gap
            }}
          >
            {event.athletes.length && (
              <View style={{ ...tabel_row }}>
                <Text style={{ ...table_data1 }}>Athletes:</Text>
                <Text style={{ ...table_data2 }}>{event.athletes.length}</Text>
              </View>
            )}
            {Object.keys(event.heats).length > 0 && (
              <View style={{ ...tabel_row }}>
                <Text style={{ ...table_data1 }}>{event.labels.heat}(s):</Text>
                <Text style={{ ...table_data2 }}>{Object.keys(event.heats).length}</Text>
              </View>
            )}
            {event.judges.length > 0 && (
              <View style={{ ...tabel_row }}>
                <Text style={{ ...table_data1 }}>Judges:</Text>
                <Text style={{ ...table_data2 }}>{event.judges.length}</Text>
              </View>
            )}
            {event.sponsors.length > 0 && (
              <View style={{ ...tabel_row }}>
                <Text style={{ ...table_data1 }}>Sponsors:</Text>
                <Text style={{ ...table_data2 }}>{event.sponsors.length}</Text>
              </View>
            )}
            {event.subscribers.length > 0 && (
              <View style={{ ...tabel_row }}>
                <Text style={{ ...table_data1 }}>Followers:</Text>
                <Text style={{ ...table_data2 }}>{event.subscribers.length}</Text>
              </View>
            )}
          </View>
        </View>

        <Sponsors
          sponsors={[
            {
              url: 'https://locallegends.live/',
              image: theme_variables.logo
            },
            ...event.sponsors
          ]}
          borderColor={theme_variables.gray200}
          backgroundColor={theme_variables.gray100}
          color={theme_variables.secondary}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'relative',
        ...theme_variables.flex_center,
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#ffffff',
        borderColor: theme_variables.primary,
        borderTopWidth: 2
      }}
    >
      <Image
        source={{ uri: event?.poster ? event.poster.url : theme_variables.banner }}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 1
        }}
      />
      <BlurView
        intensity={5}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}
      />
      <View
        style={{
          position: 'relative',
          top: '-15%',
          zIndex: 3,
          paddingLeft: theme_variables.gap,
          paddingRight: theme_variables.gap
        }}
      >
        {event?.date?.start && (
          <Text
            style={{
              fontSize: 16,
              lineHeight: 20,
              fontFamily: theme_variables.gothic_italic,
              ...text_styles
            }}
          >
            {dayjs(event.date.start).format('MMMM DD, YYYY')}
          </Text>
        )}
        {organization && (
          <Text
            style={{
              fontSize: 32,
              lineHeight: 36,
              fontFamily: theme_variables.gothic_italic,
              textTransform: 'uppercase',
              color: '#ffffff',
              ...text_styles
            }}
          >
            {organization.profile.organization.name} Presents:
          </Text>
        )}
        <Text
          style={{
            fontSize: 48,
            lineHeight: 52,
            fontFamily: theme_variables.gothic,
            ...text_styles
          }}
        >
          {event.name}
        </Text>
      </View>

      <Sponsors
        sponsors={[
          {
            url: 'https://locallegends.live/',
            image: theme_variables.logo_light
          },
          ...event.sponsors
        ]}
        color="#ffffff"
      />
    </View>
  );
}
