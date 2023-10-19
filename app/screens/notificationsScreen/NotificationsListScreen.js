/* eslint-disable array-callback-return */
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
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  getUnreadCount,
  getNotificationsList,
  getNotificationsNextList,
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
import {strings} from '../../../Localization/translation';
import * as RefereeUtils from '../referee/RefereeUtility';
import * as ScorekeeperUtils from '../scorekeeper/ScorekeeperUtility';
import * as challengeUtility from '../challenge/ChallengeUtility';
import {getGroupDetails} from '../../api/Groups';
import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';

import PRNotificationTeamInvite from '../../components/notificationComponent/PRNotificationTeamInvite';
import PRNotificationDetailItem from '../../components/notificationComponent/PRNotificationDetailItem';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import {getEventById} from '../../api/Schedule';
import TCInnerLoader from '../../components/TCInnerLoader';
import errorCode from '../../Constants/errorCode';
import SendRequestModal from '../../components/SendRequestModal/SendRequestModal';
import ScreenHeader from '../../components/ScreenHeader';
import JoinButtonModal from '../home/JoinButtomModal';
import Verbs from '../../Constants/Verbs';
import JoinRequestModal from '../../components/notificationComponent/JoinRequestModal';
import useSwitchAccount from '../../hooks/useSwitchAccount';
import {getUserDetails} from '../../api/Users';

