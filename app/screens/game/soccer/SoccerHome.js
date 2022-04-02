/* eslint-disable consistent-return */
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../../Constants/Colors';
import TCBorderButton from '../../../components/TCBorderButton';

import TopBackgroundHeader from '../../../components/game/soccer/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/soccer/home/summary/Summary';
import Stats from '../../../components/game/soccer/home/stats/Stats';
import Gallery from '../../../components/game/common/gallary/Gallery';
import {
  approveDisapproveGameRecords,
  createGamePost,
  getGameData,
  getGameFeed,
  getGameGallery,
  getGameMatchRecords,
  getGameRefereeReservation,
  getGameScorekeeperReservation,
  getGameStats,
  getAllLineUp,
  getGameNextFeed,
  resetGame,
  getGameReview,
  addRefereeReview,
  patchRefereeReview,
  addScorekeeperReview,
  patchScorekeeperReview,
  addGameReview,
  patchGameReview,
} from '../../../api/Games';
import AuthContext from '../../../auth/context';
import {followUser, unfollowUser} from '../../../api/Users';

import LineUp from '../../../components/game/soccer/home/lineUp/LineUp';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import GameHomeShimer from '../../../components/shimmer/game/GameHomeShimer';
import strings from '../../../Constants/String';
import GameStatus from '../../../Constants/GameStatus';
import fonts from '../../../Constants/Fonts';
import {checkReviewExpired, reviewExpiredDate} from '../../../utils/gameUtils';
import {ImageUploadContext} from '../../../context/ImageUploadContext';
import RefereeReservationStatus from '../../../Constants/RefereeReservationStatus';
import EntityReviewView from '../../../components/EntityReviewView';
import ScorekeeperReservationStatus from '../../../Constants/ScorekeeperReservationStatus';
import ReservationStatus from '../../../Constants/ReservationStatus';
import ActivityLoader from '../../../components/loader/ActivityLoader';

