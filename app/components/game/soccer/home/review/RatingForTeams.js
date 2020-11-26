import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import TCRadarChart from '../../../../TCRadarChart';
import TCTeamVS from '../../../../TCTeamVS';
import TCTeamsAttributesRating from '../../../../TCTeamsAttributesRating';
import colors from '../../../../../Constants/Colors';

const RatingForTeams = ({ gameData }) => (
  //  title
  <View style={styles.mainContainer}>
    <Text style={styles.titleText}>Ratings for teams (10)</Text>

    {/* Radar Chart */}
    <TCRadarChart/>

    {/* Teams Display */}
    <TCTeamVS
          firstTeamName={gameData?.home_team?.group_name}
          secondTeamName={gameData?.away_team?.group_name}
          firstTeamProfilePic={gameData?.home_team?.background_thumbnail}
          secondTeamProfilePic={gameData?.away_team?.background_thumbnail}
      />

    {/*  Teams Attribute Rating */}
    <TCTeamsAttributesRating
        style={{ marginTop: 15 }}
        ratingName={'Manner'}
        firstTeamRating={4}
        secondTeamRating={1}
    />
    <TCTeamsAttributesRating
          ratingName={'Punctuality'}
          firstTeamRating={3}
          secondTeamRating={4}
      />
    <TouchableOpacity>
      <Text style={styles.detailText}>Detail info about ratings</Text>
    </TouchableOpacity>
  </View>)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
  detailText: {
    marginVertical: 5,
    marginRight: 5,
    color: colors.lightBlackColor,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: fonts.RLight,
    textDecorationLine: 'underline',
  },
})
export default RatingForTeams;
