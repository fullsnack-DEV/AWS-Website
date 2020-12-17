import React, { useEffect, useState, useContext } from 'react';
import {
  Text, View, StyleSheet, FlatList,
} from 'react-native';
import _ from 'lodash';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../../../utils';
import TCUserFollowUnfollowList from '../../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../../TCGradientButton';
import AuthContext from '../../../../../auth/context'

const Referees = ({
  refereesData,
  isAdmin,
  userRole,
  followSoccerUser,
  unFollowSoccerUser,
  gameData,
  navigation,
}) => {
  const [refree, setRefree] = useState([]);
  const authContext = useContext(AuthContext)
  const [myUserId, setMyUserId] = useState(null);
  useEffect(() => { getMyUserId() }, [])
  useEffect(() => setRefree(refereesData), [refereesData])
  const onFollowPress = (userID, status) => {
    const refre = _.cloneDeep(refree);
    const index = refre.findIndex((item) => item?.user_id === userID);
    if (index > -1) refre[index].is_following = status
    setRefree(refre);
  };

  const getMyUserId = async () => {
    const entity = authContext.entity
    setMyUserId(entity.uid);
  }

  const renderReferees = ({ item }) => (
    <TCUserFollowUnfollowList
        myUserId={myUserId}
        followSoccerUser={followSoccerUser}
        unFollowSoccerUser={unFollowSoccerUser}
        userID={item?.user_id}
          title={item?.full_name}
          subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
          is_following={item?.is_following}
          onFollowUnfollowPress={onFollowPress}
          profileImage={item?.thumbnail}
          isAdmin={isAdmin}
          userRole={userRole}
      />
  )

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
      {isAdmin && (
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
