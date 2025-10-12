import React from 'react';
import { Text, View } from 'react-native';
import theme_variables from '../helpers/theme-variables.js';

const CardTag = function ({ text, backgroundColor = theme_variables.primary, color = '#ffffff' }) {
	if (!text) return <></>;

	return (
		<View
			style={{
				borderRadius: 100,
				backgroundColor,
				...theme_variables.flex_center
			}}
		>
			<Text
				style={{
					minWidth: 80,
					paddingTop: 4,
					paddingBottom: 4,
					...theme_variables.padding_half_horizontal,
					color,
					fontSize: 16,
					fontFamily: theme_variables.gothic_italic,
					textAlign: 'center',
					textTransform: 'uppercase',
					letterSpacing: 1
				}}
			>
				{text}
			</Text>
		</View>
	);
};

export default CardTag;
