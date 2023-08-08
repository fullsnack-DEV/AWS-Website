// @flow
import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, StyleSheet, FlatList, Text, Pressable} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import AuthContext from '../../../../auth/context';

import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {getChannelName, getLastMessageTime} from '../../../../utils/streamChat';
import CustomAvatar from '../../components/CustomAvatar';

const SearchList = ({list = [], currentTab = '', searchText = ''}) => {
  const {navigate} = useNavigation();
  const authContext = useContext(AuthContext);

  const ListEmptyComponent = () => (
    <View style={styles.centerMsgContainer}>
      <Text style={styles.msgAppearText}>{strings.noRecordFoundText}</Text>
    </View>
  );

  const getMessage = (data = {}) => {
    const message = currentTab === strings.message ? data.message : '';
    const wordsArray = message.text?.split(/\s+/);

    const processedText =
      wordsArray?.length > 0 &&
      wordsArray.map((word) => {
        const match = word.toLowerCase().includes(searchText.toLowerCase());

        if (match) {
          const parts = word.split(new RegExp(`(${searchText})`, 'gi'));
          const partsText = parts.map((item, idx) => {
            if (item.toLowerCase() === searchText.toLowerCase()) {
              return (
                <Text
                  key={idx}
                  style={[
                    styles.channelLowerText,
                    {color: colors.tabFontColor},
                  ]}
                  numberOfLines={1}>
                  {item}
                </Text>
              );
            }
            return (
              <Text key={idx} style={styles.channelLowerText} numberOfLines={1}>
                {item}
              </Text>
            );
          });
          return partsText;
        }
        return `${word} `;
      });

    return (
      <Text style={styles.channelLowerText} numberOfLines={1}>
        {processedText}
      </Text>
    );
  };

  return (
    <View>
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const channel =
            currentTab === strings.message ? item.message.channel : item;
          return (
            <Pressable
              onPress={async () => {
                await channel.watch();
                navigate('MessageChatScreen', {channel});
              }}
              style={styles.parent}>
              <View style={styles.userDetails}>
                <CustomAvatar channel={channel} />
                <View style={{flex: 1}}>
                  <Text style={styles.channelTitle} numberOfLines={1}>
                    {getChannelName(channel, authContext.chatClient.userID)}
                  </Text>

                  {getMessage(item)}
                </View>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.channelAge}>
                  {getLastMessageTime(channel)}
                </Text>

                {channel.state.unreadCount > 0 ? (
                  <View style={styles.channelUnreadCount}>
                    <Text style={styles.channelUnreadText}>
                      {channel.state.unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centerMsgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  msgAppearText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
  },
  parent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
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
});
export default SearchList;
