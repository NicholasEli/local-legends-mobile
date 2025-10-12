import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles/styles';
import { getInitials } from '../hooks/useGetInitials';
import { scale } from '../utils/scaling';
import { formatDate } from '../hooks/useFormatDate';

const Avatar = ({ icon, name, textColor, borderColor, backgroundColor }) => (
  <View
    style={[
      styles.avatarContainer,
      {
        backgroundColor,
        borderColor,
        borderWidth: 1,
        overflow: 'hidden'
      }
    ]}
  >
    {icon ? (
      <Image
        source={typeof icon === 'string' ? { uri: icon } : icon}
        style={styles.avatar}
        resizeMode="contain"
      />
    ) : (
      <Text style={[styles.avatarContainerText, { color: textColor }]}>{getInitials(name)}</Text>
    )}
  </View>
);

const MessageContainer = ({
  message,
  name,
  icon,
  backgroundColor,
  textColor,
  isSender,
  showAvatar,
  time
}) => {
  const [showDate, setShowDate] = useState(false);
  const messageContainerStyle = isSender
    ? styles.senderMessageContainer
    : styles.receiverMessageContainer;
  const alignmentStyle = isSender ? styles.alignEnd : styles.alignStart;

  return (
    <View style={alignmentStyle}>
      {!isSender && showAvatar && (
        <Avatar
          icon={icon}
          name={name}
          textColor={textColor}
          borderColor={backgroundColor}
          backgroundColor="#ffffff"
        />
      )}
      <TouchableOpacity style={[messageContainerStyle, { backgroundColor }]} activeOpacity={0.9}>
        <Text style={[styles.messageText, { color: textColor }]}>{message}</Text>
        <Text style={[styles.messageText, { marginTop: 10, color: textColor, fontSize: 10 }]}>
          {name}
        </Text>
      </TouchableOpacity>
      {isSender && showAvatar && (
        <Avatar
          icon={icon}
          name={name}
          textColor={textColor}
          borderColor={backgroundColor}
          backgroundColor="#ffffff"
        />
      )}
    </View>
  );
};

export default MessageContainer;
