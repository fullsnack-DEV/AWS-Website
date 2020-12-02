import React, { Fragment, useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import moment from 'moment';
import fonts from '../../../../../Constants/Fonts';
import RatingForTeams from './RatingForTeams';
import colors from '../../../../../Constants/Colors';
import RatingForReferees from './RatingForReferees';
import ReviewsList from './ReviewsList';
import TCGradientButton from '../../../../TCGradientButton';
import { heightPercentageToDP as hp } from '../../../../../utils';
import TCInnerLoader from '../../../../TCInnerLoader';
import {
  checkReviewExpired,
  getGameDateTimeInDHMformat, REVIEW_EXPIRY_DAYS,
} from '../../../../../utils/gameUtils';

const Review = ({
  navigation, gameData, isAdmin, getSoccerGameReview,
}) => {
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    setLoading(true);
    getSoccerGameReview(gameData?.game_id).then((res) => {
      setReviewsData({ ...res.payload })
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }, [navigation])
  const Seperator = () => (
    <View style={styles.separator}/>
  )
  return (
    <View style={styles.mainContainer}>

      {/*  Leave Review Section */}
      {gameData?.status === 'ended' && !checkReviewExpired(gameData?.actual_enddatetime) && (
        <View style={{ backgroundColor: colors.whiteColor, padding: 10 }}>
          <View>
            <TCGradientButton
              onPress={() => {
                navigation.navigate('LeaveReview',
                  {
                    gameData,
                  })
              }}
                    startGradientColor={colors.yellowColor}
                    endGradientColor={colors.themeColor}
                    title={'LEAVE REVIEW'}
                    style={{
                      borderRadius: 5,
                    }}
                    outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
                />

          </View>
        </View>
      )}
      {gameData?.status === 'ended' && (
        <View style={{ marginBottom: hp(1), backgroundColor: colors.whiteColor, marginLeft: 10 }}>
          {!checkReviewExpired(gameData?.actual_enddatetime) ? (
            <Text style={styles.reviewPeriod}>
              The review period will be expired within
              <Text style={{ fontFamily: fonts.RBold }}>
                {getGameDateTimeInDHMformat(
                  (moment(gameData?.actual_enddatetime * 1000)
                    .add(REVIEW_EXPIRY_DAYS, 'days')) / 1000,
                )}
              </Text>
            </Text>
          ) : (
            <Text style={{
              ...styles.reviewPeriod,
              marginVertical: 10,
            }}>
              The review period is{' '}
              <Text style={{ fontFamily: fonts.RBold }}>
                expired
              </Text>
            </Text>
          )}

        </View>
      )}
      {!isAdmin && <Seperator/>}

      <TCInnerLoader visible={loading} size={50}/>
      {!loading && (
        <Fragment>

          {/* Rating For Team Section */}
          <RatingForTeams gameData={gameData} reviewsData={reviewsData}/>
          <Seperator/>

          {/* Rating For Referees Section */}
          <RatingForReferees refreeData={gameData?.referees ?? []}/>
          <Seperator/>

          {/* Review List Section */}
          <ReviewsList gameData={gameData}/>
          <Seperator/>
        </Fragment>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  separator: {
    flex: 1,
    height: 5,
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
  },
  reviewPeriod: {
    marginHorizontal: 5,
    fontSize: 16,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
})
export default Review;
