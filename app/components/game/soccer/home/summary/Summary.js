/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable react/jsx-indent */
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import {
  View, StyleSheet, Text, Alert,
} from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import { getGameReview } from '../../../../../api/Games';
import { heightPercentageToDP as hp } from '../../../../../utils';
import MatchRecords from './MatchRecords';
import SpecialRules from './SpecialRules';
import AuthContext from '../../../../../auth/context';

import Referees from '../../../common/summary/Referees';
import Scorekeepers from '../../../common/summary/Scorekeepers';
import TCGradientButton from '../../../../TCGradientButton';
import colors from '../../../../../Constants/Colors';
import ApproveDisapprove from './approveDisapprove/ApproveDisapprove';
// import FeedsScreen from '../../../../../screens/newsfeeds/FeedsScreen';
import TCInnerLoader from '../../../../TCInnerLoader';
import {
  checkReviewExpired,
  getGameDateTimeInDHMformat,
  REVIEW_EXPIRY_DAYS,
} from '../../../../../utils/gameUtils';
import fonts from '../../../../../Constants/Fonts';
import strings from '../../../../../Constants/String';
import GameFeed from '../../../common/summary/GameFeed';

const Summary = ({
  gameData,
  isAdmin,
  isRefereeAdmin,
  userRole,
  navigation,
  followSoccerUser,
  unFollowSoccerUser,
  approveDisapproveGameScore,
  getGameData,
  getGameMatchRecords,
  getSportsList,
  getRefereeReservation,
  getScorekeeperReservation,
  getGameFeedData,
  createGamePostData,
  setUploadImageProgressData,
}) => {
  const authContext = useContext(AuthContext);
  const reviewOpetions = useRef();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
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
    if (isFocused && gameData) {
      console.log('Game Data:=>', gameData);
      setLoading(true);
      getSportsList()
        .then((sports) => {
          const soccerSportData = sports?.payload?.length
            && sports?.payload?.filter(
              (item) => item.sport_name?.toLowerCase()
                === gameData?.sport?.toLowerCase(),
            )[0];

          console.log('soccerSportData', soccerSportData);
          const teamReviewProp = soccerSportData?.team_review_properties ?? [];
          const playerReviewProp = soccerSportData?.player_review_properties ?? [];
          const refereeReviewProp = soccerSportData?.referee_review_properties ?? [];
          const sliderReviewProp = [];
          const starReviewProp = [];
          const sliderReviewPropForPlayer = [];
          const starReviewPropForPlayer = [];
          const sliderReviewPropForReferee = [];
          const starReviewPropForReferee = [];

          if (teamReviewProp?.length) {
            teamReviewProp.filter((item) => {
              if (item.type === 'slider') { sliderReviewProp.push(item?.name.toLowerCase()); } else if (item.type === 'star') { starReviewProp.push(item?.name.toLowerCase()); }
              return true;
            });
            setSliderAttributes([...sliderReviewProp]);
            setStarAttributes([...starReviewProp]);
          }
          if (playerReviewProp?.length) {
            playerReviewProp.filter((item) => {
              if (item.type === 'slider') { sliderReviewPropForPlayer.push(item?.name.toLowerCase()); } else if (item.type === 'star') { starReviewPropForPlayer.push(item?.name.toLowerCase()); }
              return true;
            });
            setSliderAttributesForPlayer([...sliderReviewPropForPlayer]);
            setStarAttributesForPlayer([...starReviewPropForPlayer]);
          }
          if (refereeReviewProp?.length) {
            refereeReviewProp.filter((item) => {
              if (item.type === 'topstar') { sliderReviewPropForReferee.push(item?.name.toLowerCase()); } else if (item.type === 'star') { starReviewPropForReferee.push(item?.name.toLowerCase()); }
              return true;
            });
            setSliderAttributesForReferee([...sliderReviewPropForReferee]);
            setStarAttributesForReferee([...starReviewPropForReferee]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [gameData, isFocused]);

  const getRefereeReviewsData = (item) => {
    setLoading(true)
    getGameReview(gameData?.game_id, gameData?.review_id, authContext).then((response) => {
      navigation.navigate('RefereeReviewScreen', {
        gameReviewData: response.payload, gameData, userData: item, sliderAttributesForReferee, starAttributesForReferee,
      })
      setLoading(false)
    }).catch((error) => {
      setLoading(false);
      setTimeout(() => Alert.alert('TownsCup', error?.message), 100)
    })
  }

  const getGameReviewsData = () => {
    setLoading(true)
    getGameReview(gameData?.game_id, gameData?.review_id, authContext).then((response) => {
      navigation.navigate('LeaveReview', {
        gameData,
        gameReviewData: response.payload,
        sliderAttributes,
        starAttributes,
      });
      setLoading(false)
    }).catch((error) => {
      setLoading(false);
      setTimeout(() => Alert.alert('TownsCup', error?.message), 100)
    })
  }
  return (
    <View style={styles.mainContainer}>
      <TCInnerLoader visible={loading} />

      <View
        style={{
          marginBottom: hp(1),
          backgroundColor: colors.whiteColor,
          padding: 10,
        }}>
        {(isAdmin || isRefereeAdmin) && (
          <TCGradientButton
            onPress={() => navigation.navigate('SoccerRecording', { gameId: gameData.game_id })
            }
            startGradientColor={colors.yellowColor}
            endGradientColor={colors.themeColor}
            title={'RECORD MATCH'}
            style={{
              borderRadius: 5,
            }}
            outerContainerStyle={{
              marginHorizontal: 5,
              marginTop: 5,
              marginBottom: 0,
            }}
          />
        )}

        {!loading
          && gameData?.status === 'ended'
          && !checkReviewExpired(gameData?.actual_enddatetime)
          && !isAdmin && (
            <View style={{ backgroundColor: colors.whiteColor, marginTop: 5 }}>
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

        {!loading && gameData?.status === 'ended' && !isAdmin && (
          <View
            style={{
              marginBottom: hp(1),
              backgroundColor: colors.whiteColor,
              marginLeft: 10,
            }}>
            {!checkReviewExpired(gameData?.actual_enddatetime) ? (
              <Text style={styles.reviewPeriod}>
                The review period will be expired within{' '}
                <Text style={{ fontFamily: fonts.RBold }}>
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
                <Text style={{ fontFamily: fonts.RBold }}>expired</Text>
              </Text>
            )}
          </View>
        )}
      </View>

      {gameData?.status === 'ended' && isAdmin && (
        <ApproveDisapprove
          getGameData={getGameData}
          navigation={navigation}
          gameId={gameData?.game_id}
          gameData={gameData}
          approveDisapproveGameScore={approveDisapproveGameScore}
        />
      )}
      <MatchRecords
        navigation={navigation}
        isAdmin={isAdmin}
        gameId={gameData?.game_id}
        gameData={gameData}
        getGameMatchRecords={getGameMatchRecords}
      />
      <SpecialRules
        specialRulesData={gameData?.special_rule ?? ''}
        isAdmin={isAdmin}
      />

      <Referees
        getRefereeReservation={getRefereeReservation}
        gameData={gameData}
        navigation={navigation}
        isAdmin={isAdmin}
        userRole={userRole}
        followUser={followSoccerUser}
        unFollowUser={unFollowSoccerUser}
        onReviewPress={(referee) => {
          // navigation.navigate('ReviewRefereeList', {
          //   gameData,
          //   sliderAttributesForReferee,
          //   starAttributesForReferee,
          // });
          if (referee?.review_id) {
            getRefereeReviewsData(referee)
          }
          navigation.navigate('RefereeReviewScreen', {
            gameData,
            userData: referee,
            sliderAttributesForReferee,
            starAttributesForReferee,
          })
          console.log('Referee data::=>', referee);
        }}
      />
      <Scorekeepers
        getScorekeeperReservation={getScorekeeperReservation}
        followUser={followSoccerUser}
        unFollowUser={unFollowSoccerUser}
        gameData={gameData}
        navigation={navigation}
        isAdmin={isAdmin}
        userRole={userRole}
      />

      {/* Game Feed */}
      <GameFeed
          setUploadImageProgressData={setUploadImageProgressData}
          createGamePostData={createGamePostData}
          gameData={gameData}
          getGameFeedData={getGameFeedData}
          navigation={navigation}
          currentUserData={authContext?.entity?.obj}
          userID={authContext?.entity?.uid}
      />

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
          console.log('Sections:=>', sections);
          if (index === 0) {
            console.log('gameData?.review_id:=>', gameData?.review_id);
            if (gameData?.review_id) {
              getGameReviewsData()
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
    backgroundColor: colors.grayBackgroundColor,
  },
  reviewPeriod: {
    marginHorizontal: 5,
    fontSize: 16,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
});
export default Summary;
