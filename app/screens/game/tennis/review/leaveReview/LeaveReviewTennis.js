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
import {
  addPlayerReview,
  patchPlayerReview,
  addGameReview,
  patchGameReview,
} from '../../../../../api/Games';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import Header from '../../../../../components/Home/Header';
import AuthContext from '../../../../../auth/context';
import strings from '../../../../../Constants/String';
import uploadImages from '../../../../../utils/imageAction';
import ActivityLoader from '../../../../../components/loader/ActivityLoader';
import { ImageUploadContext } from '../../../../../context/ImageUploadContext';

const LeaveReviewTennis = ({ navigation, route }) => {
  const imageUploadContext = useContext(ImageUploadContext);
  const authContext = useContext(AuthContext);
  const [currentForm, setCurrentForm] = useState(
    route?.params?.selectedTeam === 'home' ? 1 : 2,
  );
  const [loading, setLoading] = useState(false);
  const [starAttributes, setStarAttributes] = useState([]);

  const [progressBar, setProgressBar] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [cancelApiRequest, setCancelApiRequest] = useState(null);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);

  console.log(
    'route?.params?.starAttributes',
    route?.params?.starAttributes,
  );
  console.log(
    'route?.params?.isRefereeAvailable',
    route?.params?.isRefereeAvailable,
  );
  const { selectedTeam } = route?.params;
  console.log('selectedTeam:=>', selectedTeam);
  console.log('route?.params?.gameReviewData', route?.params?.gameReviewData);

  const getReviewDataObject = () => {
    if (currentForm === 1) {
      if (route?.params?.gameData?.home_team?.user_id) {
        return {
          player_id: route?.params?.gameData?.home_team?.user_id,
          comment: '',
          attachments: [],
          tagged: [],
        };
      }
      return {
        team_id: route?.params?.gameData?.home_team?.group_id,
        comment: '',
        attachments: [],
        tagged: [],
      };
    }
    if (route?.params?.gameData?.away_team?.user_id) {
      return {
        player_id: route?.params?.gameData?.away_team?.user_id,
        comment: '',
        attachments: [],
        tagged: [],
      };
    }
    return {
      team_id: route?.params?.gameData?.away_team?.group_id,
      comment: '',
      attachments: [],
      tagged: [],
    };
  };

  const [reviewsData, setReviewsData] = useState(getReviewDataObject());
  useEffect(() => {
    if (route?.params?.gameReviewData?.results[0]?.object) {
      const reviewObj = JSON.parse(route?.params?.gameReviewData?.results?.[0]?.object)
          ?.playerReview
        ?? JSON.parse(route?.params?.gameReviewData?.results?.[0]?.object)
          ?.gameReview;
      setReviewsData({ ...reviewObj });
    }
  }, [route?.params?.gameReviewData?.results]);

  useEffect(() => {
    const obj = { ...reviewsData };
    if (route?.params?.selectedImageList) {
      obj.attachments = route?.params?.selectedImageList;
      setReviewsData(obj);
    }
    if (route?.params?.searchText?.length >= 0) {
      obj.comment = route?.params?.searchText ?? '';
      setReviewsData(obj);
    }
    if (route?.params?.entityTags) {
      console.table(route?.params?.entityTags);

      obj.tagged = route?.params?.entityTags;
      setReviewsData(obj);
    }
    if (route?.params?.format_tagged_data) {
      obj.format_tagged_data = route?.params?.format_tagged_data;
      setReviewsData(obj);
    }
  }, [
    route?.params?.selectedImageList,
    route?.params?.searchText,
    route?.params?.entityTags,
    route?.params?.format_tagged_data,
  ]);

  useEffect(() => {
    setStarAttributes([...route?.params?.starAttributes]);

    // console.log('Edit review Data::=>', JSON.stringify(route?.params?.gameReviewData?.results));
    if (!route?.params?.gameReviewData) {
      loadStarAttributes(route?.params?.starAttributes || []);
    }
  }, [route?.params?.gameReviewData, route?.params?.starAttributes]);

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

  const loadStarAttributes = (attributes) => {
    setLoading(true);
    const attr = {};
    attributes.map((item) => {
      attr[item.name] = 0;
      return true;
    });
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };
    setReviewsData({ ...reviews });
    setLoading(false);
  };

  const isValidReview = () => {
    const exceptKey = [
      'player_id',
      'comment',
      'attachments',
      'tagged',
      'format_tagged_data',
      'created_at',
      'member',
      'review_id',
      'reviewer_id',
    ];

    if (!route?.params?.isRefereeAvailable) {
      exceptKey.push('respectforreferre');
    }
    console.log(route?.params?.isRefereeAvailable);
    console.log(exceptKey);

    let isValid = true;
    const review = _.cloneDeep(reviewsData);
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

    if (currentForm === 1) {
      if (isValidReview()) {
        uploadMediaForTeamA();
      } else {
        Alert.alert('Please, complete all ratings before moving to the next.');
      }
    } else if (currentForm === 2) {
      if (isValidReview()) {
        uploadMediaForTeamB();
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
  };
  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? completed + 1 : total);
  };

  const cancelRequest = (axiosTokenSource) => {
    setCancelApiRequest({ ...axiosTokenSource });
  };

  const patchOrAddReview = () => {
    if (route?.params?.gameReviewData) {
      setLoading(true);
      const teamReview = reviewsData;
      delete teamReview.created_at;
      delete teamReview.entity_type;
      const team1ID = teamReview.entity_id;
      delete teamReview.entity_id;
      teamReview.player_id = team1ID;
      delete teamReview.game_id;
      const reviewID = teamReview.review_id;
      delete teamReview.review_id;
      delete teamReview.reviewer_id;
      delete teamReview.sport;

      const reviewObj = {
        ...teamReview,
      };

      console.log('Edited Review Object::=>', reviewObj);
      console.log(
        `Home userID or teamID:=> ${
          route?.params?.gameData?.home_team?.user_id
          ?? route?.params?.gameData?.home_team?.group_id
        } home username:=> ${route?.params?.gameData?.home_team?.full_name}`,
      );
      console.log(
        `away userID or TeamID:=> ${
          route?.params?.gameData?.away_team?.user_id
          ?? route?.params?.gameData?.away_team?.group_id
        } away username:=> ${route?.params?.gameData?.away_team?.full_name}`,
      );

      patchPlayerReview(
        currentForm === 1
          ? route?.params?.gameData?.home_team?.user_id
              ?? route?.params?.gameData?.home_team?.group_id
          : route?.params?.gameData?.away_team?.user_id
              ?? route?.params?.gameData?.away_team?.group_id,
        route?.params?.gameData?.game_id,
        reviewID,
        reviewObj,
        authContext,
      )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(
            () => Alert.alert(strings.alertmessagetitle, error?.message),
            100,
          );
          navigation.goBack();
        });
    }
      console.log('New Review Object::=>', reviewsData);
      console.log(
        `Home userID:=> ${route?.params?.gameData?.home_team?.user_id} home username:=> ${route?.params?.gameData?.home_team?.full_name}`,
      );
      console.log(
        `away userID:=> ${route?.params?.gameData?.away_team?.user_id} away username:=> ${route?.params?.gameData?.away_team?.full_name}`,
      );
      setLoading(true);
      addPlayerReview(
        currentForm === 1
          ? route?.params?.gameData?.home_team?.user_id
          : route?.params?.gameData?.away_team?.user_id,
        route?.params?.gameData?.game_id,
        reviewsData,
        authContext,
      )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(
            () => Alert.alert(strings.alertmessagetitle, error?.message),
            100,
          );
          navigation.goBack();
        });
  };

  const patchOrAddReviewTeam = () => {
    if (route?.params?.gameReviewData) {
      setLoading(true);
      const teamReview = reviewsData;
      delete teamReview.created_at;
      delete teamReview.entity_type;
      const team1ID = teamReview.entity_id;
      delete teamReview.entity_id;
      teamReview.team_id = team1ID;
      delete teamReview.game_id;
      const reviewID = teamReview.review_id;
      delete teamReview.review_id;
      delete teamReview.reviewer_id;
      delete teamReview.sport;

      const reviewObj = {
        ...teamReview,
      };

      console.log('Edited Review Object::=>', reviewObj);
      patchGameReview(
        route?.params?.gameData?.game_id,
        reviewID,
        reviewObj,
        authContext,
      )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          console.log('strings.alertmessagetitle, error?.message', strings.alertmessagetitle, error?.message);
          setTimeout(
            () => Alert.alert(strings.alertmessagetitle, error?.message),
            100,
          );
          navigation.goBack();
        });
    } else {
      console.log('New Review Object::=>', reviewsData);

      setLoading(true);
      addGameReview(route?.params?.gameData?.game_id, reviewsData, authContext)
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(
            () => Alert.alert(strings.alertmessagetitle, error?.message),
            100,
          );
          navigation.goBack();
        });
    }
  };

  const uploadMediaForTeamA = () => {
    setLoading(false); // CHANGED

    if (reviewsData?.attachments?.length > 0) {
      console.log('Player A-1');

      const { onPressReviewDone } = route?.params;
      onPressReviewDone(
        currentForm,
        !!route?.params?.gameReviewData,
        reviewsData,
      );
      navigation.goBack()
    } else if (reviewsData?.team_id) {
      console.log('Player A-2');

        patchOrAddReviewTeam();
      } else {
        console.log('Player A-3');

        patchOrAddReview();
       }
  };
  const uploadMediaForTeamB = () => {
    setLoading(false); // CHANGED
    console.log('Player B');

    if (reviewsData?.attachments?.length > 0) {
      const { onPressReviewDone } = route?.params;

      onPressReviewDone(
        currentForm,
        !!route?.params?.gameReviewData,
        reviewsData,
      );
      navigation.goBack()
    } else if (reviewsData?.team_id) {
      patchOrAddReviewTeam();
    } else {
      patchOrAddReview();
    }
  };
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
              reviewAttributes={starAttributes}
              starColor={STAR_COLOR.YELLOW}
              teamData={route?.params?.gameData?.home_team}
              setTeamReview={setTeamReview}
              navigation={navigation}
              route={route}
              isRefereeAvailable={route?.params?.isRefereeAvailable}
              tags={reviewsData?.tagged || route?.params?.entityTags}
            />
          ) : (
            <UserReview
              teamNo={1}
              reviewsData={reviewsData}
              starColor={STAR_COLOR.BLUE}
              teamData={route?.params?.gameData?.away_team}
              reviewAttributes={starAttributes}
              setTeamReview={setTeamReview}
              navigation={navigation}
              route={route}
              isRefereeAvailable={route?.params?.isRefereeAvailable}
              tags={
                route?.params?.format_tagged_data
                || reviewsData?.format_tagged_data
              }
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
