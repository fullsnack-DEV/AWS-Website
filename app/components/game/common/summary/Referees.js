import React, {
  useEffect, useState, useContext, useRef,
} from 'react';
import {
  Text, View, StyleSheet, FlatList,
} from 'react-native';
import _ from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../utils';
import TCUserFollowUnfollowList from '../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../TCGradientButton';
import AuthContext from '../../../../auth/context';
import * as RefereeUtils from '../../../../screens/referee/RefereeUtility';
import ActivityLoader from '../../../loader/ActivityLoader';
import GameStatus from '../../../../Constants/GameStatus';
import RefereeReservationStatus from '../../../../Constants/RefereeReservationStatus';
import {
  checkReviewExpired,
} from '../../../../utils/gameUtils';

let selectedRefereeData;
const Referees = ({
  gameData,
  isAdmin,
  userRole,
  followUser,
  unFollowUser,
  navigation,
  getRefereeReservation,
  onReviewPress,
}) => {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext)
  const [loading, setloading] = useState(false);
  const [refree, setRefree] = useState([])
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => { getMyUserId() }, [])
  useEffect(() => {
    getRefereeReservation(gameData?.game_id).then((res) => {
      console.log('Referee Reservation:', res?.payload);
      const refData = res?.payload?.filter((item) => ![RefereeReservationStatus.cancelled].includes(item?.status));
      const cloneRefData = [];
      refData.map((item) => {
        const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime()
        if (item?.status === RefereeReservationStatus.offered && !isExpired) {
          cloneRefData.push(item);
        } else if (item?.status !== RefereeReservationStatus.offered) {
          cloneRefData.push(item);
        }
        return false;
      })
      setRefree([...cloneRefData]);
    });
  }, [gameData])
  const goToRefereReservationDetail = (data) => {
    console.log('Reservation data:', JSON.stringify(data));
    setloading(true);
    RefereeUtils.getRefereeReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
      setloading(false);
      console.log('Reservation Object:', JSON.stringify(obj.reservationObj));
      console.log('Screen name of Reservation:', obj.screenName);
      navigation.navigate(obj.screenName, {
        reservationObj: obj.reservationObj || obj.reservationObj[0],
      });
      setloading(false);
    }).catch(() => setloading(false));
  }
  const onFollowPress = (userID, status) => {
    const refre = _.cloneDeep(refree);
    const index = refre.findIndex((item) => item?.referee?.user_id === userID);
    if (index > -1) refre[index].referee.is_following = status
    setRefree(refre);
  };

  const getMyUserId = async () => {
    setMyUserId(authContext.entity.uid);
  }

  const getRefereeStatusMessage = (item, type) => {
    console.log('Referee status::=>', item);
    const status = item?.status;
    let statusData = '';
    const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime()
    switch (status) {
      case RefereeReservationStatus.accepted: statusData = { status: 'Confirmed', color: colors.greeColor }; break;
      case RefereeReservationStatus.restored: statusData = { status: 'Restored', color: colors.greeColor }; break;
      case RefereeReservationStatus.cancelled: statusData = { status: 'Cancelled', color: colors.greeColor }; break;
      case RefereeReservationStatus.pendingpayment: statusData = { status: 'Pending', color: colors.yellowColor }; break;
      case RefereeReservationStatus.offered:
        if (isExpired) statusData = { status: 'Expired', color: colors.userPostTimeColor };
        else statusData = { status: 'Sent', color: colors.yellowColor };
        break;
      default: statusData = { status: '' };
    }
    return statusData[type];
  }
  const renderReferees = ({ item }) => {
    const entity = authContext?.entity;
    const reservationDetail = item?.reservation;
console.log('ITEM::=>', item);
    return (
      <TCUserFollowUnfollowList
              statusColor={getRefereeStatusMessage(reservationDetail, 'color')}
              statusTitle={getRefereeStatusMessage(reservationDetail, 'status')}
              myUserId={myUserId}
              isShowReviewButton = {gameData?.status === 'ended' && !checkReviewExpired(gameData?.actual_enddatetime) && !isAdmin}
              isReviewed={!!item?.review_id}
              followUser={followUser}
              unFollowUser={unFollowUser}
              userID={reservationDetail?.referee?.user_id}
              title={reservationDetail?.referee?.full_name}
              subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
              is_following={reservationDetail?.referee?.is_following}
              onFollowUnfollowPress={onFollowPress}
              profileImage={reservationDetail?.referee?.thumbnail}
              isShowThreeDots={item?.booked_by === entity?.uid}
              onThreeDotPress={() => {
                selectedRefereeData = item
                actionSheet.current.show()
              }}
              userRole={userRole}
              onReviewPress={() => onReviewPress(item)}
          />
      //     <TCUserFollowUnfollowList
      //     statusColor={getRefereeStatusMessage(item, 'color')}
      //     statusTitle={getRefereeStatusMessage(item, 'status')}
      //     myUserId={myUserId}
      //     isShowReviewButton = {gameData?.status === 'ended' && !checkReviewExpired(gameData?.actual_enddatetime) && !isAdmin}
      //     isReviewed={!!referee?.review_id}
      //     followUser={followUser}
      //     unFollowUser={unFollowUser}
      //     userID={referee?.user_id}
      //     title={referee?.full_name}
      //     subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
      //     is_following={referee?.is_following}
      //     onFollowUnfollowPress={onFollowPress}
      //     profileImage={referee?.thumbnail}
      //     isShowThreeDots={item?.booked_by === entity?.uid}
      //     onThreeDotPress={() => {
      //       selectedRefereeData = item
      //       actionSheet.current.show()
      //     }}
      //     userRole={userRole}
      //     onReviewPress={() => onReviewPress(referee)}
      // />
    )
  }

  const handleBookReferee = () => {
    navigation.navigate('BookReferee', { gameData })
  }
  return (<View style={styles.mainContainer}>
    <View style={styles.contentContainer}>
      <ActivityLoader visible={loading} />
      <Text style={styles.title}>
        Referees
      </Text>
      <FlatList
              keyExtractor={(item) => item?.user_id}
              bounces={false}
              data={gameData?.referees}
              renderItem={renderReferees}
              ListEmptyComponent={() => (
                <View>
                  <Text style={styles.notAvailableTextStyle}>
                    No booked referee
                  </Text>
                </View>
              )}/>
      {isAdmin
      && [GameStatus.accepted, GameStatus.reset].includes(gameData?.status) && (
        <TCGradientButton
                  onPress={handleBookReferee}
                  startGradientColor={colors.whiteColor}
                  endGradientColor={colors.whiteColor}
                  title={'BOOK REFEREE'}
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: colors.greeColor,
                    height: 28.5,
                  }}
                  textStyle={{ color: colors.greeColor, fontSize: 12 }}
                  outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
              />
      )}
      <ActionSheet
              ref={actionSheet}
              options={[
                'Referee Reservation Details',
                'Cancel',
              ]}
              cancelButtonIndex={1}
              onPress={(index) => {
                if (index === 0) {
                  console.log('gameData::: button pressed::=>', gameData);
                  goToRefereReservationDetail(selectedRefereeData)
                }
              }}
          />
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  contentContainer: {

  },
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
})
export default Referees;
