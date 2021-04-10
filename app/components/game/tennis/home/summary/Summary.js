import React, {
 useContext, useEffect, useMemo, useState, useCallback,
 } from 'react';
import {
 View, StyleSheet, Text, Alert,
} from 'react-native';
import moment from 'moment';

import { heightPercentageToDP as hp } from '../../../../../utils';
import MatchRecords from './MatchRecords';
import SpecialRules from './SpecialRules';
import Referees from '../../../common/summary/Referees';
import Scorekeepers from '../../../common/summary/Scorekeepers';
import TCGradientButton from '../../../../TCGradientButton';
import colors from '../../../../../Constants/Colors';
// import FeedsScreen from '../../../../../screens/newsfeeds/FeedsScreen';

import {
  checkReviewExpired,
  getGameDateTimeInDHMformat,
  REVIEW_EXPIRY_DAYS,
} from '../../../../../utils/gameUtils';
import fonts from '../../../../../Constants/Fonts';
import TCInnerLoader from '../../../../TCInnerLoader';
import AuthContext from '../../../../../auth/context';
import TennisScoreView from '../../TennisScoreView';
import GameFeed from '../../../common/summary/GameFeed';
import { getGameReview } from '../../../../../api/Games';

// import GameStatus from '../../../../../Constants/GameStatus';

