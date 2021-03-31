import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
 Text, View, StyleSheet, FlatList,
 } from 'react-native';
import _ from 'lodash';
// import { useIsFocused } from '@react-navigation/native';

import ActionSheet from 'react-native-actionsheet';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../../utils';
import TCUserFollowUnfollowList from '../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../TCGradientButton';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../loader/ActivityLoader';
import GameStatus from '../../../../Constants/GameStatus';
import * as ScorekeeperUtils from '../../../../screens/scorekeeper/ScorekeeperUtility';
import { checkReviewExpired } from '../../../../utils/gameUtils';

import ScorekeeperReservationStatus from '../../../../Constants/ScorekeeperReservationStatus';

let selectedScorekeeperData;
const Scorekeepers = ({
  isAdmin,
  userRole,
  gameData,
  followUser,
  unFollowUser,
  navigation,
  onReviewPress,
  getScorekeeperReservation,
}) => {
  const actionSheet = useRef();
  // const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [scorekeeper, setScorekeeper] = useState([]);

  useEffect(() => {
    setMyUserId(authContext.entity.uid);
  }, [authContext.entity.uid]);
  useEffect(() => {
    getScorekeeperReservation(gameData?.game_id).then((res) => {
      const refData = res?.payload?.filter(
        (item) => ![ScorekeeperReservationStatus.cancelled].includes(item?.status),
      );
      const cloneRefData = [];
      refData.map((item) => {
        const isExpired = new Date(item?.expiry_datetime * 1000).getTime()
          < new Date().getTime();
        if (
          item?.status === ScorekeeperReservationStatus.offered
          && !isExpired
          && item?.initiated_by === authContext?.entity?.uid
        ) {
          cloneRefData.push(item);
        } else if (item?.status !== ScorekeeperReservationStatus.offered) {
          cloneRefData.push(item);
        }
        return false;
      });
      setScorekeeper([...cloneRefData]);
    });
  }, [authContext?.entity?.uid, gameData, getScorekeeperReservation]);

  const goToScorekeeperReservationDetail = useCallback(
    (data) => {
      setloading(true);
      ScorekeeperUtils.getScorekeeperReservationDetail(
        data?.reservation_id,
        authContext.entity.uid,
        authContext,
      )
        .then((obj) => {
          setloading(false);
          navigation.navigate(obj.screenName, {
            reservationObj: obj.reservationObj || obj.reservationObj[0],
          });
          setloading(false);
        })
        .catch(() => setloading(false));
    },
    [authContext, navigation],
  );

  const onFollowPress = useCallback(
    (userID, status) => {
      const sKeeper = _.cloneDeep(gameData?.scorekeeper_reservations);
      const index = sKeeper.findIndex(
        (item) => item?.scorekeeper?.user_id === userID,
      );
      if (index > -1) sKeeper[index].scorekeeper.is_following = status;
    },
    [gameData?.scorekeeper_reservations],
  );

  const getScorekeeperStatusMessage = useCallback((item, type) => {
    const status = item?.status;
    let statusData = '';
    const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime();
    switch (status) {
      case ScorekeeperReservationStatus.accepted:
        statusData = { status: 'Confirmed', color: colors.greeColor };
        break;
      case ScorekeeperReservationStatus.restored:
        statusData = { status: 'Restored', color: colors.greeColor };
        break;
      case ScorekeeperReservationStatus.cancelled:
        statusData = { status: 'Cancelled', color: colors.greeColor };
        break;
      case ScorekeeperReservationStatus.pendingpayment:
        statusData = { status: 'Pending payment', color: colors.yellowColor };
        break;
      case ScorekeeperReservationStatus.offered:
        if (isExpired) { statusData = { status: 'Expired', color: colors.userPostTimeColor }; } else statusData = { status: 'Sent', color: colors.yellowColor };
        break;
      case ScorekeeperReservationStatus.changeRequest:
        statusData = { status: 'Change requested', color: colors.yellowColor };
        break;
      default:
        statusData = { status: '' };
    }
    return statusData[type];
  }, []);

  const renderScorekeepers = useCallback(
    ({ item }) => {
      const entity = authContext?.entity;
      const reservationDetail = item;

      return (
        <TCUserFollowUnfollowList
          statusColor={getScorekeeperStatusMessage(reservationDetail, 'color')}
          statusTitle={getScorekeeperStatusMessage(reservationDetail, 'status')}
          myUserId={myUserId}
          isShowReviewButton={
            gameData?.status === 'ended'
            && reservationDetail?.status !== ScorekeeperReservationStatus.offered
            && !checkReviewExpired(gameData?.actual_enddatetime)
            && !isAdmin
          }
          isReviewed={!!item?.review_id}
          followUser={followUser}
          unFollowUser={unFollowUser}
          userID={reservationDetail?.scorekeeper?.user_id}
          title={reservationDetail?.scorekeeper?.full_name}
          is_following={reservationDetail?.scorekeeper?.is_following}
          onFollowUnfollowPress={onFollowPress}
          profileImage={reservationDetail?.scorekeeper?.thumbnail}
          isShowThreeDots={item?.initiated_by === entity?.uid}
          onThreeDotPress={() => {
            selectedScorekeeperData = item;
            actionSheet.current.show();
          }}
          userRole={userRole}
          onReviewPress={() => onReviewPress(item)}
        />
      );
    },
    [
      authContext?.entity,
      followUser,
      gameData?.actual_enddatetime,
      gameData?.status,
      getScorekeeperStatusMessage,
      isAdmin,
      myUserId,
      onFollowPress,
      onReviewPress,
      unFollowUser,
      userRole,
    ],
  );

  const handleBookScorekeeper = useCallback(() => {
    navigation.navigate('BookScorekeeper', { gameData });
  }, [gameData, navigation]);

  const ListEmptyComponent = useMemo(
    () => (
      <View>
        <Text style={styles.notAvailableTextStyle}>No booked scorekeepers</Text>
      </View>
    ),
    [],
  );

  const renderBookScorekeepersButton = useMemo(
    () => isAdmin
      && [GameStatus.accepted, GameStatus.reset].includes(gameData?.status) && (
        <TCGradientButton
          onPress={handleBookScorekeeper}
          startGradientColor={colors.whiteColor}
          endGradientColor={colors.whiteColor}
          title={'BOOK SCOREKEEPERS'}
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.greeColor,
            height: 28.5,
          }}
          textStyle={{ color: colors.greeColor, fontSize: 12 }}
          outerContainerStyle={{
            marginHorizontal: 5,
            marginTop: 5,
            marginBottom: 0,
          }}
        />
      ),
    [gameData?.status, handleBookScorekeeper, isAdmin],
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <ActivityLoader visible={loading} />
        <Text style={styles.title}>Scorekeepers</Text>
        <FlatList
          keyExtractor={(item) => item?.user_id}
          bounces={false}
          data={scorekeeper}
          renderItem={renderScorekeepers}
          ListEmptyComponent={ListEmptyComponent}
        />

        {renderBookScorekeepersButton}
        <ActionSheet
          ref={actionSheet}
          options={['Scorekeeper Reservation Details', 'Cancel']}
          cancelButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              goToScorekeeperReservationDetail(selectedScorekeeperData);
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  contentContainer: {},
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  notAvailableTextStyle: {
    margin: wp(4),
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
export default Scorekeepers;
