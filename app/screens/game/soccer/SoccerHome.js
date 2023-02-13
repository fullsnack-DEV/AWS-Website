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
import {format} from 'react-string-format';
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
  getGameTimeline,
  getGameGallery,
  getGameMatchRecords,
  getGameRefereeReservation,
  getGameScorekeeperReservation,
  getGameStats,
  getAllLineUp,
  getGameNextTimeline,
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
import {strings} from '../../../../Localization/translation';
import GameStatus from '../../../Constants/GameStatus';
import fonts from '../../../Constants/Fonts';
import {checkReviewExpired, reviewExpiredDate} from '../../../utils/gameUtils';
import {ImageUploadContext} from '../../../context/ImageUploadContext';
import RefereeReservationStatus from '../../../Constants/RefereeReservationStatus';
import EntityReviewView from '../../../components/EntityReviewView';
import ScorekeeperReservationStatus from '../../../Constants/ScorekeeperReservationStatus';
import ReservationStatus from '../../../Constants/ReservationStatus';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {TAB_ITEMS} from '../../../utils/constant';

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
  const [starAttributes, setStarAttributes] = useState([]);
  const [sliderAttributesForReferee, setSliderAttributesForReferee] = useState(
    [],
  );

  const [starAttributesForReferee, setStarAttributesForReferee] = useState([]);

  const [sliderAttributesForScorekeeper, setSliderAttributesForScorekeeper] =
    useState([]);
  const [starAttributesForScorekeeper, setStarAttributesForScorekeeper] =
    useState([]);

  const [isShowReviewRow, setIsShowReviewRow] = useState(false);
  const [referee, setReferee] = useState([]);
  const [scorekeeper, setScorekeeper] = useState([]);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();

  useEffect(() => {
    if (isFocused && gameData) {
      const soccerSportData = authContext.sports?.filter(
          (item) => item.sport === gameData?.sport,
        )[0];

      const teamReviewProp = soccerSportData?.team_review_properties ?? [];
      const refereeReviewProp = soccerSportData?.referee_review_properties ?? [];
      const scorekeeperReviewProp = soccerSportData?.scorekeeper_review_properties ?? [];
      const starReviewProp = [];
      const sliderReviewPropForReferee = [];
      const starReviewPropForReferee = [];
      const sliderReviewPropForScorekeeper = [];
      const starReviewPropForScorekeeper = [];

      if (teamReviewProp?.length) {
          teamReviewProp.filter((item) => {
            if (item.type === 'star' || item.type === 'topstar' || item.type === 'bottomstar') {
            starReviewProp.push(item);
          }
          return true;
        });
        setStarAttributes([...starReviewProp]);
      }
      if (refereeReviewProp?.length) {
        refereeReviewProp.filter((item) => {
          if (item.type === 'slider') {
            sliderReviewPropForReferee.push(item.name.toLowerCase());
          } else if (item.type === 'star' || item.type === 'topstar' || item.type === 'bottomstar') {
            starReviewPropForReferee.push(item);
          }
          return true;
        });
        setSliderAttributesForReferee([...sliderReviewPropForReferee]);
        setStarAttributesForReferee([...starReviewPropForReferee]);
      }
      if (scorekeeperReviewProp?.length) {
        scorekeeperReviewProp.filter((item) => {
          if (item.type === 'slider') {
            sliderReviewPropForScorekeeper.push(item.name.toLowerCase());
          } else if (item.type === 'star' || item.type === 'topstar' || item.type === 'bottomstar') {
            starReviewPropForScorekeeper.push(item);
          }
          return true;
        });
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

      let reviewFillingStatus = 0;

      if (
        homeID === authContext.entity.uid ||
        awayID === authContext.entity.uid
      ) {
        if (homeID === authContext.entity.uid) {
          if (gameObject?.away_review_id) {
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
        return strings.leaveReview;
      }
      if (reviewFillingStatus === 1) {
        return strings.leaveEditReview;
      }
      return strings.editReview;
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
    () => getGameTimeline(soccerGameId, authContext),
    [authContext, soccerGameId],
  );
  const getGameNextFeedData = useCallback(
    (last_id) => getGameNextTimeline(soccerGameId, last_id, authContext),
    [authContext, soccerGameId],
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
            resetGameDetail(soccerGameId);
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
      soccerGameId,
    ],
  );

  const resetGameDetail = useCallback(
    (gameId) => {
      setLoading(true);
      resetGame(gameId, authContext)
        .then(() => {
          setLoading(false);
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
        patchScorekeeperReview(
          scorekeeper_id,
          soccerGameId,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            getGameDetails()
              .then(() => {
                setLoading(false);
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
          soccerGameId,
          reviewsData,
          authContext,
        )
          .then(() => {
            getGameDetails()
              .then(() => {
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
    [authContext, getGameDetails, isShowReviewRow, navigation, soccerGameId],
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
        patchRefereeReview(
          referee_id,
          soccerGameId,
          reviewID,
          reviewObj,
          authContext,
        )
          .then(() => {
            getGameDetails()
              .then(() => {
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
        addRefereeReview(referee_id, soccerGameId, reviewsData, authContext)
          .then(() => {
            getGameDetails()
              .then(() => {
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
    [authContext, getGameDetails, isShowReviewRow, navigation, soccerGameId],
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

  const getRefereeReviewsData = useCallback(
    (item) => {
      setLoading(true);
      getGameReview(soccerGameId, item.review_id, authContext)
        .then((response) => {
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
          setTimeout(() => Alert.alert(strings.appName, error?.message), 100);
        });
    },
    [
      authContext,
      gameData,
      navigation,
      onPressRefereeReviewDone,
      sliderAttributesForReferee,
      soccerGameId,
      starAttributesForReferee,
    ],
  );

  const getScorekeeperReviewsData = useCallback(
    (item) => {
      setLoading(true);
      getGameReview(soccerGameId, item.review_id, authContext)
        .then((response) => {
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
          setTimeout(() => Alert.alert(strings.appName, error?.message), 100);
        });
    },
    [
      authContext,
      gameData,
      navigation,
      onPressScorekeeperReviewDone,
      sliderAttributesForScorekeeper,
      soccerGameId,
      starAttributesForScorekeeper,
    ],
  );

  useEffect(() => {
    if (isFocused) {
      getRefereeReservation(soccerGameId).then((res) => {
        const refData = res?.payload?.filter(
          (item) =>
            ![
              RefereeReservationStatus.cancelled,
              RefereeReservationStatus.approved,
            ].includes(item?.status),
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
        setReferee([...cloneRefData]);
      });
    }
  }, [
    authContext?.entity?.uid,
    gameData,
    getRefereeReservation,
    isFocused,
    soccerGameId,
  ]);

  useEffect(() => {
    getScorekeeperReservation(soccerGameId).then((res) => {
      const refData = res?.payload?.filter(
        (item) =>
          ![
            ScorekeeperReservationStatus.cancelled,
            ScorekeeperReservationStatus.approved,
          ].includes(item?.status),
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
  }, [
    authContext?.entity?.uid,
    gameData,
    getScorekeeperReservation,
    soccerGameId,
  ]);

  const isCheckReviewButton = useCallback(
    (reservationDetail) => {
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
      getGameReview(soccerGameId, reviewID, authContext)
        .then((response) => {
          modalizeRef.current.close();
          navigation.navigate('LeaveReview', {
            gameData,
            gameReviewData: response.payload,
            selectedTeam: isHome ? 'home' : 'away',
            starAttributes,
            isRefereeAvailable: gameData.referees?.length > 0,
            onPressReviewDone,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('', error?.message), 100);
        });
    },
    [authContext, gameData, navigation, starAttributes],
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

        patchGameReview(soccerGameId, reviewID, reviewObj, authContext)
          .then(() => {
            setLoading(false);
            getGameDetails().then(() => {
              setLoading(false);
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
        setLoading(true);
        addGameReview(soccerGameId, reviewsData, authContext)
          .then(() => {
            setLoading(false);
            getGameDetails().then(() => {
              setLoading(false);
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
    [authContext, soccerGameId, getGameDetails, isShowReviewRow],
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
      let reviewID = '';
      if (reservationDetail?.isHome) {
        if (gameData?.home_review_id) {
          isReviewed = true;
          reviewID = gameData.home_review_id
        }
      } else if (gameData?.away_review_id) {
        isReviewed = true;
        reviewID = gameData.away_review_id
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
            if (isReviewed) {
              getGameReviewsData(reviewID,reservationDetail.isHome);
            } else {
              modalizeRef.current.close();
              navigation.navigate('LeaveReview', {
                gameData,
                selectedTeam: reservationDetail?.isHome ? 'home' : 'away',
                starAttributes,
                isRefereeAvailable: gameData?.referees?.length > 0,
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
      starAttributes,
      onPressReviewDone,
    ],
  );

  const renderReferees = useCallback(
    ({item}) => {
      const reservationDetail = item; // item?.reservation

      return (
        <EntityReviewView
          myUserId={authContext.entity.uid}
          isShowReviewButton={isCheckReviewButton(reservationDetail)}
          isReviewed={!!item.referee.review_id} // we have to change this condition if both player can give review to referee
          userID={reservationDetail.referee.user_id}
          title={reservationDetail.referee.full_name}
          subTitle={item.chief_referee ? 'Chief' : 'Assistant'}
          profileImage={reservationDetail?.referee?.thumbnail}
          onReviewPress={() => {
            if (item.referee.review_id) {
              getRefereeReviewsData(item.referee);
            } else {
              modalizeRef.current.close();
              navigation.navigate('RefereeReviewScreen', {
                gameData,
                userData: item.referee,
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
          isReviewed={!!item.scorekeeper.review_id} // we have to change this condition if both player can give review to referee
          userID={reservationDetail.scorekeeper.user_id}
          title={reservationDetail.scorekeeper.full_name}
          profileImage={reservationDetail.scorekeeper.thumbnail}
          onReviewPress={() => {
            if (item.scorekeeper.review_id) {
              getScorekeeperReviewsData(item.scorekeeper);
            } else {
              modalizeRef.current.close();
              navigation.navigate('ScorekeeperReviewScreen', {
                gameData,
                userData: item.scorekeeper,
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
      <SafeAreaView>
        <View>{renderImageProgress}</View>
      </SafeAreaView>
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
          {strings.pleaseLeaveReview}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.RRegular,
            color: colors.darkThemeColor,
            textAlign: 'center',
            marginTop: 15,
          }}>
          {format(
            strings.reviewPeriodExpires,
            reviewExpiredDate(gameData?.review_expired_period),
          )}
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
          {strings.reviewWillDisplayDesc}
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
                  <Text style={styles.refereeTitle}>{strings.teamstitle}</Text>
                  <FlatList
                    data={getTeams()}
                    renderItem={renderTeams}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}

              {!isRefereeAdmin && !isScorekeeperAdmin && referee.length > 0 && (
                <View>
                  <Text style={styles.refereeTitle}>
                    {strings.refereesTitle}
                  </Text>
                  <FlatList
                    data={referee}
                    renderItem={renderReferees}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}

              {!isScorekeeperAdmin &&
                !isRefereeAdmin &&
                scorekeeper.length > 0 && (
                  <View>
                    <Text style={styles.scorekeeperTitle}>
                      {strings.scorekeeperTitle}
                    </Text>

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
