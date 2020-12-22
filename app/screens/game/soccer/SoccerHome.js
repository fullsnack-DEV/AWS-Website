import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TopBackgroundHeader from '../../../components/game/soccer/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/soccer/home/summary/Summary';
import Stats from '../../../components/game/common/stats/Stats';
import Review from '../../../components/game/soccer/home/review/Review';
import Gallery from '../../../components/game/common/gallary/Gallery';
import {
  approveDisapproveGameRecords,
  getGameData,
  getGameGallery,
  getGameMatchRecords, getGameRefereeReservation,
  getGameReviews, getGameScorekeeperReservation,
  getGameStats,
  getSportsList,
} from '../../../api/Games';
import AuthContext from '../../../auth/context'
import { followUser, unfollowUser } from '../../../api/Users';
import LineUp from '../../../components/game/soccer/home/lineUp/LineUp';
import ImageProgress from '../../../components/newsFeed/ImageProgress';

const TAB_ITEMS = ['Summary', 'Line-up', 'Stats', 'Review', 'Gallery']
const gameIds = [
  'f88963d1-6817-48d6-897f-4edb236ca37d', // 0 - For Referees
  '6f3b91f5-a1c9-4fb7-94a4-6dfae2217469', // 1 - For Referees
  '460adeca-f36e-4cb7-9d97-8928a6f77281', // 2 -
  '6b1dd495-9d68-4a8b-8feb-363406d279ba', // 3 - 19-11-2020 9-00
  '1dd4f109-0a7c-40a3-b616-f0cf055ba61c', // 4 - Admin: Arvind  20-11-2020 6-50
  'fb6e4794-4fdd-4af2-b07a-a109d3f550f7', // 5  Admin: Arvind
  '8385c959-ca3a-4471-9fd5-8a3637a5217e', // 6 - For Review
  '4fd32621-46b8-4ed8-a145-50ab4b82ce62', // 7
]
const globalGameId = gameIds[0];
const SoccerHome = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const [soccerGameId] = useState(route?.params?.gameId ?? globalGameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);
  const [uploadImageProgressData, setUploadImageProgressData] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    })
    getGameDetails();
  }, []);

  const getGameDetails = () => {
    setLoading(true)
    getSoccerGameData(soccerGameId).then(async (res) => {
      if (res.status) {
        const entity = authContext.entity
        setUserRole(entity?.role);
        setUserId(entity?.uid);
        const checkIsAdmin = res?.payload?.home_team?.am_i_admin || res?.payload?.away_team?.am_i_admin;
        setIsAdmin(checkIsAdmin)
        setGameData(res.payload);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }

  const getSoccerGameData = (gameId = soccerGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData, authContext);
  const followSoccerUser = (params, userID) => followUser(params, userID, authContext);
  const unFollowSoccerUser = (params, userID) => unfollowUser(params, userID, authContext);
  const getSoccerGameMatchRecords = (gameId) => getGameMatchRecords(gameId, authContext);
  const approveDisapproveGameScore = (gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params, authContext)
  const getSoccerGameStats = (gameId) => getGameStats(gameId, authContext)
  const getSoccerGameReview = (gameId) => getGameReviews(gameId, authContext)
  const getSoccerGalleryData = (gameId) => getGameGallery(gameId, authContext)
  const getGameSportsList = () => getSportsList(authContext)
  const getRefereeReservation = (gameId) => getGameRefereeReservation(gameId, authContext)
  const getScorekeeperReservation = (gameId) => getGameScorekeeperReservation(gameId, authContext)

  const renderTabContain = (tabKey) => (
    <View style={{ flex: Platform.OS === 'ios' ? 0 : 10 }}>
      {tabKey === 0 && (
        <Summary
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
            userRole={userRole}
            userId={userId}
        />
      )}
      {tabKey === 1 && <LineUp navigation={navigation} gameData={gameData}/>}
      {tabKey === 2 && (
        <Stats
              homeTeamName={gameData?.home_team?.group_name}
              awayTeamName={gameData?.away_team?.group_name}
              getGameStatsData={getSoccerGameStats}
              gameData={gameData}
          />
      )}
      {tabKey === 3 && <Review navigation={navigation} getSoccerGameReview={getSoccerGameReview} isAdmin={isAdmin} gameData={gameData}/>}
      {tabKey === 4 && (
        <Gallery
              setUploadImageProgressData={(uploadImageData) => setUploadImageProgressData(uploadImageData)}
              gameData={gameData}
              getSoccerGalleryData={getSoccerGalleryData}
              navigation={navigation}/>
      )}
    </View>
  )
  return (<View style={styles.mainContainer}>
    <ActivityLoader visible={loading} />
    <TopBackgroundHeader navigation={navigation} gameData={gameData}>
      <TCScrollableProfileTabs
        tabItem={TAB_ITEMS}
        onChangeTab={(ChangeTab) => {
          setCurrentTab(ChangeTab.i)
        }}
        customStyle={{ flex: 1 }}
        currentTab={currentTab}
        renderTabContain={renderTabContain}
    />
    </TopBackgroundHeader>
    {uploadImageProgressData && (
      <ImageProgress
            numberOfUploaded={uploadImageProgressData?.doneUploadCount}
            totalUpload={uploadImageProgressData?.totalUploadCount}
            onCancelPress={() => {
              console.log('Cancel Pressed!');
            }}
            postDataItem={uploadImageProgressData?.postData ? uploadImageProgressData?.postData[0] : {}}
        />
    )}
  </View>

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
})
export default SoccerHome;
