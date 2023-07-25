// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';

import AuthContext from '../../../auth/context';

import UserListShimmer from '../../../components/shimmer/commonComponents/UserListShimmer';
import SearchTabBar from './components/SearchTabBar';
import SearchList from './components/SearchList';

const MessageSearchScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState(strings.chatroomText);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);

  const authContext = useContext(AuthContext);

  const getSearchData = useCallback(
    (text = '') => {
      setLoading(true);

      const channelFilters = {members: {$in: [authContext.chatClient.userID]}};
      const messageFilters = {text: {$autocomplete: text}};

      const sort = {last_message_at: -1};

      const promiseArr = [
        authContext.chatClient.queryChannels(
          {
            name: {$autocomplete: text},
            members: {$in: [authContext.chatClient.userID]},
          },
          sort,
        ),
        authContext.chatClient.queryChannels(
          {
            'member.user.name': {$autocomplete: text},
            members: {$in: [authContext.chatClient.userID]},
          },
          sort,
        ),
        authContext.chatClient.queryChannels(
          {
            'member.user.group_name': {$autocomplete: text},
            members: {$in: [authContext.chatClient.userID]},
          },
          sort,
        ),
        authContext.chatClient.search(channelFilters, messageFilters),
      ];

      Promise.all(promiseArr)
        .then(
          async ([
            channelsResponseWithName,
            channelsResponseWithMemberName,
            channelsResponseWithGroupName,
            messagesResponse,
          ]) => {
            const channelsData = [
              ...channelsResponseWithName,
              ...channelsResponseWithMemberName,
              ...channelsResponseWithGroupName,
            ];
            setChannels(channelsData);
            const messageList = [...messagesResponse.results];

            const newList = [];
            messageList.forEach(async (item) => {
              const filter = {id: {$eq: item.message.channel.id}};
              const data = newList.find(
                (ele) => ele.message.channel.id === item.message.channel.id,
              );
              let channel = {};
              if (data) {
                channel = data.message.channel;
              } else {
                channel = await authContext.chatClient.queryChannels(filter);
              }
              const obj = {
                message: {
                  ...item.message,
                  channel: channel[0],
                },
              };

              newList.push(obj);
            });

            setMessages(newList);
            setLoading(false);
          },
        )
        .catch((err) => {
          setLoading(false);
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    },
    [authContext.chatClient],
  );

  useEffect(() => {
    if (searchText.length > 0) {
      getSearchData(searchText);
    } else {
      setMessages([]);
      setChannels([]);
    }
  }, [searchText, getSearchData]);

  const getList = () => {
    switch (currentTab) {
      case strings.chatroomText:
        return channels;

      case strings.message:
        return messages;

      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.searchText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInputStyle}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          placeholder={strings.searchText}
        />
        <TouchableOpacity onPress={() => setSearchText('')}>
          <Image source={images.closeRound} style={{height: 15, width: 15}} />
        </TouchableOpacity>
      </View>

      {messages.length > 0 || channels.length > 0 ? (
        <SearchTabBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      ) : null}

      <View style={styles.listContainer}>
        {loading ? (
          <UserListShimmer />
        ) : (
          <SearchList
            list={getList()}
            currentTab={currentTab}
            searchText={searchText}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingHorizontal: 15,
    margin: 15,
    backgroundColor: colors.textFieldBackground,
    height: 40,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
});
export default MessageSearchScreen;