const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Gallery'];
const SoccerHome = ({navigation, route}) => {
  const gameFeedFlatListRef = useRef(null);
  const imageUploadContext = useContext(ImageUploadContext);

  const modalizeRef = useRef(null);

  const [fistTimeLoad, setFirstTimeLoad] = useState(true);
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const galleryRef = useRef(null);

  const [soccerGameId] = useState(route?.params?.gameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRefereeAdmin, setIsRefereeAdmin] = useState(false);
  const [isScorekeeperAdmin, setIsScorekeeperAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);
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

  const [isShowReviewRow, setIsShowReviewRow] = useState(false);
  const [referee, setReferee] = useState([]);
  const [scorekeeper, setScorekeeper] = useState([]);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();

  useEffect(() => {
    if (isFocused && gameData) {
      const soccerSportData =
        authContext?.sports?.length &&
        authContext?.sports?.filter(
          (item) => item.sport === gameData?.sport,
        )[0];

      console.log('soccerSportData', soccerSportData);
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
        console.log(
          'sliderReviewPropForScorekeeper',
          sliderReviewPropForScorekeeper,
        );
        console.log(
          'starReviewPropForScorekeeper',
          starReviewPropForScorekeeper,
        );
        setSliderAttributesForScorekeeper([...sliderReviewPropForScorekeeper]);
        setStarAttributesForScorekeeper([...starReviewPropForScorekeeper]);
      }
    }
  }, [gameData, isFocused]);

  useEffect(() => {
    if (
      gameData?.status === 'ended' &&
      gameData?.review_expired_period &&
      !checkReviewExpired(gameData?.review_expired_period) &&
      // gameData?.approval?.home_team?.approved &&
      // gameData?.approval?.away_team?.approved &&
      (isRefereeAdmin || isScorekeeperAdmin || isAdmin)
    ) {
      modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
    }
  }, [
    gameData?.review_expired_period,
    gameData?.status,
    isAdmin,
    isRefereeAdmin,
    isScorekeeperAdmin,
    isShowReviewRow,
  ]);

  useEffect(() => {
    getGameDetails()
      .then(() => {
        setFirstTimeLoad(false);
      })
      .catch(() => {
        setFirstTimeLoad(false);
      });
  }, []);
  const getLeaveReviewTitle = useCallback(
    (gameObject) => {
      const homeID = homeTeam?.group_id ?? homeTeam?.user_id;
      const awayID = awayTeam?.group_id ?? awayTeam?.user_id;

      console.log('gameObject::=>', gameObject);
      let reviewFillingStatus = 0;

      if (
        homeID === authContext.entity.uid ||
        awayID === authContext.entity.uid
      ) {
        if (homeID === authContext.entity.uid) {
          console.log('homeIIID');
          if (gameObject?.away_review_id) {
            const refereeReviews = gameObject?.referees?.filter(
              (obj) => obj?.review_id,
            );
            const scorekeeperReviews = gameObject?.scorekeepers?.filter(
              (obj) => obj?.review_id,
            );

            if (
              refereeReviews.length === gameObject?.referees?.length &&
              scorekeeperReviews.length === gameObject?.scorekeepers?.length
            ) {
              reviewFillingStatus = 2;
            } else {
              reviewFillingStatus = 1;
            }
          } else {
            const refereeReviews = gameObject?.referees?.filter(
              (obj) => obj?.review_id,
            );
            const scorekeeperReviews = gameObject?.scorekeepers?.filter(
              (obj) => obj?.review_id,
            );

            if (
              refereeReviews?.length === gameObject?.referees?.length ||
              scorekeeperReviews?.length === gameObject?.scorekeepers?.length
            ) {
              reviewFillingStatus = 1;
            } else {
              reviewFillingStatus = 0;
            }
          }
        }
        if (awayID === authContext.entity.uid) {
          console.log('awayIIID');

          if (gameObject?.home_review_id) {
            const refereeReviews = gameObject?.referees?.filter(
              (obj) => obj?.review_id,
            );
            const scorekeeperReviews = gameObject?.scorekeepers?.filter(
              (obj) => obj?.review_id,
            );

            if (
              refereeReviews?.length === gameObject?.referees?.length &&
              scorekeeperReviews?.length === gameObject?.scorekeepers?.length
            ) {
              reviewFillingStatus = 2;
            } else {
              reviewFillingStatus = 1;
            }
          } else {
            console.log('awayELSEIIID');
            const refereeReviews = gameObject?.referees?.filter(
              (obj) => obj?.review_id,
            );
            const scorekeeperReviews = gameObject?.scorekeepers?.filter(
              (obj) => obj?.review_id,
            );

            console.log('refereeReviews.length', gameObject?.referees?.length);
            if (
              refereeReviews?.length === gameObject?.referees?.length ||
              scorekeeperReviews?.length === gameObject?.scorekeepers?.length
            ) {
              console.log('awayELSEIIID1');
              reviewFillingStatus = 1;
            } else {
              console.log('awayELSEIIID0');
              reviewFillingStatus = 0;
            }
          }
        }
      } else if (isRefereeAdmin || isScorekeeperAdmin) {
        if (gameObject?.home_review_id && gameObject?.away_review_id) {
          reviewFillingStatus = 2;
        } else if (!gameObject?.home_review_id && !gameObject?.away_review_id) {
          reviewFillingStatus = 0;
        } else {
          if (!gameObject?.home_review_id) {
            reviewFillingStatus = 1;
          }
          if (!gameObject?.away_review_id) {
            reviewFillingStatus = 1;
          }
        }
      }

      if (reviewFillingStatus === 0) {
        return 'LEAVE REVIEW';
      }
      if (reviewFillingStatus === 1) {
        return 'LEAVE OR EDIT A REVIEW';
      }
      return 'EDIT REVIEW';
    },
    [
      authContext.entity.uid,
      awayTeam?.group_id,
      awayTeam?.user_id,
      homeTeam?.group_id,
      homeTeam?.user_id,
      isRefereeAdmin,
      isScorekeeperAdmin,
    ],
  );

  console.log('soccerGameId:=>', soccerGameId);

  const getSoccerGameData = useCallback(
    (gameId = soccerGameId, fetchTeamData = true) =>
      getGameData(gameId, fetchTeamData, authContext),
    [authContext, soccerGameId],
  );

  const getGameDetails = useCallback(
    () =>
      new Promise((resolve, reject) => {
        getSoccerGameData(soccerGameId, true, authContext)
          .then((res) => {
            setGameData(res.payload);

            setHomeTeam(res.payload.home_team);
            setAwayTeam(res.payload.away_team);
            console.log('GET GAME DETAIL::', res.payload);
            if (res.status) {
              const entity = authContext.entity;
              setUserRole(entity?.role);
              setUserId(entity?.uid);
              const homeTeamId = res?.payload?.user_challenge
                ? res?.payload?.home_team?.user_id
                : res?.payload?.home_team?.group_id;
              const awayTeamId = res?.payload?.user_challenge
                ? res?.payload?.away_team?.user_id
                : res?.payload?.away_team?.group_id;
              let refereeIds = [];
              refereeIds = res?.payload?.referees?.map((e) => e.referee_id);
              const teamIds = [homeTeamId, awayTeamId];
              const checkIsAdmin = teamIds?.includes(entity?.uid);
              const checkIsRefereeAdmin = refereeIds?.includes(entity?.uid);

              let scorekeeperIds = [];
              scorekeeperIds = res?.payload?.scorekeepers?.map(
                (e) => e.scorekeeper_id,
              );
              const checkIsScorekeeperAdmin = scorekeeperIds?.includes(
                entity?.uid,
              );

              setIsAdmin(checkIsAdmin);
              setIsRefereeAdmin(checkIsRefereeAdmin);
              setIsScorekeeperAdmin(checkIsScorekeeperAdmin);
            }
            resolve(true);
          })
          .catch((error) => {
            console.log(error);
            reject(new Error(error));
          });
      }),
    [authContext, getSoccerGameData, soccerGameId],
  );

  const getGameLineUp = useCallback(
    (gameId = soccerGameId) => getAllLineUp(gameId, authContext),
    [authContext, soccerGameId],
  );
  const followSoccerUser = useCallback(
    (params, userID) => followUser(params, userID, authContext),
    [authContext],
  );
  const unFollowSoccerUser = useCallback(
    (params, userID) => unfollowUser(params, userID, authContext),
    [authContext],
  );
  const getSoccerGameMatchRecords = useCallback(
    (gameId) => getGameMatchRecords(gameId, authContext),
    [authContext],
  );
  const approveDisapproveGameScore = useCallback(
    (gameId, teamId, type, params) =>
      approveDisapproveGameRecords(gameId, teamId, type, params, authContext),
    [authContext],
  );
  const getSoccerGameStats = useCallback(
    (gameId) => getGameStats(gameId, authContext),
    [authContext],
  );

  const getSoccerGalleryData = useCallback(
    (gameId) => getGameGallery(gameId, authContext),
    [authContext],
  );
  const getGameSportsList = authContext?.sports;
  const getRefereeReservation = useCallback(
    (gameId = soccerGameId) =>
      getGameRefereeReservation(gameId, true, false, authContext),
    [authContext],
  );
  const getScorekeeperReservation = useCallback(
    (gameId = soccerGameId) =>
      getGameScorekeeperReservation(gameId, authContext),
    [authContext],
  );
  const getGameFeedData = useCallback(
    () => getGameFeed(gameData?.game_id, authContext),
    [authContext, gameData?.game_id],
  );
  const getGameNextFeedData = useCallback(
    (last_id) => getGameNextFeed(gameData?.game_id, last_id, authContext),
    [authContext, gameData?.game_id],
  );
  const createGamePostData = useCallback(
    (params) => createGamePost(params, authContext),
    [authContext],
  );

  const renderSummaryTab = useMemo(
    () => (
      <Summary
        getGameNextFeedData={getGameNextFeedData}
        gameFeedFlatListRef={gameFeedFlatListRef}
        createGamePostData={createGamePostData}
        getGameFeedData={getGameFeedData}
        getRefereeReservation={getRefereeReservation}
        getScorekeeperReservation={getScorekeeperReservation}
        getSportsList={getGameSportsList}
        getSoccerGameStats={getSoccerGameStats}
        getGameData={getSoccerGameData}
        approveDisapproveGameScore={approveDisapproveGameScore}
        getGameMatchRecords={getSoccerGameMatchRecords}
        unFollowSoccerUser={unFollowSoccerUser}
        followSoccerUser={followSoccerUser}
        navigation={navigation}
        gameData={gameData}
        isAdmin={isAdmin}
        isRefereeAdmin={isRefereeAdmin}
        isScorekeeperAdmin={isScorekeeperAdmin}
        userRole={userRole}
        userId={userId}
        getGameLineUp={getGameLineUp}
        getGameDetails={getGameDetails}
      />
    ),
    [
      approveDisapproveGameScore,
      createGamePostData,
      followSoccerUser,
      gameData,
      getGameDetails,
      getGameFeedData,
      getGameLineUp,
      getGameNextFeedData,
      getGameSportsList,
      getRefereeReservation,
      getScorekeeperReservation,
      getSoccerGameData,
      getSoccerGameMatchRecords,
      getSoccerGameStats,
      isAdmin,
      isRefereeAdmin,
      isScorekeeperAdmin,
      navigation,
      unFollowSoccerUser,
      userId,
      userRole,
    ],
  );

  const renderLineUpTab = useMemo(
    () => <LineUp navigation={navigation} gameData={gameData} />,
    [gameData, navigation],
  );

  const renderStatsTab = useMemo(
    () => (
      <Stats
        homeTeamName={gameData?.home_team?.group_name}
        awayTeamName={gameData?.away_team?.group_name}
        getGameStatsData={getSoccerGameStats}
        gameData={gameData}
      />
    ),
    [gameData, getSoccerGameStats],
  );

  const renderGalleryTab = useMemo(
    () => (
      <Gallery
        isAdmin={isAdmin}
        gameData={gameData}
        getGalleryData={getSoccerGalleryData}
        navigation={navigation}
        galleryRef={galleryRef}
      />
    ),
    [gameData, getSoccerGalleryData, isAdmin, navigation],
  );

  const renderTabContain = useCallback(
    (tabKey) => (
      <View style={{flex: 1}}>
        {tabKey === 0 && renderSummaryTab}
        {tabKey === 1 && renderLineUpTab}
        {tabKey === 2 && renderStatsTab}
        {tabKey === 3 && renderGalleryTab}
      </View>
    ),
    [renderGalleryTab, renderLineUpTab, renderStatsTab, renderSummaryTab],
  );

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const onEndReached = useCallback(() => {
    if (currentTab === 0 && gameFeedFlatListRef?.current?.onEndReached)
      gameFeedFlatListRef.current.onEndReached();
  }, [currentTab]);

  const renderTopHeaderWithTabContain = useMemo(
    () => (
      <TopBackgroundHeader
        onEndReached={onEndReached}
        onBackPress={route?.params?.onBackPress}
        isAdmin={isAdmin}
        navigation={navigation}
        gameData={gameData}
        onResetGame={() => {
          if (
            gameData?.status === GameStatus.accepted ||
            gameData?.status === GameStatus.reset
          ) {
            Alert.alert(strings.gameNotStarted);
          } else if (gameData?.status === GameStatus.ended) {
            Alert.alert(strings.gameEnded);
          } else {
            resetGameDetail(gameData?.game_id);
          }
        }}>
        <TCScrollableProfileTabs
          tabItem={TAB_ITEMS}
          onChangeTab={(ChangeTab) => setCurrentTab(ChangeTab.i)}
          currentTab={currentTab}
          renderTabContain={renderTabContain}
        />
      </TopBackgroundHeader>
    ),
    [
      currentTab,
      gameData,
      isAdmin,
      navigation,
      onEndReached,
      renderTabContain,
      route?.params?.onBackPress,
    ],
  );

  const resetGameDetail = useCallback(
    (gameId) => {
      setLoading(true);
      resetGame(gameId, authContext)
        .then((response) => {
          setLoading(false);
          console.log('RESET GAME RESPONSE::', response.payload);
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext],
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
    [imageUploadContext, authContext],
  );

  const patchOrAddScorekeeperReview = useCallback(
    // eslint-disable-next-line no-unused-vars
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
          soccerGameId,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            getGameDetails().then(() => {
              modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
            })
            .catch(() => {
              setFirstTimeLoad(false);
            });
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
           
            getGameDetails().then(() => {
              setLoading(false);
              modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
            })
            .catch(() => {
              setFirstTimeLoad(false);
              setLoading(false);
            });
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
    [authContext, gameData?.game_id, getGameDetails, navigation, soccerGameId],
  );

  const patchOrAddRefereeReview = useCallback(
    // eslint-disable-next-line no-unused-vars
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
          soccerGameId,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            getGameDetails().then(() => {
              setLoading(false);
              modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
            })
            .catch(() => {
              setFirstTimeLoad(false);
              setLoading(false);
            });
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
            getGameDetails().then(() => {
              setLoading(false);
              modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
            })
            .catch(() => {
              setFirstTimeLoad(false);
              setLoading(false);
            });
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
    [
      authContext,
      gameData?.game_id,
      getGameDetails,
      isShowReviewRow,
      navigation,
      soccerGameId,
    ],
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

  const getRefereeReviewsData = useCallback(
    (item) => {
      setLoading(true);
      getGameReview(gameData?.game_id, item?.review_id, authContext)
        .then((response) => {
          console.log('Get review of referee::=>', response.payload);
          modalizeRef.current.close();
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
      onPressRefereeReviewDone,
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
          modalizeRef.current.close();
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
      onPressScorekeeperReviewDone,
      sliderAttributesForScorekeeper,
      starAttributesForScorekeeper,
    ],
  );

  useEffect(() => {
    if (isFocused) {
      getRefereeReservation(gameData?.game_id).then((res) => {
        const refData = res?.payload?.filter(
          (item) =>
            ![RefereeReservationStatus.cancelled].includes(item?.status),
        );
        const cloneRefData = [];
        refData.map((item) => {
          const isExpired =
            new Date(item?.expiry_datetime * 1000).getTime() <
            new Date().getTime();
          if (
            item?.status === RefereeReservationStatus.offered &&
            !isExpired &&
            item?.initiated_by === authContext?.entity?.uid
          ) {
            cloneRefData.push(item);
          } else if (item?.status !== RefereeReservationStatus.offered) {
            cloneRefData.push(item);
          }
          return false;
        });
        console.log('referee reservation:=>', cloneRefData);
        setReferee([...cloneRefData]);
      });
    }
  }, [authContext?.entity?.uid, gameData, getRefereeReservation, isFocused]);

  useEffect(() => {
    getScorekeeperReservation(gameData?.game_id).then((res) => {
      console.log('Scorekeeper reservation::=>', res);
      const refData = res?.payload?.filter(
        (item) =>
          ![ScorekeeperReservationStatus.cancelled].includes(item?.status),
      );
      const cloneRefData = [];
      refData.map((item) => {
        const isExpired =
          new Date(item?.expiry_datetime * 1000).getTime() <
          new Date().getTime();
        if (
          item?.status === ScorekeeperReservationStatus.offered &&
          !isExpired &&
          item?.initiated_by === authContext?.entity?.uid
        ) {
          cloneRefData.push(item);
        } else if (item?.status !== ScorekeeperReservationStatus.offered) {
          cloneRefData.push(item);
        }
        return false;
      });
      setScorekeeper([...cloneRefData]);
    });
  }, [authContext?.entity?.uid, gameData, getScorekeeperReservation]);

  const isCheckReviewButton = useCallback(
    (reservationDetail) => {
      console.log('gameData?.status', isScorekeeperAdmin);
      if (
        gameData?.status === GameStatus.ended &&
        ![
          ReservationStatus.offered,
          ReservationStatus.cancelled,
          ReservationStatus.declined,
        ].includes(reservationDetail?.status) &&
        !checkReviewExpired(gameData?.review_expired_period) &&
        (isAdmin || isScorekeeperAdmin || isRefereeAdmin)
      ) {
        return true;
      }

      return false;
    },
    [
      gameData?.review_expired_period,
      gameData?.status,
      isAdmin,
      isRefereeAdmin,
      isScorekeeperAdmin,
    ],
  );
  const getGameReviewsData = useCallback(
    (reviewID, isHome) => {
      setLoading(true);
      getGameReview(gameData?.game_id, reviewID, authContext)
        .then((response) => {
          console.log(
            'Edit Review By Review ID Response::=>',
            response.payload,
          );
          console.log('selectedTeamForReview::=>', isHome);
          modalizeRef.current.close();
          navigation.navigate('LeaveReview', {
            gameData,
            gameReviewData: response.payload,
            selectedTeam: isHome ? 'home' : 'away',
            sliderAttributes,
            starAttributes,
            onPressReviewDone,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100);
        });
    },
    [authContext, gameData, navigation, sliderAttributes, starAttributes],
  );

  const patchOrAddReview = useCallback(
    // eslint-disable-next-line no-unused-vars
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
        patchGameReview(gameData?.game_id, reviewID, reviewObj, authContext)
          .then(() => {
            setLoading(false);
            getGameDetails().then(() => {
              modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
            });
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
        addGameReview(gameData?.game_id, reviewsData, authContext)
          .then(() => {
            setLoading(false);
            getGameDetails().then(() => {
              modalizeRef.current.open(isShowReviewRow ? 'top' : 'default');
            });
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
    [authContext, gameData?.game_id, getGameDetails, isShowReviewRow],
  );

  const onPressReviewDone = useCallback(
    (currentForm, isAlreadyReviewed, reviewsData) => {
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

  const renderTeams = useCallback(
    ({item}) => {
      const reservationDetail = item; // item?.reservation
      let isReviewed = false;
      if (reservationDetail?.isHome) {
        if (gameData?.home_review_id) {
          isReviewed = true;
        }
      } else if (gameData?.away_review_id) {
        isReviewed = true;
      }

      return (
        <EntityReviewView
          myUserId={authContext.entity.uid}
          isShowReviewButton={isCheckReviewButton(reservationDetail)}
          isReviewed={isReviewed} // we have to change this condition if both player can give review to referee
          userID={reservationDetail?.group_id}
          title={reservationDetail?.group_name}
          profileImage={reservationDetail?.thumbnail}
          onReviewPress={() => {
            if (reservationDetail?.isHome) {
              if (gameData?.home_review_id) {
                getGameReviewsData(
                  gameData?.home_review_id,
                  reservationDetail?.isHome,
                );
              } else {
                modalizeRef.current.close();
                navigation.navigate('LeaveReview', {
                  gameData,
                  selectedTeam: reservationDetail?.isHome ? 'home' : 'away',
                  sliderAttributes,
                  starAttributes,
                  onPressReviewDone,
                });
              }
            } else if (gameData?.away_review_id) {
              getGameReviewsData(
                gameData?.away_review_id,
                reservationDetail?.isHome,
              );
            } else {
              modalizeRef.current.close();
              navigation.navigate('LeaveReview', {
                gameData,
                selectedTeam: reservationDetail?.isHome ? 'home' : 'away',
                sliderAttributes,
                starAttributes,
                onPressReviewDone,
              });
            }
          }}
        />
      );
    },
    [
      authContext.entity.uid,
      isCheckReviewButton,
      gameData,
      getGameReviewsData,
      navigation,
      sliderAttributes,
      starAttributes,
      onPressReviewDone,
    ],
  );

  const renderReferees = useCallback(
    ({item}) => {
      const reservationDetail = item; // item?.reservation
      console.log('reservation detail referees::=>>>', reservationDetail);

      return (
        <EntityReviewView
          myUserId={authContext.entity.uid}
          isShowReviewButton={isCheckReviewButton(reservationDetail)}
          isReviewed={!!item?.referee?.review_id} // we have to change this condition if both player can give review to referee
          userID={reservationDetail?.referee?.user_id}
          title={reservationDetail?.referee?.full_name}
          subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
          profileImage={reservationDetail?.referee?.thumbnail}
          onReviewPress={() => {
            console.log('Referee Pressed:=>', referee);
            if (item?.referee?.review_id) {
              getRefereeReviewsData(referee);
            } else {
              modalizeRef.current.close();
              navigation.navigate('RefereeReviewScreen', {
                gameData,
                userData: item?.referee,
                sliderAttributesForReferee,
                starAttributesForReferee,
                onPressRefereeReviewDone,
              });
            }
          }}
        />
      );
    },
    [
      authContext.entity.uid,
      isCheckReviewButton,
      referee,
      getRefereeReviewsData,
      navigation,
      gameData,
      sliderAttributesForReferee,
      starAttributesForReferee,
      onPressRefereeReviewDone,
    ],
  );

  const renderScorekeepers = useCallback(
    ({item}) => {
      const reservationDetail = item;

      return (
        <EntityReviewView
          myUserId={authContext.entity.uid}
          isShowReviewButton={isCheckReviewButton(reservationDetail)}
          isReviewed={!!item?.scorekeeper?.review_id} // we have to change this condition if both player can give review to referee
          userID={reservationDetail?.scorekeeper?.user_id}
          title={reservationDetail?.scorekeeper?.full_name}
          profileImage={reservationDetail?.scorekeeper?.thumbnail}
          onReviewPress={() => {
            console.log('scorekeeper Pressed:=>', scorekeeper);
            if (item?.scorekeeper?.review_id) {
              getScorekeeperReviewsData(scorekeeper);
            } else {
              modalizeRef.current.close();
              navigation.navigate('ScorekeeperReviewScreen', {
                gameData,
                userData: item?.scorekeeper,
                sliderAttributesForScorekeeper,
                starAttributesForScorekeeper,
                onPressScorekeeperReviewDone,
              });
            }
          }}
        />
      );
    },
    [
      authContext.entity.uid,
      gameData,
      getScorekeeperReviewsData,
      isCheckReviewButton,
      navigation,
      onPressScorekeeperReviewDone,
      scorekeeper,
      sliderAttributesForScorekeeper,
      starAttributesForScorekeeper,
    ],
  );

  const getTeams = useCallback(() => {
    if (gameData?.home_team?.group_id === authContext.entity.uid) {
      return [{...awayTeam, isHome: false}];
    }
    if (gameData?.away_team?.group_id === authContext.entity.uid) {
      return [{...homeTeam, isHome: true}];
    }
    return [
      {...homeTeam, isHome: true},
      {...awayTeam, isHome: false},
    ];
  }, [
    authContext.entity.uid,
    awayTeam,
    gameData?.away_team?.group_id,
    gameData?.home_team?.group_id,
    homeTeam,
  ]);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {fistTimeLoad ? (
        <GameHomeShimer navigation={navigation} />
      ) : (
        renderTopHeaderWithTabContain
      )}
      {renderImageProgress}
      <Modalize
        ref={modalizeRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        snapPoint={300}
        HeaderComponent={
          <View style={{alignItems: 'center', marginTop: 15, marginBottom: 15}}>
            <View
              style={{
                backgroundColor: colors.modalHandleColor,
                height: 5,
                width: 40,
                borderRadius: 10,
              }}
            />
          </View>
        }
        withHandle={false}
        overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RBold,
            color: colors.lightBlackColor,
            textAlign: 'center',
          }}>
          Please leave a review.
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.RRegular,
            color: colors.darkThemeColor,
            textAlign: 'center',
            marginTop: 15,
          }}>
          {`The review period will be expires within ${reviewExpiredDate(
            gameData?.review_expired_period,
          )}.`}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
            textAlign: 'left',
            margin: 30,
            marginTop: 15,
          }}>
          Your reviews will be displayed after the review period expires or all
          teams, referees, scorekeepers complete their reviews.
        </Text>
        <SafeAreaView>
          {!isShowReviewRow ? (
            <TCBorderButton
              title={getLeaveReviewTitle(gameData)}
              height={45}
              fontSize={16}
              borderColor={colors.whiteColor}
              shadow={true}
              onPress={() => {
                setIsShowReviewRow(true);
              }}
            />
          ) : (
            <View>
              {(isAdmin || isRefereeAdmin || isScorekeeperAdmin) && (
                <View>
                  <Text style={styles.refereeTitle}>Teams</Text>
                  <FlatList
                    data={getTeams()}
                    renderItem={renderTeams}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}

              {!isRefereeAdmin && !isScorekeeperAdmin && (
                <View>
                  <Text style={styles.refereeTitle}>Referees</Text>
                  <FlatList
                    data={referee}
                    renderItem={renderReferees}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}

              {!isScorekeeperAdmin && !isRefereeAdmin && (
                <View>
                  <Text style={styles.scorekeeperTitle}>Scorekeepers</Text>

                  <FlatList
                    data={scorekeeper}
                    renderItem={renderScorekeepers}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  refereeTitle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'left',
    marginLeft: 15,
    marginTop: 15,
  },
  scorekeeperTitle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'left',
    marginLeft: 15,
    marginTop: 15,
  },
});
export default SoccerHome;
