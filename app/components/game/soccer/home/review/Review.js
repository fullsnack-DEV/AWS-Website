import React, { Fragment, useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import RatingForTeams from './RatingForTeams';
import colors from '../../../../../Constants/Colors';
import RatingForReferees from './RatingForReferees';
import ReviewsList from './ReviewsList';
import TCGradientButton from '../../../../TCGradientButton';
import { heightPercentageToDP as hp } from '../../../../../utils';
import TCInnerLoader from '../../../../TCInnerLoader';

const Review = ({ gameData, isAdmin, getSoccerGameReview }) => {
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState([]);
  useEffect(() => {
    setLoading(true);
    getSoccerGameReview(gameData?.game_id).then((res) => {
      setReviewsData({ ...res.payload })
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }, [])
  const Seperator = () => (
    <View style={styles.separator}/>
  )
  return (
    <View style={styles.mainContainer}>

      {/*  Leave Review Section */}
      {!isAdmin && (<View style={{ marginBottom: hp(1), backgroundColor: colors.whiteColor, padding: 10 }}>
        <View>
          <TCGradientButton
                    startGradientColor={colors.yellowColor}
                    endGradientColor={colors.themeColor}
                    title={'LEAVE REVIEW'}
                    style={{
                      borderRadius: 5,
                    }}
                    outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
                />
          <Text style={styles.reviewPeriod}>
            The review period will be expired within  <Text style={{ fontFamily: fonts.RBold }}>4d 23h 59m left</Text>
          </Text>
        </View>
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
    fontSize: 12,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
})
export default Review;
