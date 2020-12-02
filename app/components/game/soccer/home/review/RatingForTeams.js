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

const RatingForTeams = ({
  sliderAttributes,
  starAttributes,
  gameData,
  reviewsData,
}) => {
  const [radarChartData, setRadarChartData] = useState([]);
  const [radarChartAttributes] = useState(sliderAttributes);
  const [starRatingData, setStarRatingData] = useState(null);

  useEffect(() => {
    if (reviewsData) processChartData(reviewsData?.averageReview)
  }, [reviewsData]);

  const processChartData = (teamsRatingData) => {
    let homeTeamRatings = {};
    let awayTeamRatings = {};
    let homeTeamStarRatings = {};
    let awayTeamStarRatings = {};
    if (teamsRatingData?.length) {
      const process = new Promise((resolve) => {
        teamsRatingData.map((item) => {
          if (item.team_id === gameData?.home_team?.group_id) {
            const homeTempRate = {};
            const homeTeamStar = {};
            Object.keys(item?.avg_review).map((homeTeamItem) => {
              if (sliderAttributes.includes(homeTeamItem) && item?.avg_review[homeTeamItem] !== 'NaN') {
                homeTempRate[homeTeamItem] = item?.avg_review[homeTeamItem];
              } else if (sliderAttributes.includes(homeTeamItem) && item?.avg_review[homeTeamItem] === 'NaN') {
                homeTempRate[homeTeamItem] = 0;
              } else if (starAttributes.includes(homeTeamItem) && item?.avg_review[homeTeamItem] !== 'NaN') {
                homeTeamStar[homeTeamItem] = item?.avg_review[homeTeamItem];
              } else if (starAttributes.includes(homeTeamItem) && item?.avg_review[homeTeamItem] === 'NaN') {
                homeTeamStar[homeTeamItem] = 0;
              }
              return true;
            });
            homeTeamRatings = homeTempRate;
            homeTeamStarRatings = homeTeamStar;
          } else if (item.team_id === gameData?.away_team?.group_id) {
            const awayTempRate = {};
            const awayTeamStar = {};
            Object.keys(item.avg_review).map((awayTeamItem) => {
              if (sliderAttributes.includes(awayTeamItem) && item?.avg_review[awayTeamItem] !== 'NaN') {
                awayTempRate[awayTeamItem] = item?.avg_review[awayTeamItem];
              } else if (sliderAttributes.includes(awayTeamItem) && item?.avg_review[awayTeamItem] === 'NaN') {
                awayTempRate[awayTeamItem] = 0;
              } else if (starAttributes.includes(awayTeamItem) && item?.avg_review[awayTeamItem] !== 'NaN') {
                awayTeamStar[awayTeamItem] = item?.avg_review[awayTeamItem];
              } else if (starAttributes.includes(awayTeamItem) && item?.avg_review[awayTeamItem] === 'NaN') {
                awayTeamStar[awayTeamItem] = 0;
              }
              return true;
            });
            awayTeamRatings = awayTempRate;
            awayTeamStarRatings = awayTeamStar;
          }
          return true;
        });
        setTimeout(resolve, 100);
      })
      Promise.all([process]).then(() => {
        setStarRatingData({ home_team: homeTeamStarRatings, away_team: awayTeamStarRatings })
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
          radarChartAttributes={sliderAttributes}
            radarChartData={radarChartData ?? []}
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
          data={starAttributes}
          renderItem={({ item }) => (
            <TCTeamsAttributesRating
                  style={{ marginTop: 15 }}
                  ratingName={_.startCase(item)}
                  firstTeamRating={starRatingData?.home_team[item.toString()] ?? 0}
                  secondTeamRating={starRatingData?.away_team[item.toString()] ?? 0}
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
