import React, { useEffect, useState } from 'react';
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
import ApproveDisapprove from './approveDisapprove/ApproveDisapprove';
import FeedsScreen from '../../../../../screens/newsfeeds/FeedsScreen';
import TCInnerLoader from '../../../../TCInnerLoader';
import { checkReviewExpired, getGameDateTimeInDHMformat, REVIEW_EXPIRY_DAYS } from '../../../../../utils/gameUtils';
import fonts from '../../../../../Constants/Fonts';

const Summary = ({
  gameData,
  isAdmin,
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
}) => {
  const [loading, setLoading] = useState(true);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, starStarAttributes] = useState([]);
  useEffect(() => {
    setLoading(true);
    getSportsList().then((sports) => {
      const soccerSportData = sports?.payload?.length && sports?.payload?.filter((item) => item.sport_name === gameData?.sport)[0]
      const teamReviewProp = soccerSportData?.team_review_properties ?? []
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
          onPress={() => navigation.navigate('SoccerRecording')}
              startGradientColor={colors.yellowColor}
              endGradientColor={colors.themeColor}
              title={'RECORD MATCH'}
              style={{
                borderRadius: 5,
              }}
              outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
          />
          {!loading && gameData?.status === 'ended' && !checkReviewExpired(gameData?.actual_enddatetime) && (
            <View style={{ backgroundColor: colors.whiteColor, marginTop: 5 }}>
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

          {!loading && gameData?.status === 'ended' && (
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
      {gameData?.status === 'ended' && (
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
      gameId={gameData?.game_id}
      gameData={gameData}
      getGameMatchRecords={getGameMatchRecords}
  />
      <SpecialRules specialRulesData={gameData?.special_rule ?? ''} isAdmin={isAdmin}/>

      <Referees
          getRefereeReservation={getRefereeReservation}
          gameData={gameData}
          navigation={navigation}
          isAdmin={isAdmin}
          userRole={userRole}
          followSoccerUser={followSoccerUser}
          unFollowSoccerUser={unFollowSoccerUser}
      />
      <Scorekeepers
          getScorekeeperReservation={getScorekeeperReservation}
          followSoccerUser={followSoccerUser}
          unFollowSoccerUser={unFollowSoccerUser}
          gameData={gameData}
          navigation={navigation}
          isAdmin={isAdmin}
          userRole={userRole}
      />
      <View style={{ backgroundColor: colors.whiteColor }}>
        <FeedsScreen navigation={navigation}/>
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
})
export default Summary;
