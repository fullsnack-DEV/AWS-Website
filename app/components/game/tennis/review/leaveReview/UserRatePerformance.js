import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import TCRatingStarSlider from '../../../../TCRatingStarSlider';

// const QUSTIONS = [
//    { attrName: 'punctuality', desc: 'Did the players arrive at the match place on time?' },
//   // { attrName: 'manner', desc: 'Did the players arrive at the match place on time?' },
//   { attrName: 'manner', desc: 'Did the players keep good manners for the other players, officials and spectators during the match?' },
//   { attrName: 'respectforreferre', desc: 'Did the players respect the referees and their decisions?' },
// ]
// const QUSTIONS_WITHOUT_REFREE = [
//   { attrName: 'punctuality', desc: 'Did the players arrive at the match place on time?' },
//  // { attrName: 'manner', desc: 'Did the players arrive at the match place on time?' },
//  { attrName: 'manner', desc: 'Did the players keep good manners for the other players, officials and spectators during the match?' },

// ]
const UserRatePerformance = ({
  reviewsData,
  setTeamReview,
  starColor,
  reviewAttributes,
  isRefereeAvailable,
}) => {
console.log('reviewAttributes:=>', reviewAttributes);

  return (
    <View style={styles.mainContainer}>

      {/*    Title */}
      <Text style={styles.titleText}>Rate<Text style={{ color: colors.redDelColor }}>*</Text></Text>

      {/* Questions */}

      {isRefereeAvailable ? reviewAttributes.map((item, index) => (
        <View style={{ marginVertical: 5 }} key={index}>
          <Text style={styles.questionText}>{item.description}</Text>
          <TCRatingStarSlider
                  currentRating={reviewsData[item.name]}
                  onPress={(star) => {
                    setTeamReview(item.name, star)
                  }}
                    style={{ alignSelf: 'flex-end' }}
                    starColor={starColor}/>
        </View>
            )) : (reviewAttributes.filter((e) => e.name !== 'respectforreferre')).map((item, index) => (
              <View style={{ marginVertical: 5 }} key={index}>
                <Text style={styles.questionText}>{item.description}</Text>
                <TCRatingStarSlider
                  currentRating={reviewsData[item.name]}
                  onPress={(star) => {
                    setTeamReview(item.name, star)
                  }}
                    style={{ alignSelf: 'flex-end' }}
                    starColor={starColor}/>
              </View>
            ))}
    </View>
    )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  questionText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
})
export default UserRatePerformance;
