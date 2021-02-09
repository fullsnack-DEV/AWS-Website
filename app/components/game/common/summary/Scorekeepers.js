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
import ActivityLoader from '../../../loader/ActivityLoader';
import GameStatus from '../../../../Constants/GameStatus';
import * as ScorekeeperUtils from '../../../../screens/scorekeeper/ScorekeeperUtility';

import ScorekeeperReservationStatus from '../../../../Constants/ScorekeeperReservationStatus';

let selectedScorekeeperData;
const Scorekeepers = ({
  isAdmin,
  userRole,
  gameData,
  followUser,
  unFollowUser,
  navigation,
  getScorekeeperReservation,
}) => {
  const [scorekeeper, setScorekeeper] = useState([]);
  const actionSheet = useRef();

  const authContext = useContext(AuthContext)
  const [loading, setloading] = useState(false);
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => { getMyUserId() }, [])
  useEffect(() => {
    getScorekeeperReservation(gameData?.game_id).then((res) => {
      const userData = res?.payload?.filter((item) => ![ScorekeeperReservationStatus.cancelled].includes(item?.status));
      const cloneUserData = [];
      userData.map((item) => {
        const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime()
        if (item?.status === ScorekeeperReservationStatus.offered && !isExpired) {
          cloneUserData.push(item);
        } else if (item?.status !== ScorekeeperReservationStatus.offered) {
          cloneUserData.push(item);
        }
        return false;
      })
      setScorekeeper([...cloneUserData]);
    });
  }, [gameData]);

  const goToScorekeeperReservationDetail = (data) => {
    console.log('Reservation data:', JSON.stringify(data));
    setloading(true);
    ScorekeeperUtils.getScorekeeperReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
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
    const sKeeper = _.cloneDeep(scorekeeper);
    const index = sKeeper.findIndex((item) => item?.scorekeeper?.user_id === userID);
    if (index > -1) sKeeper[index].scorekeeper.is_following = status
    setScorekeeper(sKeeper);
  };

  const getMyUserId = async () => {
    setMyUserId(authContext.entity.uid);
  }

  const getScorekeeperStatusMessage = (item, type) => {
    console.log(item?.status);
    const status = item?.status;
    let statusData = '';
    const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime()
    switch (status) {
      case ScorekeeperReservationStatus.pendingpayment: statusData = { status: 'AWAITING PAYMENT', color: colors.yellowColor }; break;
      case ScorekeeperReservationStatus.offered:
        if (isExpired) statusData = { status: 'SCOREKEEPER RESERVATION REQUEST EXPIRED', color: colors.userPostTimeColor };
        else statusData = { status: 'SCOREKEEPER RESERVATION REQUEST SENT', color: colors.yellowColor };
        break;
      default: statusData = { status: '' };
    }
    return statusData[type];
  }
  const renderScorekeepers = ({ item }) => {
    const entity = authContext?.entity;
    const sKeeper = item?.scorekeeper;

    return (
      <TCUserFollowUnfollowList
            statusColor={getScorekeeperStatusMessage(item, 'color')}
            statusTitle={getScorekeeperStatusMessage(item, 'status')}
            myUserId={myUserId}
            followUser={followUser}
            unFollowUser={unFollowUser}
            userID={sKeeper?.user_id}
            title={sKeeper?.full_name}
            is_following={sKeeper?.is_following}
            onFollowUnfollowPress={onFollowPress}
            profileImage={sKeeper?.thumbnail}
            isShowThreeDots={item?.initiated_by === entity?.uid}
            onThreeDotPress={() => {
              selectedScorekeeperData = item
              actionSheet.current.show()
            }}
            userRole={userRole}
        />
    )
  }

  const handleBookScorekeeper = () => {
    navigation.navigate('BookScorekeeper', { gameData })
  }
  return (<View style={styles.mainContainer}>
    <View style={styles.contentContainer}>
      <ActivityLoader visible={loading} />
      <Text style={styles.title}>
        Scorekeepers
      </Text>
      <FlatList
              keyExtractor={(item) => item?.user_id}
              bounces={false}
              data={scorekeeper}
              renderItem={renderScorekeepers}
              ListEmptyComponent={() => (
                <View>
                  <Text style={styles.notAvailableTextStyle}>
                    No booked scorekeepers
                  </Text>
                </View>
              )}/>
      {isAdmin
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
                  outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
              />
      )}
      <ActionSheet
              ref={actionSheet}
              options={[
                'Scorekeeper Reservation Details',
                'Cancel',
              ]}
              cancelButtonIndex={1}
              onPress={(index) => {
                if (index === 0) {
                  goToScorekeeperReservationDetail(selectedScorekeeperData)
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
export default Scorekeepers;
