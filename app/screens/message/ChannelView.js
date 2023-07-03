import React, {useContext} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {ChannelAvatar} from 'stream-chat-react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';

const ChannelView = ({channel, latestMessagePreview}) => {
  const authContext = useContext(AuthContext);
  const {navigate} = useNavigation();

  const renderChatTitle = () => {
    let name;
    if (channel.data.member_count === 2) {
      const members = channel?.state?.members;
      const filteredMember = Object.fromEntries(
        Object.entries(members).filter(
          ([key]) => key !== authContext.entity?.obj?.user_id,
        ),
      );
      name = Object.entries(filteredMember).map((obj) => obj[1]?.user?.name);
    } else {
      name = channel.data.name;
    }
    return name;
  };

  const renderDateTimeString = () => {
    const timeString = channel.data.last_message_at;
    const date = new Date(timeString);
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const currentDate = new Date();
    let formattedTime;
    let formattedDate;
    let chatScreenTime;

    if (date.toDateString() === currentDate.toDateString()) {
      formattedTime =
        hours >= 12
          ? `${hours % 12}:${minutes < 10 ? `0 ${minutes}` : minutes} PM`
          : `${hours}:${minutes < 10 ? `0 ${minutes}` : minutes} AM`;
      chatScreenTime = `${formattedTime}`;
    } else {
      formattedTime = `${hours}:${minutes < 10 ? `0 ${minutes}` : minutes}`;
      formattedDate = `${day} ${month}`;
      chatScreenTime = `${formattedDate}`;

      if (date < currentDate) {
        chatScreenTime = `${chatScreenTime}`;
      }
    }
    return chatScreenTime;
  };

  return (
    <Pressable onPress={() => navigate('MessageChatScreen', {channel})}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginRight: 10}}>
            <ChannelAvatar channel={channel} />
          </View>
          <View>
            <Text style={styles.channelTitle}>{renderChatTitle(channel)}</Text>
            <Text style={styles.channelLowerText}>
              {latestMessagePreview?.messageObject?.text
                ? latestMessagePreview.messageObject?.text
                : strings.emptyChatMessage}
            </Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={styles.channelAge}>
              {renderDateTimeString(channel)}
            </Text>
          </View>
          {channel.state?.unreadCount > 0 && (
            <View style={styles.channelUnreadCount}>
              <Text style={styles.channelUnreadText}>
                {channel.state?.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  channelTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: colors.blackColor,
  },
  channelLowerText: {
    fontSize: 14,
    color: colors.placeHolderColor,
  },
  channelAge: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.placeHolderColor,
  },
  channelUnreadCount: {
    backgroundColor: colors.redColorCard,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginTop: 5,
    width: 30,
  },
  channelUnreadText: {
    color: colors.whiteColor,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ChannelView;
