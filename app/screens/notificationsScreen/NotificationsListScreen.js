/* eslint-disable no-nested-ternary */
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
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  getUnreadCount,
  getNotificationsList,
  acceptRequest,
  declineRequest,
  deleteNotification,
  getRequestDetail,
} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as RefereeUtils from '../referee/RefereeUtility';
import * as ScorekeeperUtils from '../scorekeeper/ScorekeeperUtility';
import * as challengeUtility from '../challenge/ChallengeUtility';
import {
  getQBAccountType,
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBcreateUser,
  QBlogin,
  QBLogout,
} from '../../utils/QuickBlox';
import {getUserDetails} from '../../api/Users';
import {getGroupDetails} from '../../api/Groups';
import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';
import TCGradientButton from '../../components/TCGradientButton';
import PRNotificationTeamInvite from '../../components/notificationComponent/PRNotificationTeamInvite';
import PRNotificationDetailItem from '../../components/notificationComponent/PRNotificationDetailItem';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import {getEventById} from '../../api/Schedule';

function NotificationsListScreen({navigation}) {
  const actionSheet = useRef();
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState([]);
  const [notifAPI, setNotifAPI] = useState();
  const authContext = useContext(AuthContext);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState();
  const [activeScreen, setActiveScreen] = useState(groupList?.length === 0);

  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [groupData, setGroupData] = useState();
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);

  const onDetailPress = (item) => {
    console.log('Group ITEM ID:::::=>', item);

    if (activeScreen) {
      const verb = item.activities[0].verb;

      if (
        verb.includes(NotificationType.initialChallengePaymentFail) ||
        verb.includes(NotificationType.alterChallengePaymentFail) ||
        verb.includes(NotificationType.challengeAwaitingPaymentPaid) ||
        verb.includes(
          NotificationType.gameAutoCanceledDueToInitialPaymentFailed,
        ) ||
        verb.includes(
          NotificationType.gameAutoRestoredDueToAlterPaymentFailed,
        ) ||
        verb.includes(NotificationType.gameCanceledDuringAwaitingPayment) ||
        verb.includes(NotificationType.gameRestoredDuringAwaitingPayment) ||
        verb.includes(NotificationType.challengeOffered) ||
        verb.includes(NotificationType.challengeAltered)
      ) {
        const a =
          JSON.parse(item.activities[0].object)?.challengeObject
            ?.challenge_id ||
          JSON.parse(item.activities[0].object).newChallengeObject.challenge_id;
        setloading(true);
        challengeUtility
          .getChallengeDetail(a, authContext)
          .then((obj) => {
            console.log('challenge utils res:=>', obj);
            navigation.navigate(obj.screenName, {
              challengeObj: obj.challengeObj,
            });
            setloading(false);
          })
          .catch(() => setloading(false));
      } else if (
        verb.includes(NotificationType.refereeReservationInitialPaymentFail) ||
        verb.includes(NotificationType.refereeReservationAlterPaymentFail) ||
        verb.includes(NotificationType.refereeReservationAwaitingPaymentPaid) ||
        verb.includes(
          NotificationType.refereeReservationAutoCanceledDueToInitialPaymentFailed,
        ) ||
        verb.includes(
          NotificationType.refereeReservationAutoRestoredDueToAlterPaymentFailed,
        ) ||
        verb.includes(
          NotificationType.refereeReservationCanceledDuringAwaitingPayment,
        ) ||
        verb.includes(
          NotificationType.refereeReservationRestoredDuringAwaitingPayment,
        ) ||
        verb.includes(NotificationType.refereeRequest) ||
        verb.includes(NotificationType.changeRefereeRequest)
      ) {
        const a =
          JSON.parse(item.activities[0].object)?.reservationObject
            ?.reservation_id ||
          JSON.parse(item.activities[0].object)?.reservation?.reservation_id;
        setloading(true);
        RefereeUtils.getRefereeReservationDetail(
          a,
          authContext.entity.uid,
          authContext,
        )
          .then((obj) => {
            const reservationObj = obj.reservationObj || obj.reservationObj[0];

            console.log('reservationObj:1>=>', reservationObj);
            if (reservationObj?.referee?.user_id === authContext.entity.uid) {
              navigation.navigate(obj.screenName, {
                reservationObj,
              });
            } else if (
              reservationObj?.approved_by === authContext.entity.uid &&
              reservationObj.status === RefereeReservationStatus.accepted
            ) {
              navigation.navigate('RefereeApprovalScreen', {
                type: 'accepted',
                reservationObj,
              });
            } else if (
              reservationObj?.approved_by === authContext.entity.uid &&
              reservationObj.status === RefereeReservationStatus.declined
            ) {
              navigation.navigate('RefereeApprovalScreen', {
                type: 'declined',
                reservationObj,
              });
            } else if (
              reservationObj.status === RefereeReservationStatus.offered &&
              !reservationObj?.is_offer
            ) {
              navigation.navigate('RefereeApprovalScreen', {
                type: 'approve',
                reservationObj,
              });
            } else if (
              reservationObj.status === RefereeReservationStatus.approved &&
              reservationObj?.is_offer
            ) {
              if (authContext.entity.uid === reservationObj.initiated_by) {
                navigation.navigate(obj.screenName, {
                  reservationObj,
                });
              } else {
                navigation.navigate('RefereeApprovalScreen', {
                  type: 'accept',
                  reservationObj,
                });
              }
            } else if (
              reservationObj.status === RefereeReservationStatus.approved &&
              !reservationObj?.is_offer
            ) {
              navigation.navigate('RefereeApprovalScreen', {
                type: 'accepted',
                reservationObj,
              });
            } else if (
              reservationObj.status === RefereeReservationStatus.offered &&
              reservationObj?.expiry_datetime <
                parseFloat(new Date().getTime() / 1000).toFixed(0)
            ) {
              navigation.navigate('RefereeApprovalScreen', {
                type: 'expired',
                reservationObj,
              });
            } else {
              console.log('reservationObj', reservationObj.status);
              if (authContext.entity.uid === reservationObj.approved_by) {
                navigation.navigate('RefereeApprovalScreen', {
                  type: 'accepted',
                  reservationObj,
                });
              } else {
                navigation.navigate(obj.screenName, {
                  reservationObj,
                });
              }
            }
            setloading(false);
          })
          .catch(() => setloading(false));
      } else if (
        verb.includes(
          NotificationType.scorekeeperReservationInitialPaymentFail,
        ) ||
        verb.includes(
          NotificationType.scorekeeperReservationAlterPaymentFail,
        ) ||
        verb.includes(
          NotificationType.scorekeeperReservationAwaitingPaymentPaid,
        ) ||
        verb.includes(
          NotificationType.scorekeeperReservationAutoCanceledDueToInitialPaymentFailed,
        ) ||
        verb.includes(
          NotificationType.scorekeeperReservationAutoRestoredDueToAlterPaymentFailed,
        ) ||
        verb.includes(
          NotificationType.scorekeeperReservationCanceledDuringAwaitingPayment,
        ) ||
        verb.includes(
          NotificationType.scorekeeperReservationRestoredDuringAwaitingPayment,
        ) ||
        verb.includes(NotificationType.scorekeeperRequest) ||
        verb.includes(NotificationType.changeScorekeeperRequest)
      ) {
        // const a = JSON.parse(item.activities[0].object)?.reservationObject
        //   ?.reservation_id;
        // setloading(true);
        // ScorekeeperUtils.getScorekeeperReservationDetail(
        //   a,
        //   authContext.entity.uid,
        //   authContext,
        // )
        //   .then((obj) => {
        //     navigation.navigate(obj.screenName, {
        //       reservationObj: obj.reservationObj || obj.reservationObj[0],
        //     });
        //     setloading(false);
        //   })
        //   .catch(() => setloading(false));
        const a =
          JSON.parse(item.activities[0].object)?.reservationObject
            ?.reservation_id ||
          JSON.parse(item.activities[0].object)?.reservation?.reservation_id;
        setloading(true);
        ScorekeeperUtils.getScorekeeperReservationDetail(
          a,
          authContext.entity.uid,
          authContext,
        )
          .then((obj) => {
            const reservationObj = obj.reservationObj || obj.reservationObj[0];
            console.log('reservationObj:1>=>', reservationObj);
            if (
              reservationObj?.scorekeeper?.user_id === authContext.entity.uid
            ) {
              navigation.navigate(obj.screenName, {
                reservationObj,
              });
            } else if (
              reservationObj?.approved_by === authContext.entity.uid &&
              reservationObj.status === ScorekeeperReservationStatus.accepted
            ) {
              navigation.navigate('ScorekeeperApprovalScreen', {
                type: 'accepted',
                reservationObj,
              });
            } else if (
              reservationObj?.approved_by === authContext.entity.uid &&
              reservationObj.status === ScorekeeperReservationStatus.declined
            ) {
              navigation.navigate('ScorekeeperApprovalScreen', {
                type: 'declined',
                reservationObj,
              });
            } else if (
              reservationObj.status === ScorekeeperReservationStatus.offered &&
              !reservationObj?.is_offer
            ) {
              navigation.navigate('ScorekeeperApprovalScreen', {
                type: 'approve',
                reservationObj,
              });
            } else if (
              reservationObj.status === ScorekeeperReservationStatus.approved &&
              reservationObj?.is_offer
            ) {
              if (authContext.entity.uid === reservationObj.initiated_by) {
                navigation.navigate(obj.screenName, {
                  reservationObj,
                });
              } else {
                navigation.navigate('ScorekeeperApprovalScreen', {
                  type: 'accept',
                  reservationObj,
                });
              }
            } else if (
              reservationObj.status === ScorekeeperReservationStatus.approved &&
              !reservationObj?.is_offer
            ) {
              navigation.navigate('ScorekeeperApprovalScreen', {
                type: 'accepted',
                reservationObj,
              });
            } else if (
              reservationObj.status === ScorekeeperReservationStatus.offered &&
              reservationObj?.expiry_datetime <
                parseFloat(new Date().getTime() / 1000).toFixed(0)
            ) {
              navigation.navigate('ScorekeeperApprovalScreen', {
                type: 'expired',
                reservationObj,
              });
            } else {
              console.log('reservationObj', reservationObj.status);
              if (authContext.entity.uid === reservationObj.approved_by) {
                navigation.navigate('ScorekeeperApprovalScreen', {
                  type: 'accepted',
                  reservationObj,
                });
              } else {
                navigation.navigate(obj.screenName, {
                  reservationObj,
                });
              }
            }
            setloading(false);
          })
          .catch(() => setloading(false));
      } else if (verb.includes(NotificationType.inviteToConnectMember)) {
        navigation.navigate('InviteToMemberScreen', {
          data: item,
        });
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
        navigation.navigate('MessageChat', {
          screen: 'MessageChat',
          params: {userId},
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
    authContext.setEntity({...currentEntity});
    await Utility.setStorage('authContextEntity', {...currentEntity});
    return currentEntity;
  };
  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entityType = accountData?.entity_type;
    const uid = entityType === 'player' ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {USER, CLUB, LEAGUE, TEAM} = QB_ACCOUNT_TYPE;
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
              QB: {...res.user, connected: true, token: res?.session?.token},
            };
            authContext.setEntity({...currentEntity});
            await Utility.setStorage('authContextEntity', {...currentEntity});
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setloading(false);
                if (qbRes?.error) {
                  console.log(strings.appName, qbRes?.error);
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
    const name =
      selectedEntity.entity_type === 'player'
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
        {text: 'Yes', onPress: () => onSwitchProfile(selectedEntity)},
      ],
      {cancelable: true},
    );
  };

  const onDelete = ({item}) => {
    if (activeScreen) {
      setloading(true);
      const ids = item.activities.map((activity) => activity.id);
      // setMainNotificationsList(mainNotificationsList.filter((obj) => obj.id !== ids))
      deleteNotification(ids, item.type, authContext)
        .then(() => {
          callNotificationList()
            .then(() => setloading(false))
            .catch(() => setloading(false));
        })
        .catch(() => {
          setloading(false);
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

  const onRespond = (groupObj) => {
    console.log('groupObj11:=>', groupObj);

    const groupId = JSON.parse(groupObj?.activities?.[0]?.object).groupData
      ?.group_id;
    console.log(
      'groupObject:=>',
      JSON.parse(groupObj?.activities?.[0]?.object),
    );

    if (activeScreen) {
      if (
        groupObj.activities[0].verb.includes(NotificationType.inviteToJoinClub)
      ) {
        navigation.navigate('RespondForInviteScreen', {groupObj});
      }
      if (
        groupObj.activities[0].verb.includes(NotificationType.inviteToEvent)
      ) {
        setloading(true);
        getEventById(
          authContext.entity.role === 'user' ? 'users' : 'groups',
          authContext.entity.uid || authContext.entity.auth.user_id,
          JSON.parse(groupObj?.activities?.[0]?.object).eventId,
          authContext,
        )
          .then((response) => {
            setloading(false);
            navigation.navigate('AcceptEventInviteScreen', {
              data: response.payload,
              requestID: groupObj?.activities?.[0].id,
            });
          })
          .catch((e) => {
            setloading(false);
            console.log('Error :-', e);
          });
      } else if (
        groupObj.activities[0].verb.includes(
          NotificationType.sendBasicInfoToMember,
        )
      ) {
        navigation.navigate('RequestBasicInfoScreen', {
          groupID: groupId,
          memberID: authContext.entity.uid,
          requestID: groupObj.activities[0].id,
        });
      } else {
        setloading(true);
        getRequestDetail(groupId, authContext)
          .then((response) => {
            setloading(false);
            console.log('details: =>', response.payload);
            setGroupData(response.payload);
            setIsRulesModalVisible(true);
          })
          .catch((error) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, error.message);
            }, 10);
          });
      }
    } else {
      showSwitchProfilePopup();
    }
    // setGroupData(groupdata)
    // setIsRulesModalVisible(true)
  };

  const isInvite = (verb) =>
    verb.includes(NotificationType.inviteToJoinClub) ||
    verb.includes(NotificationType.invitePlayerToJoinTeam) ||
    verb.includes(NotificationType.invitePlayerToJoinClub) ||
    verb.includes(NotificationType.inviteToConnectProfile) ||
    verb.includes(NotificationType.invitePlayerToJoingame) ||
    verb.includes(NotificationType.inviteToDoubleTeam) ||
    verb.includes(NotificationType.inviteToEvent) ||
    verb.includes(NotificationType.sendBasicInfoToMember);
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
  const onNotificationClick = (notificationItem) => {
    console.log('Notification detail::=>', notificationItem);
    console.log(notificationItem?.verb);
    const verb = notificationItem?.verb?.split('_');
    const postVerbTypes = [
      NotificationType.clap,
      NotificationType.tagged,
      NotificationType.comment,
    ];
    const scorekeeperVerbTypes = [
      NotificationType.scorekeeperReservationCancelled,
      NotificationType.scorekeeperReservationAccepted,
      NotificationType.scorekeeperReservationApproved,
    ];
    const refereeVerbTypes = [
      NotificationType.refereeReservationCancelled,
      NotificationType.refereeReservationAccepted,
      NotificationType.refereeReservationApproved,
    ];
    const gameVerbTypes = [
      NotificationType.gameAccepted,
      NotificationType.gameCancelled,
    ];

    if (postVerbTypes.includes(verb?.[0])) {
      navigation.navigate('SingleNotificationScreen', {notificationItem});
    }
    if (scorekeeperVerbTypes.includes(verb?.[0])) {
      const a =
        JSON.parse(notificationItem.activities[0].object)?.reservationObject
          ?.reservation_id ||
        JSON.parse(notificationItem.activities[0].object)?.reservation
          ?.reservation_id;
      setloading(true);
      ScorekeeperUtils.getScorekeeperReservationDetail(
        a,
        authContext.entity.uid,
        authContext,
      )
        .then((obj) => {
          const reservationObj = obj.reservationObj || obj.reservationObj[0];

          console.log('reservationObj:1>=>', reservationObj);

          navigation.navigate(obj.screenName, {
            reservationObj,
          });

          setloading(false);
        })
        .catch(() => setloading(false));
    }
    if (refereeVerbTypes.includes(verb?.[0])) {
      const a =
        JSON.parse(notificationItem.activities[0].object)?.reservationObject
          ?.reservation_id ||
        JSON.parse(notificationItem.activities[0].object)?.reservation
          ?.reservation_id;
      setloading(true);
      RefereeUtils.getRefereeReservationDetail(
        a,
        authContext.entity.uid,
        authContext,
      )
        .then((obj) => {
          const reservationObj = obj.reservationObj || obj.reservationObj[0];

          console.log('reservationObj:1>=>', reservationObj);

          navigation.navigate(obj.screenName, {
            reservationObj,
          });

          setloading(false);
        })
        .catch(() => setloading(false));
    }
    if (gameVerbTypes.includes(verb?.[0])) {
      const a = JSON.parse(notificationItem.activities[0].object)
        ?.challengeObject?.challenge_id;
      setloading(true);
      challengeUtility
        .getChallengeDetail(a, authContext)
        .then((obj) => {
          const challengeObj = obj.challengeObj || obj.challengeObj[0];

          console.log('challengeObj:1>=>', challengeObj);

          navigation.navigate(obj.screenName, {
            challengeObj,
          });

          setloading(false);
        })
        .catch(() => setloading(false));
    }
  };

  const notificationComponentType = (item) => {
    console.log('VERB::=>', item);
    if (isInvite(item.activities[0].verb)) {
      if (
        item.activities[0].verb.includes(NotificationType.inviteToDoubleTeam) ||
        item.activities[0].verb.includes(NotificationType.inviteToEvent) ||
        item.activities[0].verb.includes(NotificationType.inviteToJoinClub)
      ) {
        return (
          <PRNotificationTeamInvite
            item={item}
            selectedEntity={selectedEntity}
            // onAccept={() => onAccept(item.activities[0].id)}
            onRespond={() => onRespond(item)} // JSON.parse(item.activities[0].object))
            onPress={() => onNotificationClick(item)}
            onPressFirstEntity={openHomePage}
          />
        );
      }
      if (
        item.activities[0].verb.includes(NotificationType.sendBasicInfoToMember)
      ) {
        return (
          <PRNotificationTeamInvite
            item={item}
            selectedEntity={selectedEntity}
            // onAccept={() => onAccept(item.activities[0].id)}
            onRespond={() => onRespond(item)} // JSON.parse(item.activities[0].object))
            onPress={() => onNotificationClick(item)}
            onPressFirstEntity={openHomePage}
          />
        );
      }

      return (
        <PRNotificationInviteCell
          item={item}
          selectedEntity={selectedEntity}
          onAccept={() => onAccept(item.activities[0].id)}
          onDecline={() => onDecline(item.activities[0].id)}
          onPress={() => onNotificationClick(item)}
          onPressFirstEntity={openHomePage}
        />
      );
    }
    if (
      item.activities[0].verb.includes(
        NotificationType.inviteToConnectMember,
      ) ||
      item.activities[0].verb.includes(NotificationType.refereeRequest) ||
      item.activities[0].verb.includes(NotificationType.scorekeeperRequest)
    ) {
      return (
        <PRNotificationDetailItem
          item={item}
          selectedEntity={selectedEntity}
          onDetailPress={() => onDetailPress(item)}
          onPress={() => onNotificationClick(item)}
          onPressFirstEntity={openHomePage}
        />
      );
    }

    return (
      <PRNotificationDetailMessageItem
        item={item}
        selectedEntity={selectedEntity}
        onDetailPress={() => onDetailPress(item)}
        onMessagePress={onMessagePress}
        onPress={() => onNotificationClick(item)}
        onPressFirstEntity={openHomePage}
      />
    );
  };

  const renderPendingRequestComponent = ({item}) => {
    console.log('ITEm:,', item);
    return (
      <AppleStyleSwipeableRow
        onPress={() => onDelete({item})}
        color={colors.darkThemeColor}
        image={images.deleteIcon}
      >
        {notificationComponentType(item)}
      </AppleStyleSwipeableRow>
    );
  };

  const renderNotificationComponent = ({item}) => {
    console.log('Item notification:=>', item);
    if (item.activities[0].is_request) {
      return (
        <AppleStyleSwipeableRow
          onPress={() => onDelete({item})}
          color={colors.darkThemeColor}
          image={images.deleteIcon}
        >
          {notificationComponentType(item)}
        </AppleStyleSwipeableRow>
      );
    }
    return (
      <AppleStyleSwipeableRow
        onPress={() => onDelete({item})}
        color={colors.darkThemeColor}
        image={images.deleteIcon}
      >
        <NotificationItem
          data={item}
          onPressFirstEntity={openHomePage}
          onPressSecondEntity={openHomePage}
          onPressCard={() => onNotificationClick(item)}
        />
      </AppleStyleSwipeableRow>
    );
  };

  const RenderSections = ({item, section}) => {
    console.log('section:', section);
    if (section.section === strings.pendingrequests) {
      return renderPendingRequestComponent({item: {...item, type: 'request'}});
    }

    if (
      section.section === strings.earlier ||
      section.section === strings.today
    ) {
      return renderNotificationComponent({
        item: {...item, type: 'notification'},
      });
    }

    return null;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            actionSheet.current.show();
          }}
        >
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
            const {teams} = response.payload;
            const {clubs} = response.payload;
            const groups = [authContext.entity.auth.user, ...clubs, ...teams];
            const entityId =
              authContext?.entity?.role === 'user'
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

  const callNotificationList = () =>
    new Promise((resolve, reject) => {
      const entity = groupList[currentTab];
      setSelectedEntity({...entity});
      const params = {
        mark_read: 'true',
        mark_seen: 'true',
        uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
      };
      getNotificationsList(params, authContext)
        .then(async (response) => {
          const pendingReqNotification = response.payload.requests;
          const todayNotifications = response.payload.notifications.filter(
            (item) =>
              Moment(item.created_at).format('yyyy-MM-DD') ===
              Moment(currentDate).format('yyyy-MM-DD'),
          );
          const erlierNotifications = response.payload.notifications.filter(
            (item) =>
              Moment(item.created_at).format('yyyy-MM-DD') !==
              Moment(currentDate).format('yyyy-MM-DD'),
          );

          console.log('todayNotifications:=>', todayNotifications);
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

  const renderSectionFooter = ({section}) => {
    if (section.section === strings.pendingrequests) {
      return <View style={styles.thinDivider} />;
    }
    return <View style={styles.listItemSeparatorStyle} />;
  };

  const checkActiveScreen = async (entity) => {
    const loggedInEntity = authContext.entity;
    const currentID =
      entity.entity_type === 'player' ? entity.user_id : entity.group_id;
    if (loggedInEntity.uid === currentID) {
      setActiveScreen(true);
    } else {
      setActiveScreen(false);
    }
  };

  const onNextPressed = () => {
    navigation.navigate('RespondToInviteScreen', {teamObject: groupData});
    setIsRulesModalVisible(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {firstTimeLoading && <NotificationListShimmer />}

      <ActivityLoader visible={loading} />
      {/* eslint-disable-next-line no-nested-ternary */}

      {!firstTimeLoading && mainNotificationsList.length > 0 && (
        <SectionList
          style={{flex: 1}}
          ItemSeparatorComponent={itemSeparator}
          sections={mainNotificationsList}
          keyExtractor={keyExtractor}
          renderItem={RenderSections}
          renderSectionHeader={({section: {section}}) => (
            <TouchableOpacity
              style={{flex: 1, backgroundColor: colors.whiteColor}}
              disabled={section !== strings.pendingrequests}
              onPress={() => {
                navigation.navigate('PendingRequestScreen');
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.header}>{section}</Text>
                {section === strings.pendingrequests && (
                  <Image source={images.nextArrow} style={styles.nextArrow} />
                )}
              </View>
              <View style={styles.listItemSeparatorStyle} />
            </TouchableOpacity>
          )}
          renderSectionFooter={renderSectionFooter}
        />
      )}

      {!firstTimeLoading && mainNotificationsList.length <= 0 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={styles.noEventText}>No Notification</Text>
          <Text style={styles.dataNotFoundText}>
            New notification will appear here.
          </Text>
        </View>
      )}

      <ActionSheet
        ref={actionSheet}
        options={['Trash', 'Cancel']}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate('TrashScreen', {
              selectedGroup: groupList[currentTab],
              selectedEntity,
            });
          }
        }}
      />

      {/* Rules notes modal */}
      <Modal
        isVisible={isRulesModalVisible}
        onBackdropPress={() => setIsRulesModalVisible(false)}
        onRequestClose={() => setIsRulesModalVisible(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}
      >
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.7,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}
            >
              Respond to invite to create team
            </Text>
          </View>
          <View style={styles.separatorLine} />
          <View style={{flex: 1}}>
            <ScrollView>
              <Text style={[styles.rulesText, {margin: 15}]}>
                {'When your team creates a club:'}
              </Text>
              <Text style={[styles.rulesText, {marginLeft: 15}]}>
                {'\n• your team will belong to the club initially.'}
              </Text>
              <Text style={[styles.rulesText, {marginLeft: 15}]}>
                {'\n• your team can leave the club anytime later.'}
              </Text>
              <Text style={[styles.rulesText, {marginLeft: 15}]}>
                {
                  '\n• the admins of your team will be the admins of the club initially.'
                }
              </Text>
            </ScrollView>
          </View>
          <TCGradientButton
            isDisabled={false}
            title={strings.nextTitle}
            style={{marginBottom: 30}}
            onPress={onNextPressed}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 10,
  },
  header: {
    backgroundColor: '#fff',
    fontFamily: fonts.RBold,
    fontSize: 16,
    padding: 15,
    color: colors.lightBlackColor,
    alignContent: 'center',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: colors.grayBackgroundColor,
  },
  thinDivider: {
    width: '100%',
    height: 7,
    alignSelf: 'center',
    backgroundColor: colors.grayBackgroundColor,
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
});

export default NotificationsListScreen;
