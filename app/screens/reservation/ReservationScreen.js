import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import ActivityLoader from '../../components/loader/ActivityLoader';
import { getReservationList } from '../../api/Reservations';
import MatchReservation from '../../components/reservations/MatchReservation';
import TCNoDataView from '../../components/TCNoDataView';
import strings from '../../Constants/String';
import TCScrollableTabs from '../../components/TCScrollableTabs';
import AuthContext from '../../auth/context'
import * as RefereeUtils from '../referee/RefereeUtility';
import * as Utils from '../challenge/ChallengeUtility';

export default function ReservationScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const authContext = useContext(AuthContext)

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getReservationListByCaller();
    }
  }, [isFocused]);

  const getReservationListByCaller = async () => {
    getReservationList(authContext.entity.uid, authContext).then((response) => {
      setloading(false);
      const upcomingData = [];
      const pastData = [];
      for (const temp of response.payload) {
        const date = temp?.start_datetime || temp?.game?.start_datetime;
        const curruentDate = new Date().getTime() / 1000;
        if (curruentDate < date) {
          upcomingData.push(temp);
        } else {
          pastData.push(temp);
        }
      }
      setUpcoming(upcomingData);
      setPast(pastData);
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
    });
  };
  const goToReservationDetail = (data) => {
    if (data?.responsible_to_secure_venue) {
      setloading(true);
      Utils.getChallengeDetail(data?.challenge_id, authContext).then((obj) => {
        setloading(false);
        console.log('Challenge Object:', JSON.stringify(obj.challengeObj));
        console.log('Screen name of challenge:', obj.screenName);
        navigation.navigate(obj.screenName, {
          challengeObj: obj.challengeObj || obj.challengeObj[0],
        });
        setloading(false);
      });
    } else if (data?.scorekeeper) {
      console.log('Screen name of Reservation:');
    } else {
      setloading(true);
      RefereeUtils.getRefereeReservationDetail(data?.reservation_id, authContext.entity.uid, authContext).then((obj) => {
        setloading(false);
        console.log('Reservation Object:', JSON.stringify(obj.reservationObj));
        console.log('Screen name of Reservation:', obj.screenName);
        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      });
    }
  }
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <TCScrollableTabs>
        <View tabLabel='Upcoming' style={{ flex: 1 }}>{upcoming.length === 0 && loading === false
          ? <TCNoDataView title={strings.noReservationFountText}/>
          : <FlatList
                    data={upcoming }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <MatchReservation
                            data={item}
                            onPressButon={() => {
                              console.log('Selected Item::', item);
                              goToReservationDetail(item)
                            }}
                       />
                    )}
                />
                }</View>
        <View tabLabel='Past' style={{ flex: 1 }}>{past.length === 0 && loading === false ? (
          <TCNoDataView title={strings.noReservationFountText}/>
        ) : (
          <FlatList
                      data={past}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <MatchReservation
                            data={item}
                            onPressButon={() => {
                              console.log('Selected Item::', item);
                              goToReservationDetail(item)
                            }}
                          />
                      )}
                   />
        )}</View>
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
