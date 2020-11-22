import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  NativeEventEmitter,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';

import QB from 'quickblox-react-native-sdk';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash'
import ActivityLoader from '../../components/loader/ActivityLoader';
import TCHorizontalMessageOverview from '../../components/TCHorizontalMessageOverview';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCSearchBox from '../../components/TCSearchBox';
import {
  QB_ACCOUNT_TYPE, QBconnectAndSubscribe,
  QBcreateDialog,
  QBgetDialogs,
  QBgetUserDetail,
  QBsetupSettings,
} from '../../utils/QuickBlox';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils';

const QbMessageEmitter = new NativeEventEmitter(QB.chat)

const MessageMainScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [endReachedCalled, setEndReachedCalled] = useState(false);
  const [savedDialogsData, setSavedDialogsData] = useState({
    append: {},
    dialogs: [],
    limit: 30,
    skip: 0,
    total: 0,
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    connectAndSubscribe();
    QbMessageEmitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      newDialogHandler,
    )
    if (route?.params?.userId) navigateToMessageChat(route.params.userId);
    return () => {
      QbMessageEmitter.removeListener(QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE);
    }
  }, [isFocused])

  const navigateToMessageChat = async (uid) => {
    QBgetUserDetail(
      QB.users.USERS_FILTER.FIELD.LOGIN,
      QB.users.USERS_FILTER.TYPE.STRING,
      [uid].join(),
    ).then((userData) => {
      const user = userData.users.filter((item) => item.login === uid)[0];
      QBcreateDialog([user.id]).then((res) => {
        navigation.setParams({ userId: null })
        navigation.navigate('MessageChat', {
          screen: 'MessageChatRoom',
          params: { dialog: res },
        });
      }).catch((error) => {
        console.log(error);
      })
    })
  }
  const newDialogHandler = () => {
    getDialogs();
  }

  const getDialogs = async (request = {}, pagination = false) => {
    const savedDialog = await QBgetDialogs({
      ...request,
      filter: {
        field: QB.chat.DIALOGS_FILTER.FIELD.NAME,
        value: searchText,
        operator: QB.chat.DIALOGS_FILTER.OPERATOR.CTN,
      },
    })
    _.map(savedDialog?.dialogs, (x) => {
      if (x?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && !x?.isJoined) {
        QB.chat.joinDialog({ dialogId: x?.id });
      }
    })
    if (pagination) {
      const data = { ...savedDialog, dialogs: [...savedDialogsData.dialogs, ...savedDialog.dialogs] }
      setSavedDialogsData({ ...data });
    } else {
      setSavedDialogsData(savedDialog);
    }
    setLoading(false);
  }

  const connectAndSubscribe = async () => {
    setLoading(true);
    await QBconnectAndSubscribe();
    await QBsetupSettings();
    await getDialogs();
    setLoading(false)
  }

  const onDialogPress = (dialog) => {
    navigation.navigate('MessageChat', {
      screen: 'MessageChatRoom',
      params: { dialog },
    });
  }

  useEffect(() => {
    if (endReachedCalled) {
      setEndReachedCalled(false)
      getDialogs({ skip: savedDialogsData.dialogs.length }, true)
    }
  }, [endReachedCalled])

  useEffect(() => {
    getDialogs()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [searchText])

  const renderAllMessages = () => (
    savedDialogsData?.dialogs?.length > 0
    && <FlatList
        refreshing={loading}
        data={savedDialogsData.dialogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          let fullName = item.name;
          if (item.type === QB.chat.DIALOG_TYPE.CHAT) {
            const firstTwoChar = item.name.slice(0, 2);
            if ([QB_ACCOUNT_TYPE.USER, QB_ACCOUNT_TYPE.LEAGUE, QB_ACCOUNT_TYPE.TEAM, QB_ACCOUNT_TYPE.CLUB].includes(firstTwoChar)) {
              fullName = item.name.slice(2, item.name.length)
            }
          }

          return (<TCHorizontalMessageOverview
              dialogType={item.type}
              onPress={() => onDialogPress(item)}
              title={fullName}
              subTitle={item.lastMessage}
              numberOfMembers={item.occupantsIds}
              lastMessageDate={new Date(item.lastMessageDateSent)}
              numberOfUnreadMessages={item.unreadMessagesCount}
          />)
        }
        }
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => setEndReachedCalled(false)}
        onEndReached={() => {
          if (!endReachedCalled) {
            setEndReachedCalled(true);
          }
        }}
    />
  )

  return (
    <SafeAreaView style={ styles.mainContainer }>
      <Header
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack() }>
                <FastImage source={images.backArrow} resizeMode={'contain'} style={styles.backImageStyle} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.eventTextStyle}>Messages</Text>
            }
            rightComponent={
              <TouchableOpacity style={{ padding: 2 }} onPress={() => { navigation.navigate('MessageInviteScreen') }}>
                <FastImage source={images.plus} resizeMode={'contain'} style={styles.rightImageStyle} />
              </TouchableOpacity>
            }
        />
      <View style={styles.separateLine}/>
      <ActivityLoader visible={loading} />
      <TCSearchBox onChangeText={(text) => setSearchText(text)}/>
      <View style={ styles.sperateLine } />
      {renderAllMessages()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  rightImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
    marginBottom: hp(2),
  },
});

export default MessageMainScreen;
