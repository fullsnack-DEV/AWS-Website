import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import colors from '../../../../../../Constants/Colors';
import fonts from '../../../../../../Constants/Fonts';
import TCAttributeRatingWithSlider from '../../../../../TCAttributeRatingWithSlider';
import TCRatingStarSlider from '../../../../../TCRatingStarSlider';

const QUSTIONS = [
  // { attrName: 'ontime', desc: 'Did the players arrive at the match place on time?' },
  { attrName: 'manner', desc: 'Did the players keep good manners for the other players, officials and spectators during the match?' },
  { attrName: 'punctuality', desc: 'Did the players respect the referees and their decisions?' },
]
const RatePerformance = ({
  teamNo,
  reviewsData,
  setTeamReview,
  reviewAttributes,
  starColor,
}) => (
  <View style={styles.mainContainer}>

    {/*    Title */}
    <Text style={styles.titleText}>Rate performance <Text style={{ color: colors.redDelColor }}>*</Text></Text>

    {/* Ratings */}
    <View style={styles.rateSection}>

      {/* Poor Excellent Section */}
      <View style={{ ...styles.poorExcellentSection }}>
        <View style={{ flex: 0.3 }}/>
        <View style={styles.poorExcellentChildSection}>
          <Text style={styles.poorExcellenceText}>Poor</Text>
          <Text>Excellent</Text>
        </View>
        <View style={{ flex: 0.1 }}/>
      </View>

      {/*    Rating Slider */}
      {reviewAttributes.map((item, index) => (<View key={index}>
        <TCAttributeRatingWithSlider
            selectedTrackColors={teamNo === 0
              ? [colors.yellowColor, colors.themeColor]
              : [colors.blueGradiantEnd, colors.blueGradiantStart]}
                setTeamReview={setTeamReview}
                title={item}
                rating={reviewsData?.team_reviews[teamNo][item]}
            />
      </View>))}
    </View>

    {/* Questions */}
    {QUSTIONS.map((item, index) => (
      <View style={{ marginVertical: 5 }} key={index}>
        <Text style={styles.questionText}>{item.desc}</Text>
        <TCRatingStarSlider
            currentRating={reviewsData?.team_reviews[teamNo][item.attrName]}
            onPress={(star) => {
              setTeamReview(item.attrName, star)
            }}
              style={{ alignSelf: 'flex-end' }}
              starColor={starColor}/>
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  rateSection: {
    marginVertical: 10,
  },
  poorExcellentSection: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: 5,
  },
  poorExcellentChildSection: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  poorExcellenceText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  questionText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
})
export default RatePerformance;
