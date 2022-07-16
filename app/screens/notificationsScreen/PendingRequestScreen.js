import React, {useEffect, useState, useContext, useCallback} from 'react';
import {View, StyleSheet, Alert, SafeAreaView, FlatList} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  acceptRequest,
  declineRequest,
  deleteNotification,
  getPendingRequest,
  getPendingRequestNextList,
  getRequestDetail,
} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import TCNoDataView from '../../components/TCNoDataView';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';

import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';
import TCInnerLoader from '../../components/TCInnerLoader';
import AppleStyleSwipeableRow from '../../components/notificationComponent/AppleStyleSwipeableRow';
import images from '../../Constants/ImagePath';
import PRNotificationDetailItem from '../../components/notificationComponent/PRNotificationDetailItem';
import PRNotificationTeamInvite from '../../components/notificationComponent/PRNotificationTeamInvite';
import {getEventById} from '../../api/Schedule';
import {getRefereeReservationDetail} from '../referee/RefereeUtility';
import {getScorekeeperReservationDetail} from '../scorekeeper/ScorekeeperUtility';
import {getChallengeDetail} from '../challenge/ChallengeUtility';
import {getUserDetails} from '../../api/Users';
import {getGroupDetails} from '../../api/Groups';
import {getQBAccountType, QBcreateUser} from '../../utils/QuickBlox';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';

function PendingRequestScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [notificationsList, setNotificationsList] = useState();
  const [selectedEntity, setSelectedEntity] = useState();
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);

  const isInvite = (verb) =>
    verb.includes(NotificationType.inviteToJoinClub) ||
    verb.includes(NotificationType.invitePlayerToJoinTeam) ||
    verb.includes(NotificationType.invitePlayerToJoinClub) ||
    verb.includes(NotificationType.inviteToConnectProfile) ||
    verb.includes(NotificationType.invitePlayerToJoingame);

  const openHomePage = (item) => {
    if (item?.entityType && item?.entityId) {
      navigation.push('HomeScreen', {
        uid: item?.entityId,
        backButtonVisible: true,
        menuBtnVisible: false,
        role: item?.entityType,
      });
    }
  };

  const onDetailPress = (item) => {
    console.log('Group ITEM ID:::::=>', item);
    const verb = item.activities[0].verb;
    if (
      verb.includes(NotificationType.initialChallengePaymentFail) ||
      verb.includes(NotificationType.alterChallengePaymentFail) ||
      verb.includes(NotificationType.challengeAwaitingPaymentPaid) ||
      verb.includes(
        NotificationType.gameAutoCanceledDueToInitialPaymentFailed,
      ) ||
      verb.includes(NotificationType.gameAutoRestoredDueToAlterPaymentFailed) ||
      verb.includes(NotificationType.gameCanceledDuringAwaitingPayment) ||
      verb.includes(NotificationType.gameRestoredDuringAwaitingPayment) ||
      verb.includes(NotificationType.challengeOffered) ||
      verb.includes(NotificationType.challengeAltered)
    ) {
      const a =
        JSON.parse(item.activities[0].object)?.challengeObject?.challenge_id ||
        JSON.parse(item.activities[0].object).newChallengeObject.challenge_id;
      setloading(true);
      getChallengeDetail(a, authContext)
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
      getRefereeReservationDetail(a, authContext.entity.uid, authContext)
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
      verb.includes(NotificationType.scorekeeperReservationAlterPaymentFail) ||
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
      getScorekeeperReservationDetail(a, authContext.entity.uid, authContext)
        .then((obj) => {
          const reservationObj = obj.reservationObj || obj.reservationObj[0];
          console.log('reservationObj:1>=>', reservationObj);
          if (reservationObj?.scorekeeper?.user_id === authContext.entity.uid) {
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
  };

  const onMessagePress = (item) => {
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
  };

  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest(requestId, authContext)
      .then(() => {
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);

    declineRequest(requestId, authContext)
      .then(() => {
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDelete = ({item}) => {
    setloading(true);
    const ids = item.activities.map((activity) => activity.id);
    // setMainNotificationsList(mainNotificationsList.filter((obj) => obj.id !== ids))
    deleteNotification(ids, item.type, authContext)
      .then(() => {
        setloading(false);
      })
      .catch(() => {
        setloading(false);
        Alert.alert('Failed to move to trash. Try again later');
      });
  };

  const onRespond = (groupObj) => {
    console.log('groupObj11:=>', groupObj);

    const groupId = JSON.parse(groupObj?.activities?.[0]?.object).groupData
      ?.group_id;
    console.log(
      'groupObject:=>',
      JSON.parse(groupObj?.activities?.[0]?.object),
    );

    if (
      groupObj.activities[0].verb.includes(NotificationType.inviteToJoinClub)
    ) {
      navigation.navigate('RespondForInviteScreen', {groupObj});
    }
    if (groupObj.activities[0].verb.includes(NotificationType.inviteToEvent)) {
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
        })
        .catch((error) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
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
      getScorekeeperReservationDetail(a, authContext.entity.uid, authContext)
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
      getRefereeReservationDetail(a, authContext.entity.uid, authContext)
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

      getChallengeDetail(a, authContext)
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
        image={images.deleteIcon}>
        {notificationComponentType(item)}
      </AppleStyleSwipeableRow>
    );
  };

  useEffect(() => {
    if (isFocused) {
      setFirstTimeLoading(true);
      getPendingRequestData();
    }
  }, [isFocused]);

  const getPendingRequestData = () => {
    const entity = authContext.entity.obj;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    getPendingRequest(params, authContext)
      .then(async (response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
        setNotificationsList([...response.payload.requests]);
      })
      .catch((e) => {
        Alert.alert(e.messages);
      });
  };

  const getNextPendingRequestData = () => {
    const entity = authContext.entity.obj;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    const id_lt = notificationsList[notificationsList.length - 1].id;
    getPendingRequestNextList(params, id_lt, authContext)
      .then(async (response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
        setNotificationsList([
          ...notificationsList,
          ...response.payload.requests,
        ]);
      })
      .catch((e) => {
        Alert.alert(e.messages);
      });
  };

  const itemSeparator = () => (
    // Item Separator
    <View style={styles.listItemSeparatorStyle} />
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

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
          console.log('next page');
          setLoadMore(true);
          setTimeout(() => {
            getNextPendingRequestData();
          }, 1000);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.rowViewStyle}>
      <ActivityLoader visible={loading} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {firstTimeLoading ? (
        <NotificationListShimmer />
      ) : notificationsList?.length > 0 ? (
        <FlatList
          ItemSeparatorComponent={itemSeparator}
          data={notificationsList}
          keyExtractor={keyExtractor}
          renderItem={renderPendingRequestComponent}
          onScroll={onLoadMore}
        />
      ) : (
        <TCNoDataView title={'No records found'} />
      )}
      {loadMore && (
        <TCInnerLoader allowMargin={false} size={60} visible={loadMore} />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  rowViewStyle: {
    flex: 1,
  },

  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.linesepratorColor,
  },
});

export default PendingRequestScreen;
