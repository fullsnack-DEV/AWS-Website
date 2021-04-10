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
import UserReview from '../../../../../components/game/tennis/review/leaveReview/UserReview';
import { STAR_COLOR } from '../../../../../utils';
import { addPlayerReview, patchPlayerReview } from '../../../../../api/Games';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import Header from '../../../../../components/Home/Header';
import AuthContext from '../../../../../auth/context';
import strings from '../../../../../Constants/String';
import uploadImages from '../../../../../utils/imageAction';
import ActivityLoader from '../../../../../components/loader/ActivityLoader';

const LeaveReviewTennis = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const [currentForm, setCurrentForm] = useState(route?.params?.selectedTeam === 'home' ? 1 : 2);
  const [loading, setLoading] = useState(false);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [progressBar, setProgressBar] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [cancelApiRequest, setCancelApiRequest] = useState(null);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);

  const { selectedTeam } = route?.params;
  console.log('selectedTeam:=>', selectedTeam);
  const [reviewsData, setReviewsData] = useState(currentForm === 1 ? {

    player_id: route?.params?.gameData?.home_team?.user_id,
    comment: '',
    attachments: [],
    tagged: [],

  } : {

    player_id: route?.params?.gameData?.away_team?.user_id,
    comment: '',
    attachments: [],
    tagged: [],

  });
  useEffect(() => {
    if (route?.params?.gameReviewData?.results[0]?.object) {
      const reviewObj = JSON.parse(route?.params?.gameReviewData?.results?.[0]?.object)?.playerReview;
      setReviewsData({ ...reviewObj });
    }
  }, [route?.params?.gameReviewData?.results[0]?.object]);

  useEffect(() => {
    const obj = { ...reviewsData }
    if (route?.params?.selectedImageList) {
      obj.attachments = route?.params?.selectedImageList
      setReviewsData(obj)
    }
    if (route?.params?.searchText?.length >= 0) {
      obj.comment = route?.params?.searchText ?? ''
      setReviewsData(obj)
    }
    if (route?.params?.entityTags) {
      console.table(route?.params?.entityTags)

      obj.tagged = route?.params?.entityTags
      setReviewsData(obj)
    }
  }, [route?.params?.selectedImageList, route?.params?.searchText, route?.params?.entityTags]);

  useEffect(() => {
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
          Done
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
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };
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
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };
    setReviewsData({ ...reviews });
    setLoading(false);
  };

  const isValidReview = (teamNo) => {
    const exceptKey = ['player_id', 'comment', 'attachments', 'tagged'];
    let isValid = true;
    const reviews = _.cloneDeep(reviewsData);
    const review = reviews
    Object.keys(review).map((key) => {
      if (!exceptKey.includes(key) && isValid && Number(review?.[key]) <= 0) {
        isValid = false;
      }
      return key;
    });
    return isValid;
  };
  const createReview = () => {
    console.log('Review Data::=>', JSON.stringify(reviewsData));
    // if (route?.params?.gameReviewData) {
    //   if (currentForm === 1) {
    //     if (isValidReview(currentForm)) {
    //       setCurrentForm(2);
    //     } else {
    //       Alert.alert('Please, complete all ratings before moving to the next.');
    //     }
    //   } else if (isValidReview(currentForm)) {
    //     setLoading(true);
    //     uploadMediaForTeamA()
    //   } else {
    //     Alert.alert(strings.alertmessagetitle, strings.completeReviewFirst);
    //   }
    // } else if (currentForm === 1) {
    //   if (isValidReview(currentForm)) {
    //     setCurrentForm(2);
    //   } else {
    //     Alert.alert(strings.alertmessagetitle, strings.completeReviewFirst);
    //   }
    // } else if (isValidReview(currentForm)) {
    //   setLoading(true);
    //   uploadMediaForTeamA()
    // } else {
    //   Alert.alert(strings.alertmessagetitle, strings.completeReviewFirst);
    // }

    if (currentForm === 1) {
      if (isValidReview(currentForm)) {
        uploadMediaForTeamA()
      } else {
        Alert.alert('Please, complete all ratings before moving to the next.');
      }
    } else if (currentForm === 2) {
      if (isValidReview(currentForm)) {
        uploadMediaForTeamB()
      } else {
        Alert.alert('Please, complete all ratings before moving to the next.');
      }
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

  const patchOrAddReview = () => {
    if (route?.params?.gameReviewData) {
      setLoading(true);
      const teamReview = reviewsData
      delete teamReview.created_at;
      delete teamReview.entity_type;
      const team1ID = teamReview.entity_id
      delete teamReview.entity_id;
      teamReview.player_id = team1ID
      delete teamReview.game_id;
      const reviewID = teamReview.review_id;
      delete teamReview.review_id;
      delete teamReview.reviewer_id;
      delete teamReview.sport;

      const reviewObj = {

        ...teamReview,

      };

      console.log('Edited Review Object::=>', reviewObj);
      patchPlayerReview(currentForm === 1 ? route?.params?.gameData?.home_team?.user_id : route?.params?.gameData?.away_team?.user_id, route?.params?.gameData?.game_id, reviewID, reviewObj, authContext)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert(strings.alertmessagetitle, error?.message), 100);
          navigation.goBack();
        });
    } else {
      console.log('New Review Object::=>', reviewsData);
      setLoading(true);
      addPlayerReview(currentForm === 1 ? route?.params?.gameData?.home_team?.user_id : route?.params?.gameData?.away_team?.user_id, route?.params?.gameData?.game_id, reviewsData, authContext)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert(strings.alertmessagetitle, error?.message), 100);
          navigation.goBack();
        });
    }
  }
  const uploadMediaForTeamA = () => {
    if (reviewsData?.attachments?.length) {
      const UrlArray = []
      const pathArray = []
      const o = reviewsData?.attachments.map((e) => {
        if (e.path) {
          pathArray.push(e)
        } else {
          UrlArray.push(e)
        }
      })
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
        const obj = { ...reviewsData }
        obj.attachments = [...attachments, ...UrlArray]
        console.log('Attachments Full Object::=>', obj);
        setReviewsData({ ...obj })
        patchOrAddReview()
      })
    } else {
      patchOrAddReview()
    }
  }
  const uploadMediaForTeamB = () => {
    if (reviewsData?.attachments?.length) {
      const UrlArray = []
      const pathArray = []
      const o = reviewsData?.attachments.map((e) => {
        if (e.path) {
          pathArray.push(e)
        } else {
          UrlArray.push(e)
        }
      })
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
        const obj = { ...reviewsData }
        obj.attachments = [...attachments, ...UrlArray]
        console.log('Attachments Full Object::=>', obj);
        setReviewsData({ ...obj })
        patchOrAddReview()
      })
    } else {
      patchOrAddReview()
    }
  }
  const setTeamReview = (teamNo = 0, key = '', value = '') => {
    console.log(`key::${key}value::${value}`);
    if (reviewsData[key] !== value) {
      const reviews = _.cloneDeep(reviewsData);
      reviews[key] = value;
      setReviewsData({ ...reviews });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() => (currentForm === 1 ? navigation.goBack() : navigation.pop(1))
            }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Leave a match review</Text>
        }
        rightComponent={
          <Text onPress={createReview} style={styles.nextButtonStyle}>
            Done
          </Text>
        }
      />
      <View style={styles.headerSeperator} />
      {/* <TCStep totalStep={2} currentStep={currentForm} /> */}
      <ActivityLoader visible={loading} />
      {!loading && (
        <ScrollView style={styles.mainContainer}>
          {currentForm === 1 ? (
            <UserReview
              teamNo={0}
              reviewsData={reviewsData}
              reviewAttributes={sliderAttributes}
              starColor={STAR_COLOR.YELLOW}
              teamData={route?.params?.gameData?.home_team}
              setTeamReview={setTeamReview}
              navigation = {navigation}
              route={route}
              tags={reviewsData?.tagged || route?.params?.entityTags}
            />
          ) : (
            <UserReview
              teamNo={1}
              reviewsData={reviewsData}
              starColor={STAR_COLOR.BLUE}
              teamData={route?.params?.gameData?.away_team}
              reviewAttributes={sliderAttributes}
              setTeamReview={setTeamReview}
              navigation = {navigation}
              route={route}
              tags={reviewsData?.tagged || route?.params?.entityTags}
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
  headerSeperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 0,
    height: 2,
    width: '100%',
  },
});

export default LeaveReviewTennis;
