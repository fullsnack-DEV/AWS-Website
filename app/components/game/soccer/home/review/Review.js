import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import RatingForTeams from './RatingForTeams';
import colors from '../../../../../Constants/Colors';
import RatingForReferees from './RatingForReferees';
import ReviewsList from './ReviewsList';
import TCGradientButton from '../../../../TCGradientButton';
import { heightPercentageToDP as hp } from '../../../../../utils';

const Review = ({ gameData, isAdmin, getSoccerGameReview }) => {
  useEffect(() => {
    getSoccerGameReview(gameData?.game_id).then(() => {
    }).catch(() => {
    })
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

      {/* Rating For Team Section */}
      <RatingForTeams gameData={gameData}/>
      <Seperator/>

      {/* Rating For Referees Section */}
      <RatingForReferees/>
      <Seperator/>

      {/* Review List Section */}
      <ReviewsList gameData={gameData}/>
      <Seperator/>

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
