import React, {
  useEffect, useState, useContext, useCallback, useMemo, useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,

} from 'react-native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
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
  getGameReviews,
  getGameScorekeeperReservation,
  getGameStats,
  getSportsList,
  getAllLineUp, getGameNextFeed,
} from '../../../api/Games';
import AuthContext from '../../../auth/context';
import { followUser, unfollowUser } from '../../../api/Users';

import LineUp from '../../../components/game/soccer/home/lineUp/LineUp';
import ImageProgress from '../../../components/newsFeed/ImageProgress';

const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Gallery']
const SoccerHome = ({ navigation, route }) => {
  const gameFeedFlatListRef = useRef(null);
  const authContext = useContext(AuthContext)
  const [soccerGameId] = useState(route?.params?.gameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRefereeAdmin, setIsRefereeAdmin] = useState(false);
  const [isScorekeeperAdmin, setIsScorekeeperAdmin] = useState(false);

  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);
  const [uploadImageProgressData, setUploadImageProgressData] = useState(null);

  useEffect(() => {
      getGameDetails();
  }, []);

  const getSoccerGameData = useCallback((gameId = soccerGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData, authContext), [authContext, soccerGameId]);

  const getGameDetails = useCallback(() => {
    setLoading(true);
    getSoccerGameData(soccerGameId)
      .then(async (res) => {
        if (res.status) {
          const entity = authContext.entity;
          setUserRole(entity?.role);
          setUserId(entity?.uid);
          const homeTeamId = res?.payload?.singlePlayerGame
            ? res?.payload?.home_team?.user_id
            : res?.payload?.home_team?.group_id;
          const awayTeamId = res?.payload?.singlePlayerGame
            ? res?.payload?.away_team?.user_id
            : res?.payload?.away_team?.group_id;
          const teamIds = [homeTeamId, awayTeamId];
          const checkIsAdmin = teamIds.includes(entity?.uid);

          let refereeIds = [];
          refereeIds = res?.payload?.referees?.map((e) => e.user_id);
          const checkIsRefereeAdmin = refereeIds?.includes(entity?.uid);

          let scorekeeperIds = [];
          scorekeeperIds = res?.payload?.scorekeepers?.map((e) => e.user_id);
          const checkIsScorekeeperAdmin = scorekeeperIds?.includes(entity?.uid);

          setIsAdmin(checkIsAdmin);
          setIsRefereeAdmin(checkIsRefereeAdmin);
          setIsScorekeeperAdmin(checkIsScorekeeperAdmin);
          setGameData(res.payload);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, [authContext.entity, getSoccerGameData, soccerGameId]);

  const getGameLineUp = useCallback((gameId = soccerGameId) => getAllLineUp(gameId, authContext), [authContext, soccerGameId]);
  const followSoccerUser = useCallback((params, userID) => followUser(params, userID, authContext), [authContext]);
  const unFollowSoccerUser = useCallback((params, userID) => unfollowUser(params, userID, authContext), [authContext]);
  const getSoccerGameMatchRecords = useCallback((gameId) => getGameMatchRecords(gameId, authContext), [authContext]);
  const approveDisapproveGameScore = useCallback((gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params, authContext), [authContext]);
  const getSoccerGameStats = useCallback((gameId) => getGameStats(gameId, authContext), [authContext]);
  const getSoccerGameReview = useCallback((gameId) => getGameReviews(gameId, authContext), [authContext]);
  const getSoccerGalleryData = useCallback((gameId) => getGameGallery(gameId, authContext), [authContext]);
  const getGameSportsList = useCallback(() => getSportsList(authContext), [authContext]);
  const getRefereeReservation = useCallback((gameId) => getGameRefereeReservation(gameId, authContext), [authContext]);
  const getScorekeeperReservation = useCallback((gameId) => getGameScorekeeperReservation(gameId, authContext), [authContext]);
  const getGameFeedData = useCallback(() => getGameFeed(gameData?.game_id, authContext), [authContext, gameData?.game_id]);
  const getGameNextFeedData = useCallback((last_id) => getGameNextFeed(gameData?.game_id, last_id, authContext), [authContext, gameData?.game_id]);
  const createGamePostData = useCallback((params) => createGamePost(params, authContext), [authContext]);

  const renderSummaryTab = useMemo(() => (
    <Summary
          getGameNextFeedData={getGameNextFeedData}
          gameFeedFlatListRef={gameFeedFlatListRef}
          setUploadImageProgressData={setUploadImageProgressData}
          createGamePostData={createGamePostData}
          getGameFeedData={getGameFeedData}
          getRefereeReservation={getRefereeReservation}
          getScorekeeperReservation={getScorekeeperReservation}
          getSportsList={getGameSportsList}
          getSoccerGameReview={getSoccerGameReview}
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

      />
  ), [approveDisapproveGameScore, createGamePostData, followSoccerUser, gameData, getGameFeedData, getGameLineUp, getGameNextFeedData, getGameSportsList, getRefereeReservation, getScorekeeperReservation, getSoccerGameData, getSoccerGameMatchRecords, getSoccerGameReview, getSoccerGameStats, isAdmin, isRefereeAdmin, isScorekeeperAdmin, navigation, unFollowSoccerUser, userId, userRole])

  const renderLineUpTab = useMemo(() => (
    <LineUp navigation={navigation} gameData={gameData} />
  ), [gameData, navigation])

  const renderStatsTab = useMemo(() => (
    <Stats
          homeTeamName={gameData?.home_team?.group_name}
          awayTeamName={gameData?.away_team?.group_name}
          getGameStatsData={getSoccerGameStats}
          gameData={gameData}
      />
  ), [gameData, getSoccerGameStats])

  const renderGalleryTab = useMemo(() => (
    <Gallery
          setUploadImageProgressData={setUploadImageProgressData}
          gameData={gameData}
          getGalleryData={getSoccerGalleryData}
          navigation={navigation}
      />
  ), [gameData, getSoccerGalleryData, navigation])

  const renderTabContain = useCallback((tabKey) => (
    <View style={{ flex: 1 }}>
      {tabKey === 0 && renderSummaryTab}
      {tabKey === 1 && renderLineUpTab}
      {tabKey === 2 && renderStatsTab}
      {tabKey === 3 && renderGalleryTab}
    </View>
  ), [renderGalleryTab, renderLineUpTab, renderStatsTab, renderSummaryTab]);

  const onCancelImageUpload = useCallback(() => {
    if (uploadImageProgressData?.cancelRequest) {
      uploadImageProgressData.cancelRequest.cancel('Cancel Image Uploading');
    }
    setUploadImageProgressData(null);
  }, [uploadImageProgressData?.cancelRequest]);

  const onImageAlertCancel = useCallback(() => {
      Alert.alert(
          'Cancel Upload?',
          'If you cancel your upload now, your post will not be saved.',
          [
            {
              text: 'Go back',
            },
            {
              text: 'Cancel upload',
              onPress: onCancelImageUpload,
            },
          ],
      );
  }, [onCancelImageUpload]);

  const renderImageProgress = useMemo(() => (
      uploadImageProgressData && (
        <ImageProgress
              numberOfUploaded={uploadImageProgressData?.doneUploadCount}
              totalUpload={uploadImageProgressData?.totalUploadCount}
              onCancelPress={onImageAlertCancel}
              postDataItem={uploadImageProgressData?.postData?.[0] ?? {}}
          />
      )
  ), [onImageAlertCancel, uploadImageProgressData])

  const onEndReached = useCallback(() => {
    if (currentTab === 0) gameFeedFlatListRef.current.onEndReached()
  }, [currentTab])

  const renderTopHeaderWithTabContain = useMemo(() => (
    <TopBackgroundHeader
          onEndReached={onEndReached}
          onBackPress={route?.params?.onBackPress}
          isAdmin={isAdmin}
          navigation={navigation}
          gameData={gameData}>
      <TCScrollableProfileTabs
            tabItem={TAB_ITEMS}
            onChangeTab={(ChangeTab) => setCurrentTab(ChangeTab.i)}
            currentTab={currentTab}
            renderTabContain={renderTabContain}
        />
    </TopBackgroundHeader>
  ), [currentTab, gameData, isAdmin, navigation, renderTabContain, route?.params?.onBackPress])

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {renderTopHeaderWithTabContain}
      {renderImageProgress}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

});
export default SoccerHome;
