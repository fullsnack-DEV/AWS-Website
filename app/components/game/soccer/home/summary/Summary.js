/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable react/jsx-indent */
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
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

import images from '../../../../../Constants/ImagePath';

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
  getGameLineUp,
  isTeamPopupVisible,
  selectedTeam,
}) => {
  const authContext = useContext(AuthContext);
  const reviewOpetions = useRef();
  const isFocused = useIsFocused();
  const [playerFrom, setplayerFrom] = useState('');
  const [selectedTeamForReview, setSelectedTeamForReview] = useState();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, setStarAttributes] = useState([]);
  const [leaveReviewText, setLeaveReviewText] = useState('');
  const [lineUpUser, setLineUpUser] = useState(false);

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
      console.log('Game data==:=>', gameData);
      leaveReviewButtonConfig();
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
              if (item.type === 'slider') {
                sliderReviewProp.push(item?.name.toLowerCase());
              } else if (item.type === 'star') {
                starReviewProp.push(item?.name.toLowerCase());
              }
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
        })
        .finally(() => setLoading(false));
    }
  }, [gameData, isFocused]);

  const leaveReviewButtonConfig = () => {
    let found = false;
    let teamName = '';

    getGameLineUp()
      .then((response) => {
        console.log('AllRoster Data:=>', response.payload);
        console.log('Game Data:=>', gameData);
        const homeTeamPlayers = response.payload.home_team.roster.concat(response.payload.home_team.non_roster)

        const awayTeamPlayers = response.payload.away_team.roster.concat(response.payload.away_team.non_roster)
        const homeTeamRoasters = []
        const awayTeamRoasters = []
        if (homeTeamPlayers.length > 0) {
          homeTeamPlayers.map((item) => homeTeamRoasters.push(item?.member_id))
        }
        if (awayTeamPlayers.length > 0) {
          awayTeamPlayers.map((item) => awayTeamRoasters.push(item?.member_id))
        }
        if ([...homeTeamRoasters, ...awayTeamRoasters].includes(authContext.entity.uid)) setLineUpUser(true);

        for (let i = 0; i < homeTeamPlayers.length; i++) {
          if (
            homeTeamPlayers?.[i]?.member_id
            === authContext.entity.uid
          ) {
            found = true;
            teamName = gameData?.away_team?.group_name;
            console.log('Team name Data:=>', teamName);
            if (gameData?.home_review_id || gameData?.away_review_id) {
              // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
              setLeaveReviewText(strings.editReviewText);
            }
            else {
              // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
              setLeaveReviewText(strings.leaveReviewText);
            }
            setplayerFrom('home')
            break;
          }
        }
        if (!found) {
          for (let i = 0; i < awayTeamPlayers.length; i++) {
            if (
              awayTeamPlayers?.[i]?.member_id
              === authContext.entity.uid
            ) {
              found = true;
              teamName = gameData?.home_team?.group_name;
              console.log('Team name Data:=>', teamName);
              if (gameData?.away_review_id || gameData?.home_review_id) {
                // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
                setLeaveReviewText(strings.editReviewText);
              } else {
                // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
                setLeaveReviewText(strings.leaveReviewText);
              }
              setplayerFrom('away')
              break;
            }
          }
          for (let i = 0; i < gameData?.referees?.length; i++) {
            if (gameData?.referees?.[i]?.referee_id === authContext.entity.uid) {
              found = true;
              // teamName = gameData?.home_team?.group_name
              // console.log('Team name Data:=>', teamName);
              setLeaveReviewText(strings.leaveOrEditReviewText);
              break;
            }
          }
        }
      })
      .catch((error) => {
        console.log('error L ', error)
        Alert.alert(strings.alertmessagetitle, error);
      });
  };
  const showLeaveReviewButton = () => (lineUpUser || isRefereeAdmin);

  const getRefereeReviewsData = (item) => {
    setLoading(true);
    getGameReview(gameData?.game_id, item?.review_id, authContext)
      .then((response) => {
        console.log('Get review of referee::=>', response.payload);
        navigation.navigate('RefereeReviewScreen', {
          gameReviewData: response.payload,
          gameData,
          userData: item,
          sliderAttributesForReferee,
          starAttributesForReferee,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
      });
  };

  const getGameReviewsData = (reviewID) => {
    setLoading(true);
    getGameReview(gameData?.game_id, reviewID, authContext)
      .then((response) => {
        console.log('Edit Review By Review ID Response::=>', response.payload);
        navigation.navigate('LeaveReview', {
          gameData,
          gameReviewData: response.payload,
          selectedTeam: selectedTeamForReview,
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
          && !isAdmin
          && showLeaveReviewButton() && (
            <View style={{ backgroundColor: colors.whiteColor, marginTop: 5 }}>
              <View>
                <TCGradientButton
                  onPress={() => {
                    if (playerFrom !== '') {
                      if (gameData?.home_review_id) {
                        getGameReviewsData(gameData?.home_review_id);
                      } else if (gameData?.away_review_id) {
                        getGameReviewsData(gameData?.away_review_id)
                      } else {
                        navigation.navigate('LeaveReview', {
                          gameData,
                          selectedTeam: playerFrom === 'home' ? 'away' : 'home',
                          sliderAttributes,
                          starAttributes,
                        });
                      }
                    } else {
                      setIsPopupVisible(true)
                    }
                  }}
                  startGradientColor={colors.yellowColor}
                  endGradientColor={colors.themeColor}
                  title={leaveReviewText?.toUpperCase()}
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

        {!loading && gameData?.status === 'ended' && !isAdmin && showLeaveReviewButton() && (
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
          console.log('referee review data:=>', referee);
          // navigation.navigate('ReviewRefereeList', {
          //   gameData,
          //   sliderAttributesForReferee,
          //   starAttributesForReferee,
          // });
          if (referee?.review_id) {
            getRefereeReviewsData(referee);
          }
          navigation.navigate('RefereeReviewScreen', {
            gameData,
            userData: referee,
            sliderAttributesForReferee,
            starAttributesForReferee,
          });
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

      <Modal
        backdropColor="black"
        onBackdropPress={() => setIsPopupVisible(false)}
        backdropOpacity={0.5}
        animationType="slide"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={() => {
          // this.closeButtonFunction()
        }}>

        <View
          style={{
            // height: '50%',
            marginTop: 'auto',
            // backgroundColor: 'blue',
          }}>
          <View style={styles.bottomPopupContainer}>
            <View style={styles.titlePopup}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsPopupVisible(false)
                  setSelectedTeamForReview();
                }}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableWithoutFeedback>
              <Text style={styles.startTime}>Leave a team review</Text>
              <Text
                style={styles.doneText}
                onPress={() => {
                  setIsPopupVisible(false);
                  console.log('gameData?.review_id:=>', gameData?.review_id);
                  if (playerFrom === '' && selectedTeamForReview) {
                    if (selectedTeamForReview === 'home') {
                      if (gameData?.home_review_id) {
                        getGameReviewsData(gameData?.home_review_id);
                      }
                      else {
                        navigation.navigate('LeaveReview', {
                          gameData,
                          selectedTeam: selectedTeamForReview,
                          sliderAttributes,
                          starAttributes,
                        });
                      }
                    }
                    if (selectedTeamForReview === 'away') {
                      if (gameData?.away_review_id) {
                        getGameReviewsData(gameData?.away_review_id);
                      }
                      else {
                        navigation.navigate('LeaveReview', {
                          gameData,
                          selectedTeam: selectedTeamForReview,
                          sliderAttributes,
                          starAttributes,
                        });
                      }
                    }
                  }
                  else {
                    Alert.alert(strings.alertmessagetitle, strings.chooseTeamFirst)
                  }
                }}>
                Done
              </Text>
            </View>
            <View style={styles.separatorLine}></View>
            <View>
              <Text
                style={{
                  alignSelf: 'center',
                  marginBottom: 20,
                  fontFamily: fonts.RRegular,
                  fontSize: 20,
                  color: colors.lightBlackColor,
                }}>
                Choose a team to leave a review for.
              </Text>
              <View style={styles.entityView}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSelectedTeamForReview('home');
                  }}>
                  {selectedTeamForReview === 'home' ? (
                    <LinearGradient
                      colors={[colors.yellowColor, colors.themeColor]}
                      style={styles.leftEntityView}>
                      <Image
                        source={images.teamPlaceholder}
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameData?.home_team?.group_name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.leftEntityView}>
                      <Image
                        source={images.teamPlaceholder}
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                        {gameData?.home_team?.group_name}
                      </Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>

                <Text style={styles.vs}>VS</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSelectedTeamForReview('away');
                  }}>
                  {selectedTeamForReview === 'away' ? (
                    <LinearGradient
                      colors={[colors.yellowColor, colors.themeColor]}
                      style={styles.rightEntityView}>
                      <Image
                        source={images.teamPlaceholder}
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameData?.away_team?.group_name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.rightEntityView}>
                      <Image
                        source={images.teamPlaceholder}
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                        {gameData?.away_team?.group_name}
                      </Text>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>

      </Modal>

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
    backgroundColor: colors.grayBackgroundColor,
  },
  reviewPeriod: {
    marginHorizontal: 5,
    fontSize: 16,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
  titlePopup: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separatorLine: {
    backgroundColor: colors.thinDividerColor,
    marginBottom: 30,
    height: 1,
    width: '100%',
  },
  entityView: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  leftEntityView: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 10,
    height: 100,
    marginLeft: '6%',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: '37%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  teamProfileView: {
    borderRadius: 30,
    height: 60,
    width: 60,
    resizeMode: 'cover',
  },
  closeButton: {
    marginLeft: 20,
    height: 15,
    width: 15,
    resizeMode: 'cover',
  },
  rightEntityView: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    height: 100,
    marginRight: '6%',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: '37%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startTime: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  doneText: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    marginRight: 15,
  },
  vs: {
    alignSelf: 'center',
    fontFamily: fonts.RLight,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  teamNameText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },

  teamNameTextBlack: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
});
export default Summary;
