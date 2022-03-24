/* eslint-disable no-nested-ternary */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  NativeEventEmitter,
  Text,
  FlatList,
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import QB from 'quickblox-react-native-sdk';
import {useIsFocused, StackActions} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
// import ActivityLoader from '../../components/loader/ActivityLoader';
import TCHorizontalMessageOverview from '../../components/TCHorizontalMessageOverview';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  getQBProfilePic,
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBgetDialogs,
  QBsetupSettings,
} from '../../utils/QuickBlox';
import {widthPercentageToDP as wp} from '../../utils';
import AuthContext from '../../auth/context';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';

const QbMessageEmitter = new NativeEventEmitter(QB);

const MessageMainScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  const [endReachedCalled, setEndReachedCalled] = useState(false);
  const [pressStatus, setPressStatus] = useState(null);
  const [savedDialogsData, setSavedDialogsData] = useState({
    append: {},
    dialogs: [],
    limit: 30,
    skip: 0,
    total: 0,
  });
  const isFocused = useIsFocused();
  console.log('Auth context:', authContext);
  useEffect(() => {
    if (!authContext?.entity?.QB) navigation.dispatch(StackActions.popToTop());
  }, [authContext?.entity?.QB, navigation]);

  useEffect(() => {
    if (authContext?.entity?.QB && isFocused) {
      connectAndSubscribe();
      QbMessageEmitter.addListener(
        QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
        newDialogHandler,
      );
    }

    return () => {
      QbMessageEmitter.removeListener(QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE);
    };
  }, [navigation, isFocused, authContext?.entity?.QB]);

  const newDialogHandler = () => {
    getDialogs();
  };

  const getDialogs = async (request = {}, pagination = false) => {
    QBgetDialogs({
      ...request,
      filter: {
        field: QB.chat.DIALOGS_FILTER.FIELD.NAME,
        value: '',
        operator: QB.chat.DIALOGS_FILTER.OPERATOR.CTN,
      },
    })
      .then((savedDialog) => {
        console.log('savedDialog', savedDialog);
        _.map(savedDialog?.dialogs, (x) => {
          if (x?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && !x?.isJoined) {
            QB.chat.joinDialog({dialogId: x?.id});
          }
        });
        if (pagination) {
          const data = {
            ...savedDialog,
            dialogs: [...savedDialogsData.dialogs, ...savedDialog.dialogs],
          };
          setSavedDialogsData({...data});
        } else {
          setSavedDialogsData(savedDialog);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const connectAndSubscribe = async () => {
    console.log('authContext?.entity', authContext?.entity);
    await QBconnectAndSubscribe(authContext?.entity);
    await QBsetupSettings();
    await getDialogs();
    // setTimeout(() => setLoading(false), 1500);
  };

  const onDialogPress = useCallback(
    (dialog) => {
      navigation.navigate('MessageChat', {dialog});
    },
    [navigation],
  );

  useEffect(() => {
    if (endReachedCalled) {
      setEndReachedCalled(false);
      getDialogs({skip: savedDialogsData.dialogs.length}, true);
    }
  }, [endReachedCalled]);

  const renderSingleEntityChat = useCallback(
    ({item}) => {
      console.log('ITEMMMM', item);
      let fullName = item.name;
      let firstTwoChar = '';
      if (item.type === QB.chat.DIALOG_TYPE.CHAT) {
        firstTwoChar = item.name.slice(0, 2);
        if (
          [
            QB_ACCOUNT_TYPE.USER,
            QB_ACCOUNT_TYPE.LEAGUE,
            QB_ACCOUNT_TYPE.TEAM,
            QB_ACCOUNT_TYPE.CLUB,
          ].includes(firstTwoChar)
        ) {
          fullName = item?.name?.slice(2, item?.name?.length);
        }
      }

      return (
        <TCHorizontalMessageOverview
          occupantsIds={item?.occupantsIds}
          entityType={firstTwoChar}
          profilePic={getQBProfilePic(item?.type, firstTwoChar, item?.photo)}
          dialogType={item?.type}
          onPress={() => onDialogPress(item)}
          title={fullName}
          subTitle={item?.lastMessage}
          numberOfMembers={item?.occupantsIds}
          lastMessageDate={new Date(item?.lastMessageDateSent)}
          numberOfUnreadMessages={
            Number(item?.unreadMessagesCount) > 99
              ? '+ 99'
              : item?.unreadMessagesCount
          }
        />
      );
    },
    [onDialogPress],
  );

  const onEndReached = useCallback(() => {
    if (!endReachedCalled) {
      setEndReachedCalled(true);
    }
  }, [endReachedCalled]);

  const chatKeyExtractor = useCallback((item, index) => index.toString(), []);

  const onMomentumScrollBegin = useCallback(
    () => setEndReachedCalled(false),
    [],
  );

  const LiseEmptyComponent = useMemo(
    () => (
      <View style={styles.chatMainContainer}>
        {/* <TouchableOpacity
          style={styles.plusImage}
          onPress={() => {
            navigation.navigate('MessageInviteScreen');
          }}>
          <FastImage
            resizeMode={'contain'}
            source={images.chatPlus}
            style={styles.chatplusStyle}
          />

          <Text style={styles.startText}>Start a Chat</Text>
        </TouchableOpacity> */}
        <View style={styles.centerMsgContainer}>
          <Text style={styles.noMsgText}>No Chat</Text>
          <Text style={styles.msgAppearText}>
            New chats will appear here.
          </Text>
        </View>
      </View>
    ),
    [],
  );

  const renderHeader = useMemo(
    () => (
      <Header
        showBackgroundColor={true}
        mainContainerStyle={{paddingBottom: 0}}
        leftComponent={
          <View>
            <FastImage
              source={images.tc_message_top_icon}
              resizeMode={'contain'}
              style={styles.backImageStyle}
            />
          </View>
        }
        centerComponent={<Text style={styles.eventTextStyle}>Chat</Text>}
        rightComponent={
          authContext?.entity?.QB && (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => setPressStatus('messageButton')}
                onPressOut={() => setPressStatus(null)}
                style={{marginRight: 10}}
                onPress={() => {
                  navigation.navigate('MessageInviteScreen');
                }}>
                <FastImage
                  source={
                    pressStatus === 'messageButton'
                      ? images.selectAddMessageButton
                      : images.addMessageChat
                  }
                  resizeMode={'contain'}
                  style={{...styles.rightImageStyle}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => setPressStatus('searchButton')}
                onPressOut={() => setPressStatus(null)}
                onPress={() => {
                  navigation.navigate('MessageSearchScreen');
                }}>
                <FastImage
                  source={
                    pressStatus === 'searchButton'
                      ? images.selectMessageSearchButton
                      : images.messageSearchButton2
                  }
                  resizeMode={'contain'}
                  style={{...styles.rightImageStyle}}
                />
              </TouchableOpacity>
            </View>
        )
        }
      />
    ),
    [authContext?.entity?.QB, pressStatus, navigation],
  );

  return (
    <View style={styles.mainContainer}>
      {renderHeader}
      <View style={styles.separateLine} />
     
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading
         ? (
           <UserListShimmer />
        ) : (savedDialogsData.dialogs?.length > 0  && authContext?.entity?.QB  )? (
          <FlatList
            refreshing={loading}
            data={savedDialogsData.dialogs ?? []}
            keyExtractor={chatKeyExtractor}
            renderItem={renderSingleEntityChat}
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onEndReached={onEndReached}
            style={{flex: 1, height: '100%', width: '100%'}}
          />
        ) : (
          LiseEmptyComponent
        )
      }
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backImageStyle: {
    height: 35,
    width: 35,
  },
  rightImageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  separateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
 
  chatMainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
 
  centerMsgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMsgText: {
    fontFamily: fonts.RBold,
    fontSize: 20,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
  msgAppearText: {
    fontFamily: fonts.RRegular,
    marginTop: 10,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});

export default MessageMainScreen;
