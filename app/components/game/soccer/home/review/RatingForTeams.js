import React, { useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import _ from 'lodash';
import fonts from '../../../../../Constants/Fonts';
import TCRadarChart from '../../../../TCRadarChart';
import TCTeamVS from '../../../../TCTeamVS';
import TCTeamsAttributesRating from '../../../../TCTeamsAttributesRating';
import colors from '../../../../../Constants/Colors';

const RatingForTeams = ({ gameData, reviewsData }) => {
  const [radarChartData, setRadarChartData] = useState([]);
  const [radarChartAttributes, setRadarChartAttributes] = useState([]);
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    if (reviewsData) processChartData(reviewsData?.averageReview)
  }, [reviewsData]);

  const processChartData = async (teamsRatingData) => {
    let homeTeamRatings = {};
    let awayTeamRatings = {};
    if (teamsRatingData.length) {
      const process = new Promise((resolve) => {
        teamsRatingData.map((item) => {
          if (item.team_id === gameData?.home_team?.group_id) {
            const homeTempRate = item.avg_review;
            Object.keys(homeTempRate).map((homeTeamItem) => {
              if (_.isNaN(homeTempRate[homeTeamItem])) {
                homeTempRate[homeTeamItem] = 0
              }
              return homeTeamItem;
            });
            homeTeamRatings = homeTempRate;
          } else if (item.team_id === gameData?.away_team?.group_id) {
            const awayTempRate = item.avg_review;
            Object.keys(awayTempRate).map((awayTeamItem) => {
              if (_.isNaN(awayTempRate[awayTeamItem])) {
                awayTempRate[awayTeamItem] = 0
              }
              return awayTeamItem;
            });

            awayTeamRatings = awayTempRate;
          }
          setTimeout(resolve, 100);
          return item;
        });
      })
      Promise.all([process]).then(() => {
        setRatings({ home_team: homeTeamRatings, away_team: awayTeamRatings })
        if (homeTeamRatings) setRadarChartAttributes([...Object.keys(homeTeamRatings)]);
        if (homeTeamRatings && awayTeamRatings) {
          setRadarChartData([{ ...awayTeamRatings }, { ...homeTeamRatings }]);
        }
      })
    }
  }
  return (
    <View style={styles.mainContainer}>
      {/* title */}
      <Text style={styles.titleText}>Ratings for teams ({radarChartAttributes?.length ?? 0})</Text>

      {/* Radar Chart */}
      <TCRadarChart
          radarChartAttributes={radarChartAttributes}
            radarChartData={radarChartData}
      />

      {/* Teams Display */}
      <TCTeamVS
                firstTeamName={gameData?.home_team?.group_name}
                secondTeamName={gameData?.away_team?.group_name}
                firstTeamProfilePic={gameData?.home_team?.background_thumbnail}
                secondTeamProfilePic={gameData?.away_team?.background_thumbnail}
            />

      {/*  Teams Attribute Rating */}

      <FlatList
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ index }) => index?.toString()}
          data={radarChartAttributes}
          renderItem={({ item }) => (
            <TCTeamsAttributesRating
                  style={{ marginTop: 15 }}
                  ratingName={_.startCase(item)}
                  firstTeamRating={ratings?.home_team[item.toString()] ?? 0}
                  secondTeamRating={ratings?.away_team[item.toString()] ?? 0}
              />
          )}/>

      {/* Detail Info Button */}
      <TouchableOpacity>
        <Text style={styles.detailText}>Detail info about ratings</Text>
      </TouchableOpacity>
    </View>)
}

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