function NotificationsListScreen({navigation}) {
  const actionSheet = useRef();
  const JoinButtonModalRef = useRef(null);
  const JoinRequestModalRef = useRef(null);
  const [currentTab, setCurrentTab] = useState();
  const [groupList, setGroupList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [notifAPI, setNotifAPI] = useState();
  const [currentReqItem, setCurrentReqItem] = useState({});
  const authContext = useContext(AuthContext);
  const [mainNotificationsList, setMainNotificationsList] = useState();
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState();
  const [activeScreen, setActiveScreen] = useState(groupList?.length === 0);

  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [groupData, setGroupData] = useState();
  const isFocused = useIsFocused();
  const [isNotificationListName, setIsNotificationListName] = useState(0);
  const [messageText, setMessageText] = useState('');

  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [IDLT, setIDLT] = useState();
  const [grpInfo, setGrpInfo] = useState({});
  const [isAccept, setIsAccept] = useState(false);
  const [currentNotificationData, setCurrentNotificationData] = useState([]);

  const onDetailPress = (item) => {
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
    } else {
      showSwitchProfilePopup();
    }
  };

  const onMessagePress = () => {
    if (activeScreen) {
      // handle button press for message
    } else {
      showSwitchProfilePopup();
    }
  };

  const {onSwitchProfile} = useSwitchAccount();

  const handleSwitchProfile = async (item) => {
    setloading(true);
    await onSwitchProfile(item);
    setloading(false);
  };

  const showSwitchProfilePopup = () => {
    const name =
      selectedEntity.entity_type === 'player'
        ? `${selectedEntity.first_name} ${selectedEntity.last_name}`
        : selectedEntity.group_name;
    Alert.alert(
      `${strings.doYouWantSwitchAc} ${name}?`,
      '',
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {text: strings.yes, onPress: () => handleSwitchProfile(selectedEntity)},
      ],
      {cancelable: true},
    );
  };

  const onDelete = ({item}) => {
    if (activeScreen) {
      setloading(true);
      const ids = item.activities.map((activity) => activity.id);
      deleteNotification(ids, item.type, authContext)
        .then(() => {
          callNotificationList()
            .then(() => setloading(false))
            .catch(() => setloading(false));
        })
        .catch(() => {
          setloading(false);
          Alert.alert(strings.failedToMove);
        });
    } else {
      showSwitchProfilePopup();
    }
  };

  const onAccept = (item) => {
    const requestId = item.activities[0].id;

    setloading(true);
    acceptRequest({}, requestId, authContext)
      .then((response) => {
        setloading(false);
        JoinButtonModalRef.current.close();
        JoinRequestModalRef.current.close();
        if (
          item.verb.includes(NotificationType.invitePlayerToJoinTeam) ||
          item.verb.includes(NotificationType.invitePlayerToJoinClub)
        ) {
          if (response?.payload?.error_code === errorCode.invitePlayerToJoin) {
            Alert.alert(
              '',
              response.payload.user_message,
              [
                {
                  text: 'Accept',
                  onPress: () => {
                    setloading(true);
                    acceptRequest({is_confirm: true}, requestId, authContext)
                      .then(() => {
                        callNotificationList()
                          .then(() => setloading(false))
                          .catch(() => setloading(false));
                        JoinButtonModalRef.current.close();
                      })
                      .catch((error) => {
                        setTimeout(() => {
                          JoinButtonModalRef.current.close();
                          Alert.alert(strings.alertmessagetitle, error.message);
                        }, 10);
                      });
                  },
                  style: 'destructive',
                },
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          }
        } else {
          callNotificationList()
            .then(() => setloading(false))
            .catch(() => setloading(false));
        }

        if (
          item.verb.includes(NotificationType.invitePlayerToJoinClub) ||
          item.verb.includes(NotificationType.invitePlayerToJoinTeam)
        ) {
          Utility.showAlert(format(strings.alertTitle1, grpInfo.group_name));
        }
        if (item.verb.includes(NotificationType.userRequestedJoingroup)) {
          Utility.showAlert(strings.joinReqAccepted);
        } else if (item.verb.includes(NotificationType.followRequest)) {
          Utility.showAlert(strings.followReqAccepted);
        }
      })
      .catch((error) => {
        setloading(false);
        JoinButtonModalRef.current.close();
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId, item) => {
    setloading(true);
    if (activeScreen) {
      declineRequest(requestId, authContext)
        .then(() => {
          JoinRequestModalRef.current.close();
          // Utility.showAlert('Join request accepted ');
          if (item.verb.includes(NotificationType.userRequestedJoingroup)) {
            Utility.showAlert(strings.joinReqDeclineText);
          } else if (item.verb.includes(NotificationType.followRequest)) {
            Utility.showAlert(strings.followReqDeclineText);
          } else if (
            item.verb.includes(NotificationType.invitePlayerToJoinClub) ||
            item.verb.includes(NotificationType.invitePlayerToJoinTeam)
          ) {
            Utility.showAlert(strings.invitationDeclinedText);
          }

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

  const getGroupInfo = async (grpid) => {
    setloading(true);
    try {
      const {payload} = await getGroupDetails(grpid, authContext);
      setloading(false);
      setGrpInfo(payload);
      setIsAccept(true);
      JoinButtonModalRef.current?.present();
    } catch (error) {
      setloading(false);
    }
  };

  const getUserInfo = async (grpid) => {
    setloading(true);
    try {
      const {payload} = await getUserDetails(grpid, authContext);

      setUserInfo(payload);
      setloading(false);

      JoinRequestModalRef.current?.present();
    } catch (error) {
      setloading(false);
    }
  };

  const onRespond = (groupObj) => {
    const groupId = JSON.parse(groupObj?.activities?.[0]?.object).groupData
      ?.group_id;

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
            navigation.navigate('EventScreen', {
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
          groupObj: JSON.parse(groupObj.activities[0].object).groupData,
        });
      } else {
        setloading(true);
        getRequestDetail(groupId, authContext)
          .then((response) => {
            setloading(false);

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
    verb.includes(NotificationType.sendBasicInfoToMember) ||
    verb.includes(NotificationType.userRequestedJoingroup) ||
    verb.includes(NotificationType.followRequest);

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
          navigation.navigate(obj.screenName, {
            challengeObj,
          });

          setloading(false);
        })
        .catch(() => setloading(false));
    }
  };

  const notificationComponentType = (item) => {
    if (isInvite(item.activities[0].verb)) {
      if (
        item.activities[0].verb.includes(NotificationType.inviteToDoubleTeam) ||
        item.activities[0].verb.includes(NotificationType.inviteToEvent) ||
        item.activities[0].verb.includes(NotificationType.inviteToJoinClub) ||
        item.activities[0].verb.includes(
          NotificationType.userRequestedJoingroup,
        )
      ) {
        return (
          <PRNotificationTeamInvite
            item={item}
            selectedEntity={selectedEntity}
            // onAccept={() => onAccept(item.activities[0].id)}
            onRespond={() => {
              if (
                item.activities[0].verb.includes(
                  NotificationType.userRequestedJoingroup,
                )
              ) {
                const PardsedObj = JSON.parse(item?.activities[0]?.object);

                setMessageText(PardsedObj?.message);
                getUserInfo(item.activities[0]?.foreign_id);
                setCurrentReqItem(item);
                return;
              }

              onRespond(item);
            }}
            // JSON.parse(item.activities[0].object))
            onPress={() => onNotificationClick(item)}
            onPressFirstEntity={openHomePage}
            isRepond={item.activities[0].verb.includes(
              NotificationType.userRequestedJoingroup,
            )}
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
          onAccept={() => {
            if (
              authContext.entity.role === Verbs.entityTypeClub ||
              authContext.entity.role === Verbs.entityTypeTeam
            ) {
              onAccept(item);
            } else if (item.verb.includes(NotificationType.followRequest)) {
              onAccept(item);
            } else {
              setCurrentNotificationData(item);
              getGroupInfo(item.activities[0]?.foreign_id);
            }
          }}
          onDecline={() => onDecline(item.activities[0].id, item)}
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

  const renderPendingRequestComponent = ({item}) => (
    <AppleStyleSwipeableRow
      onPress={() => onDelete({item})}
      color={colors.darkThemeColor}
      image={images.deleteIcon}>
      {notificationComponentType(item)}
    </AppleStyleSwipeableRow>
  );

  const renderNotificationComponent = ({item}) => {
    if (item.activities[0].is_request) {
      return (
        <AppleStyleSwipeableRow
          onPress={() => onDelete({item})}
          color={colors.darkThemeColor}
          image={images.deleteIcon}>
          {notificationComponentType(item)}
        </AppleStyleSwipeableRow>
      );
    }
    return (
      <AppleStyleSwipeableRow
        onPress={() => onDelete({item})}
        color={colors.darkThemeColor}
        image={images.deleteIcon}>
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
      headerShown: false,
      headerRight: () => (
        <TouchableWithoutFeedback
          hitSlop={Utility.getHitSlop(15)}
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

          if (response.payload.notifications.length > 0) {
            setIDLT(
              response.payload.notifications[
                response.payload.notifications.length - 1
              ].id,
            );
          }

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

  const getNextNotificationData = () => {
    const entity = authContext.entity.obj;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    const id_lt = IDLT;
    getNotificationsNextList(params, id_lt, authContext)
      .then((response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
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

        const array = [];

        mainNotificationsList.map((obj, index) => {
          if (obj.section === 'PENDING REQUESTS') {
            array.push({
              data: [
                ...mainNotificationsList?.[index]?.data,
                ...pendingReqNotification,
              ],
              section: strings.pendingrequests,
              type: 'request',
            });
          } else if (obj.section === 'TODAY') {
            array.push({
              data: [
                ...mainNotificationsList?.[index]?.data,
                ...todayNotifications,
              ],
              section: strings.today,
              type: 'notification',
            });
          } else {
            array.push({
              data: [
                ...mainNotificationsList?.[index]?.data,
                ...erlierNotifications,
              ],
              section: strings.earlier,
              type: 'notification',
            });
          }
        });

        setMainNotificationsList([
          ...array.filter((item) => item.data.length !== 0),
        ]);
      })
      .catch((e) => {
        Alert.alert(e.messages);
      });
  };

  const onLoadMore = (e) => {
    let paddingToBottom = 10;
    paddingToBottom += e.nativeEvent.layoutMeasurement.height;
    const currentOffset = e.nativeEvent.contentOffset.y;
    const direction = currentOffset > 50 ? 'down' : 'up';
    if (direction === 'up') {
      if (
        e.nativeEvent.contentOffset.y >=
        e.nativeEvent.contentSize.height - paddingToBottom
      ) {
        if (!loadMore) {
          setLoadMore(true);
          setTimeout(() => {
            getNextNotificationData();
          }, 1000);
        }
      }
    }
  };

  useEffect(() => {
    if (mainNotificationsList && mainNotificationsList.length) {
      setIsNotificationListName(mainNotificationsList.length);
    }
  }, [mainNotificationsList]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.notifications}
        leftIcon={images.backArrow}
        rightIcon1={images.chat3Dot}
        leftIconPress={() => navigation.goBack()}
        rightIcon1Press={() => {
          actionSheet.current.show();
        }}
      />
      {firstTimeLoading && <NotificationListShimmer />}

      <ActivityLoader visible={loading} />
      {/* eslint-disable-next-line no-nested-ternary */}

      <SendRequestModal
        visibleRequestModal={isRulesModalVisible}
        onClosePress={() => setIsRulesModalVisible(false)}
        onNextPress={() => onNextPressed()}
        groupData={groupData}
        headerTitle={strings.respondToInviteCreateTeam}
        textstring1={format(
          strings.responseToRequesttxt1,
          groupData?.player1?.full_name,
        )}
        textstring2={format(
          strings.responseToRequesttxt2,
          groupData?.player1?.full_name,
        )}
        textstring3={format(
          strings.responseToRequesttxt3,
          groupData?.player1?.full_name,
        )}
        btntext={strings.nextTitle}
      />

      {!firstTimeLoading && mainNotificationsList?.length > 0 && (
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
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.subHeader}>
                  <Text style={styles.header}>{section}</Text>
                  {section === strings.pendingrequests && (
                    <View style={{backgroundColor: 'red', borderRadius: 20}}>
                      <Text style={styles.popUp}>
                        {isNotificationListName}+
                      </Text>
                    </View>
                  )}
                </View>
                {section === strings.pendingrequests && (
                  <Image source={images.nextArrow} style={styles.nextArrow} />
                )}
              </View>
              <View style={styles.listItemSeparatorStyle} />
            </TouchableOpacity>
          )}
          renderSectionFooter={renderSectionFooter}
          onScroll={onLoadMore}
        />
      )}
      {loadMore && (
        <TCInnerLoader allowMargin={false} size={60} visible={loadMore} />
      )}

      {!firstTimeLoading && mainNotificationsList?.length <= 0 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.noEventText}>{strings.noNotification}</Text>
          <Text style={styles.dataNotFoundText}>
            {strings.newNotificationn}
          </Text>
        </View>
      )}

      <ActionSheet
        ref={actionSheet}
        options={[strings.trash, strings.cancel]}
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

      <JoinButtonModal
        JoinButtonModalRef={JoinButtonModalRef}
        currentUserData={grpInfo}
        isInvited={isAccept}
        onJoinPress={() => onAccept(currentNotificationData)}
        onAcceptPress={() => onAccept(currentNotificationData)}
        hideMessageBox={true}
      />
      <JoinRequestModal
        JoinRequestModalRef={JoinRequestModalRef}
        currentUserData={userInfo}
        onAcceptPress={() => onAccept(currentReqItem)}
        onDeclinePress={() =>
          onDecline(currentReqItem.activities[0].id, currentReqItem)
        }
        messageText={messageText}
      />
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
  popUp: {
    // backgroundColor: 'red',
    fontFamily: fonts.RBold,
    fontSize: 12,
    padding: 0,
    // alignContent: 'center',
    width: 30,
    color: colors.whiteColor,
    textAlign: 'center',
    // borderRadius:50
  },

  subHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexDirection: 'row',
  },

  listItemSeparatorStyle: {
    height: 1,
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
