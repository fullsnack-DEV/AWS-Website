/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
import React, {Fragment, useEffect, useState, useContext, useRef} from 'react';
import {Text, StyleSheet, View, Alert} from 'react-native';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import fonts from '../../../../../Constants/Fonts';
import RatingForTeams from './RatingForTeams';
import colors from '../../../../../Constants/Colors';
import {getGameReview} from '../../../../../api/Games';
import RatingForReferees from './RatingForReferees';
import ReviewsList from './ReviewsList';
import TCGradientButton from '../../../../TCGradientButton';
import {heightPercentageToDP as hp} from '../../../../../utils';
import TCInnerLoader from '../../../../TCInnerLoader';
import AuthContext from '../../../../../auth/context';
import {
  checkReviewExpired,
  getGameDateTimeInDHMformat,
  REVIEW_EXPIRY_DAYS,
} from '../../../../../utils/gameUtils';

import {strings} from '../../../../../../Localization/translation';

const Review = ({navigation, gameData, isAdmin, getSoccerGameReview}) => {
  const isFocused = useIsFocused();
  const reviewOpetions = useRef();

  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState([]);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, setStarAttributes] = useState([]);
  const [sliderAttributesForPlayer, setSliderAttributesForPlayer] = useState(
    [],
  );
  const [starAttributesForPlayer, setStarAttributesForPlayer] = useState([]);

  const [sliderAttributesForReferee, setSliderAttributesForReferee] = useState(
    [],
  );
  const [starAttributesForReferee, setStarAttributesForReferee] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getSoccerGameReview(gameData?.game_id)
        .then((res) => {
          setReviewsData({...res.payload});
        })
        .catch((error) => {
          console.log(error);
        });

      const soccerSportData =
        authContext?.sports?.length &&
        authContext?.sports?.filter(
          (item) => item.sport === gameData?.sport,
        )[0];
      const teamReviewProp = soccerSportData?.team_review_properties ?? [];
      const playerReviewProp = soccerSportData?.player_review_properties ?? [];
      const refereeReviewProp =
        soccerSportData?.referee_review_properties ?? [];
      const sliderReviewProp = [];
      const starReviewProp = [];
      const sliderReviewPropForPlayer = [];
      const starReviewPropForPlayer = [];
      const sliderReviewPropForReferee = [];
      const starReviewPropForReferee = [];
      if (teamReviewProp?.length) {
        teamReviewProp.filter((item) => {
          if (item.type === 'slider')
            sliderReviewProp.push(item?.name.toLowerCase());
          else if (item.type === 'star')
            starReviewProp.push(item?.name.toLowerCase());
          return true;
        });
        setSliderAttributes([...sliderReviewProp]);
        setStarAttributes([...starReviewProp]);
      }
      if (playerReviewProp?.length) {
        playerReviewProp.filter((item) => {
          if (item.type === 'slider') {
            sliderReviewPropForPlayer.push(item?.name.toLowerCase());
          } else if (item.type === 'star') {
            starReviewPropForPlayer.push(item?.name.toLowerCase());
          }
          return true;
        });
        setSliderAttributesForPlayer([...sliderReviewPropForPlayer]);
        setStarAttributesForPlayer([...starReviewPropForPlayer]);
      }
      if (refereeReviewProp?.length) {
        refereeReviewProp.filter((item) => {
          if (item.type === 'topstar') {
            sliderReviewPropForReferee.push(item?.name.toLowerCase());
          } else if (item.type === 'star') {
            starReviewPropForReferee.push(item?.name.toLowerCase());
          }
          return true;
        });
        setSliderAttributesForReferee([...sliderReviewPropForReferee]);
        setStarAttributesForReferee([...starReviewPropForReferee]);
      }
    }
  }, [isFocused]);

  const Seperator = () => <View style={styles.separator} />;
  const getGameReviewsData = () => {
    setLoading(true);
    getGameReview(gameData?.game_id, gameData?.review_id, authContext)
      .then((response) => {
        navigation.navigate('LeaveReview', {
          gameData,
          gameReviewData: response.payload,
          sliderAttributes,
          starAttributes,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
      });
  };
  return (
    <View style={styles.mainContainer}>
      {/*  Leave Review Section */}
      {gameData?.status === 'ended' &&
        !checkReviewExpired(gameData?.actual_enddatetime) &&
        !isAdmin && (
          <View style={{backgroundColor: colors.whiteColor, padding: 10}}>
            <View>
              <TCGradientButton
                onPress={() => {
                  reviewOpetions.current.show();
                }}
                startGradientColor={colors.yellowColor}
                endGradientColor={colors.themeColor}
                title={'LEAVE REVIEW'}
                style={{
                  borderRadius: 5,
                }}
                outerContainerStyle={{
                  marginHorizontal: 5,
                  marginTop: 5,
                  marginBottom: 0,
                }}
              />
            </View>
          </View>
        )}
      {gameData?.status === 'ended' && !isAdmin && (
        <View
          style={{
            marginBottom: hp(1),
            backgroundColor: colors.whiteColor,
            marginLeft: 10,
          }}>
          {!checkReviewExpired(gameData?.actual_enddatetime) ? (
            <Text style={styles.reviewPeriod}>
              The review period will be expired within{' '}
              <Text style={{fontFamily: fonts.RBold}}>
                {getGameDateTimeInDHMformat(
                  moment(gameData?.actual_enddatetime * 1000).add(
                    REVIEW_EXPIRY_DAYS,
                    'days',
                  ) / 1000,
                )}
              </Text>
            </Text>
          ) : (
            <Text
              style={{
                ...styles.reviewPeriod,
                marginVertical: 10,
              }}>
              The review period is{' '}
              <Text style={{fontFamily: fonts.RBold}}>expired</Text>
            </Text>
          )}
        </View>
      )}
      {!isAdmin && <Seperator />}

      <TCInnerLoader visible={loading} size={50} />
      {!loading && (
        <Fragment>
          {/* Rating For Team Section */}
          <RatingForTeams
            sliderAttributes={sliderAttributes}
            starAttributes={starAttributes}
            gameData={gameData}
            reviewsData={reviewsData}
          />
          <Seperator />

          {/* Rating For Referees Section */}
          <RatingForReferees refreeData={gameData?.referees ?? []} />
          <Seperator />

          {/* Review List Section */}
          <ReviewsList gameData={gameData} />
          <Seperator />
        </Fragment>
      )}
      <ActionSheet
        ref={reviewOpetions}
        options={
          gameData?.review_id
            ? [
                strings.editReviewForTeams,
                // strings.reviewForPlayers,
                strings.reviewForReferees,
                strings.cancel,
              ]
            : [
                strings.reviewForTeams,
                // strings.reviewForPlayers,
                strings.reviewForReferees,
                strings.cancel,
              ]
        }
        cancelButtonIndex={2}
        onPress={(index, sections) => {
          if (index === 0) {
            if (gameData?.review_id) {
              getGameReviewsData();
            } else {
              navigation.navigate('LeaveReview', {
                gameData,
                sliderAttributes,
                starAttributes,
              });
            }
          }
          // else if (index === 1) {
          //   navigation.navigate('ReviewPlayerList', {
          //     gameData,
          //     sliderAttributesForPlayer,
          //     starAttributesForPlayer,
          //   });
          // }
          else if (index === 1) {
            navigation.navigate('ReviewRefereeList', {
              gameData,
              sliderAttributesForReferee,
              starAttributesForReferee,
            });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  separator: {
    flex: 1,
    height: 5,
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
  },
  reviewPeriod: {
    marginHorizontal: 5,
    fontSize: 16,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
});
export default Review;