const Summary = ({
  gameData,
  isAdmin,
  isRefereeAdmin,
  userRole,
  navigation,
  followTennisUser,
  unFollowTennisUser,
  getGameMatchRecords,
  getSportsList,
  getRefereeReservation,
  getScorekeeperReservation,
  createGamePostData,
  getGameFeedData,
  gameFeedFlatListRef,
  getGameNextFeedData,
}) => {
  console.log('Tennis GameDATA:=>', gameData);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, setStarAttributes] = useState([]);
  useEffect(() => {
    setLoading(true);
    getSportsList(authContext)
      .then((sports) => {
        const sportData = sports?.payload?.length
          && sports?.payload?.filter(
            (item) => item.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase(),
          )[0];
        const teamReviewProp = sportData?.team_review_properties ?? [];
        console.log('Sports Dat:=>', sportData);
        const sliderReviewProp = [];
        const starReviewProp = [];
        if (teamReviewProp?.length) {
          teamReviewProp.filter((item) => {
            if (item.type === 'slider') { sliderReviewProp.push(item?.name.toLowerCase()); } else if (item.type === 'star') { starReviewProp.push(item?.name.toLowerCase()); }
            return true;
          });
          setSliderAttributes([...sliderReviewProp]);
          setStarAttributes([...starReviewProp]);
        }
      })
      .finally(() => setLoading(false));
  }, [authContext, gameData?.sport, getSportsList]);

  const getGameReviewsData = useCallback((reviewID) => {
    setLoading(true);
    getGameReview(gameData?.game_id, reviewID, authContext)
      .then((response) => {
        console.log('Edit Review By Review ID Response::=>', response.payload);
        navigation.navigate('LeaveReviewTennis', {
          gameData,
          gameReviewData: response.payload,
          selectedTeam: gameData?.home_team?.user_id === authContext?.entity?.uid ? 'away' : 'home',
          sliderAttributes,
          starAttributes,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
      });
  }, [authContext, gameData, navigation, sliderAttributes, starAttributes]);

  const renderRecordButton = useMemo(
    () => (
      gameData?.status !== 'ended' ? <TCGradientButton
        onPress={() => {
          navigation.navigate('TennisRecording', {
            gameDetail: gameData,
            isAdmin,
          });
        }}
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
      /> : null
    ),
    [gameData, isAdmin, navigation],
  );

  const renderLeaveAReviewButton = useMemo(
    () => (
      <>
        {gameData?.status === 'ended'
          && !checkReviewExpired(gameData?.actual_enddatetime)
          && !isRefereeAdmin && (
            <View style={{ backgroundColor: colors.whiteColor, padding: 10 }}>
              <View>
                <TCGradientButton
                  onPress={() => {
                    if (gameData?.home_review_id) {
                      getGameReviewsData(gameData?.home_review_id);
                  } else if (gameData?.away_review_id) {
                      getGameReviewsData(gameData?.away_review_id);
                  } else {
                      navigation.navigate('LeaveReviewTennis', {
                          gameData,
                          selectedTeam: gameData?.home_team?.user_id === authContext?.entity?.uid ? 'away' : 'home',
                          sliderAttributes,
                          starAttributes,
                      });
                  }
                    // navigation.navigate('LeaveReviewTennis', {
                    //   gameData,
                    //   selectedTeam: gameData?.home_team?.user_id === authContext?.entity?.uid ? 'away' : 'home',
                    //   sliderAttributes,
                    //   starAttributes,
                    // });
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
        {gameData?.status === 'ended' && !isRefereeAdmin && (
          <View
            style={{
              marginBottom: hp(1),
              backgroundColor: colors.whiteColor,
              marginLeft: 10,
            }}>
            {!checkReviewExpired(gameData?.actual_enddatetime) ? (
              <Text style={styles.reviewPeriod}>
                The review period will be expired within
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
      </>
    ),
    [gameData, isRefereeAdmin, navigation, sliderAttributes, starAttributes],
  );

  const renderTopButtons = useMemo(
    () => (isAdmin || isRefereeAdmin) && (
      <View
          style={{
            marginBottom: hp(1),
            backgroundColor: colors.whiteColor,
            padding: 10,
          }}>
        {renderRecordButton}
        {renderLeaveAReviewButton}
      </View>
      ),
    [isAdmin, isRefereeAdmin, renderLeaveAReviewButton, renderRecordButton],
  );

  const renderScoresSection = useMemo(
    () => (
      <View
        style={{
          backgroundColor: colors.whiteColor,
          padding: 10,
          marginBottom: hp(1),
        }}>
        <Text style={styles.title}>Scores</Text>
        <TennisScoreView scoreDataSource={gameData} />
      </View>
    ),
    [gameData],
  );

  const renderMatchRecordsSection = useMemo(
    () => (
      <MatchRecords
        isAdmin={isAdmin}
        navigation={navigation}
        gameId={gameData?.game_id}
        gameData={gameData}
        getGameMatchRecords={getGameMatchRecords}
      />
    ),
    [gameData, getGameMatchRecords, isAdmin, navigation],
  );

  const renderSpecialRulesSection = useMemo(
    () => (
      <SpecialRules
        specialRulesData={gameData?.special_rule ?? ''}
        isAdmin={isAdmin}
      />
    ),
    [gameData?.special_rule, isAdmin],
  );

  const renderRefereesSection = useMemo(
    () => (
      <Referees
        getRefereeReservation={getRefereeReservation}
        navigation={navigation}
        gameData={gameData}
        isAdmin={isAdmin}
        userRole={userRole}
        followUser={followTennisUser}
        unFollowUser={unFollowTennisUser}
      />
    ),
    [
      followTennisUser,
      gameData,
      getRefereeReservation,
      isAdmin,
      navigation,
      unFollowTennisUser,
      userRole,
    ],
  );

  const renderScorekeepersSection = useMemo(
    () => (
      <Scorekeepers
        getScorekeeperReservation={getScorekeeperReservation}
        followUser={followTennisUser}
        unFollowUser={unFollowTennisUser}
        isAdmin={isAdmin}
        userRole={userRole}
        navigation={navigation}
        gameData={gameData}
      />
    ),
    [
      followTennisUser,
      gameData,
      getScorekeeperReservation,
      isAdmin,
      navigation,
      unFollowTennisUser,
      userRole,
    ],
  );

  const renderGameFeedSection = useMemo(
    () => (
      <GameFeed
        getGameNextFeedData={getGameNextFeedData}
        gameFeedRefs={gameFeedFlatListRef}
        createGamePostData={createGamePostData}
        gameData={gameData}
        getGameFeedData={getGameFeedData}
        navigation={navigation}
        currentUserData={authContext?.entity?.obj}
        userID={authContext?.entity?.uid}
      />
    ),
    [
      authContext?.entity?.obj,
      authContext?.entity?.uid,
      createGamePostData,
      gameData,
      gameFeedFlatListRef,
      getGameFeedData,
      getGameNextFeedData,
      navigation,
    ],
  );

  return (
    <View style={styles.mainContainer}>
      <TCInnerLoader visible={loading} />
      {renderTopButtons}
      {renderScoresSection}
      {renderMatchRecordsSection}
      {renderSpecialRulesSection}
      {renderRefereesSection}
      {renderScorekeepersSection}
      {renderGameFeedSection}
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
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
});
export default Summary;
