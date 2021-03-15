import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  SectionList,
  Text,
  Alert,

} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import Moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationProfileItem from '../../components/notificationComponent/NotificationProfileItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  getUnreadCount,
  getNotificationsList,
  acceptRequest,
  declineRequest,
  deleteNotification,
} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
import TCThinDivider from '../../components/TCThinDivider';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utils from '../challenge/ChallengeUtility';
import * as RefereeUtils from '../referee/RefereeUtility';
import * as ScorekeeperUtils from '../scorekeeper/ScorekeeperUtility';
import {
  getQBAccountType,
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBcreateUser,
  QBlogin,
  QBLogout,
} from '../../utils/QuickBlox';
import { getUserDetails } from '../../api/Users';
import { getGroupDetails } from '../../api/Groups';
import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';
import NotificationListTopHeaderShimmer from '../../components/shimmer/account/NotificationListTopHeaderShimmer';

function NotificationsListScreen({ navigation }) {
  const actionSheet = useRef();
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notifAPI, setNotifAPI] = useState();
  const refContainer = useRef();
  const authContext = useContext(AuthContext);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState();
  const [activeScreen, setActiveScreen] = useState(false);
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const onDetailPress = (item) => {
    if (activeScreen) {
      const verb = item.activities[0].verb;
      if (
        verb.includes(NotificationType.initialChallengePaymentFail)
        || verb.includes(NotificationType.alterChallengePaymentFail)
        || verb.includes(NotificationType.challengeAwaitingPaymentPaid)
        || verb.includes(
          NotificationType.gameAutoCanceledDueToInitialPaymentFailed,
        )
        || verb.includes(
          NotificationType.gameAutoRestoredDueToAlterPaymentFailed,
        )
        || verb.includes(NotificationType.gameCanceledDuringAwaitingPayment)
        || verb.includes(NotificationType.gameRestoredDuringAwaitingPayment)
        || verb.includes(NotificationType.challengeOffered)
        || verb.includes(NotificationType.challengeAltered)
      ) {
        const a = JSON.parse(item.activities[0].object)?.challengeObject
            ?.challenge_id
          || JSON.parse(item.activities[0].object).newChallengeObject.challenge_id;
        setloading(true);
        Utils.getChallengeDetail(a, authContext)
          .then((obj) => {
            navigation.navigate(obj.screenName, {
              challengeObj: obj.challengeObj || obj.challengeObj[0],
            });
            setloading(false);
          })
          .catch(() => setloading(false));
      } else if (
        verb.includes(NotificationType.refereeReservationInitialPaymentFail)
        || verb.includes(NotificationType.refereeReservationAlterPaymentFail)
        || verb.includes(NotificationType.refereeReservationAwaitingPaymentPaid)
        || verb.includes(
          NotificationType.refereeReservationAutoCanceledDueToInitialPaymentFailed,
        )
        || verb.includes(
          NotificationType.refereeReservationAutoRestoredDueToAlterPaymentFailed,
        )
        || verb.includes(
          NotificationType.refereeReservationCanceledDuringAwaitingPayment,
        )
        || verb.includes(
          NotificationType.refereeReservationRestoredDuringAwaitingPayment,
        )
        || verb.includes(NotificationType.refereeRequest)
        || verb.includes(NotificationType.changeRefereeRequest)
      ) {
        const a = JSON.parse(item.activities[0].object)?.reservationObject
          ?.reservation_id;
        setloading(true);
        RefereeUtils.getRefereeReservationDetail(
          a,
          authContext.entity.uid,
          authContext,
        )
          .then((obj) => {
            navigation.navigate(obj.screenName, {
              reservationObj: obj.reservationObj || obj.reservationObj[0],
            });
            setloading(false);
          })
          .catch(() => setloading(false));
      } else if (
        verb.includes(
          NotificationType.scorekeeperReservationInitialPaymentFail,
        )
        || verb.includes(
          NotificationType.scorekeeperReservationAlterPaymentFail,
        )
        || verb.includes(
          NotificationType.scorekeeperReservationAwaitingPaymentPaid,
        )
        || verb.includes(
          NotificationType.scorekeeperReservationAutoCanceledDueToInitialPaymentFailed,
        )
        || verb.includes(
          NotificationType.scorekeeperReservationAutoRestoredDueToAlterPaymentFailed,
        )
        || verb.includes(
          NotificationType.scorekeeperReservationCanceledDuringAwaitingPayment,
        )
        || verb.includes(
          NotificationType.scorekeeperReservationRestoredDuringAwaitingPayment,
        )
        || verb.includes(NotificationType.scorekeeperRequest)
        || verb.includes(NotificationType.changeScorekeeperRequest)
      ) {
        const a = JSON.parse(item.activities[0].object)?.reservationObject
          ?.reservation_id;
        setloading(true);
        ScorekeeperUtils.getScorekeeperReservationDetail(
          a,
          authContext.entity.uid,
          authContext,
        )
          .then((obj) => {
            navigation.navigate(obj.screenName, {
              reservationObj: obj.reservationObj || obj.reservationObj[0],
            });
            setloading(false);
          })
          .catch(() => setloading(false));
      }
      // else if (verb.includes(NotificationType.scorekeeperRequest)) {
      //   Alert.alert('Remain Functionality')
      // }
    } else {
      showSwitchProfilePopup();
    }
  };

  const onMessagePress = (item) => {
    if (activeScreen) {
      const entityId = item?.entityId;
      const entityType = item?.entityType;
      const navigateToMessage = (userId) => {
        setloading(false);
        navigation.push('MessageChat', {
          screen: 'MessageChatRoom',
          params: { userId },
        });
      };
      const createQBUser = (userData) => {
        const accountType = getQBAccountType(entityType);
        QBcreateUser(entityId, userData, accountType)
          .then(() => {
            navigateToMessage(entityId);
          })
          .catch(() => {
            navigateToMessage(entityId);
          });
      };
      if (entityType && entityId) {
        setloading(true);
        if (entityType === 'player' || entityType === 'user') {
          getUserDetails(entityId, authContext)
            .then((uData) => {
              createQBUser(uData?.payload);
            })
            .catch(() => setloading(false));
        } else {
          getGroupDetails(entityId, authContext)
            .then((gData) => {
              createQBUser(gData?.payload);
            })
            .catch(() => setloading(false));
        }
      }
    } else {
      showSwitchProfilePopup();
    }
  };

  const switchProfile = async (item) => {
    let currentEntity = authContext.entity;

    if (item.entity_type === 'player') {
      currentEntity = {
        ...currentEntity,
        uid: item.user_id,
        role: 'user',
        obj: item,
      };
    } else if (item.entity_type === 'team') {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: 'team',
        obj: item,
      };
    } else if (item.entity_type === 'club') {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: 'club',
        obj: item,
      };
    }
    authContext.setEntity({ ...currentEntity });
    await Utility.setStorage('authContextEntity', { ...currentEntity });
    return currentEntity;
  };
  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entityType = accountData?.entity_type;
    const uid = entityType === 'player' ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {
 USER, CLUB, LEAGUE, TEAM,
 } = QB_ACCOUNT_TYPE;
        let accountType = USER;
        if (entityType === 'club') accountType = CLUB;
        else if (entityType === 'team') accountType = TEAM;
        else if (entityType === 'league') accountType = LEAGUE;
        QBlogin(
          accountData[uid],
          {
            ...accountData,
            full_name: accountData.group_name,
          },
          accountType,
        )
          .then(async (res) => {
            currentEntity = {
              ...currentEntity,
              QB: { ...res.user, connected: true, token: res?.session?.token },
            };
            authContext.setEntity({ ...currentEntity });
            await Utility.setStorage('authContextEntity', { ...currentEntity });
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setloading(false);
                if (qbRes?.error) {
                  console.log('Towns Cup', qbRes?.error);
                }
              })
              .catch(() => {
                setloading(false);
              });
          })
          .catch(() => {
            setloading(false);
          });
      })
      .catch(() => {
        setloading(false);
      });
  };

  const onSwitchProfile = async (item) => {
    setloading(true);
    switchProfile(item)
      .then((currentEntity) => {
        setActiveScreen(true);
        switchQBAccount(item, currentEntity);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const showSwitchProfilePopup = () => {
    const name = selectedEntity.entity_type === 'player'
        ? `${selectedEntity.first_name} ${selectedEntity.last_name}`
        : selectedEntity.group_name;
    Alert.alert(
      `Do you want to switch account to ${name}?`,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => onSwitchProfile(selectedEntity) },
      ],
      { cancelable: true },
    );
  };

  const onDelete = ({ item }) => {
    if (activeScreen) {
      // setloading(true);
      const ids = item.activities.map((activity) => activity.id);
      deleteNotification(ids, item.type, authContext)
        .then(() => {
          callNotificationList()
            .then(() => setloading(false))
            .catch(() => setloading(false));
        })
        .catch(() => {
          // setloading(false);
          Alert.alert('Failed to move to trash. Try again later');
        });
    } else {
      showSwitchProfilePopup();
    }
  };

  const onAccept = (requestId) => {
    if (activeScreen) {
      setloading(true);
      acceptRequest(requestId, authContext)
        .then(() => {
          callNotificationList()
            .then(() => setloading(false))
            .catch(() => setloading(false));
        })
        .catch((error) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    } else {
      showSwitchProfilePopup();
    }
  };

  const onDecline = (requestId) => {
    setloading(true);
    if (activeScreen) {
      declineRequest(requestId, authContext)
        .then(() => {
          callNotificationList()
            .then(() => setloading(false))
            .catch(() => setloading(false));
        })
        .catch((error) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    } else {
      showSwitchProfilePopup();
    }
  };

  const isInvite = (verb) => verb.includes(NotificationType.inviteToJoinClub)
    || verb.includes(NotificationType.invitePlayerToJoinTeam)
    || verb.includes(NotificationType.invitePlayerToJoinClub)
    || verb.includes(NotificationType.inviteToConnectProfile)
    || verb.includes(NotificationType.invitePlayerToJoingame);

  const openHomePage = (item) => {
    if (activeScreen) {
      if (item?.entityType && item?.entityId) {
        navigation.push('HomeScreen', {
          uid: item?.entityId,
          backButtonVisible: true,
          menuBtnVisible: false,
          role: item?.entityType,
        });
      }
    } else {
      showSwitchProfilePopup();
    }
  };

  const renderPendingRequestComponent = ({ item }) => (
    <AppleStyleSwipeableRow
      onPress={() => onDelete({ item })}
      color={colors.redDelColor}
      image={images.deleteIcon}>
      {isInvite(item.activities[0].verb) && (
        <PRNotificationInviteCell
          item={item}
          selectedEntity={selectedEntity}
          onAccept={() => onAccept(item.activities[0].id)}
          onDecline={() => onDecline(item.activities[0].id)}
          onPress={() => {}}
          onPressFirstEntity={openHomePage}
        />
      )}

      {!isInvite(item.activities[0].verb) && (
        <PRNotificationDetailMessageItem
          item={item}
          selectedEntity={selectedEntity}
          onDetailPress={() => onDetailPress(item)}
          onMessagePress={onMessagePress}
          onPress={() => {}}
          onPressFirstEntity={openHomePage}
        />
      )}
    </AppleStyleSwipeableRow>
  );

  const renderNotificationComponent = ({ item }) => (
    <AppleStyleSwipeableRow
      onPress={() => onDelete({ item })}
      color={colors.redDelColor}
      image={images.deleteIcon}>
      <NotificationItem
        data={item}
        onPressFirstEntity={openHomePage}
        onPressSecondEntity={openHomePage}
        onPressCard={() => {}}
      />
    </AppleStyleSwipeableRow>
  );

  const RenderSections = ({ item, section }) => {
    if (section.section === strings.pendingrequests) {
      return renderPendingRequestComponent({ item: { ...item, type: 'request' } });
    }

    if (
      section.section === strings.earlier
      || section.section === strings.today
    ) {
      return renderNotificationComponent({
        item: { ...item, type: 'notification' },
      });
    }

    return null;
  };

  const activeTab = async (index) => {
    const gList = JSON.parse(JSON.stringify(groupList));
    gList[index].unread = 0;
    setGroupList(gList);
    checkActiveScreen(gList[index]);
    setCurrentTab(index);
    refContainer.current.scrollToIndex({
      animated: true,
      index,
      viewPosition: 0.5,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            actionSheet.current.show();
          }}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  useEffect(() => {
    if (isFocused) {
      setFirstTimeLoading(true);
      if (notifAPI !== 1) {
        getUnreadCount(authContext).then((response) => {
          if (response.status === true) {
            const { teams } = response.payload;
            const { clubs } = response.payload;
            const groups = [authContext.entity.auth.user, ...clubs, ...teams];
            const entityId = authContext?.entity?.role === 'user'
                ? authContext?.entity?.obj?.user_id
                : authContext?.entity?.obj?.group_id;
            const tabIndex = groups.findIndex(
              (item) => item?.group_id === entityId,
            );
            setGroupList(groups);
            setNotifAPI(1);
            setCurrentTab(tabIndex !== -1 ? tabIndex : 0);
            checkActiveScreen(groups[0]);
          }
        });
      }
      if (notifAPI === 1) {
        checkActiveScreen(groupList[currentTab]);
        callNotificationList()
          .then(() => setFirstTimeLoading(false))
          .catch(() => setFirstTimeLoading(false));
      }
    }
  }, [currentTab, isFocused]);

  const callNotificationList = () => new Promise((resolve, reject) => {
      const entity = groupList[currentTab];
      setSelectedEntity({ ...entity });
      const params = {
        mark_read: 'true',
        mark_seen: 'true',
        uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
      };
      getNotificationsList(params, authContext)
        .then(async (response) => {
          const pendingReqNotification = response.payload.requests;
          const todayNotifications = response.payload.notifications.filter(
            (item) => Moment(item.created_at).format('yyyy-MM-DD')
              === Moment(currentDate).format('yyyy-MM-DD'),
          );
          const erlierNotifications = response.payload.notifications.filter(
            (item) => Moment(item.created_at).format('yyyy-MM-DD')
              !== Moment(currentDate).format('yyyy-MM-DD'),
          );

          const array = [
            {
              data: [...pendingReqNotification],
              section: strings.pendingrequests,
              type: 'request',
            },
            {
              data: [...todayNotifications],
              section: strings.today,
              type: 'notification',
            },
            {
              data: [...erlierNotifications],
              section: strings.earlier,
              type: 'notification',
            },
          ];
          setMainNotificationsList([]);
          setMainNotificationsList([
            ...array.filter((item) => item.data.length !== 0),
          ]);
          resolve(true);
        })
        .catch((e) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('error');
          Alert.alert(e.messages);
        });
    });

  const itemSeparator = () => (
    // Item Separator
    <View style={styles.listItemSeparatorStyle} />
  );

  const renderSectionFooter = ({ section }) => {
    if (section.section === strings.pendingrequests) {
      return (
        <View
          style={[
            styles.listItemSeparatorStyle,
            { height: 7, backgroundColor: colors.grayBackgroundColor },
          ]}
        />
      );
    }
    return <View style={styles.listItemSeparatorStyle} />;
  };

  const renderGroupItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => activeTab(index)} key={index}>
      <NotificationProfileItem
        data={item}
        indexNumber={index}
        selectedIndex={currentTab}
      />
    </TouchableOpacity>
  );

  const checkActiveScreen = async (entity) => {
    const loggedInEntity = authContext.entity;
    const currentID = entity.entity_type === 'player' ? entity.user_id : entity.group_id;
    if (loggedInEntity.uid === currentID) {
      setActiveScreen(true);
    } else {
      setActiveScreen(false);
    }
  };

  return (
    <View style={[styles.rowViewStyle, { opacity: activeScreen ? 1.0 : 0.5 }]}>
      <View>
        {groupList?.length <= 0 ? (
          <NotificationListTopHeaderShimmer />
        ) : (
          <FlatList
            ref={refContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={groupList}
            renderItem={renderGroupItem}
            keyExtractor={keyExtractor}
          />
        )}

        <TCThinDivider marginTop={0} width={'100%'} />
      </View>
      <ActivityLoader visible={loading} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {firstTimeLoading ? (
        <NotificationListShimmer />
      ) : mainNotificationsList?.length > 0 ? (
        <SectionList
          ItemSeparatorComponent={itemSeparator}
          sections={mainNotificationsList}
          keyExtractor={keyExtractor}
          renderItem={RenderSections}
          renderSectionHeader={({ section: { section } }) => (
            <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
              <View style={styles.listItemSeparatorStyle} />
              <Text style={styles.header}>{section}</Text>
            </View>
          )}
          renderSectionFooter={renderSectionFooter}
        />
      ) : (
        <TCNoDataView title={'No records found'} />
      )}
      <ActionSheet
        ref={actionSheet}
        options={['Trash', 'Cancel']}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('NotificationNavigator', {
              screen: 'TrashScreen',
              params: {
                selectedGroup: groupList[currentTab],
                selectedEntity,
              },
            });
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  rowViewStyle: {
    flex: 1,
  },
  headerRightImg: {
    height: 20,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 20,
  },
  header: {
    backgroundColor: '#fff',
    fontFamily: fonts.RRegular,
    fontSize: 20,
    padding: 15,
    color: colors.lightBlackColor,
    alignContent: 'center',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.linesepratorColor,
  },
});

export default NotificationsListScreen;
