import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../utils';
import TCUserFollowUnfollowList from '../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../TCGradientButton';
import AuthContext from '../../../../auth/context';
import GameStatus from '../../../../Constants/GameStatus';

const Scorekeepers = ({
  navigation,
  isAdmin,
  userRole,
  gameData,
  followUser,
  unFollowUser,
  getScorekeeperReservation,
}) => {
  const [scorekeeper, setScorekeeper] = useState([]);
  const actionSheet = useRef();
  const authContext = useContext(AuthContext)

  useEffect(() => {
    getScorekeeperReservation(gameData?.game_id).then((res) => {
      setScorekeeper([...res?.payload]);
    });
  }, [gameData]);

  const onFollowPress = async (userID, status) => {
    const sKeeper = _.cloneDeep(scorekeeper);
    const index = sKeeper.findIndex((item) => item?.scorekeeper?.user_id === userID);
    if (index > -1) sKeeper[index].scorekeeper.is_following = status
    setScorekeeper(sKeeper);
  };

  const renderScorekeepers = ({ item }) => {
    const entity = authContext?.entity;
    const sKeeper = item?.scorekeeper;
    if (!['declined', 'cancel'].includes(item?.status)) {
      return (
        <TCUserFollowUnfollowList
              userID={sKeeper?.user_id}
              title={sKeeper?.full_name}
              is_following={sKeeper?.is_following}
              onFollowUnfollowPress={onFollowPress}
              followUser={followUser}
              unFollowUser={unFollowUser}
              profileImage={sKeeper?.thumbnail}
              isAdmin={isAdmin}
              isShowThreeDots={item?.initiated_by === entity?.uid}
              userRole={userRole}
              onThreeDotPress={() => actionSheet.current.show()}
          />
      )
    }
    return null;
  }
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
      {isAdmin && [GameStatus.accepted, GameStatus.reset].includes(gameData?.status) && (
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
              alert('Scorekeeper Reservation Details')
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
