import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
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
// import ActivityLoader from '../../components/loader/ActivityLoader';
import TCHorizontalMessageOverview from '../../components/TCHorizontalMessageOverview';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  getQBProfilePic,
  QB_ACCOUNT_TYPE, QBconnectAndSubscribe,
  QBgetDialogs,
  QBsetupSettings,
} from '../../utils/QuickBlox';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils';
import AuthContext from '../../auth/context';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';

const QbMessageEmitter = new NativeEventEmitter(QB.chat)

const MessageMainScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
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
    if (isFocused) {
      connectAndSubscribe();
      QbMessageEmitter.addListener(
          QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
          newDialogHandler,
      )
    }

    return () => {
      // setSavedDialogsData({
      //   append: {},
      //   dialogs: [],
      //   limit: 30,
      //   skip: 0,
      //   total: 0,
      // });
      QbMessageEmitter.removeListener(QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE);
    }
  }, [navigation, isFocused])

  const newDialogHandler = () => {
    getDialogs();
  }

  const getDialogs = async (request = {}, pagination = false) => {
    const savedDialog = await QBgetDialogs({
      ...request,
      filter: {
        field: QB.chat.DIALOGS_FILTER.FIELD.NAME,
        value: '',
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
    await QBconnectAndSubscribe(authContext?.entity);
    await QBsetupSettings();
    await getDialogs();
    setTimeout(() => setLoading(false), 1500);
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

  const renderSingleEntityChat = useCallback(({ item, index }) => {
    let fullName = item.name;
    let firstTwoChar = '';
    if (item.type === QB.chat.DIALOG_TYPE.CHAT) {
      firstTwoChar = item.name.slice(0, 2);
      if ([QB_ACCOUNT_TYPE.USER, QB_ACCOUNT_TYPE.LEAGUE, QB_ACCOUNT_TYPE.TEAM, QB_ACCOUNT_TYPE.CLUB].includes(firstTwoChar)) {
        fullName = item?.name?.slice(2, item?.name?.length)
      }
    }
    console.log(`${fullName} `, item)

    return (<TCHorizontalMessageOverview
        entityType={firstTwoChar}
        profilePic={getQBProfilePic(item?.type, index, firstTwoChar, item?.photo)}
        dialogType={item?.type}
        onPress={() => onDialogPress(item)}
        title={fullName}
        subTitle={item?.lastMessage}
        numberOfMembers={item?.occupantsIds}
        lastMessageDate={new Date(item?.lastMessageDateSent)}
        numberOfUnreadMessages={Number(item?.unreadMessagesCount) > 99 ? '+ 99' : item?.unreadMessagesCount}
    />)
  }, [onDialogPress])

  const onEndReached = useCallback(() => {
    if (!endReachedCalled) {
      setEndReachedCalled(true);
    }
  }, [endReachedCalled])

  const chatKeyExtractor = useCallback((item, index) => index.toString(), [])

  const onMomentumScrollBegin = useCallback(() => setEndReachedCalled(false), [])

  const LiseEmptyComponent = useMemo(() => (
    <Text style={{
        fontFamily: fonts.RLight, marginTop: 15, fontSize: 16, color: colors.lightBlackColor,
    }}>No Messages Found</Text>
  ), [])
  const renderAllMessages = useMemo(() => (
    <FlatList
            ListEmptyComponent={LiseEmptyComponent}
            refreshing={loading}
            data={savedDialogsData.dialogs ?? []}
            keyExtractor={chatKeyExtractor}
            renderItem={renderSingleEntityChat}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onEndReached={onEndReached}
        />
    ), [LiseEmptyComponent, chatKeyExtractor, loading, onEndReached, onMomentumScrollBegin, renderSingleEntityChat, savedDialogsData.dialogs])

  const renderHeader = useMemo(() => (
    <Header
        mainContainerStyle={{ paddingBottom: 0 }}
            leftComponent={navigation.canGoBack()
              && <View>
                <FastImage source={images.tc_message_top_icon} resizeMode={'contain'} style={styles.backImageStyle} />
              </View>
            }
            centerComponent={
              <Text style={styles.eventTextStyle}>Message</Text>
            }
            rightComponent={
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ paddingHorizontal: 2 }} onPress={() => { navigation.navigate('MessageSearchScreen') }}>
                  <FastImage source={images.messageSearchButton} resizeMode={'contain'} style={styles.rightImageStyle} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 2 }} onPress={() => { navigation.navigate('MessageInviteScreen') }}>
                  <FastImage source={images.addMessageChat} resizeMode={'contain'} style={styles.rightImageStyle} />
                </TouchableOpacity>
              </View>
            }
        />
    ), [navigation])

  return (
    <SafeAreaView style={ styles.mainContainer }>
      {renderHeader}
      <View style={styles.separateLine}/>
      <View style={ styles.sperateLine } />
      {loading
          ? <UserListShimmer/>
          : renderAllMessages
      }
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backImageStyle: {
    height: 36,
    width: 36,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  rightImageStyle: {
    height: 36,
    width: 36,
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
