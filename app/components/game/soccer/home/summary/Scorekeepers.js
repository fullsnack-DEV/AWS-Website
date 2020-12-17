import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../../utils';
import TCUserFollowUnfollowList from '../../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../../TCGradientButton';

const Scorekeepers = ({
  navigation,
  scorekeepersData,
  isAdmin,
  userRole,
  gameData,
  followSoccerUser,
  unFollowSoccerUser,
}) => {
  const [scorekeeper, setScorekeeper] = useState([]);

  useEffect(() => setScorekeeper(scorekeepersData), [scorekeepersData])

  const onFollowPress = async (userID, status) => {
    const sKeeper = _.cloneDeep(scorekeeper);
    const index = sKeeper.findIndex((item) => item?.user_id === userID);
    if (index > -1) sKeeper[index].is_following = status
    setScorekeeper(sKeeper);
  };

  const renderScorekeepers = ({ item }) => (
    <TCUserFollowUnfollowList
          userID={item?.user_id}
          title={item?.full_name}
          is_following={item?.is_following}
          onFollowUnfollowPress={onFollowPress}
          followSoccerUser={followSoccerUser}
          unFollowSoccerUser={unFollowSoccerUser}
          profileImage={item?.thumbnail}
          isAdmin={isAdmin}
          userRole={userRole}
      />
  )
  const handleBookScorekeeper = () => {
    navigation.navigate('BookScorekeeper', { gameData })
  }

  return (<View style={styles.mainContainer}>
    <View style={styles.contentContainer}>
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
      {isAdmin && gameData?.status !== 'ended' && (
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
