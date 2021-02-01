import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Alert,

} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TopBackgroundHeader from '../../../components/game/soccer/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/soccer/home/summary/Summary';
import Stats from '../../../components/game/soccer/home/stats/Stats';
import Review from '../../../components/game/soccer/home/review/Review';
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
  getAllLineUp,
} from '../../../api/Games';
import AuthContext from '../../../auth/context';
import { followUser, unfollowUser } from '../../../api/Users';

import LineUp from '../../../components/game/soccer/home/lineUp/LineUp';
import ImageProgress from '../../../components/newsFeed/ImageProgress';

const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Review', 'Gallery'];
const gameIds = [
  'f88963d1-6817-48d6-897f-4edb236ca37d', // 0 - For Referees
  '6f3b91f5-a1c9-4fb7-94a4-6dfae2217469', // 1 - For Referees
  '460adeca-f36e-4cb7-9d97-8928a6f77281', // 2 -
  '6b1dd495-9d68-4a8b-8feb-363406d279ba', // 3 - 19-11-2020 9-00
  '1dd4f109-0a7c-40a3-b616-f0cf055ba61c', // 4 - Admin: Arvind  20-11-2020 6-50
  'fb6e4794-4fdd-4af2-b07a-a109d3f550f7', // 5  Admin: Arvind
  '8385c959-ca3a-4471-9fd5-8a3637a5217e', // 6 - For Review
  '4fd32621-46b8-4ed8-a145-50ab4b82ce62', // 7
];
const globalGameId = gameIds[0];
const SoccerHome = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const [soccerGameId] = useState(route?.params?.gameId ?? globalGameId);
  console.log(route?.params?.gameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRefereeAdmin, setIsRefereeAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);
  const [uploadImageProgressData, setUploadImageProgressData] = useState(null);

  const isFocused = useIsFocused();
  useEffect(() => {
    getGameDetails();
  }, [navigation, isFocused]);

  const getGameDetails = () => {
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

          setIsAdmin(checkIsAdmin);
          setIsRefereeAdmin(checkIsRefereeAdmin);
          console.log('DD', res.payload);
          setGameData(res.payload);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const getGameLineUp = (gameId = soccerGameId) => getAllLineUp(gameId, authContext);
  const getSoccerGameData = (gameId = soccerGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData, authContext);
  const followSoccerUser = (params, userID) => followUser(params, userID, authContext);
  const unFollowSoccerUser = (params, userID) => unfollowUser(params, userID, authContext);
  const getSoccerGameMatchRecords = (gameId) => getGameMatchRecords(gameId, authContext);
  const approveDisapproveGameScore = (gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params, authContext);
  const getSoccerGameStats = (gameId) => getGameStats(gameId, authContext);
  const getSoccerGameReview = (gameId) => getGameReviews(gameId, authContext);
  const getSoccerGalleryData = (gameId) => getGameGallery(gameId, authContext);
  const getGameSportsList = () => getSportsList(authContext);
  const getRefereeReservation = (gameId) => getGameRefereeReservation(gameId, authContext);
  const getScorekeeperReservation = (gameId) => getGameScorekeeperReservation(gameId, authContext);
  const getGameFeedData = (params) => getGameFeed(params, authContext);
  const createGamePostData = (params) => createGamePost(params, authContext);

  const renderTabContain = (tabKey) => (
    <View style={{ flex: 1 }}>
      {/* Summary */}
      {tabKey === 0 && (
        <Summary
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
          userRole={userRole}
          userId={userId}
          getGameLineUp={getGameLineUp}

        />
      )}

      {/* Line Up */}
      {tabKey === 1 && <LineUp navigation={navigation} gameData={gameData} />}

      {/* Stats */}
      {tabKey === 2 && (
        <Stats
          homeTeamName={gameData?.home_team?.group_name}
          awayTeamName={gameData?.away_team?.group_name}
          getGameStatsData={getSoccerGameStats}
          gameData={gameData}
        />
      )}

      {/* Review */}
      {tabKey === 3 && (
        <Review
          navigation={navigation}
          getSoccerGameReview={getSoccerGameReview}
          isAdmin={isAdmin}
          gameData={gameData}
        />
      )}

      {/* Gallery */}
      {tabKey === 4 && (
        <Gallery
          setUploadImageProgressData={(uploadImageData) => setUploadImageProgressData(uploadImageData)
          }
          gameData={gameData}
          getGalleryData={getSoccerGalleryData}
          navigation={navigation}
        />
      )}
    </View>
  );
  const onCancelImageUpload = () => {
    if (uploadImageProgressData?.cancelRequest) {
      uploadImageProgressData.cancelRequest.cancel('Cancel Image Uploading');
    }
    setUploadImageProgressData(null);
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <TopBackgroundHeader
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
      {uploadImageProgressData && (
        <ImageProgress
          numberOfUploaded={uploadImageProgressData?.doneUploadCount}
          totalUpload={uploadImageProgressData?.totalUploadCount}
          onCancelPress={() => {
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
          }}
          postDataItem={
            uploadImageProgressData?.postData
              ? uploadImageProgressData?.postData[0]
              : {}
          }
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

});
export default SoccerHome;
