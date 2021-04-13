import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
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
import { addPlayerReview, getGameReview, patchPlayerReview } from '../../../../../api/Games';
import images from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';
import { ImageUploadContext } from '../../../../../context/ImageUploadContext';

// import GameStatus from '../../../../../Constants/GameStatus';

const Summary = ({
  gameData,
  isAdmin,
  isRefereeAdmin,
  isScorekeeperAdmin,
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
  const imageUploadContext = useContext(ImageUploadContext)
  console.log('GameData:=>', gameData);
  console.log('isRefereeAdmin:=>', isRefereeAdmin);
  console.log('isScorekeeperAdmin:=>', isScorekeeperAdmin);
  const authContext = useContext(AuthContext);

  const [playerFrom, setplayerFrom] = useState('');
  const [selectedTeamForReview, setSelectedTeamForReview] = useState();
  const [leaveReviewText, setLeaveReviewText] = useState('');

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sliderAttributes, setSliderAttributes] = useState([]);
  const [starAttributes, setStarAttributes] = useState([]);

  const [sliderAttributesForReferee, setSliderAttributesForReferee] = useState(
    [],
  );
  const [starAttributesForReferee, setStarAttributesForReferee] = useState([]);

  const [
    sliderAttributesForScorekeeper,
    setSliderAttributesForScorekeeper,
  ] = useState([]);
  const [
    starAttributesForScorekeeper,
    setStarAttributesForScorekeeper,
  ] = useState([]);

  useEffect(() => {
      if (gameData) {
        leaveReviewButtonConfig();
      recordGameConfiguration()
      }
  }, [gameData]);

  const recordGameConfiguration = () => {
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
      const scorekeeperReviewProp = soccerSportData?.scorekeeper_review_properties ?? [];
      const sliderReviewProp = [];
      const starReviewProp = [];
      const sliderReviewPropForPlayer = [];
      const starReviewPropForPlayer = [];
      const sliderReviewPropForReferee = [];
      const starReviewPropForReferee = [];

      const sliderReviewPropForScorekeeper = [];
      const starReviewPropForScorekeeper = [];

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
      if (scorekeeperReviewProp?.length) {
        scorekeeperReviewProp.filter((item) => {
          if (item.type === 'topstar') {
            sliderReviewPropForScorekeeper.push(item?.name.toLowerCase());
          } else if (item.type === 'star') {
            starReviewPropForScorekeeper.push(item?.name.toLowerCase());
          }
          return true;
        });
        console.log(
          'sliderReviewPropForScorekeeper',
          sliderReviewPropForScorekeeper,
        );
        console.log(
          'starReviewPropForScorekeeper',
          starReviewPropForScorekeeper,
        );
        setSliderAttributesForScorekeeper([
          ...sliderReviewPropForScorekeeper,
        ]);
        setStarAttributesForScorekeeper([...starReviewPropForScorekeeper]);
      }
    })
    .finally(() => setLoading(false));
  }

  const leaveReviewButtonConfig = () => {
    let found = false;
    let teamName = '';

    if (gameData?.home_team?.user_id === authContext.entity.uid) {
      found = true;
      teamName = gameData?.away_team?.full_name;
      console.log('Team name Data:=>', teamName);
      if (gameData?.home_review_id || gameData?.away_review_id) {
        // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
        setLeaveReviewText(strings.editReviewPlayerText);
      } else {
        // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
        setLeaveReviewText(strings.leaveReviewplayerText);
      }
      setplayerFrom('home');
    }

    if (!found) {
      if (gameData?.away_team?.user_id === authContext.entity.uid) {
        found = true;
        teamName = gameData?.home_team?.full_name;
        if (gameData?.away_review_id || gameData?.home_review_id) {
          // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
          setLeaveReviewText(strings.editReviewPlayerText);
        } else {
          // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
          setLeaveReviewText(strings.leaveReviewPlayerText);
        }
        setplayerFrom('away');
      }

      const data = [
        ...(gameData?.referees ?? []),
        ...(gameData?.scorekeepers ?? []),
      ];
      if (
        data.some(
          (obj) => obj?.referee_id === authContext.entity.uid
            || obj?.scorekeeper_id === authContext.entity.uid,
        )
      ) {
        setLeaveReviewText(strings.leaveOrEditReviewPlayerText);
      }
    }
  }

  const patchOrAddReview = useCallback(({ isAlreadyReviewed, currentForm, reviewsData }) => {
    if (isAlreadyReviewed) {
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
      patchPlayerReview(currentForm === 1 ? gameData?.home_team?.user_id : gameData?.away_team?.user_id, gameData?.game_id, reviewID, reviewObj, authContext)
          .then(() => {
            setLoading(false);
            // navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(() => Alert.alert(strings.alertmessagetitle, error?.message), 100);
            // navigation.goBack();
          });
    } else {
      console.log('New Review Object::=>', reviewsData);
      setLoading(true);
      addPlayerReview(currentForm === 1 ? gameData?.home_team?.user_id : gameData?.away_team?.user_id, gameData?.game_id, reviewsData, authContext)
          .then(() => {
            setLoading(false);
            // navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(() => Alert.alert(strings.alertmessagetitle, error?.message), 100);
            // navigation.goBack();
          });
    }
  }, [authContext, gameData?.away_team?.user_id, gameData?.game_id, gameData?.home_team?.user_id])

  const onPressReviewDone = useCallback((currentForm, isAlreadyReviewed, reviewsData) => {
    const reviewData = { ...reviewsData }
    const alreadyUrlDone = [];
    const createUrlData = [];

    if (reviewsData.attachments.length > 0) {
      reviewsData.attachments.map((dataItem) => {
        if (dataItem.thumbnail) {
          alreadyUrlDone.push(dataItem);
        } else {
          createUrlData.push(dataItem);
        }
        return null;
      })
    }

    reviewData.attachments = [...alreadyUrlDone]
    if (createUrlData?.length > 0) {
      const imageArray = createUrlData.map((dataItem) => (dataItem))
      imageUploadContext.uploadData(
          authContext,
          reviewData,
          imageArray,
          (dataParams) => patchOrAddReview({ currentForm, isAlreadyReviewed, reviewsData: dataParams }),
      )
    } else {
      patchOrAddReview({ currentForm, isAlreadyReviewed, reviewsData })
    }
  }, [authContext, imageUploadContext, patchOrAddReview])

  const getGameReviewsData = useCallback(
    (reviewID) => {
      setLoading(true);
      getGameReview(gameData?.game_id, reviewID, authContext)
        .then((response) => {
          console.log('gameData?.referees?.length > 0', gameData?.referees?.length > 0);
          console.log(
            'Edit Review By Review ID Response::=>',
            response.payload,
          );
          navigation.navigate('LeaveReviewTennis', {
            gameData,
            gameReviewData: response.payload,
            selectedTeam: selectedTeamForReview,
            sliderAttributes,
            starAttributes,
            isRefereeAvailable: gameData?.referees?.length > 0,
            onPressReviewDone,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
        });
    },
    [authContext, gameData, navigation, onPressReviewDone, selectedTeamForReview, sliderAttributes, starAttributes],
);

  const renderRecordButton = useMemo(
    () => (gameData?.status !== 'ended' ? (
      <TCGradientButton
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
        />
      ) : null),
    [gameData, isAdmin, navigation],
  );
  const showLeaveReviewButton = () => isAdmin || isRefereeAdmin || isScorekeeperAdmin;

  const getRefereeReviewsData = useCallback(
    (item) => {
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
    },
    [
      authContext,
      gameData,
      navigation,
      sliderAttributesForReferee,
      starAttributesForReferee,
    ],
  );
  const getScorekeeperReviewsData = useCallback(
    (item) => {
      setLoading(true);
      getGameReview(gameData?.game_id, item?.review_id, authContext)
        .then((response) => {
          console.log('Get review of scorekeeper::=>', response.payload);
          navigation.navigate('ScorekeeperReviewScreen', {
            gameReviewData: response.payload,
            gameData,
            userData: item,
            sliderAttributesForScorekeeper,
            starAttributesForScorekeeper,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
        });
    },
    [
      authContext,
      gameData,
      navigation,
      sliderAttributesForScorekeeper,
      starAttributesForScorekeeper,
    ],
  );

  const renderLeaveAReviewButton = useMemo(
    () => (
      <>
        {gameData?.status === 'ended'
      && !checkReviewExpired(gameData?.actual_enddatetime)
      && showLeaveReviewButton() && (
        <View style={{ backgroundColor: colors.whiteColor, padding: 10 }}>
          <View>
            <TCGradientButton
                  onPress={() => {
                    if (playerFrom !== '') {
                      if (gameData?.home_review_id) {
                        getGameReviewsData(gameData?.home_review_id);
                      } else if (gameData?.away_review_id) {
                        getGameReviewsData(gameData?.away_review_id);
                      } else {
                        navigation.navigate('LeaveReviewTennis', {
                          gameData,
                          selectedTeam: playerFrom === 'home' ? 'away' : 'home',
                          sliderAttributes,
                          starAttributes,
                          isRefereeAvailable: gameData?.referees?.length > 0,
                        });
                      }
                    } else {
                      setIsPopupVisible(true);
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
    [
      gameData,
      getGameReviewsData,
      isAdmin,
      isRefereeAdmin,
      leaveReviewText,
      navigation,
      playerFrom,
      showLeaveReviewButton,
      sliderAttributes,
      starAttributes,
    ],
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
        onReviewPress={(referee) => {
          console.log('Referee Pressed:=>', referee);
          if (referee?.review_id) {
            getRefereeReviewsData(referee);
          }
          navigation.navigate('RefereeReviewScreen', {
            gameData,
            userData: referee,
            sliderAttributesForReferee,
            starAttributesForReferee,
          });
        }}
      />
    ),
    [
      followTennisUser,
      gameData,
      getRefereeReservation,
      getRefereeReviewsData,
      isAdmin,
      navigation,
      sliderAttributesForReferee,
      starAttributesForReferee,
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
        onReviewPress={(scorekeeper) => {
          if (scorekeeper?.review_id) {
            getScorekeeperReviewsData(scorekeeper);
          }
          navigation.navigate('ScorekeeperReviewScreen', {
            gameData,
            userData: scorekeeper,
            sliderAttributesForScorekeeper,
            starAttributesForScorekeeper,
          });
        }}
      />
    ),
    [
      followTennisUser,
      gameData,
      getScorekeeperReservation,
      getScorekeeperReviewsData,
      isAdmin,
      navigation,
      sliderAttributesForScorekeeper,
      starAttributesForScorekeeper,
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

      <Modal
          onBackdropPress={() => setIsPopupVisible(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={isPopupVisible}>
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
                    setIsPopupVisible(false);
                  }}>
                <Image
                    source={images.cancelImage}
                    style={styles.closeButton}
                  />
              </TouchableWithoutFeedback>
              <Text style={styles.startTime}>Leave a player review</Text>
              <Text
                  style={styles.doneText}
                  onPress={() => {
                    setIsPopupVisible(false);
                    console.log('gameData?.review_id:=>', gameData?.referees?.length > 0);
                    if (playerFrom === '' && selectedTeamForReview) {
                      if (selectedTeamForReview === 'home') {
                        if (gameData?.home_review_id) {
                          getGameReviewsData(gameData?.home_review_id);
                        } else {
                          navigation.navigate('LeaveReviewTennis', {
                            gameData,
                            selectedTeam: selectedTeamForReview,
                            sliderAttributes,
                            starAttributes,
                            isRefereeAvailable: gameData?.referees?.length > 0,
                          });
                        }
                      }
                      if (selectedTeamForReview === 'away') {
                        if (gameData?.away_review_id) {
                          getGameReviewsData(gameData?.away_review_id);
                        } else {
                          navigation.navigate('LeaveReviewTennis', {
                            gameData,
                            selectedTeam: selectedTeamForReview,
                            sliderAttributes,
                            starAttributes,
                            isRefereeAvailable: gameData?.referees?.length > 0,
                          });
                        }
                      }
                    } else {
                      Alert.alert(
                        strings.alertmessagetitle,
                        strings.chooseTeamFirst,
                      );
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
                Choose a player to leave a review for.
              </Text>
              <View style={styles.entityView}>
                <TouchableWithoutFeedback
                    onPress={() => setSelectedTeamForReview('home')}>
                  {selectedTeamForReview === 'home' ? (
                    <LinearGradient
                        colors={[colors.yellowColor, colors.themeColor]}
                        style={styles.leftEntityView}>
                      <Image
                          source={
                            gameData?.home_team?.thumbnail
                              ? gameData?.home_team?.thumbnail
                              : images.profilePlaceHolder
                          }
                          style={styles.teamProfileView}
                        />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameData?.home_team?.full_name}
                      </Text>
                    </LinearGradient>
                    ) : (
                      <View style={styles.leftEntityView}>
                        <Image
                          source={
                            gameData?.home_team?.thumbnail
                              ? gameData?.home_team?.thumbnail
                              : images.profilePlaceHolder
                          }
                          style={styles.teamProfileView}
                        />
                        <Text
                          style={styles.teamNameTextBlack}
                          numberOfLines={2}>
                          {gameData?.home_team?.full_name}
                        </Text>
                      </View>
                    )}
                </TouchableWithoutFeedback>

                <Text style={styles.vs}>VS</Text>
                <TouchableWithoutFeedback
                    onPress={() => setSelectedTeamForReview('away')}>
                  {selectedTeamForReview === 'away' ? (
                    <LinearGradient
                        colors={[colors.yellowColor, colors.themeColor]}
                        style={styles.rightEntityView}>
                      <Image
                          source={
                            gameData?.away_team?.thumbnail
                              ? gameData?.away_team?.thumbnail
                              : images.profilePlaceHolder
                          }
                          style={styles.teamProfileView}
                        />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameData?.away_team?.full_name}
                      </Text>
                    </LinearGradient>
                    ) : (
                      <View style={styles.rightEntityView}>
                        <Image
                          source={
                            gameData?.away_team?.thumbnail
                              ? gameData?.away_team?.thumbnail
                              : images.profilePlaceHolder
                          }
                          style={styles.teamProfileView}
                        />
                        <Text
                          style={styles.teamNameTextBlack}
                          numberOfLines={2}>
                          {gameData?.away_team?.full_name}
                        </Text>
                      </View>
                    )}
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
