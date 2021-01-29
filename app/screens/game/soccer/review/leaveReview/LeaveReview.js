/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, {
  useState, useEffect, useLayoutEffect, useContext,
} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import fonts from '../../../../../Constants/Fonts';
import TCStep from '../../../../../components/TCStep';
import TeamReview from '../../../../../components/game/soccer/home/review/leaveReview/TeamReview';
import { STAR_COLOR } from '../../../../../utils';
import { addGameReview, patchGameReview } from '../../../../../api/Games';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import Header from '../../../../../components/Home/Header';
import AuthContext from '../../../../../auth/context';
import strings from '../../../../../Constants/String';
import uploadImages from '../../../../../utils/imageAction';
import ActivityLoader from '../../../../../components/loader/ActivityLoader';

const LeaveReview = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const [currentForm, setCurrentForm] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [progressBar, setProgressBar] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [cancelApiRequest, setCancelApiRequest] = useState(null);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);

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
      },
      {
        team_id: route?.params?.gameData?.away_team?.group_id,
        comment: '',
        attachments: [],
        tagged: [],
      },
    ],
  });
  useEffect(() => {
    if (route?.params?.gameReviewData?.results[0]?.object) {
      const reviewObj = {
        comment: '',
        attachments: [],
        tagged: [],
        team_reviews: JSON.parse(route?.params?.gameReviewData?.results?.[0]?.object)
          ?.teamReviews,
      };

      setReviewsData({ ...reviewObj });
    }
  }, [route?.params?.gameReviewData?.results[0]?.object]);

  useEffect(() => {
    if (route?.params?.selectedImageList) {
      if (currentForm === 1) {
        const obj = { ...reviewsData }
        obj.team_reviews[0].attachments = route?.params?.selectedImageList
        console.log(
          'obj of attachments::=>',
          obj,
        );
        setReviewsData({ ...obj })
      } else {
        const obj = { ...reviewsData }
        obj.team_reviews[1].attachments = route?.params?.selectedImageList
        setReviewsData({ ...obj })
      }
    }
    if (route?.params?.searchText) {
      if (currentForm === 1) {
        const obj = { ...reviewsData }
        obj.team_reviews[0].comment = route?.params?.searchText ?? ''
        setReviewsData({ ...obj })
      } else {
        const obj = { ...reviewsData }
        obj.team_reviews[1].comment = route?.params?.searchText ?? ''
        setReviewsData({ ...obj })
      }
    }
    if (route?.params?.entityTags) {
      console.table(route?.params?.entityTags)
      if (currentForm === 1) {
        const obj = { ...reviewsData }
        obj.team_reviews[0].tagged = route?.params?.entityTags
        setReviewsData({ ...obj })
      } else {
        const obj = { ...reviewsData }
        obj.team_reviews[1].tagged = route?.params?.entityTags
        setReviewsData({ ...obj })
      }
    }
  }, [route?.params?.selectedImageList, route?.params?.searchText, route?.params?.entityTags]);

  useEffect(() => {
    console.log(
      'Edit review Data::=>',
      route?.params?.gameReviewData?.results[0]?.object,
    );
    setSliderAttributes([...route?.params?.sliderAttributes]);

    // console.log('Edit review Data::=>', JSON.stringify(route?.params?.gameReviewData?.results));
    if (!route?.params?.gameReviewData) {
      loadSliderAttributes(route?.params?.sliderAttributes);
      loadStarAttributes(route?.params?.starAttributes);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => (currentForm === 1 ? navigation.goBack() : setCurrentForm(1))
          }>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 15,
              tintColor: colors.blackColor,
            }}
          />
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
    const attr = {};
    attributes.map((item) => {
      attr[item] = 0;
      return true;
    });
    const reviews = _.cloneDeep(reviewsData);
    reviews.team_reviews[0] = { ...reviews.team_reviews[0], ...attr };
    reviews.team_reviews[1] = { ...reviews.team_reviews[1], ...attr };
    setReviewsData({ ...reviews });
    setLoading(false);
  };

  const loadStarAttributes = (attributes) => {
    setLoading(true);
    const attr = {};
    attributes.map((item) => {
      attr[item] = 0;
      return true;
    });
    const reviews = _.cloneDeep(reviewsData);
    reviews.team_reviews[0] = { ...reviews.team_reviews[0], ...attr };
    reviews.team_reviews[1] = { ...reviews.team_reviews[1], ...attr };
    setReviewsData({ ...reviews });
    setLoading(false);
  };

  const isValidReview = (teamNo) => {
    const exceptKey = ['team_id', 'comment', 'attachments', 'tagged'];
    let isValid = true;
    const reviews = _.cloneDeep(reviewsData);
    const review = reviews?.team_reviews?.[teamNo - 1];
    Object.keys(review).map((key) => {
      if (!exceptKey.includes(key) && isValid && Number(review?.[key]) <= 0) {
        isValid = false;
      }
      return key;
    });
    return isValid;
  };
  const createReview = () => {
    if (route?.params?.gameReviewData) {
      if (currentForm === 1) {
        if (isValidReview(currentForm)) {
          setCurrentForm(2);
        } else {
          Alert.alert('Please, complete all ratings before moving to the next.');
        }
      } else if (isValidReview(currentForm)) {
        setLoading(true);
        uploadMediaForTeamA()
      } else {
        Alert.alert(strings.alertmessagetitle, strings.completeReviewFirst);
      }
    } else if (currentForm === 1) {
      if (isValidReview(currentForm)) {
        setCurrentForm(2);
      } else {
        Alert.alert(strings.alertmessagetitle, strings.completeReviewFirst);
      }
    } else if (isValidReview(currentForm)) {
      setLoading(true);
      uploadMediaForTeamA()
    } else {
      Alert.alert(strings.alertmessagetitle, strings.completeReviewFirst);
    }
  };
  const onCancelImageUpload = () => {
    if (cancelApiRequest) {
      cancelApiRequest.cancel('Cancel Image Uploading');
    }
    setProgressBar(false);
    setDoneUploadCount(0);
    setTotalUploadCount(0);
  }
  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  const cancelRequest = (axiosTokenSource) => {
    setCancelApiRequest({ ...axiosTokenSource });
  }

  const uploadMediaForTeamA = () => {
    if (reviewsData?.team_reviews[0]?.attachments?.length) {
      const UrlArray = []
      const pathArray = []
      const o = reviewsData?.team_reviews[0]?.attachments.map((e) => {
        if (e.path) {
          pathArray.push(e)
        } else {
          UrlArray.push(e)
        }
      })
      console.log('OOOOO:', o);
      setTotalUploadCount(pathArray?.length || 1);
      // setProgressBar(true);
      setLoading(true);
      const imageArray = pathArray
      uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
        const attachments = responses.map((item) => ({
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
          media_height: item.height,
          media_width: item.width,
        }))
        console.log('Attachments For A::=>', attachments);

        const obj = { ...reviewsData }
        obj.team_reviews[0].attachments = [...attachments, ...UrlArray]
        setReviewsData({ ...obj })
        uploadMediaForTeamB()
        // addRefereeReview(route?.params?.userData?.profile?.user_id, gameData?.game_id, dataParams, authContext)
        //   .then(() => {
        //     console.log('Review Created for referee');
        //   })
        //   .catch((error) => {
        //     setTimeout(() => Alert.alert(strings.alertmessagetitle, error?.message), 100)
        //   })
      })
    }
  }
  const uploadMediaForTeamB = () => {
    console.log('Attachments For B::=>', reviewsData?.team_reviews[1]?.attachments?.length);
    if (reviewsData?.team_reviews[1]?.attachments?.length) {
      const UrlArray = []
      const pathArray = []
      const o = reviewsData?.team_reviews[1]?.attachments.map((e) => {
        if (e.path) {
          pathArray.push(e)
        } else {
          UrlArray.push(e)
        }
      })
      console.log('OOOOO:', o);
      setTotalUploadCount(pathArray?.length || 1);
      // setProgressBar(true);
      const imageArray = pathArray
      uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
        const attachments = responses.map((item) => ({
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
          media_height: item.height,
          media_width: item.width,
        }))
        console.log('Attachments For B::=>', attachments);

        const obj = { ...reviewsData }
        obj.team_reviews[1].attachments = [...attachments, ...UrlArray]
        setReviewsData({ ...obj })
      })
    }
    if (route?.params?.gameReviewData) {
      const team1Review = reviewsData?.team_reviews?.[0]
      delete team1Review.created_at;
      delete team1Review.entity_type;
      const team1ID = team1Review.entity_id
      delete team1Review.entity_id;
      team1Review.team_id = team1ID
      delete team1Review.game_id;
      const reviewID = team1Review.review_id;
      delete team1Review.review_id;
      delete team1Review.reviewer_id;
      delete team1Review.sport;

      const team2Review = reviewsData?.team_reviews?.[1]
      delete team2Review.created_at;
      delete team2Review.entity_type;
      const team2ID = team2Review.entity_id
      delete team2Review.entity_id;
      team2Review.team_id = team2ID
      delete team2Review.game_id;
      delete team2Review.review_id;
      delete team2Review.reviewer_id;
      delete team2Review.sport;

      const reviewObj = {
        comment: '',
        attachments: [],
        tagged: [],
        team_reviews: [
          {
            ...team1Review,
          },
          {
            ...team2Review,
          },
        ],
      };
      console.log('Edited Review Object::=>', reviewObj);
      patchGameReview(route?.params?.gameData?.game_id, reviewID, reviewObj, authContext)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
          navigation.goBack();
        });
    } else {
      setLoading(true);
      addGameReview(route?.params?.gameData?.game_id, reviewsData, authContext)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
          navigation.goBack();
        });
    }
  }
  const setTeamReview = (teamNo = 0, key = '', value = '') => {
    console.log(`key::${key}value::${value}`);
    if (reviewsData?.team_reviews[teamNo][key] !== value) {
      const reviews = _.cloneDeep(reviewsData);
      reviews.team_reviews[teamNo][key] = value;
      setReviewsData({ ...reviews });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() => (currentForm === 1 ? navigation.goBack() : setCurrentForm(1))
            }>
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
      <ActivityLoader visible={loading} />
      {!loading && (
        <ScrollView style={styles.mainContainer}>
          {currentForm === 1 ? (
            <TeamReview
              teamNo={0}
              reviewsData={reviewsData}
              reviewAttributes={sliderAttributes}
              starColor={STAR_COLOR.YELLOW}
              teamData={route?.params?.gameData?.home_team}
              setTeamReview={setTeamReview}
              navigation = {navigation}
              route={route}
              tags={reviewsData?.team_reviews[0]?.tagged || route?.params?.entityTags}
            />
          ) : (
            <TeamReview
              teamNo={1}
              reviewsData={reviewsData}
              starColor={STAR_COLOR.BLUE}
              teamData={route?.params?.gameData?.away_team}
              reviewAttributes={sliderAttributes}
              setTeamReview={setTeamReview}
              navigation = {navigation}
              route={route}
              tags={reviewsData?.team_reviews[0]?.tagged || route?.params?.entityTags}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

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
