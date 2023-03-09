/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useMemo,
  useCallback,
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
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import {
  addGameReview,
  getGameReview,
  patchGameReview,
  addRefereeReview,
  patchRefereeReview,
  patchScorekeeperReview,
  addScorekeeperReview,
  getGameMemberDetails,
} from '../../../../../api/Games';
import {getHitSlop, heightPercentageToDP as hp} from '../../../../../utils';
import MatchRecords from './MatchRecords';
import SpecialRules from './SpecialRules';
import AuthContext from '../../../../../auth/context';
import Referees from '../../../common/summary/Referees';
import Scorekeepers from '../../../common/summary/Scorekeepers';
import TCGradientButton from '../../../../TCGradientButton';
import colors from '../../../../../Constants/Colors';
import ApproveDisapprove from './approveDisapprove/ApproveDisapprove';
import {checkReviewExpired} from '../../../../../utils/gameUtils';
import fonts from '../../../../../Constants/Fonts';
import {strings} from '../../../../../../Localization/translation';
import GameFeed from '../../../common/summary/GameFeed';

import images from '../../../../../Constants/ImagePath';
import {ImageUploadContext} from '../../../../../context/ImageUploadContext';
import GameStatus from '../../../../../Constants/GameStatus';

const Summary = ({
  gameData,
  isAdmin,
  isRefereeAdmin,
  isScorekeeperAdmin,
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
  gameFeedFlatListRef,
  getGameNextFeedData,
}) => {
  const recipientModalRef = useRef();
  const imageUploadContext = useContext(ImageUploadContext);
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
  const [isMemberOfHomeAway, setIsMemberOfHomeAway] = useState(false);
  const [pressedReferee, setPressedReferee] = useState({});

  const [sliderAttributesForReferee, setSliderAttributesForReferee] = useState(
    [],
  );
  const [starAttributesForReferee, setStarAttributesForReferee] = useState([]);

  const [sliderAttributesForScorekeeper, setSliderAttributesForScorekeeper] =
    useState([]);
  const [starAttributesForScorekeeper, setStarAttributesForScorekeeper] =
    useState([]);

  useEffect(() => {
    if (isFocused && gameData) {
      leaveReviewButtonConfig();

      const soccerSportData =
        authContext?.sports?.length &&
        authContext?.sports?.filter(
          (item) => item.sport === gameData?.sport,
        )[0];

      const teamReviewProp = soccerSportData?.team_review_properties ?? [];
      const playerReviewProp = soccerSportData?.player_review_properties ?? [];
      const refereeReviewProp =
        soccerSportData?.referee_review_properties ?? [];
      const scorekeeperReviewProp =
        soccerSportData?.scorekeeper_review_properties ?? [];
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
            sliderReviewProp.push(item?.title.toLowerCase());
          } else if (item.type === 'star') {
            starReviewProp.push(item);
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
            starReviewPropForPlayer.push(item);
          }
          return true;
        });
      }
      if (refereeReviewProp?.length) {
        refereeReviewProp.filter((item) => {
          if (item.type === 'topstar') {
            sliderReviewPropForReferee.push(item?.name.toLowerCase());
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
            sliderReviewPropForScorekeeper.push(item?.name.toLowerCase());
          } else if (item.type === 'star') {
            starReviewPropForScorekeeper.push(item);
          }
          return true;
        });
        setSliderAttributesForScorekeeper([...sliderReviewPropForScorekeeper]);
        setStarAttributesForScorekeeper([...starReviewPropForScorekeeper]);
      }
    }
  }, [gameData, isFocused]);

  const leaveReviewButtonConfig = () => {
    let found = false;
    let teamName = '';

    // getGameLineUp()
    getGameMemberDetails(gameData?.game_id, authContext)
      .then((response) => {
        // const homeTeamPlayers = response.payload.home_team.roster.concat(
        //   response.payload.home_team.non_roster,
        // );

        // const awayTeamPlayers = response.payload.away_team.roster.concat(
        //   response.payload.away_team.non_roster,
        // );
        const homeTeamMembers = response.payload.home_team_members;

        const awayTeamMembers = response.payload.away_team_members;

        const homeTeamRoasters = [];
        const awayTeamRoasters = [];
        if (homeTeamMembers.length > 0) {
          homeTeamMembers.map((item) => homeTeamRoasters.push(item?.member_id));
        }
        if (awayTeamMembers.length > 0) {
          awayTeamMembers.map((item) => awayTeamRoasters.push(item?.member_id));
        }
        if (
          [...homeTeamRoasters, ...awayTeamRoasters].includes(
            authContext.entity.uid,
          )
        ) {
          setIsMemberOfHomeAway(true);
        }

        if (
          homeTeamMembers?.filter(
            (home) => home.member_id === authContext.entity.uid,
          ).length > 0 &&
          awayTeamMembers?.filter(
            (away) => away.member_id === authContext.entity.uid,
          ).length > 0
        ) {
          if (gameData?.home_review_id || gameData?.away_review_id) {
            // setLeaveReviewText(`EDIT A REVIEW FOR ${teamName}`);
            setLeaveReviewText(strings.editReviewText);
          } else {
            // setLeaveReviewText(`LEAVE A REVIEW FOR ${teamName}`);
            setLeaveReviewText(strings.leaveReviewText);
          }
          setplayerFrom('');
        } else {
          for (let i = 0; i < homeTeamMembers?.length; i++) {
            if (homeTeamMembers?.[i]?.member_id === authContext.entity.uid) {
              found = true;
              teamName = gameData?.away_team?.group_name;
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
            for (let i = 0; i < awayTeamMembers.length; i++) {
              if (awayTeamMembers?.[i]?.member_id === authContext.entity.uid) {
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
        }
      })
      .catch((error) => {
        console.log('error L ', error);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  };

  const showLeaveReviewButton = () =>
    isMemberOfHomeAway || isRefereeAdmin || isScorekeeperAdmin;

  const getRefereeReviewsData = useCallback(
    (item) => {
      setLoading(true);
      getGameReview(gameData?.game_id, item?.review_id, authContext)
        .then((response) => {
          navigation.navigate('RefereeReviewScreen', {
            gameReviewData: response.payload,
            gameData,
            userData: item,
            sliderAttributesForReferee,
            starAttributesForReferee,
            onPressRefereeReviewDone,
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
          navigation.navigate('ScorekeeperReviewScreen', {
            gameReviewData: response.payload,
            gameData,
            userData: item,
            sliderAttributesForScorekeeper,
            starAttributesForScorekeeper,
            onPressScorekeeperReviewDone,
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

  const getGameReviewsData = useCallback(
    (reviewID) => {
      setLoading(true);
      getGameReview(gameData?.game_id, reviewID, authContext)
        .then((response) => {
          navigation.navigate('LeaveReview', {
            gameData,
            gameReviewData: response.payload,
            selectedTeam: selectedTeamForReview, // ?? playerFrom === 'home' ? 'away' : 'home',
            starAttributes,
            isRefereeAvailable: gameData.referees?.length > 0,
            onPressReviewDone,
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
      selectedTeamForReview,
      sliderAttributes,
      starAttributes,
      playerFrom,
    ],
  );

  const reviewOperationsActionSheetOptions = useMemo(
    () =>
      gameData?.review_id
        ? [
            strings.editReviewForTeams,
            strings.reviewForReferees,
            strings.cancel,
          ]
        : [strings.reviewForTeams, strings.reviewForReferees, strings.cancel],
    [gameData?.review_id],
  );

  const onReviewActionsheetItemPress = useCallback(
    (index, sections) => {
      console.log('Sections:=>', sections);
      if (index === 0) {
        if (gameData?.review_id) {
          getGameReviewsData();
        } else {
          navigation.navigate('LeaveReview', {
            gameData,
            starAttributes,
            isRefereeAvailable: gameData.referees?.length > 0,
            onPressReviewDone,
          });
        }
      } else if (index === 1) {
        navigation.navigate('ReviewRefereeList', {
          gameData,
          sliderAttributesForReferee,
          starAttributesForReferee,
        });
      }
    },
    [
      gameData,
      getGameReviewsData,
      navigation,
      sliderAttributes,
      sliderAttributesForReferee,
      starAttributes,
      starAttributesForReferee,
    ],
  );

  const renderScoreRecordingButton = useMemo(
    () =>
      (isAdmin || isRefereeAdmin || isScorekeeperAdmin) &&
      gameData?.status !== GameStatus.ended ? (
        <TCGradientButton
          onPress={() =>
            navigation.navigate('SoccerRecording', {gameId: gameData?.game_id})
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
      ) : (
        <View />
      ),
    [
      gameData?.game_id,
      gameData?.status,
      isAdmin,
      isRefereeAdmin,
      isScorekeeperAdmin,
      navigation,
    ],
  );

  const renderLeaveAReviewButton = useMemo(
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
                    getGameReviewsData(gameData?.home_review_id);
                  } else if (gameData?.away_review_id) {
                    getGameReviewsData(gameData?.away_review_id);
                  } else {
                    navigation.navigate('LeaveReview', {
                      gameData,
                      selectedTeam: playerFrom === 'home' ? 'away' : 'home',
                      sliderAttributes,
                      starAttributes,
                      isRefereeAvailable: gameData.referees?.length > 0,
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
      getGameReviewsData,
      isAdmin,
      leaveReviewText,
      loading,
      navigation,
      playerFrom,
      showLeaveReviewButton,
      sliderAttributes,
      starAttributes,
    ],
  );

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

  const renderMatchRecordsSection = useMemo(
    () => (
      <MatchRecords
        navigation={navigation}
        isAdmin={isAdmin}
        gameId={gameData?.game_id}
        gameData={gameData}
        getGameMatchRecords={getGameMatchRecords}
      />
    ),
    [gameData, getGameMatchRecords, isAdmin, navigation],
  );

  const renderSpecialRulesSection = useMemo(
    () => <SpecialRules specialRulesData={gameData} />,
    [gameData],
  );

  const renderRefereesSection = useMemo(
    () => (
      <Referees
        getRefereeReservation={getRefereeReservation}
        gameData={gameData}
        navigation={navigation}
        isAdmin={isAdmin}
        isRefereeAdmin={isRefereeAdmin}
        isScorekeeperAdmin={isScorekeeperAdmin}
        userRole={userRole}
        followUser={followSoccerUser}
        unFollowUser={unFollowSoccerUser}
        onReviewPress={(referee) => {
          setPressedReferee(referee);
          if (referee?.review_id) {
            getRefereeReviewsData(referee);
          } else {
            navigation.navigate('RefereeReviewScreen', {
              gameData,
              userData: referee,
              sliderAttributesForReferee,
              starAttributesForReferee,
              onPressRefereeReviewDone,
            });
          }
        }}
      />
    ),
    [
      followSoccerUser,
      gameData,
      getRefereeReservation,
      getRefereeReviewsData,
      isAdmin,
      navigation,
      sliderAttributesForReferee,
      starAttributesForReferee,
      unFollowSoccerUser,
      userRole,
    ],
  );

  const renderScorekeeperSection = useMemo(
    () => (
      <Scorekeepers
        getScorekeeperReservation={getScorekeeperReservation}
        followUser={followSoccerUser}
        unFollowUser={unFollowSoccerUser}
        gameData={gameData}
        navigation={navigation}
        isAdmin={isAdmin}
        isRefereeAdmin={isRefereeAdmin}
        isScorekeeperAdmin={isScorekeeperAdmin}
        userRole={userRole}
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
      followSoccerUser,
      gameData,
      getScorekeeperReservation,
      getScorekeeperReviewsData,
      isAdmin,
      navigation,
      sliderAttributesForScorekeeper,
      starAttributesForScorekeeper,
      unFollowSoccerUser,
      userRole,
    ],
  );

  const renderGameFeedSection = useMemo(
    () => (
      <GameFeed
        getGameNextFeedData={getGameNextFeedData}
        gameFeedRefs={gameFeedFlatListRef}
        setUploadImageProgressData={setUploadImageProgressData}
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
      setUploadImageProgressData,
    ],
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
        patchGameReview(gameData?.game_id, reviewID, reviewObj, authContext)
          .then(() => {
            setLoading(false);
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
      } else {
        setLoading(true);
        addGameReview(gameData?.game_id, reviewsData, authContext)
          .then(() => {
            setLoading(false);
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
    [authContext, gameData?.game_id, getGameData],
  );
  const onPressReviewDone = useCallback(
    (currentForm, isAlreadyReviewed, reviewsData) => {
      const reviewData = {...reviewsData};
      const alreadyUrlDone = [];
      const createUrlData = [];

      if (reviewsData.attachments?.length > 0) {
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
            patchOrAddReview({
              currentForm,
              isAlreadyReviewed,
              reviewsData: dataParams,
            }),
        );
      } else {
        patchOrAddReview({currentForm, isAlreadyReviewed, reviewsData});
      }
    },
    [authContext, patchOrAddReview, imageUploadContext],
  );

  const onPressRefereeReviewDone = useCallback(
    (currentForm, isAlreadyReviewed, reviewsData, referee_id) => {
      const reviewData = {...reviewsData};
      const alreadyUrlDone = [];
      const createUrlData = [];

      if (reviewsData.attachments?.length > 0) {
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

      if (reviewsData.attachments?.length > 0) {
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

  const createInvoiceModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => recipientModalRef.current.close()}>
          Cancel
        </Text>

        <Text style={styles.titleText}>New Invoice</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
          }}>
          Send
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* <TCInnerLoader visible={loading} /> */}

      <View
        style={{
          marginBottom: hp(1),
          backgroundColor: colors.whiteColor,
          padding: 10,
        }}>
        {renderScoreRecordingButton}
        {renderLeaveAReviewButton}
      </View>

      {renderApproveDisapproveSection}
      {renderMatchRecordsSection}
      {renderSpecialRulesSection}
      {renderRefereesSection}
      {renderScorekeeperSection}
      {renderGameFeedSection}

      {isPopupVisible && (
        <Modal
          onBackdropPress={() => setIsPopupVisible(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
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
                  hitSlop={getHitSlop(15)}
                  onPress={() => {
                    setIsPopupVisible(false);
                    setSelectedTeamForReview();
                  }}>
                  <Image
                    source={images.cancelImage}
                    style={styles.closeButton}
                  />
                </TouchableWithoutFeedback>
                <Text style={styles.startTime}>Leave a team review</Text>
                <Text
                  style={styles.doneText}
                  onPress={() => {
                    setIsPopupVisible(false);
                    if (playerFrom === '' && selectedTeamForReview) {
                      if (selectedTeamForReview === 'home') {
                        if (gameData?.home_review_id) {
                          getGameReviewsData(gameData?.home_review_id);
                        } else {
                          navigation.navigate('LeaveReview', {
                            gameData,
                            selectedTeam: selectedTeamForReview,
                            sliderAttributes,
                            starAttributes,
                            isRefereeAvailable: gameData.referees?.length > 0,
                            onPressReviewDone,
                          });
                        }
                      }
                      if (selectedTeamForReview === 'away') {
                        if (gameData?.away_review_id) {
                          getGameReviewsData(gameData?.away_review_id);
                        } else {
                          navigation.navigate('LeaveReview', {
                            gameData,
                            selectedTeam: selectedTeamForReview,
                            sliderAttributes,
                            starAttributes,
                            isRefereeAvailable: gameData.referees?.length > 0,
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
                        <Text
                          style={styles.teamNameTextBlack}
                          numberOfLines={2}>
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
                        <Text
                          style={styles.teamNameTextBlack}
                          numberOfLines={2}>
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
      )}

      <ActionSheet
        ref={reviewOpetions}
        options={reviewOperationsActionSheetOptions}
        cancelButtonIndex={2}
        onPress={onReviewActionsheetItemPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
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
