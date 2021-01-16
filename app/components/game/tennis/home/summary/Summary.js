import React, { useContext, useEffect, useState } from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import moment from 'moment';

import { heightPercentageToDP as hp } from '../../../../../utils';
import MatchRecords from './MatchRecords';
import SpecialRules from './SpecialRules';
import Referees from './Referees';
import Scorekeepers from './Scorekeepers';
import TCGradientButton from '../../../../TCGradientButton';
import colors from '../../../../../Constants/Colors';
// import FeedsScreen from '../../../../../screens/newsfeeds/FeedsScreen';

import { checkReviewExpired, getGameDateTimeInDHMformat, REVIEW_EXPIRY_DAYS } from '../../../../../utils/gameUtils';
import fonts from '../../../../../Constants/Fonts';
import TCInnerLoader from '../../../../TCInnerLoader';
import AuthContext from '../../../../../context/auth';
import TennisScoreView from '../../TennisScoreView';
// import GameStatus from '../../../../../Constants/GameStatus';

const Summary = ({
  gameData,
  isAdmin,
  userRole,
  navigation,
  followTennisUser,
  unFollowTennisUser,
  getGameMatchRecords,
  getSportsList,
  getRefereeReservation,
  getScorekeeperReservation,
}) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, starStarAttributes] = useState([]);
  useEffect(() => {
    setLoading(true);
    getSportsList(authContext).then((sports) => {
      const sportData = sports?.payload?.length && sports?.payload?.filter((item) => item.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase())[0]
      const teamReviewProp = sportData?.team_review_properties ?? []
      const sliderReviewProp = [];
      const starReviewProp = [];
      if (teamReviewProp?.length) {
        teamReviewProp.filter((item) => {
          if (item.type === 'slider') sliderReviewProp.push(item?.name.toLowerCase())
          else if (item.type === 'star') starReviewProp.push(item?.name.toLowerCase())
          return true;
        })
        setSliderAttributes(sliderReviewProp);
        starStarAttributes(starReviewProp);
      }
    }).finally(() => setLoading(false));
  }, [])
  return (
    <View style={styles.mainContainer}>
      <TCInnerLoader visible={loading}/>
      {isAdmin && (
        <View style={{ marginBottom: hp(1), backgroundColor: colors.whiteColor, padding: 10 }}>
          <TCGradientButton
                  onPress={() => {
                    navigation.navigate('TennisRecording', { gameDetail: gameData })
                  }}
                  startGradientColor={colors.yellowColor}
                  endGradientColor={colors.themeColor}
                  title={'RECORD MATCH'}
                  style={{
                    borderRadius: 5,
                  }}
                  outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
              />

          {/*  Leave Review Section */}
          {gameData?.status === 'ended' && !checkReviewExpired(gameData?.actual_enddatetime) && (
            <View style={{ backgroundColor: colors.whiteColor, padding: 10 }}>
              <View>
                <TCGradientButton
                          onPress={() => {
                            navigation.navigate('LeaveReview',
                              {
                                gameData,
                                sliderAttributes,
                                starAttributes,
                              })
                          }}
                          startGradientColor={colors.yellowColor}
                          endGradientColor={colors.themeColor}
                          title={'LEAVE REVIEW'}
                          style={{
                            borderRadius: 5,
                          }}
                          outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
                      />

              </View>
            </View>
          )}
          {gameData?.status === 'ended' && (
            <View style={{ marginBottom: hp(1), backgroundColor: colors.whiteColor, marginLeft: 10 }}>
              {!checkReviewExpired(gameData?.actual_enddatetime) ? (
                <Text style={styles.reviewPeriod}>
                  The review period will be expired within
                  <Text style={{ fontFamily: fonts.RBold }}>
                    {getGameDateTimeInDHMformat(
                      (moment(gameData?.actual_enddatetime * 1000)
                        .add(REVIEW_EXPIRY_DAYS, 'days')) / 1000,
                    )}
                  </Text>
                </Text>
              ) : (
                <Text style={{
                  ...styles.reviewPeriod,
                  marginVertical: 10,
                }}>
                  The review period is{' '}
                  <Text style={{ fontFamily: fonts.RBold }}>
                    expired
                  </Text>
                </Text>
              )}

            </View>
          )}
        </View>
      )}

      {/* Scores */}
      <View style={{ backgroundColor: colors.whiteColor, padding: 10, marginBottom: hp(1) }}>
        <Text style={styles.title}>
          Scores
        </Text>
        <TennisScoreView scoreDataSource={gameData} />
      </View>

      {/* Match Records */}
      <MatchRecords
            isAdmin={isAdmin}
            navigation={navigation}
            gameId={gameData?.game_id}
            gameData={gameData}
            getGameMatchRecords={getGameMatchRecords}
        />

      {/* Special Rules */}
      <SpecialRules specialRulesData={gameData?.special_rule ?? ''} isAdmin={isAdmin}/>

      {/* Regerees */}
      <Referees
          getRefereeReservation={getRefereeReservation}
          navigation={navigation}
            gameData={gameData}
            isAdmin={isAdmin}
            userRole={userRole}
            followTennisUser={followTennisUser}
            unFollowTennisUser={unFollowTennisUser}
        />

      {/* Scorekeepers */}
      <Scorekeepers
          getScorekeeperReservation={getScorekeeperReservation}
          followTennisUser={followTennisUser}
          unFollowTennisUser={unFollowTennisUser}
          isAdmin={isAdmin}
          userRole={userRole}
          navigation={navigation}
          gameData={gameData}
      />

      {/* Feed Screen */}
      <View style={{ backgroundColor: colors.whiteColor }}>
        {/* <FeedsScreen navigation={navigation}/> */}
      </View>
    </View>
  )
}

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
})
export default Summary;
