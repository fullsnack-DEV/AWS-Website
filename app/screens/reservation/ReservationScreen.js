import React, {
 useEffect, useState, useContext, useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';

import ActivityLoader from '../../components/loader/ActivityLoader';
import { getReservationList } from '../../api/Reservations';
import TCNoDataView from '../../components/TCNoDataView';
import strings from '../../Constants/String';
import TCScrollableTabs from '../../components/TCScrollableTabs';
import AuthContext from '../../auth/context'
import * as RefereeUtils from '../referee/RefereeUtility';
import * as ScorekeeperUtils from '../scorekeeper/ScorekeeperUtility';
import * as Utils from '../challenge/ChallengeUtility';
import { getGameHomeScreen } from '../../utils/gameUtils';
import ReservationMainScreenShimmer from '../../components/shimmer/schedule/ReservationMainScreenShimmer';
import ReservationCard from '../../components/reservations/ReservationCard';
import ReservationStatus from '../../Constants/ReservationStatus';
import GameStatus from '../../Constants/GameStatus';

export default function ReservationScreen({ navigation }) {
  const [loading, setloading] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const authContext = useContext(AuthContext)
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);

  useEffect(() => {
      setFirstTimeLoading(true);
      getReservationListByCaller();
  }, []);

  const getReservationListByCaller = () => {
    getReservationList(authContext.entity.role === 'team' && authContext.entity.uid, authContext).then((response) => {
      console.log('reservation list :=>', response);
      const upcomingData = [];
      const pastData = [];
      for (const temp of response.payload) {
        const date = temp?.start_datetime || temp?.game?.start_datetime;
        const curruentDate = new Date().getTime() / 1000;
        if (curruentDate < date && temp.status !== ReservationStatus.completed && temp?.game?.status !== GameStatus.ended) {
          upcomingData.push(temp);
        } else {
          pastData.push(temp);
        }
      }
      setUpcoming(upcomingData.sort((x, y) =>  x.start_datetime - y.start_datetime));

      setPast(pastData.sort((x, y) => x.start_datetime - y.start_datetime));
      setFirstTimeLoading(false);
    }).catch((e) => {
      setFirstTimeLoading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const goToReservationDetail = useCallback((data) => {
   if (data?.scorekeeper) {
      setloading(true);
      ScorekeeperUtils.getScorekeeperReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
        setloading(false);
        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      });
    } else if (data?.referee) {
      setloading(true);
      RefereeUtils.getRefereeReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
        setloading(false);
        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      });
    } else {
      setloading(true);
      Utils.getChallengeDetail(data?.challenge_id, authContext).then((obj) => {
        setloading(false);
        navigation.navigate(obj.screenName, {
          challengeObj: obj.challengeObj || obj.challengeObj[0],
        });
        setloading(false);
      });
    }
  }, [authContext, navigation])

  const matchReservationView = useCallback(
    ({ item }) => (
      <ReservationCard
              data={item}
              onPressGameCard={() => {
                const gameHome = getGameHomeScreen(item?.sport);
                if (item?.game?.game_id || item?.game_id) {
                  navigation.navigate(gameHome, {
                    gameId: item?.game?.game_id || item?.game_id,
                  });
                }
              }}
              onPressButon={() => {
                goToReservationDetail(item)
              }}
         />
      ),
    [navigation, goToReservationDetail],
  )

const keyExtractor = useCallback(
  (item, index) => index.toString(),
  [],
)
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <TCScrollableTabs>
        <View tabLabel='Upcoming' style={{ flex: 1 }}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {firstTimeLoading
              ? (
                <ReservationMainScreenShimmer/>
          )
              : (upcoming.length === 0 && loading === false)
            ? <TCNoDataView title={strings.noReservationFountText}/>
            : <FlatList
            data={upcoming}
            keyExtractor={keyExtractor}
            renderItem={matchReservationView}
            style={{ paddingTop: 15 }}
            ListFooterComponent={<SafeAreaView forceInset={{ bottom: 'always' }} />}

            /> }
        </View>
        <View tabLabel='Past' style={{ flex: 1 }}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {firstTimeLoading
              ? (
                <ReservationMainScreenShimmer/>
              )
              : (past.length === 0 && loading === false) ? (
                <TCNoDataView title={strings.noReservationFountText}/>
          ) : <FlatList
                      data={past}
                      keyExtractor={keyExtractor}
                      renderItem={matchReservationView}
                      style={{ paddingTop: 15 }}
                      ListFooterComponent={<SafeAreaView forceInset={{ bottom: 'always' }} />}
                   />}
        </View>
      </TCScrollableTabs>
    </View>

  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

});
