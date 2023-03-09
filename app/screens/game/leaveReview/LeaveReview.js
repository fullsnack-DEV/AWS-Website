/* eslint-disable no-nested-ternary */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';

import UserReview from '../../../components/game/tennis/review/leaveReview/UserReview';
import {STAR_COLOR} from '../../../utils';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import styles from '../../../components/game/soccer/home/review/ReviewStyles';

const LeaveReview = ({navigation, route}) => {
  const [currentForm] = useState(
    route.params.selectedTeam === 'home' ? 1 : 2,
  );
  const [loading, setLoading] = useState(false);
  const [starAttributes] = useState(route.params.starAttributes);
  const [isRefereeAvailable] = useState(route.params.isRefereeAvailable);
  const [gameData] = useState(route.params.gameData);
  const [onPressReview] = useState(
    route.params.onPressReviewDone
      ? () => route.params.onPressReviewDone
      : () => {},
  );

  const [reviewsData, setReviewsData] = useState({});

  useEffect(() => {
    const obj = {...reviewsData};
    if (route.params.comment) {
      obj.comment = route.params.comment ?? '';
      setReviewsData(obj);
    }
    else{
      obj.comment = null;
      setReviewsData(obj);
    }

    if (route.params.selectedImageList) {
      obj.attachments = route.params.selectedImageList;
      setReviewsData(obj);
    }
    else{
      obj.attachments = null;
      setReviewsData(obj);
    }
  }, [
    route.params.selectedImageList,
    route.params.comment,
  ]);

  useEffect(() => {
    if (route.params.gameReviewData) {
      const reviewObj = route.params.gameReviewData;
      setReviewsData({...reviewObj});
    }
    else{
      setLoading(true);
      if(reviewsData.length === 0){
        const attr = {};
        starAttributes.map((item) => {
          attr[item.name] = 0;
        });
        setReviewsData({...reviewsData,...attr});
      }
      setLoading(false);
    }
  }, [route.params.gameReviewData]);

  const isValidReview = () => {
    let returnValue = true;
    let isBlankRating = false;
    let isRating = false;
    const keys = {};
    starAttributes.map((item) => {
      if(!(!isRefereeAvailable && item.name === 'respectforreferre')){
        keys[item.name] = 0;
      }
    });
    Object.keys(keys).map((key) => {
      if (reviewsData[key] > 0) {
        isRating = true;
      }
      else{
        isBlankRating = true;
      }
    });

    if(isRating && isBlankRating){
      Alert.alert(strings.completeallrating);
      returnValue = false;
    }
    else if(!isRating && (!reviewsData.comment || reviewsData.comment?.length <= 0)){      
      Alert.alert(strings.reviewvalidation);
      returnValue = false;
    }

    return returnValue;
  };

  const createReview = () => {
    if (isValidReview()) {
      /* eslint-disable  no-unused-expressions */
      currentForm === 1
        ? gameData.home_team.user_id
          ? (reviewsData.player_id = gameData.home_team.user_id)
          : (reviewsData.team_id = gameData.home_team.group_id)
        : gameData.away_team.user_id
        ? (reviewsData.player_id = gameData.away_team.user_id)
        : (reviewsData.team_id = gameData.away_team.group_id);

      // set is_review properties
      if (reviewsData.comment?.length > 0) {
        reviewsData.is_review = 1;
      } else {
        reviewsData.is_review = 0;
      }

      // set is_rating properties
      const keys = {};
      let isRating = false;
      starAttributes.map((item) => {
        if (!(!isRefereeAvailable && item.name === 'respectforreferre')) {
          keys[item.name] = 0;
        }
      });
      Object.keys(keys).map((key) => {
        if (reviewsData[key] > 0) {
          isRating = true;
        }
      });

      if (isRating) {
        reviewsData.is_rating = 1;
      } else {
        reviewsData.is_rating = 0;
      }

      onPressReview(currentForm, currentForm === 1
        ? !!gameData.home_review_id
        : !!gameData.away_review_id, reviewsData);
      navigation.goBack();
    }
  };

  const setReviewRating = (key = '', value = '') => {
    if (reviewsData[key] !== value) {
        reviewsData[key] = value;
      setReviewsData({...reviewsData});
    }
  };

  const removeRatings = () => {
    const keys = {};
    starAttributes.map((item) => {
      keys[item.name] = 0;
    });
    Object.keys(keys).map((key) => {
      reviewsData[key] = 0
    });
    setReviewsData({...reviewsData});
  }

  return (
    <View style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>
            {strings.leavereviewinsmall}
          </Text>
        }
        rightComponent={
          <Text onPress={createReview} style={styles.nextButtonStyle}>
            {strings.done}
          </Text>
        }
      />
      {/* Seperator */}
      <View style={styles.headerSeperator} />
      <ActivityLoader visible={loading} />
      {!loading && (
        <ScrollView>
            <UserReview
              reviewsData={reviewsData}
              reviewAttributes={starAttributes}
              starColor={STAR_COLOR.YELLOW}
              teamData={currentForm === 1
                ? gameData.home_team
                : gameData.away_team}
              setReviewRating={setReviewRating}
              navigation={navigation}
              isRefereeAvailable={isRefereeAvailable}
              removeRatings={removeRatings}
              isPlayer = {gameData.user_challenge}
            />
        </ScrollView>
      )}
    </View>
  );
};

export default LeaveReview;
