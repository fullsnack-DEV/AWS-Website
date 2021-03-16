import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList, TextInput,
} from 'react-native';

import QB from 'quickblox-react-native-sdk';
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
  QB_ACCOUNT_TYPE,
  QBgetDialogs,
} from '../../utils/QuickBlox';
import { widthPercentageToDP as wp } from '../../utils';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';

const MessageSearchScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [endReachedCalled, setEndReachedCalled] = useState(false);
  const [savedDialogsData, setSavedDialogsData] = useState({
    append: {},
    dialogs: [],
    limit: 30,
    skip: 0,
    total: 0,
  });
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

  const onDialogPress = useCallback((dialog) => {
    navigation.replace('MessageChat', {
      screen: 'MessageChatRoom',
      params: { dialog },
    });
  }, [navigation]);

  useEffect(() => {
    if (endReachedCalled) {
      setEndReachedCalled(false)
      getDialogs({ skip: savedDialogsData.dialogs.length }, true)
    }
  }, [endReachedCalled])

  useEffect(() => {
      if (searchText && searchText !== '') {
        getDialogs()
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
      } else {
        setSavedDialogsData([])
      }
  }, [searchText])

  const renderSingleEntityChat = useCallback(({ item, index }) => {
    let fullName = item.name;
    let firstTwoChar = '';
    if (item.type === QB.chat.DIALOG_TYPE.CHAT) {
      firstTwoChar = item.name.slice(0, 2);
      if ([QB_ACCOUNT_TYPE.USER, QB_ACCOUNT_TYPE.LEAGUE, QB_ACCOUNT_TYPE.TEAM, QB_ACCOUNT_TYPE.CLUB].includes(firstTwoChar)) {
        fullName = item?.name?.slice(2, item?.name?.length)
      }
    }

    return (<TCHorizontalMessageOverview
        entityType={firstTwoChar}
        profilePic={getQBProfilePic(item?.type, index, firstTwoChar)}
        dialogType={item?.type}
        onPress={() => onDialogPress(item)}
        title={fullName}
        subTitle={item?.lastMessage}
        numberOfMembers={item?.occupantsIds}
        lastMessageDate={new Date(item?.lastMessageDateSent)}
        numberOfUnreadMessages={''}
    />)
  }, [onDialogPress])

  const onEndReached = useCallback(() => {
    if (!endReachedCalled) {
      setEndReachedCalled(true);
    }
  }, [endReachedCalled])

  const chatKeyExtractor = useCallback((item, index) => index.toString(), [])

  const onMomentumScrollBegin = useCallback(() => setEndReachedCalled(false), [])

  const renderAllMessages = useMemo(() => (
    <FlatList
            refreshing={loading}
            data={savedDialogsData.dialogs ?? []}
            keyExtractor={chatKeyExtractor}
            renderItem={renderSingleEntityChat}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onEndReached={onEndReached}
        />
    ), [chatKeyExtractor, loading, onEndReached, onMomentumScrollBegin, renderSingleEntityChat, savedDialogsData.dialogs])

  const renderHeader = useMemo(() => (
    <Header
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack() }>
                <FastImage source={images.backArrow} resizeMode={'contain'} style={styles.backImageStyle} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.eventTextStyle}>Search</Text>
            }
            rightComponent={
              <></>
            }
        />
    ), [navigation])

  return (
    <SafeAreaView style={ styles.mainContainer }>
      {renderHeader}
      <View style={styles.separateLine}/>
      <View style={{ backgroundColor: colors.grayBackgroundColor, width: '100%', padding: 15 }}>
        <TextInput
            autoFocus={true}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.textInputStyle}
            placeholder={'Search'}
        />
      </View>
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
  textInputStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.whiteColor,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  backImageStyle: {
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
  },
});

export default MessageSearchScreen;
