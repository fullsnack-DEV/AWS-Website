import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Alert,
  Image, ScrollView, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import fonts from '../../../../../Constants/Fonts';
import TCStep from '../../../../../components/TCStep';
import TeamReview from '../../../../../components/game/soccer/home/review/leaveReview/TeamReview';
import { STAR_COLOR } from '../../../../../utils';
import { addGameReview, getGameReviews } from '../../../../../api/Games';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';

const LeaveReview = ({ navigation, route }) => {
  const [currentForm, setCurrentForm] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reviewAttributes, setReviewAttributes] = useState([]);
  const [reviewsData, setReviewsData] = useState({
    comment: '',
    attachments: {},
    tagged: {},
    team_reviews: [
      {
        team_id: route?.params?.gameData?.home_team?.group_id,
        comment: '',
        attachments: {},
        tagged: {},
      }, {
        team_id: route?.params?.gameData?.away_team?.group_id,
        comment: '',
        attachments: {},
        tagged: {},
      }],
  });

  useEffect(() => {
    setLoading(true);
    getGameReviews(route?.params?.gameData?.game_id).then((res) => {
      loadAttributes(res?.payload?.averageReview)
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => (currentForm === 1 ? navigation.goBack() : setCurrentForm(1))}>
          <Image source={images.backArrow} style={{
            height: 20, width: 15, marginLeft: 15, tintColor: colors.blackColor,
          }} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Text onPress={createReview} style={styles.nextButtonStyle}>
          {currentForm === 1 ? 'Next' : 'Done'}
        </Text>
      ),
    });
  }, [navigation, currentForm]);

  const loadAttributes = (teamsRatingData) => {
    let teamRatings = {};
    if (teamsRatingData.length) {
      teamRatings = teamsRatingData[0]?.avg_review;
      const attr = [...Object.keys(teamRatings)];
      setReviewAttributes(attr);
      const attributes = {}
      attr.map((item) => { attributes[item] = 0; return true; })
      const reviews = _.cloneDeep(reviewsData);

      reviews.team_reviews[0] = { ...reviews.team_reviews[0], ...attributes };
      reviews.team_reviews[1] = { ...reviews.team_reviews[1], ...attributes };
      setReviewsData(reviews);
    }
  }

  const createReview = () => {
    if (currentForm === 1) {
      setCurrentForm(2);
    } else {
      console.log(reviewsData);

      addGameReview(route?.params?.gameData?.game_id, reviewsData)
        .catch((error) => {
          Alert.alert(error?.message);
        }).finally(() => navigation.goBack())
    }
  }

  const setTeamReview = (teamNo = 0, key = '', value = '') => {
    if (reviewsData?.team_reviews[teamNo][key] !== value) {
      const reviews = _.cloneDeep(reviewsData);
      reviews.team_reviews[teamNo] = { ...reviews.team_reviews[teamNo], [key]: value };
      setReviewsData(reviews);
    }
  }
  return (
    <>
      <TCStep totalStep={2} currentStep={currentForm} />
      <TCInnerLoader visible={loading} size={35}/>
      {!loading && (
        <ScrollView style={styles.mainContainer}>
          {currentForm === 1
            ? (
              <TeamReview
                  teamNo={0}
                  reviewsData={reviewsData}
                  reviewAttributes={reviewAttributes}
                  starColor={STAR_COLOR.YELLOW}
                  teamData={route?.params?.gameData?.home_team}
                  setTeamReview={setTeamReview}
              />
            )
            : (
              <TeamReview
                  teamNo={1}
                  reviewsData={reviewsData}
                  starColor={STAR_COLOR.BLUE}
                  teamData={route?.params?.gameData?.away_team}
                  reviewAttributes={reviewAttributes}
                  setTeamReview={setTeamReview}
              />
            )
            }
        </ScrollView>)
      }
    </>
  )
}

const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});

export default LeaveReview;
