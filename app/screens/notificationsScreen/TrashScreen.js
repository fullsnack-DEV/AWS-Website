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
import PRNotificationDetailMessageItem from '../../components/notificationComponent/PRNotificationDetailMessageItem';
import NotificationItem from '../../components/notificationComponent/NotificationItem';
import PRNotificationInviteCell from '../../components/notificationComponent/PRNotificationInviteCell';
import NotificationType from '../../Constants/NotificationType';
import {
  acceptRequest,
  declineRequest,
  getTrash,
  getTrashNextList,
} from '../../api/Notificaitons';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';

import NotificationListShimmer from '../../components/shimmer/account/NotificationListShimmer';
import TCInnerLoader from '../../components/TCInnerLoader';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import {getScorekeeperReservationDetail} from '../scorekeeper/ScorekeeperUtility';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import {getRefereeReservationDetail} from '../referee/RefereeUtility';
import {getChallengeDetail} from '../challenge/ChallengeUtility';

function TrashScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [notificationsList, setNotificationsList] = useState();
  const [selectedEntity, setSelectedEntity] = useState();
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);

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
    // else if (verb.includes(NotificationType.scorekeeperRequest)) {
    //   Alert.alert('Remain Functionality')
    // }
  };

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

  const RenderSections = ({item}) => {
    if (item.activities[0].is_request) {
      return (
        <View>
          {isInvite(item.activities[0].verb) && (
            <PRNotificationInviteCell
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
          )}

          {!isInvite(item.activities[0].verb) && (
            <PRNotificationDetailMessageItem
              item={item}
              isTrash={true}
              entityType={
                authContext.entity.role === 'user' ||
                authContext.entity.role === 'player'
                  ? 'user'
                  : 'group'
              } // user or group
              disabled={true}
              onDetailPress={() => onDetailPress(item)}
              selectedEntity={selectedEntity}
              onPressFirstEntity={openHomePage}
            />
          )}
        </View>
      );
    }
    if (!item.activities[0].is_request) {
      return (
        <NotificationItem
          data={item}
          isTrash={true}
          entityType={
            authContext.entity.role === 'user' ||
            authContext.entity.role === 'player'
              ? 'user'
              : 'group'
          } // user or group
          onPressFirstEntity={openHomePage}
          onPressSecondEntity={openHomePage}
          onPressCard={() => {}}
        />
      );
    }
    return null;
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
          console.log('next page');
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
          renderItem={RenderSections}
          onScroll={onLoadMore}
        />
      ) : (
        <TCNoDataView title={'No records found'} />
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
