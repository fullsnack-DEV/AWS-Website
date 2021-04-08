import React, {
  useEffect, useState, useContext, useMemo, useCallback, useRef,
} from 'react';
import {
  View,
  StyleSheet, Alert,
} from 'react-native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TopBackgroundHeader from '../../../components/game/tennis/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/tennis/home/summary/Summary';
import Gallery from '../../../components/game/common/gallary/Gallery';
import Stats from '../../../components/game/tennis/home/stats/Stats';
import {
  approveDisapproveGameRecords, createGamePost,
  getGameData, getGameFeed,
  getGameGallery,
  getGameMatchRecords, getGameNextFeed, getGameRefereeReservation,
  getGameScorekeeperReservation,
  getGameStats,
  getSportsList, resetGame,
} from '../../../api/Games';
import { followUser, unfollowUser } from '../../../api/Users';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import AuthContext from '../../../auth/context'
import strings from '../../../Constants/String';

const TAB_ITEMS = ['Summary', 'Stats', 'Review', 'Gallery']

const TennisHome = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const gameFeedFlatListRef = useRef(null);
  const galleryRef = useRef(null);
  const [tennisGameId] = useState(route?.params?.gameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRefereeAdmin, setIsRefereeAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getGameDetails();
  }, [navigation]);

  const getTennisGameData = useCallback((gameId = tennisGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData, authContext), [authContext, tennisGameId]);

  const getGameDetails = useCallback(() => {
    setLoading(true)
    getTennisGameData(tennisGameId).then(async (res) => {
      console.log('GET GAME DETAIL::', res.payload);
      if (res.status) {
        const entity = authContext.entity
        setUserRole(entity?.role);
        setUserId(entity?.uid);
        const homeTeamId = res?.payload?.singlePlayerGame ? res?.payload?.home_team?.user_id : res?.payload?.home_team?.group_id;
        const awayTeamId = res?.payload?.singlePlayerGame ? res?.payload?.away_team?.user_id : res?.payload?.away_team?.group_id;
        let refereeIds = []
        refereeIds = res?.payload?.referees?.map((e) => e.user_id)
        const teamIds = [homeTeamId, awayTeamId]
        const checkIsAdmin = teamIds?.includes(entity?.uid);
        const checkIsRefereeAdmin = refereeIds?.includes(entity?.uid);
        setIsAdmin(checkIsAdmin)
        setIsRefereeAdmin(checkIsRefereeAdmin)
        setGameData(res.payload);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }, [authContext.entity, getTennisGameData, tennisGameId])

  const getSoccerGameStats = useCallback((gameId) => getGameStats(gameId, authContext), [authContext])
  const followTennisUser = useCallback((params, userID) => followUser(params, userID, authContext), [authContext]);
  const unFollowTennisUser = useCallback((params, userID) => unfollowUser(params, userID, authContext), [authContext]);
  const getTennisGameMatchRecords = useCallback((gameId) => getGameMatchRecords(gameId, authContext), [authContext]);
  const approveDisapproveGameScore = useCallback((gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params, authContext), [authContext])
  // const getTennisGameStats = useCallback((gameId) => getGameStats(gameId, authContext),[authContext])
  const getTennisGalleryData = useCallback((gameId) => getGameGallery(gameId, authContext), [authContext])
  const getGameSportsList = useCallback(() => getSportsList(authContext), [authContext])
  const getRefereeReservation = useCallback((gameId) => getGameRefereeReservation(gameId, authContext), [authContext])
  const getScorekeeperReservation = useCallback((gameId) => getGameScorekeeperReservation(gameId, authContext), [authContext])
  const getGameFeedData = useCallback(() => getGameFeed(gameData?.game_id, authContext), [authContext, gameData?.game_id])
  const getGameNextFeedData = useCallback((last_id) => getGameNextFeed(gameData?.game_id, last_id, authContext), [authContext, gameData?.game_id]);
  const createGamePostData = useCallback((params) => createGamePost(params, authContext), [authContext])

  const renderSummaryTab = useMemo(() => (
    <Summary
        gameFeedFlatListRef={gameFeedFlatListRef}
        getGameNextFeedData={getGameNextFeedData}
        createGamePostData={createGamePostData}
          getGameFeedData={getGameFeedData}
          getRefereeReservation={getRefereeReservation}
          getScorekeeperReservation={getScorekeeperReservation}
          getSportsList={getGameSportsList}
          getGameData={getTennisGameData}
          approveDisapproveGameScore={approveDisapproveGameScore}
          getGameMatchRecords={getTennisGameMatchRecords}
          followTennisUser={followTennisUser}
          unFollowTennisUser={unFollowTennisUser}
          navigation={navigation}
          gameData={gameData}
          isAdmin={isAdmin}
          isRefereeAdmin = {isRefereeAdmin}
          userRole={userRole}
          userId={userId}
      />
  ), [approveDisapproveGameScore, createGamePostData, followTennisUser, gameData, getGameFeedData, getGameNextFeedData, getGameSportsList, getRefereeReservation, getScorekeeperReservation, getTennisGameData, getTennisGameMatchRecords, isAdmin, isRefereeAdmin, navigation, unFollowTennisUser, userId, userRole]);

  const renderStatsTab = useMemo(() => (
    <Stats
          getGameStatsData={getSoccerGameStats}
          gameData={gameData}
      />
  ), [gameData, getSoccerGameStats]);

  const renderGalleryTab = useMemo(() => (
    <Gallery
        isAdmin={isAdmin}
        galleryRef={galleryRef}
          gameData={gameData}
          getGalleryData={getTennisGalleryData}
          navigation={navigation}/>
  ), [gameData, getTennisGalleryData, navigation]);

  const renderTabContain = useCallback((tabKey) => (
    <View style={{ flex: 1 }}>
      {tabKey === 0 && renderSummaryTab}
      {tabKey === 1 && renderStatsTab}
      {tabKey === 2 && <></>}
      {tabKey === 3 && renderGalleryTab}
    </View>
  ), [renderGalleryTab, renderStatsTab, renderSummaryTab])

  const resetGameDetail = useCallback(() => {
    setLoading(true);
    resetGame(gameData?.game_id, authContext).then(() => {
      getGameDetails();
    }).catch((e) => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  }, [authContext, gameData?.game_id, getGameDetails]);

  const onEndReached = useCallback(() => {
    if (currentTab === 0 && gameFeedFlatListRef?.current?.onEndReached) gameFeedFlatListRef.current.onEndReached()
    if (currentTab === 3 && galleryRef?.current?.onEndReached) galleryRef.current.onEndReached()
  }, [currentTab])

  const renderTopHeaderWithTabContain = useMemo(() => (
    <TopBackgroundHeader
        onEndReached={onEndReached}
        onBackPress={route?.params?.onBackPress}
          isAdmin={isAdmin}
          resetGameDetail={resetGameDetail}
          navigation={navigation}
          gameData={gameData}>
      <TCScrollableProfileTabs
            tabItem={TAB_ITEMS}
            onChangeTab={(ChangeTab) => {
              setCurrentTab(ChangeTab.i)
            }}
            currentTab={currentTab}
            renderTabContain={renderTabContain}
        />
    </TopBackgroundHeader>
  ), [currentTab, gameData, isAdmin, navigation, onEndReached, renderTabContain, resetGameDetail, route?.params?.onBackPress])

  const renderImageProgress = useMemo(() => <ImageProgress/>, [])

  return (<View style={styles.mainContainer}>
    <ActivityLoader visible={loading} />
    {renderTopHeaderWithTabContain}
    {renderImageProgress}
  </View>

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
})
export default TennisHome;
