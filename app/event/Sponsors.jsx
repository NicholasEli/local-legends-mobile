import React from 'react';
import { Link } from 'expo-router';
import { Dimensions, View, Pressable, Image, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import theme_variables from '../../helpers/theme-variables.js';

export default function Sponsors({
  sponsors,
  borderColor = 'transparent',
  backgroundColor = '#ffffff',
  color = '#ffffff'
}) {
  const { width } = Dimensions.get('window');

  const height = theme_variables.gap * 6;

  const image_styles = {
    width: '100%',
    height: '100%',
    backgroundColor: 'green'
  };

  const text_styles = {
    width: '100%',
    color,
    fontSize: 35,
    fontFamily: theme_variables.gothic_condensed,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: theme_variables.primary
  };

  const Logo = function ({ uri }) {
    return (
      <Image
        source={{ uri }}
        resizeMode="contain"
        style={{
          width,
          height: height - theme_variables.gap * 2
        }}
      />
    );
  };

  return (
    <View
      style={{
        width,
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor,
        borderTopWidth: 2,
        borderColor
      }}
    >
      <Text
        style={{
          width: '100%',
          marginTop: theme_variables.gap,
          color,
          fontSize: 20,
          fontFamily: theme_variables.gothic_italic,
          textTransform: 'uppercase',
          textAlign: 'center'
        }}
      >
        Sponsored By:
      </Text>
      <Carousel
        loop
        width={width}
        height={height}
        autoPlay
        data={sponsors}
        autoPlayInterval={5000}
        scrollAnimationDuration={0}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              height: height,
              ...theme_variables.flex_center,
              textAlign: 'center'
            }}
          >
            {item.url && (
              <Link href={item.url}>
                {item.image && <Logo style={image_styles} uri={item.image} />}
                {!item.image && item.name && <Text style={text_styles}>{item.name}</Text>}
              </Link>
            )}

            {!item.url && item.image && <Logo style={image_styles} uri={item.image} />}
            {!item.url && !item.image && item.name && <Text style={text_styles}>{item.name}</Text>}
          </View>
        )}
      />
    </View>
  );
}
