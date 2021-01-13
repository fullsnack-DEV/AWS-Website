import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../../Constants/Fonts';
import images from '../../../../../../Constants/ImagePath';
import colors from '../../../../../../Constants/Colors';
import RatePerformance from './RatePerformance';
import TCInputBox from '../../../../../TCInputBox';
import TCKeyboardView from '../../../../../TCKeyboardView';

const TeamReview = ({
  teamNo,
  reviewsData,
  setTeamReview,
  reviewAttributes,
  teamData,
  starColor,
}) => (
  <TCKeyboardView>
    <View style={styles.mainContainer}>

      {/* Title */}
      <Text style={styles.titleText}>Please, rate the performance of New York City FC and leave a review for the team.</Text>

      {/*  Logo Container */}
      <View style={styles.logoContainer}>

        {/* Image */}
        <View style={styles.imageContainer}>
          <FastImage
               source={teamData?.full_image ? { uri: teamData?.full_image } : images.teamPlaceholder}
               resizeMode={'contain'}
               style={{ height: 50, width: 50 }}
          />
        </View>

        {/*    Team name */}
        <Text style={styles.teamName}>{teamData?.group_name}</Text>

        {/*    Country Name */}
        <Text style={styles.countryName}>{teamData?.country}</Text>

      </View>

      {/* Seperator */}
      <View style={styles.seperator}/>

      {/*  Rate Performance */}
      <RatePerformance
        teamNo={teamNo}
        reviewsData={reviewsData}
        setTeamReview={(key, value) => setTeamReview(teamNo, key, value)}
        reviewAttributes={reviewAttributes}
        starColor={starColor}
    />

      {/*  Leave a Review */}
      <View style={styles.leaveReviewContainer}>
        <Text style={styles.titleText}>Leave a review</Text>
        <TCInputBox
          onChangeText={(value) => setTeamReview(teamNo, 'comment', value)}
          value={reviewsData?.team_reviews[teamNo]?.comment ?? ''}
          multiline={true}
          placeHolderText={'Describe what you thought and felt about New York City FC while watching or playing the game.'}
          textInputStyle={{ fontSize: 16, color: colors.userPostTimeColor }}
          style={{
            height: 120,
            marginVertical: 10,
            alignItems: 'flex-start',
            padding: 15,
          }}
      />
      </View>

      {/*  Footer */}
      <Text style={styles.footerText}>
        (<Text style={{ color: colors.redDelColor }}>*</Text> required)
      </Text>

    </View>
  </TCKeyboardView>
)
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.whiteColor,
  },
  titleText: {
    fontSize: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  countryName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },
  seperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 20,
    height: 2,
    width: '100%',
  },
  footerText: {
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
  },
  leaveReviewContainer: {

  },
})
export default TeamReview;
