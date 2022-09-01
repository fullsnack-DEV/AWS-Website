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
  Alert,
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
  getQBAccountType,
  QBupdateUser,
} from '../../utils/QuickBlox';
import {widthPercentageToDP as wp} from '../../utils';
import AuthContext from '../../auth/context';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {groupUnpaused} from '../../api/Groups';
import {strings} from '../../../Localization/translation';
import {userActivate} from '../../api/Users';

const QbMessageEmitter = new NativeEventEmitter(QB);

const MessageMainScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');

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
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      console.log('its called....', authContext.entity.role);
      if (authContext?.entity?.obj?.is_pause === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
      if (authContext?.entity?.obj?.is_deactivate === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [
    authContext.entity?.obj.entity_type,
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    isFocused,
  ]);

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
          subTitle={
            item?.lastMessage === '[attachment]'
              ? 'Attachment'
              : item?.lastMessage
          }
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
          <Text style={styles.msgAppearText}>New chats will appear here.</Text>
        </View>
      </View>
    ),
    [],
  );

  const renderHeader = useMemo(
    () => (
      <Header
        showBackgroundColor={true}
        leftComponent={<Text style={styles.eventTextStyle}>Chats</Text>}
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

  const unPauseGroup = () => {
    setLoading(true);
    groupUnpaused(authContext)
      .then((response) => {
        setIsAccountDeactivated(false);
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setLoading(false);
          });
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const reActivateUser = () => {
    setLoading(true);
    userActivate(authContext)
      .then((response) => {
        console.log('deactivate account ', response);

        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          response?.payload?.user_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.log('QB error : ', error);
            setLoading(false);
          });
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <View
        style={{opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        {renderHeader}
        <View style={styles.separateLine} />
      </View>
      {isAccountDeactivated && (
        <TCAccountDeactivate
          type={
            authContext?.entity?.obj?.is_pause === true
              ? 'pause'
              : authContext?.entity?.obj?.under_terminate === true
              ? 'terminate'
              : 'deactivate'
          }
          onPress={() => {
            Alert.alert(
              `Are you sure you want to ${
                authContext?.entity?.obj?.is_pause === true
                  ? 'unpause'
                  : 'reactivate'
              } this account?`,
              '',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_pause === true
                      ? 'Unpause'
                      : 'Reactivate',
                  style: 'destructive',
                  onPress: () => {
                    if (authContext?.entity?.obj?.is_pause === true) {
                      unPauseGroup();
                    } else {
                      reActivateUser();
                    }
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      )}
      <View
        style={{flex: 1, opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {loading ? (
          <UserListShimmer />
        ) : savedDialogsData.dialogs?.length > 0 && authContext?.entity?.QB ? (
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
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  // backImageStyle: {
  //   height: 35,
  //   width: 35,
  // },
  rightImageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    width: 60,
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
