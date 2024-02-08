import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {format} from 'react-string-format';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import CustomAvatar from './CustomAvatar';
import {
  checkIsMessageDeleted,
  getChannelMembers,
  getChannelName,
  getLastMessageTime,
} from '../../../utils/streamChat';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import AuthContext from '../../../auth/context';

const ChannelView = ({channel, latestMessagePreview}) => {
  const {state, data} = channel;
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [memberCount, setMemberCount] = useState(0);
  const [unreadMentionCount, setUnreadMentionCount] = useState(0);

  useEffect(() => {
    const members = getChannelMembers(channel);
    setMemberCount(members.length);
  }, [channel]);

  const getMentionCount = useCallback(async () => {
    const unreadCount = await channel.countUnreadMentions();
    setUnreadMentionCount(unreadCount);
  }, [channel]);

  useEffect(() => {
    getMentionCount();
  }, [getMentionCount]);

  const getLastMessage = () => {
    const isDeletedMessage = checkIsMessageDeleted(
      authContext.chatClient.userID,
      latestMessagePreview.messageObject,
    );
    if (latestMessagePreview.messageObject?.text) {
      return isDeletedMessage
        ? strings.messageDeletedText
        : latestMessagePreview.messageObject.text;
    }

    if (latestMessagePreview.messageObject?.attachments?.length > 0) {
      if (isDeletedMessage) {
        return strings.messageDeletedText;
      }
      if (
        latestMessagePreview.messageObject?.attachments[0].type ===
        Verbs.mediaTypeVideo
      ) {
        return strings.video;
      }

      return strings.photoText;
    }

    return format(
      strings.createdChatRoom,
      data.created_by.group_name ?? data.created_by.name,
    );
  };

  const renderUnreadCount = () => {
    if (state.unreadCount > 0 || unreadMentionCount > 0) {
      const count =
        unreadMentionCount > 0
          ? state.unreadCount + unreadMentionCount
          : state.unreadCount;

      return (
        <View
          style={[
            styles.channelUnreadCount,
            count?.toString()?.length > 1 ? {paddingHorizontal: 6} : {},
          ]}>
          <Text style={styles.channelUnreadText}>
            {unreadMentionCount > 0 ? `@${count}` : count}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableHighlight
      onPress={async () => {
        await channel.watch();
        // navigate('MessageStack', {
        //   screen: 'MessageChatScreen',
        //   params: {channel},
        // });
        navigation.push('MessageStack', {
          screen: 'MessageChatScreen',
          params: {channel},
        });
      }}
      underlayColor={colors.grayBackgroundColor}
      style={styles.parent}>
      <>
        <View style={styles.userDetails}>
          <CustomAvatar
            channel={channel}
            imageStyle={{backgroundColor: colors.whiteColor}}
            iconTextStyle={{fontSize: 12, marginTop: 0.8}}
            placeHolderStyle={{right: -6, bottom: -1}}
          />
          <View style={{flex: 1}}>
            <View style={styles.channelNameContainer}>
              <View style={{maxWidth: '80%'}}>
                <Text style={styles.channelTitle} numberOfLines={1}>
                  {getChannelName(channel, authContext.chatClient.userID)}
                </Text>
              </View>

              {data.channel_type === Verbs.channelTypeAuto ? (
                <View style={styles.channelBadgeContainer}>
                  <Image
                    source={images.autoChannelBadge}
                    style={styles.image}
                  />
                </View>
              ) : null}

              {memberCount > 2 && (
                <Text
                  style={[
                    styles.memberCount,
                    data.channel_type === Verbs.channelTypeAuto
                      ? {}
                      : {marginLeft: 10},
                  ]}>
                  {memberCount}
                </Text>
              )}
            </View>
            <Text style={styles.channelLowerText} numberOfLines={1}>
              {getLastMessage()}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.channelAge}>{getLastMessageTime(channel)}</Text>
          {renderUnreadCount()}
        </View>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  channelNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  channelTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  channelLowerText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.placeHolderColor,
  },
  channelAge: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.placeHolderColor,
  },
  channelUnreadCount: {
    marginTop: 5,
    borderRadius: 50,
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center',
    backgroundColor: colors.redColorCard,
  },
  channelUnreadText: {
    color: colors.whiteColor,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  channelBadgeContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  memberCount: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
  },
});

export default ChannelView;
