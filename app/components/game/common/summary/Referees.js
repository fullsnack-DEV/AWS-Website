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

const Referees = ({
  gameData,
  isAdmin,
  userRole,
  followUser,
  unFollowUser,
  navigation,
  getRefereeReservation,
}) => {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext)
  const [loading, setloading] = useState(false);
  const [refree, setRefree] = useState([])
  const [myUserId, setMyUserId] = useState(null);
  const [selectedRefereeData, setSelectedRefereeData] = useState(null);

  useEffect(() => { getMyUserId() }, [])
  useEffect(() => {
    getRefereeReservation(gameData?.game_id).then((res) => {
      console.log('REF: ', res?.payload)
      const refData = res?.payload?.filter((item) => !['declined', 'cancelled'].includes(item?.status));
      const cloneRefData = [];
      refData.map((item) => {
        const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime()
        if (item?.status === 'offered' && !isExpired) {
          cloneRefData.push(item);
        } else if (item?.status !== 'offered') {
          cloneRefData.push(item);
        }
        return false;
      })
      setRefree([...cloneRefData]);
    });
  }, [gameData])
  const goToRefereReservationDetail = (data) => {
    if (data?.referee) {
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
    const status = item?.status;
    let statusData = '';
    const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime()
    switch (status) {
      case 'pendingpayment': statusData = { status: 'AWAITING PAYMENT', color: colors.yellowColor }; break;
      case 'offered':
        if (isExpired) statusData = { status: 'REFEREE RESERVATION REQUEST EXPIRED', color: colors.userPostTimeColor };
        else statusData = { status: 'REFEREE RESERVATION REUEST SENT', color: colors.yellowColor };
        break;
      default: statusData = { status: '' };
    }
    return statusData[type];
  }
  const renderReferees = ({ item }) => {
    const entity = authContext?.entity;
    const referee = item?.referee;
    if (!['declined', 'cancelled'].includes(item?.status)) {
      return (
        <TCUserFollowUnfollowList
              statusColor={getRefereeStatusMessage(item, 'color')}
              statusTitle={getRefereeStatusMessage(item, 'status')}
              myUserId={myUserId}
              followUser={followUser}
              unFollowUser={unFollowUser}
              userID={referee?.user_id}
              title={referee?.full_name}
              subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
              is_following={referee?.is_following}
              onFollowUnfollowPress={onFollowPress}
              profileImage={referee?.thumbnail}
              isShowThreeDots={item?.initiated_by === entity?.uid}
              onThreeDotPress={() => {
                setSelectedRefereeData(item)
                actionSheet.current.show()
              }}
              userRole={userRole}
          />
      )
    }
    return null;
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
              data={refree}
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
                  console.log(gameData);
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
