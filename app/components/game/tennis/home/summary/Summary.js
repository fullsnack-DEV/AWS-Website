/* eslint-disable no-nested-ternary */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
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
import {useIsFocused} from '@react-navigation/native';
import {getHitSlop, heightPercentageToDP as hp} from '../../../../../utils';
import MatchRecords from './MatchRecords';
import SpecialRules from './SpecialRules';
import Referees from '../../../common/summary/Referees';
import Scorekeepers from '../../../common/summary/Scorekeepers';
import TCGradientButton from '../../../../TCGradientButton';
import TCThickDivider from '../../../../TCThickDivider';
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
import {
  addPlayerReview,
  addGameReview,
  getGameReview,
  patchPlayerReview,
  patchGameReview,
  addRefereeReview,
  patchRefereeReview,
  patchScorekeeperReview,
  addScorekeeperReview,
  getGameMemberDetails,
} from '../../../../../api/Games';
import images from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';
import {ImageUploadContext} from '../../../../../context/ImageUploadContext';
import ApproveDisapprove from '../../../soccer/home/summary/approveDisapprove/ApproveDisapprove';

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
  approveDisapproveGameScore,
  createGamePostData,
  getGameFeedData,
  gameFeedFlatListRef,
  getGameNextFeedData,
  getGameData,
  isMember = true,
  getGameDetails,
}) => {
  console.log('GAME DATA:=>', gameData);
  const imageUploadContext = useContext(ImageUploadContext);
  const authContext = useContext(AuthContext);

  const [lineUpUser, setLineUpUser] = useState(false);

  const [playerFrom, setplayerFrom] = useState('');
  const [selectedTeamForReview, setSelectedTeamForReview] = useState();
  const [leaveReviewText, setLeaveReviewText] = useState('');

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sliderAttributesForTeam, setSliderAttributesForTeam] = useState([]);
  const [starAttributesForTeam, setStarAttributesForTeam] = useState([]);

  const [sliderAttributesForReferee, setSliderAttributesForReferee] = useState(
    [],
  );
  const [starAttributesForReferee, setStarAttributesForReferee] = useState([]);

  const [starAttributesForPlayer, setStarAttributesForPlayer] = useState([]);
  const [sliderAttributesForPLayer, setSliderAttributesForPLayer] = useState(
    [],
  );

  const [
    sliderAttributesForScorekeeper,
    setSliderAttributesForScorekeeper,
  ] = useState([]);
  const [
    starAttributesForScorekeeper,
    setStarAttributesForScorekeeper,
  ] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (gameData) {
        if (gameData?.sport_type === 'single') {
          leaveReviewButtonConfigTennis();
        } else {
          leaveReviewButtonConfigDoubleTennis();
        }
        recordGameConfiguration();
      }
    }
  }, [isFocused, gameData]);

  const recordGameConfiguration = () => {
    setLoading(true);

    const tennisSportData = authContext?.sports?.filter(
      (item) => item.sport === gameData?.sport,
    )[0];

    console.log('tennisSportData', authContext?.sports);

    const teamReviewProp = tennisSportData?.team_review_properties ?? [];
    const playerReviewProp = tennisSportData?.player_review_properties ?? [];
    const refereeReviewProp = tennisSportData?.referee_review_properties ?? [];
    const scorekeeperReviewProp =
      tennisSportData?.scorekeeper_review_properties ?? [];

    const sliderReviewPropForTeam = [];
    const starReviewPropForTeam = [];
    const sliderReviewPropForPlayer = [];
    const starReviewPropForPlayer = [];
    const sliderReviewPropForReferee = [];
    const starReviewPropForReferee = [];
    const sliderReviewPropForScorekeeper = [];
    const starReviewPropForScorekeeper = [];

    if (teamReviewProp?.length) {
      teamReviewProp.filter((item) => {
        if (item.type === 'slider') {
          sliderReviewPropForTeam.push(item?.name?.toLowerCase());
        } else if (item.type === 'star') {
          starReviewPropForTeam.push(item);
        }
        return true;
      });
      setSliderAttributesForTeam([...sliderReviewPropForTeam]);
      setStarAttributesForTeam([...starReviewPropForTeam]);
    }
    if (playerReviewProp?.length) {
      playerReviewProp.filter((item) => {
        if (item.type === 'slider') {
          sliderReviewPropForPlayer.push(item);
        } else if (item.type === 'star') {
          starReviewPropForPlayer.push(item);
        }
        return true;
      });

      setStarAttributesForPlayer([...starReviewPropForPlayer]);
      setSliderAttributesForPLayer([...sliderReviewPropForPlayer]);
    }
    if (refereeReviewProp?.length) {
      refereeReviewProp.filter((item) => {
        if (item.type === 'topstar') {
          sliderReviewPropForReferee.push(item?.name?.toLowerCase());
        } else if (item.type === 'star') {
          starReviewPropForReferee.push(item);
        }
        return true;
      });
      setSliderAttributesForReferee([...sliderReviewPropForReferee]);
      setStarAttributesForReferee([...starReviewPropForReferee]);
    }
    if (scorekeeperReviewProp?.length) {
      scorekeeperReviewProp.filter((item) => {
        if (item.type === 'topstar') {
          sliderReviewPropForScorekeeper.push(item?.name?.toLowerCase());
        } else if (item.type === 'star') {
          starReviewPropForScorekeeper.push(item);
        }
        return true;
      });
      setSliderAttributesForScorekeeper([...sliderReviewPropForScorekeeper]);
      setStarAttributesForScorekeeper([...starReviewPropForScorekeeper]);
    }
  };

  const getHomeID = () => {
    if (gameData?.home_team?.user_id) {
      return gameData?.home_team?.user_id;
    }
    return gameData?.home_team?.group_id;
  };

  const getAwayID = () => {
    if (gameData?.away_team?.user_id) {
      return gameData?.away_team?.user_id;
    }
    return gameData?.away_team?.group_id;
  };

  const renderApproveDisapproveSection = useMemo(
    () =>
      gameData?.status === 'ended' &&
      isAdmin && (
        // && !gameData?.approval?.home_team?.approved
        // && !gameData?.approval?.away_team?.approved
        <ApproveDisapprove
          getGameData={getGameData}
          navigation={navigation}
          gameId={gameData?.game_id}
          gameData={gameData}
          approveDisapproveGameScore={approveDisapproveGameScore}
        />
      ),
    [approveDisapproveGameScore, gameData, getGameData, isAdmin, navigation],
  );

  const leaveReviewButtonConfigTennis = () => {
    let found = false;
    let teamName = '';

    if (getHomeID() === authContext.entity.uid) {
      found = true;
      teamName =
        gameData?.away_team?.full_name ?? gameData?.away_team?.group_name;
      console.log('Team name Data:=>', teamName);
      if (gameData?.home_review_id || gameData?.away_review_id) {
        // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
        if (gameData?.home_team?.group_name) {
          setLeaveReviewText(strings.editReviewText);
        } else {
          setLeaveReviewText(strings.editReviewPlayerText);
        }
      } else {
        // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
        if (gameData?.home_team?.group_name) {
          setLeaveReviewText(strings.leaveReviewText);
        } else {
          setLeaveReviewText(strings.leaveReviewplayerText);
        }
      }
      setplayerFrom('home');
    }

    if (!found) {
      if (getAwayID() === authContext.entity.uid) {
        found = true;
        teamName =
          gameData?.home_team?.full_name ?? gameData?.home_team?.group_name;
        if (gameData?.away_review_id || gameData?.home_review_id) {
          // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
          if (gameData?.home_team?.group_name) {
            setLeaveReviewText(strings.editReviewText);
          } else {
            setLeaveReviewText(strings.editReviewPlayerText);
          }
        } else {
          // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
          if (gameData?.home_team?.group_name) {
            setLeaveReviewText(strings.leaveReviewText);
          } else {
            setLeaveReviewText(strings.leaveReviewplayerText);
          }
        }
        setplayerFrom('away');
      }

      const data = [
        ...(gameData?.referees ?? []),
        ...(gameData?.scorekeepers ?? []),
      ];
      if (
        data.some(
          (obj) =>
            obj?.referee_id === authContext.entity.uid ||
            obj?.scorekeeper_id === authContext.entity.uid,
        )
      ) {
        setLeaveReviewText(strings.leaveOrEditReviewPlayerText);
      }
    }
  };

  const leaveReviewButtonConfigDoubleTennis = () => {
    getGameMemberDetails(gameData?.game_id, authContext)
      .then((response) => {
        console.log('response of members detail api: ', response.payload);
      })
      .catch((error) => {
        console.log('error L ', error);
        Alert.alert(strings.alertmessagetitle, error);
      });

    let found = false;
    let teamName = '';

    getGameMemberDetails(gameData?.game_id, authContext)
      .then((response) => {
        const homeTeamPlayers = response.payload.home_team_members;

        const awayTeamPlayers = response.payload.away_team_members;

        const homeTeamRoasters = [];
        const awayTeamRoasters = [];
        if (homeTeamPlayers.length > 0) {
          homeTeamPlayers.map((item) => homeTeamRoasters.push(item?.member_id));
        }
        if (awayTeamPlayers.length > 0) {
          awayTeamPlayers.map((item) => awayTeamRoasters.push(item?.member_id));
        }
        if (
          [...homeTeamRoasters, ...awayTeamRoasters].includes(
            authContext.entity.uid,
          )
        ) {
          setLineUpUser(true);
        }

        for (let i = 0; i < homeTeamPlayers.length; i++) {
          if (homeTeamPlayers?.[i]?.member_id === authContext.entity.uid) {
            found = true;
            teamName = gameData?.away_team?.group_name;
            console.log('Team name Data:=>', teamName);
            if (gameData?.home_review_id || gameData?.away_review_id) {
              // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
              setLeaveReviewText(strings.editReviewText);
            } else {
              // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
              setLeaveReviewText(strings.leaveReviewText);
            }
            setplayerFrom('home');
            break;
          }
        }
        if (!found) {
          for (let i = 0; i < awayTeamPlayers.length; i++) {
            if (awayTeamPlayers?.[i]?.member_id === authContext.entity.uid) {
              found = true;
              teamName = gameData?.home_team?.group_name;
              if (gameData?.away_review_id || gameData?.home_review_id) {
                // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
                setLeaveReviewText(strings.editReviewText);
              } else {
                // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
                setLeaveReviewText(strings.leaveReviewText);
              }
              setplayerFrom('away');
              break;
            }
          }
          const data = [
            ...(gameData?.referees ?? []),
            ...(gameData?.scorekeepers ?? []),
          ];
          if (
            data.some(
              (obj) =>
                obj?.referee_id === authContext.entity.uid ||
                obj?.scorekeeper_id === authContext.entity.uid,
            )
          ) {
            setLeaveReviewText(strings.leaveOrEditReviewText);
          }
        }
      })
      .catch((error) => {
        console.log('error L ', error);
        Alert.alert(strings.alertmessagetitle, error);
      });
  };

  const patchOrAddReview = useCallback(
    ({isAlreadyReviewed, currentForm, reviewsData}) => {
      if (isAlreadyReviewed) {
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
        patchPlayerReview(
          currentForm === 1 ? getHomeID() : getAwayID(),
          gameData?.game_id,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            setLoading(false);
            getGameData();
            getGameDetails();
            // navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(
              () => Alert.alert(strings.alertmessagetitle, error?.message),
              100,
            );
            // navigation.goBack();
          });
      } else {
        console.log('New Review Object::=>', reviewsData);
        setLoading(true);
        addPlayerReview(
          currentForm === 1 ? getHomeID() : getAwayID(),
          gameData?.game_id,
          reviewsData,
          authContext,
        )
          .then(() => {
            setLoading(false);
            getGameDetails();
            getGameData();

            // navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(
              () => Alert.alert(strings.alertmessagetitle, error?.message),
              100,
            );
            // navigation.goBack();
          });
      }
    },
    [authContext, gameData?.game_id, getAwayID, getGameData, getHomeID],
  );

  const patchOrAddReviewTeam = useCallback(
    ({isAlreadyReviewed, currentForm, reviewsData}) => {
      if (isAlreadyReviewed) {
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

        console.log('Edited Review Object patchOrAddReviewTeam::=>', reviewObj);
        patchGameReview(gameData?.game_id, reviewID, reviewObj, authContext)
          .then(() => {
            setLoading(false);
            getGameData();
            getGameDetails();
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(
              () => Alert.alert(strings.alertmessagetitle, error?.message),
              100,
            );
          });
      } else {
        console.log('New Review Object::=>', reviewsData);
        setLoading(true);
        addGameReview(gameData?.game_id, reviewsData, authContext)
          .then(() => {
            setLoading(false);
            getGameData();
            getGameDetails();
          })
          .catch((error) => {
            setLoading(false);
            setTimeout(
              () => Alert.alert(strings.alertmessagetitle, error?.message),
              100,
            );
          });
      }
    },
    [authContext, gameData?.game_id, getGameData],
  );

  const onPressReviewDone = useCallback(
    (currentForm, isAlreadyReviewed, reviewsData) => {
      const reviewData = {...reviewsData};
      const alreadyUrlDone = [];
      const createUrlData = [];

      console.log('Main review data:', reviewData);

      if (reviewsData.attachments.length > 0) {
        reviewsData.attachments.map((dataItem) => {
          if (dataItem.thumbnail) {
            alreadyUrlDone.push(dataItem);
          } else {
            createUrlData.push(dataItem);
          }
          return null;
        });
      }

      reviewData.attachments = [...alreadyUrlDone];
      if (createUrlData?.length > 0) {
        const imageArray = createUrlData.map((dataItem) => dataItem);
        imageUploadContext.uploadData(
          authContext,
          reviewData,
          imageArray,
          reviewsData?.team_id
            ? (dataParams) =>
                patchOrAddReviewTeam({
                  isAlreadyReviewed,
                  currentForm,
                  reviewsData: dataParams,
                })
            : (dataParams) =>
                patchOrAddReview({
                  isAlreadyReviewed,
                  currentForm,
                  reviewsData: dataParams,
                }),
        );
      } else {
        if (reviewsData?.team_id) {
          patchOrAddReviewTeam({isAlreadyReviewed, currentForm, reviewsData});
        } else {
          patchOrAddReview({isAlreadyReviewed, currentForm, reviewsData});
        }
      }
    },
    [authContext, imageUploadContext, patchOrAddReview, patchOrAddReviewTeam],
  );

  const getGameReviewsData = useCallback(
    (reviewID) => {
      setLoading(true);
      getGameReview(gameData?.game_id, reviewID, authContext)
        .then((response) => {
          console.log('starAttributesForPlayer', starAttributesForPlayer);
          console.log('isRefereeAvailable', gameData?.referees?.length > 0);
          setLoading(false);
          navigation.navigate('LeaveReviewTennis', {
            gameData,
            gameReviewData: response.payload,
            selectedTeam:
              selectedTeamForReview ?? getHomeID() === authContext?.entity?.uid
                ? 'away'
                : 'home',
            starAttributes: starAttributesForPlayer,
            isRefereeAvailable: gameData?.referees?.length > 0,
            onPressReviewDone,
          });
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
        });
    },
    [
      authContext,
      gameData,
      getHomeID,
      navigation,
      onPressReviewDone,
      selectedTeamForReview,
      starAttributesForPlayer,
    ],
  );

  const getGameReviewsDataDouble = useCallback(
    (reviewID) => {
      setLoading(true);
      getGameReview(gameData?.game_id, reviewID, authContext)
        .then((response) => {
          setLoading(false);
          navigation.navigate('LeaveReviewTennis', {
            gameData,
            gameReviewData: response.payload,
            selectedTeam: playerFrom === 'home' ? 'away' : 'home',
            starAttributes: starAttributesForTeam,
            isRefereeAvailable: gameData?.referees?.length > 0,
            onPressReviewDone,
          });
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error', error?.message);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
        });
    },
    [
      authContext,
      gameData,
      navigation,
      onPressReviewDone,
      playerFrom,
      starAttributesForTeam,
    ],
  );

  const renderRecordButton = useMemo(
    () =>
      gameData?.status !== 'ended' &&
      (isAdmin || isScorekeeperAdmin || isRefereeAdmin) ? (
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
      ) : null,
    [gameData, isAdmin, isRefereeAdmin, isScorekeeperAdmin, navigation],
  );
  const showLeaveReviewButton = useCallback(() => {
    if (gameData?.sport_type === 'single') {
      return isAdmin || isRefereeAdmin || isScorekeeperAdmin;
    }
    return lineUpUser || isRefereeAdmin || isScorekeeperAdmin;
  }, [
    gameData?.sport_type,
    isAdmin,
    isRefereeAdmin,
    isScorekeeperAdmin,
    lineUpUser,
  ]);

  const getRefereeReviewsData = useCallback(
    (item) => {
      setLoading(true);
      getGameReview(gameData?.game_id, item?.review_id, authContext)
        .then((response) => {
          console.log('Get review of referee::=>', response.payload);
          setLoading(false);
          navigation.navigate('RefereeReviewScreen', {
            gameReviewData: response.payload,
            gameData,
            userData: item,
            sliderAttributesForReferee,
            starAttributesForReferee,
            onPressRefereeReviewDone,
          });
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
          setLoading(false);
          navigation.navigate('ScorekeeperReviewScreen', {
            gameReviewData: response.payload,
            gameData,
            userData: item,
            sliderAttributesForScorekeeper,
            starAttributesForScorekeeper,
            onPressScorekeeperReviewDone,
          });
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

  const renderLeaveAReviewButtonForDouble = useMemo(
    () =>
      gameData?.status === 'ended' &&
      !checkReviewExpired(gameData?.actual_enddatetime) &&
      !isAdmin &&
      gameData?.approval?.home_team?.approved &&
      gameData?.approval?.away_team?.approved &&
      showLeaveReviewButton() && (
        <View style={{backgroundColor: colors.whiteColor, marginTop: 5}}>
          <View>
            <TCGradientButton
              onPress={() => {
                if (playerFrom !== '') {
                  if (gameData?.home_review_id) {
                    getGameReviewsDataDouble(gameData?.home_review_id);
                  } else if (gameData?.away_review_id) {
                    getGameReviewsDataDouble(gameData?.away_review_id);
                  } else {
                    navigation.navigate('LeaveReviewTennis', {
                      gameData,
                      selectedTeam: playerFrom === 'home' ? 'away' : 'home',
                      starAttributes: starAttributesForTeam,
                      isRefereeAvailable: gameData?.referees?.length > 0,
                      onPressReviewDone,
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
      ),
    [
      gameData,
      getGameReviewsDataDouble,
      isAdmin,
      leaveReviewText,
      navigation,
      onPressReviewDone,
      playerFrom,
      showLeaveReviewButton,
      starAttributesForTeam,
    ],
  );

  const renderLeaveAReviewButton = useMemo(
    () => (
      <>
        {gameData?.status === 'ended' &&
          !checkReviewExpired(gameData?.actual_enddatetime) &&
          showLeaveReviewButton() && (
            <View style={{backgroundColor: colors.whiteColor, padding: 10}}>
              <View>
                <TCGradientButton
                  onPress={() => {
                    if (playerFrom !== '') {
                      if (gameData?.home_review_id) {
                        getGameReviewsData(gameData?.home_review_id);
                      } else if (gameData?.away_review_id) {
                        getGameReviewsData(gameData?.away_review_id);
                      } else {
                        console.log(
                          'starAttributesForPlayer',
                          starAttributesForPlayer,
                        );
                        navigation.navigate('LeaveReviewTennis', {
                          gameData,
                          selectedTeam: playerFrom === 'home' ? 'away' : 'home',
                          starAttributes:
                            gameData?.sport_type === 'single'
                              ? starAttributesForPlayer
                              : starAttributesForTeam,
                          isRefereeAvailable: gameData?.referees?.length > 0,
                          onPressReviewDone,
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
      </>
    ),
    [
      gameData,
      getGameReviewsData,
      isRefereeAdmin,
      leaveReviewText,
      loading,
      navigation,
      onPressReviewDone,
      playerFrom,
      showLeaveReviewButton,
      starAttributesForTeam,
      starAttributesForPlayer,
    ],
  );

  const renderTopButtons = useMemo(
    () =>
      (isAdmin || isMember || isRefereeAdmin) && (
        <View
          style={{
            marginBottom: hp(1),
            backgroundColor: colors.whiteColor,
            padding: 10,
          }}>
          {renderRecordButton}
          {gameData?.sport_type === 'single'
            ? renderLeaveAReviewButton
            : renderLeaveAReviewButtonForDouble}
        </View>
      ),
    [
      gameData?.sport_type,
      isAdmin,
      isMember,
      isRefereeAdmin,
      renderLeaveAReviewButton,
      renderLeaveAReviewButtonForDouble,
      renderRecordButton,
    ],
  );

  const renderScoresSection = useMemo(
    () => (
      <View
        style={{
          backgroundColor: colors.whiteColor,
        }}>
        <Text style={[styles.title, {marginLeft: 15, marginBottom: 0}]}>
          Scores
        </Text>
        <TennisScoreView scoreDataSource={gameData} />
        <TCThickDivider marginTop={15} />
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
    () => <SpecialRules gameData={gameData} />,
    [gameData],
  );

  const renderRefereesSection = useCallback(
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
            onPressRefereeReviewDone,
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

  const renderScorekeepersSection = useCallback(
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
            onPressScorekeeperReviewDone,
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

  const patchOrAddRefereeReview = useCallback(
    ({currentForm, isAlreadyReviewed, reviewsData, referee_id}) => {
      if (isAlreadyReviewed) {
        setLoading(true);

        const teamReview = {...reviewsData};
        delete teamReview.created_at;
        delete teamReview.entity_type;
        delete teamReview.entity_id;
        delete teamReview.game_id;
        const reviewID = teamReview.review_id;
        delete teamReview.review_id;
        delete teamReview.reviewer_id;
        delete teamReview.sport;

        const reviewObj = {
          ...teamReview,
        };
        console.log('Edited Review Object::=>', teamReview);
        patchRefereeReview(
          referee_id,
          gameData?.game_id,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            setLoading(false);
            getGameData();
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
        setLoading(true);
        addRefereeReview(
          referee_id,
          gameData?.game_id,
          reviewsData,
          authContext,
        )
          .then(() => {
            setLoading(false);
            getGameData();
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
    },
    [authContext, gameData?.game_id, getGameData, navigation],
  );

  const patchOrAddScorekeeperReview = useCallback(
    ({currentForm, isAlreadyReviewed, reviewsData, scorekeeper_id}) => {
      if (isAlreadyReviewed) {
        setLoading(true);

        const teamReview = {...reviewsData};
        delete teamReview.created_at;
        delete teamReview.entity_type;
        delete teamReview.entity_id;
        delete teamReview.game_id;
        const reviewID = teamReview.review_id;
        delete teamReview.review_id;
        delete teamReview.reviewer_id;
        delete teamReview.sport;

        const reviewObj = {
          ...teamReview,
        };
        console.log('Edited Review Object::=>', teamReview);
        patchScorekeeperReview(
          scorekeeper_id,
          gameData?.game_id,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            setLoading(false);
            getGameData();
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
        setLoading(true);
        addScorekeeperReview(
          scorekeeper_id,
          gameData?.game_id,
          reviewsData,
          authContext,
        )
          .then(() => {
            setLoading(false);
            getGameData();
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
    },
    [authContext, gameData?.game_id, getGameData, navigation],
  );
  const onPressRefereeReviewDone = useCallback(
    (currentForm, isAlreadyReviewed, reviewsData, referee_id) => {
      const reviewData = {...reviewsData};
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
        });
      }

      reviewData.attachments = [...alreadyUrlDone];
      if (createUrlData?.length > 0) {
        const imageArray = createUrlData.map((dataItem) => dataItem);
        imageUploadContext.uploadData(
          authContext,
          reviewData,
          imageArray,
          (dataParams) =>
            patchOrAddRefereeReview({
              currentForm,
              isAlreadyReviewed,
              reviewsData: dataParams,
              referee_id,
            }),
        );
      } else {
        patchOrAddRefereeReview({
          currentForm,
          isAlreadyReviewed,
          reviewsData,
          referee_id,
        });
      }
    },
    [imageUploadContext, authContext, patchOrAddRefereeReview],
  );
  const onPressScorekeeperReviewDone = useCallback(
    (currentForm, isAlreadyReviewed, reviewsData, scorekeeper_id) => {
      const reviewData = {...reviewsData};
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
        });
      }

      reviewData.attachments = [...alreadyUrlDone];
      if (createUrlData?.length > 0) {
        const imageArray = createUrlData.map((dataItem) => dataItem);
        imageUploadContext.uploadData(
          authContext,
          reviewData,
          imageArray,
          (dataParams) =>
            patchOrAddScorekeeperReview({
              currentForm,
              isAlreadyReviewed,
              reviewsData: dataParams,
              scorekeeper_id,
            }),
        );
      } else {
        patchOrAddScorekeeperReview({
          currentForm,
          isAlreadyReviewed,
          reviewsData,
          scorekeeper_id,
        });
      }
    },
    [imageUploadContext, authContext, patchOrAddScorekeeperReview],
  );
  return (
    <View style={styles.mainContainer}>
      {/* <TCInnerLoader visible={loading} /> */}
      {renderTopButtons}
      {renderApproveDisapproveSection}
      {renderScoresSection}
      {renderMatchRecordsSection}
      {renderSpecialRulesSection}
      {renderRefereesSection()}
      {renderScorekeepersSection()}
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
                hitSlop={getHitSlop(15)}
                onPress={() => {
                  setIsPopupVisible(false);
                }}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableWithoutFeedback>
              <Text style={styles.startTime}>
                {gameData?.sport_type === 'single'
                  ? 'Leave a player review'
                  : 'Leave a team review'}
              </Text>
              <Text
                style={styles.doneText}
                onPress={() => {
                  setIsPopupVisible(false);
                  console.log(
                    'gameData?.review_id:=>',
                    gameData?.referees?.length > 0,
                  );
                  if (playerFrom === '' && selectedTeamForReview) {
                    if (selectedTeamForReview === 'home') {
                      if (gameData?.home_review_id) {
                        getGameReviewsData(gameData?.home_review_id);
                      } else {
                        navigation.navigate('LeaveReviewTennis', {
                          gameData,
                          selectedTeam: selectedTeamForReview,
                          starAttributes: starAttributesForPlayer,
                          isRefereeAvailable: gameData?.referees?.length > 0,
                          onPressReviewDone,
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
                          starAttributes: starAttributesForPlayer,
                          isRefereeAvailable: gameData?.referees?.length > 0,
                          onPressReviewDone,
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
                {gameData?.sport_type === 'single'
                  ? 'Choose a player to leave a review for.'
                  : 'Choose a team to leave a review for.'}
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
                            : gameData?.sport_type === 'single'
                            ? images.profilePlaceHolder
                            : images.teamPlaceholder
                        }
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameData?.home_team?.full_name ??
                          gameData?.home_team?.group_name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.leftEntityView}>
                      <Image
                        source={
                          gameData?.home_team?.thumbnail
                            ? gameData?.home_team?.thumbnail
                            : gameData?.sport_type === 'single'
                            ? images.profilePlaceHolder
                            : images.teamPlaceholder
                        }
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                        {gameData?.home_team?.full_name ??
                          gameData?.home_team?.group_name}
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
                            : gameData?.sport_type === 'single'
                            ? images.profilePlaceHolder
                            : images.teamPlaceholder
                        }
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameText} numberOfLines={2}>
                        {gameData?.away_team?.full_name ??
                          gameData?.away_team?.group_name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.rightEntityView}>
                      <Image
                        source={
                          gameData?.away_team?.thumbnail
                            ? gameData?.away_team?.thumbnail
                            : gameData?.sport_type === 'single'
                            ? images.profilePlaceHolder
                            : images.teamPlaceholder
                        }
                        style={styles.teamProfileView}
                      />
                      <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                        {gameData?.away_team?.full_name ??
                          gameData?.away_team?.group_name}
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
    shadowOffset: {width: 0, height: 1},
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
    shadowOffset: {width: 0, height: 1},
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
        shadowOffset: {width: 0, height: 3},
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
