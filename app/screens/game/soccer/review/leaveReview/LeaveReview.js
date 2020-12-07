import React, {
  useState, useEffect, useLayoutEffect,
} from 'react';
import {
  Alert,
  Image, ScrollView, StyleSheet, View, Text, TouchableOpacity,
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
import Header from '../../../../../components/Home/Header';

const LeaveReview = ({ navigation, route }) => {
  const [currentForm, setCurrentForm] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [reviewsData, setReviewsData] = useState({
    comment: '',
    attachments: [],
    tagged: [],
    team_reviews: [
      {
        team_id: route?.params?.gameData?.home_team?.group_id,
        comment: '',
        attachments: [],
        tagged: [],
      }, {
        team_id: route?.params?.gameData?.away_team?.group_id,
        comment: '',
        attachments: [],
        tagged: [],
      }],
  });

  useEffect(() => {
    loadSliderAttributes(route?.params?.sliderAttributes)
    loadStarAttributes(route?.params?.starAttributes);
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
    setReviewsData({ ...reviews });
    setLoading(false);
  }

  const loadStarAttributes = (attributes) => {
    setLoading(true);
    const attr = {}
    attributes.map((item) => { attr[item] = 0; return true; })
    const reviews = _.cloneDeep(reviewsData);
    reviews.team_reviews[0] = { ...reviews.team_reviews[0], ...attr };
    reviews.team_reviews[1] = { ...reviews.team_reviews[1], ...attr };
    setReviewsData({ ...reviews });
    setLoading(false);
  }

  const isValidReview = (teamNo) => {
    const exceptKey = ['team_id', 'comment', 'attachments', 'tagged'];
    let isValid = true;
    const reviews = _.cloneDeep(reviewsData);
    const review = reviews?.team_reviews?.[teamNo - 1];
    Object.keys(review).map((key) => {
      if (!exceptKey.includes(key) && isValid && Number(review?.[key]) <= 0) {
        isValid = false
      }
      return key;
    });
    return isValid;
  }
  const createReview = () => {
    if (currentForm === 1) {
      if (isValidReview(currentForm)) {
        setCurrentForm(2);
      } else {
        Alert.alert('Please, complete all ratings before moving to the next.')
      }
    } else if (isValidReview(currentForm)) {
      setLoading(true);
      addGameReview(route?.params?.gameData?.game_id, reviewsData)
        .catch((error) => {
          Alert.alert(error?.message);
        }).finally(() => {
          setLoading(false);
          navigation.goBack()
        })
    } else {
      Alert.alert('Please, complete all ratings before moving to the next.')
    }
  }

  const setTeamReview = (teamNo = 0, key = '', value = '') => {
    if (reviewsData?.team_reviews[teamNo][key] !== value) {
      const reviews = _.cloneDeep(reviewsData);
      reviews.team_reviews[teamNo][key] = value;
      setReviewsData({ ...reviews });
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Header
          leftComponent={
            <TouchableOpacity onPress={() => (currentForm === 1 ? navigation.goBack() : setCurrentForm(1)) }>
              <Image source={images.backArrow} style={styles.backImageStyle} />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTextStyle}>Leave a match review</Text>
          }
          rightComponent={
            <Text onPress={createReview} style={styles.nextButtonStyle}>
              {currentForm === 1 ? 'Next' : 'Done'}
            </Text>
          }
      />
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
    </View>
  )
}

const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
});

export default LeaveReview;
