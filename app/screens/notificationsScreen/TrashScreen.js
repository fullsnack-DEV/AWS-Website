import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  acceptRequest,
  declineRequest,
  getRequestDetail,
  getTrash,
  getTrashNextList,
} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';

import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';
import TCInnerLoader from '../../components/TCInnerLoader';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import {getScorekeeperReservationDetail} from '../scorekeeper/ScorekeeperUtility';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import {getRefereeReservationDetail} from '../referee/RefereeUtility';
import {getChallengeDetail} from '../challenge/ChallengeUtility';
import PRNotificationTeamInvite from '../../components/notificationComponent/PRNotificationTeamInvite';
import PRNotificationDetailItem from '../../components/notificationComponent/PRNotificationDetailItem';
import {getEventById} from '../../api/Schedule';
import NotificationItem from '../../components/notificationComponent/NotificationItem';

function TrashScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [notificationsList, setNotificationsList] = useState();
  const [selectedEntity, setSelectedEntity] = useState();
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);

  const onDetailPress = (item) => {
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
          navigation.navigate(obj.screenName, {
            challengeObj: obj.challengeObj,
            isTrash: true,
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
    // else if (verb.includes(NotificationType.scorekeeperRequest)) {
    //   Alert.alert('Remain Functionality')
    // }
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
    verb.includes(NotificationType.userRequestedJoingroup);

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

  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest(requestId, authContext)
      .then(() => {
        navigation.goBack();
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
        navigation.goBack();
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onRespond = (groupObj) => {
    const groupId = JSON.parse(groupObj?.activities?.[0]?.object).groupData
      ?.group_id;
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
        .catch(() => {
          setloading(false);
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
        .then(() => {
          setloading(false);
        })
        .catch((error) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    }

    // setGroupData(groupdata)
    // setIsRulesModalVisible(true)
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
      getScorekeeperReservationDetail(a, authContext.entity.uid, authContext)
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
      getRefereeReservationDetail(a, authContext.entity.uid, authContext)
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

      getChallengeDetail(a, authContext)
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

  const notificationComponentType = ({item}) => {
    if (isInvite(item.activities[0].verb)) {
      if (
        item.activities[0].verb.includes(NotificationType.inviteToDoubleTeam) ||
        item.activities[0].verb.includes(NotificationType.inviteToEvent) ||
        item.activities[0].verb.includes(NotificationType.inviteToJoinClub)
      ) {
        return (
          <PRNotificationTeamInvite
            isTrash={true}
            entityType={
              authContext.entity.role === 'user' ||
              authContext.entity.role === 'player'
                ? 'user'
                : 'group'
            }
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
            isTrash={true}
            entityType={
              authContext.entity.role === 'user' ||
              authContext.entity.role === 'player'
                ? 'user'
                : 'group'
            }
            item={item}
            selectedEntity={selectedEntity}
            onRespond={() => onRespond(item)} // JSON.parse(item.activities[0].object))
            onPress={() => onNotificationClick(item)}
            onPressFirstEntity={openHomePage}
          />
        );
      }

      return (
        <PRNotificationInviteCell
          onPress={() => onNotificationClick(item)}
          item={item}
          isTrash={true}
          entityType={
            authContext.entity.role === 'user' ||
            authContext.entity.role === 'player'
              ? 'user'
              : 'group'
          } // user or group
          disabled={true}
          selectedEntity={selectedEntity}
          onPressFirstEntity={openHomePage}
          onAccept={() => onAccept(item.activities[0].id)}
          onDecline={() => onDecline(item.activities[0].id)}
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
          isTrash={true}
          entityType={
            authContext.entity.role === 'user' ||
            authContext.entity.role === 'player'
              ? 'user'
              : 'group'
          }
          item={item}
          selectedEntity={selectedEntity}
          onDetailPress={() => onDetailPress(item)}
          onPress={() => onNotificationClick(item)}
          onPressFirstEntity={openHomePage}
        />
      );
    }

    return (
      <NotificationItem
        isTrash={true}
        entityType={
          authContext.entity.role === 'user' ||
          authContext.entity.role === 'player'
            ? 'user'
            : 'group'
        }
        data={item}
        onPressFirstEntity={openHomePage}
        onPressSecondEntity={openHomePage}
        onPressCard={() => onNotificationClick(item)}
      />
    );
  };

  useEffect(() => {
    if (isFocused) {
      setFirstTimeLoading(true);
      getTrashData();
    }
  }, [isFocused]);

  const getTrashData = () => {
    const entity = route?.params?.selectedGroup;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    getTrash(params, authContext)
      .then(async (response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
        setNotificationsList([...response.payload.notifications]);
      })
      .catch((e) => {
        Alert.alert(e.messages);
      });
  };

  const getNextTrashData = () => {
    const entity = route?.params?.selectedGroup;
    setSelectedEntity(entity);
    const params = {
      uid: entity.entity_type === 'player' ? entity.user_id : entity.group_id,
    };
    const id_lt = notificationsList[notificationsList.length - 1].id;
    getTrashNextList(params, id_lt, authContext)
      .then(async (response) => {
        setloading(false);
        setLoadMore(false);
        setFirstTimeLoading(false);
        setNotificationsList([
          ...notificationsList,
          ...response.payload.notifications,
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
          setLoadMore(true);
          setTimeout(() => {
            getNextTrashData();
          }, 1000);
        }
      }
    }
  };

  return (
    <View style={styles.rowViewStyle}>
      <ActivityLoader visible={loading} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {firstTimeLoading ? (
        <NotificationListShimmer />
      ) : notificationsList?.length > 0 ? (
        <FlatList
          ItemSeparatorComponent={itemSeparator}
          data={notificationsList}
          keyExtractor={keyExtractor}
          renderItem={notificationComponentType}
          onScroll={onLoadMore}
        />
      ) : (
        <TCNoDataView title={strings.noRecordFoundText} />
      )}
      {loadMore && (
        <TCInnerLoader allowMargin={false} size={60} visible={loadMore} />
      )}
      <SafeAreaView style={styles.trashMessageContainerStyle}>
        <Text style={styles.trashMessageStyle}>{strings.trashmessage}</Text>
      </SafeAreaView>
    </View>
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
  trashMessageContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    // backgroundColor: colors.thinDividerColor,
  },
  trashMessageStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    textAlign: 'center',
    margin: 15,
    marginBottom: 0,
  },
});

export default TrashScreen;
