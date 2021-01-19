import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet, Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TopBackgroundHeader from '../../../components/game/tennis/home/TopBackgroundHeader';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import Summary from '../../../components/game/tennis/home/summary/Summary';
import Gallery from '../../../components/game/common/gallary/Gallery';
import {
  approveDisapproveGameRecords,
  getGameData,
  getGameGallery,
  getGameMatchRecords, getGameRefereeReservation,
  getGameScorekeeperReservation,
  // getGameStats,
  getSportsList, resetGame,
} from '../../../api/Games';
import { followUser, unfollowUser } from '../../../api/Users';
import ImageProgress from '../../../components/newsFeed/ImageProgress';
import AuthContext from '../../../auth/context'
import strings from '../../../Constants/String';

const TAB_ITEMS = ['Summary', 'Stats', 'Review', 'Gallery']
const gameIds = [
  '265b7834-6bbf-40cc-8729-372f3b706331', // 0
  '049b0c20-f9c6-473d-aab8-76b2430efa68', // 1
  '0750bda5-942e-4de2-bb65-386aec7cf6c3', // 2
  '13f4cde8-6a90-4236-8cdd-5ede92e94d5b', // 3
]
const globalGameId = gameIds[0];
const TennisHome = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const [tennisGameId] = useState(route?.params?.gameId ?? globalGameId);
  const [currentTab, setCurrentTab] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userId, setUserId] = useState(null);
  const [uploadImageProgressData, setUploadImageProgressData] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    getGameDetails();
  }, [navigation, isFocused]);

  const getGameDetails = () => {
    setLoading(true)
    getTennisGameData(tennisGameId).then(async (res) => {
      console.log('GET GAME DETAIL::', res.payload);
      if (res.status) {
        const entity = authContext.entity
        setUserRole(entity?.role);
        setUserId(entity?.uid);
        const homeTeamId = res?.payload?.singlePlayerGame ? res?.payload?.home_team?.user_id : res?.payload?.home_team?.group_id;
        const awayTeamId = res?.payload?.singlePlayerGame ? res?.payload?.away_team?.user_id : res?.payload?.away_team?.group_id;
        const teamIds = [homeTeamId, awayTeamId]
        const checkIsAdmin = teamIds.includes(entity?.uid);
        setIsAdmin(checkIsAdmin)
        setGameData(res.payload);
        console.log('GET GAME DETAIL::', res.payload);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => setLoading(false));
  }

  const getTennisGameData = (gameId = tennisGameId, fetchTeamData = true) => getGameData(gameId, fetchTeamData, authContext);
  const followTennisUser = (params, userID) => followUser(params, userID, authContext);
  const unFollowTennisUser = (params, userID) => unfollowUser(params, userID, authContext);
  const getTennisGameMatchRecords = (gameId) => getGameMatchRecords(gameId, authContext);
  const approveDisapproveGameScore = (gameId, teamId, type, params) => approveDisapproveGameRecords(gameId, teamId, type, params, authContext)
  // const getTennisGameStats = (gameId) => getGameStats(gameId, authContext)
  const getTennisGalleryData = (gameId) => getGameGallery(gameId, authContext)
  const getGameSportsList = () => getSportsList(authContext)
  const getRefereeReservation = (gameId) => getGameRefereeReservation(gameId, authContext)
  const getScorekeeperReservation = (gameId) => getGameScorekeeperReservation(gameId, authContext)

  const renderTabContain = (tabKey) => (
    <View>
      {tabKey === 0 && (
        <Summary
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
            userRole={userRole}
            userId={userId}
        />
      )}
      {tabKey === 1 && <></>}
      {tabKey === 2 && <></>}
      {tabKey === 3 && (
        <Gallery
              setUploadImageProgressData={(uploadImageData) => setUploadImageProgressData(uploadImageData)}
              gameData={gameData}
              getGalleryData={getTennisGalleryData}
              navigation={navigation}/>
      )}
    </View>
  )
  const resetGameDetail = () => {
    setLoading(true);
    resetGame(gameData?.game_id, authContext).then(() => {
      getGameDetails();
    }).catch((e) => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
    });
  };

  return (<View style={styles.mainContainer}>
    <ActivityLoader visible={loading} />
    <TopBackgroundHeader isAdmin={isAdmin} resetGameDetail={resetGameDetail} navigation={navigation} gameData={gameData}>
      <TCScrollableProfileTabs
        tabItem={TAB_ITEMS}
        onChangeTab={(ChangeTab) => {
          setCurrentTab(ChangeTab.i)
        }}
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
export default TennisHome;
