/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
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
import TeamReview from '../../../../../components/game/soccer/home/review/leaveReview/TeamReview';
import {STAR_COLOR} from '../../../../../utils';
import {addGameReview, patchGameReview} from '../../../../../api/Games';
import TCInnerLoader from '../../../../../components/TCInnerLoader';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import Header from '../../../../../components/Home/Header';
import AuthContext from '../../../../../auth/context';
import strings from '../../../../../Constants/String';
import uploadImages from '../../../../../utils/imageAction';
import ActivityLoader from '../../../../../components/loader/ActivityLoader';

const LeaveReview = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  console.log('route?.params?.selectedTeam', route?.params?.selectedTeam);
  const [currentForm, setCurrentForm] = useState(
    route?.params?.selectedTeam === 'home' ? 1 : 2,
  );
  const [loading, setLoading] = useState(false);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, setStarAttributes] = useState([]);
  const [gameData] = useState(route?.params?.gameData);
  const [onPressReview] = useState(
    route?.params?.onPressReviewDone
      ? () => route?.params?.onPressReviewDone
      : () => {},
  );
  const [reviewsData, setReviewsData] = useState(
    currentForm === 1
      ? {
          team_id: gameData?.home_team?.group_id,
          comment: '',
          attachments: [],
          tagged: [],
        }
      : {
          team_id: gameData?.away_team?.group_id,
          comment: '',
          attachments: [],
          tagged: [],
        },
  );
  useEffect(() => {
    console.log(
      'route?.params?.gameReviewData?.results[0]?.object',
      route?.params?.gameReviewData,
    );
    if (route?.params?.gameReviewData) {
      // const reviewObj = JSON.parse(
      //   route?.params?.gameReviewData?.results?.[0]?.object,
      // )?.gameReview;
      const reviewObj = route?.params?.gameReviewData;
      setReviewsData({...reviewObj});
    }
  }, [route?.params?.gameReviewData]);

  useEffect(() => {
    const obj = {...reviewsData};
    if (route?.params?.selectedImageList) {
      obj.attachments = route?.params?.selectedImageList;
      setReviewsData(obj);
    }
    if (route?.params?.searchText?.length >= 0) {
      obj.comment = route?.params?.searchText ?? '';
      setReviewsData(obj);
    }
    if (route?.params?.entityTags) {
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
    setSliderAttributes([...route?.params?.sliderAttributes]);
    setStarAttributes([...route?.params?.starAttributes]);

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
          onPress={() =>
            currentForm === 1 ? navigation.goBack() : setCurrentForm(1)
          }
        >
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
    reviews = {...reviews, ...attr};
    setReviewsData({...reviews});
    setLoading(false);
  };

  const loadStarAttributes = (attributes) => {
    setLoading(true);
    const attr = {};
    attributes.map((item) => {
      attr[item.name] = 0;
      return true;
    });
    let reviews = _.cloneDeep(reviewsData);
    reviews = {...reviews, ...attr};
    setReviewsData({...reviews});
    setLoading(false);
  };

  // const isValidReview = (teamNo) => {
  //   const exceptKey = [
  //     'team_id',
  //     'comment',
  //     'attachments',
  //     'tagged',
  //     'format_tagged_data',
  //     'created_at',
  //     'member',
  //     'review_id',
  //     'reviewer_id',
  //   ];
  //   let isValid = true;
  //   const reviews = _.cloneDeep(reviewsData);
  //   const review = reviews;
  //   Object.keys(review).map((key) => {
  //     if (!exceptKey.includes(key) && isValid && Number(review?.[key]) <= 0) {
  //       isValid = false;
  //     }
  //     return key;
  //   });
  //   return isValid;
  // };

  const isValidReview = () => {
    const starKeys = [];
    starAttributes?.map((star) => {
      starKeys.push(star?.name);
    });
    const includeKey = [...starKeys, ...sliderAttributes];
    let isValid = true;
    const reviews = _.cloneDeep(reviewsData);
    Object.keys(reviews).map((key) => {
      if (includeKey.includes(key) && isValid) {
        if (Number(reviews?.[key]) <= 0) {
          isValid = false;
        }
      }
      return key;
    });
    return isValid;
  };

  const createReview = () => {
    console.log('Review Data::=>', JSON.stringify(reviewsData));
    console.log('currentForm', currentForm);

    if (isValidReview(currentForm)) {
      uploadMediaForTeam();
    } else {
      Alert.alert('Please, complete all ratings before moving to the next.');
    }
  };

  const patchOrAddReview = () => {
    console.log('patch called...');

    if (reviewsData !== {}) {
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
      patchGameReview(gameData?.game_id, reviewID, reviewObj, authContext)
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
    } else {
      console.log('New Review Object::=>', reviewsData);
      setLoading(true);
      addGameReview(gameData?.game_id, reviewsData, authContext)
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
  const uploadMediaForTeam = () => {
    onPressReview(
      currentForm,
      currentForm === 1
        ? !!gameData?.home_review_id
        : !!gameData?.away_review_id,
      reviewsData,
    );
    navigation.goBack();
  };

  const setTeamReview = (teamNo = 0, key = '', value = '') => {
    console.log(`key::${key}value::${value}`);
    if (reviewsData[key] !== value) {
      const reviews = _.cloneDeep(reviewsData);
      reviews[key] = value;
      setReviewsData({...reviews});
    }
  };

  console.log('currentFormcurrentForm', currentForm);
  return (
    <View style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() =>
              currentForm === 1 ? navigation.goBack() : navigation.pop(1)
            }
          >
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
            <TeamReview
              teamNo={0}
              reviewsData={reviewsData}
              reviewAttributes={sliderAttributes}
              starAttributes={starAttributes}
              starColor={STAR_COLOR.YELLOW}
              teamData={gameData?.home_team}
              setTeamReview={setTeamReview}
              navigation={navigation}
              route={route}
              tags={
                route?.params?.format_tagged_data ||
                reviewsData?.format_tagged_data
              }
            />
          ) : (
            <TeamReview
              teamNo={1}
              reviewsData={reviewsData}
              starColor={STAR_COLOR.BLUE}
              teamData={gameData?.away_team}
              reviewAttributes={sliderAttributes}
              starAttributes={starAttributes}
              setTeamReview={setTeamReview}
              navigation={navigation}
              route={route}
              tags={
                route?.params?.format_tagged_data ||
                reviewsData?.format_tagged_data
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

export default LeaveReview;
