import React, {
  useEffect, useState, useContext, useRef,
} from 'react';
import {
  Text, View, StyleSheet, FlatList,
} from 'react-native';
import _ from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../../utils';
import TCUserFollowUnfollowList from '../../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../../TCGradientButton';
import AuthContext from '../../../../../auth/context'

const Referees = ({
  isAdmin,
  userRole,
  followSoccerUser,
  unFollowSoccerUser,
  gameData,
  navigation,
  getRefereeReservation,
}) => {
  const [refree, setRefree] = useState([]);
  const actionSheet = useRef();
  const authContext = useContext(AuthContext)
  const [myUserId, setMyUserId] = useState(null);
  useEffect(() => { getMyUserId() }, [])
  useEffect(() => {
    getRefereeReservation(gameData?.game_id).then((res) => {
      setRefree([...res?.payload]);
    });
  }, [gameData])

  const onFollowPress = (userID, status) => {
    const refre = _.cloneDeep(refree);
    const index = refre.findIndex((item) => item?.referee?.user_id === userID);
    if (index > -1) refre[index].referee.is_following = status
    setRefree(refre);
  };

  const getMyUserId = async () => {
    const entity = authContext.entity
    setMyUserId(entity.uid);
  }

  const renderReferees = ({ item }) => {
    const entity = authContext?.entity;
    const referee = item?.referee;
    if (!['declined', 'cancel'].includes(item?.status)) {
      return (
        <TCUserFollowUnfollowList
              myUserId={myUserId}
              followSoccerUser={followSoccerUser}
              unFollowSoccerUser={unFollowSoccerUser}
              userID={referee?.user_id}
              title={referee?.full_name}
              subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
              is_following={referee?.is_following}
              onFollowUnfollowPress={onFollowPress}
              profileImage={referee?.thumbnail}
              isShowThreeDots={item?.initiated_by === entity?.uid}
              userRole={userRole}
              onThreeDotPress={() => actionSheet.current.show()}
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
      {isAdmin && gameData?.status !== 'ended' && (
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
              alert('Referee Reservation Details')
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
