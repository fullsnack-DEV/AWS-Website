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
import { addGameReview } from '../../../../../api/Games';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';

const LeaveReview = ({ navigation, route }) => {
  const [currentForm, setCurrentForm] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sliderAttributes, setSliderAttributes] = useState([]);
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
    loadSliderAttributes(route?.params?.sliderAttributes)
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

  const loadSliderAttributes = (attributes) => {
    setLoading(true);
    setSliderAttributes(attributes);
    const attr = {}
    attributes.map((item) => { attr[item] = 0; return true; })
    const reviews = _.cloneDeep(reviewsData);
    reviews.team_reviews[0] = { ...reviews.team_reviews[0], ...attr };
    reviews.team_reviews[1] = { ...reviews.team_reviews[1], ...attr };
    setReviewsData(reviews);
    setLoading(false);
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
                  reviewAttributes={sliderAttributes}
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
                  reviewAttributes={sliderAttributes}
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
