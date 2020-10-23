import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

import ActivityLoader from '../../components/loader/ActivityLoader';
import { getReservationList } from '../../api/Reservationapi';
import * as Utility from '../../utils/index';
import MatchReservation from '../../components/reservations/MatchReservation';
import TCNoDataView from '../../components/TCNoDataView';
import strings from '../../Constants/String';
import TCScrollableTabs from '../../components/reservations/TCScrollableTabs';

export default function ReservationScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    getReservationListByCaller();
  }, []);

  const getReservationListByCaller = async () => {
    const switchEntity = await Utility.getStorage('switchBy');

    if (switchEntity === 'user') {
      const user = await Utility.getStorage('user');
      getReservationList(user.user_id).then((response) => {
        console.log('RESERVATION LIST:', response.payload);
        if (response.status) {
          setloading(false);
          const upcomingData = [];
          const pastData = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const temp of response.payload) {
            const date = new Date(temp.timestamp);
            const curruentDate = new Date();
            if (curruentDate < date === 1) {
              upcomingData.push(temp);
            } else {
              pastData.push(temp);
            }
          }
          setUpcoming(upcomingData);
          setPast(pastData);
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
      });
    } else if (switchEntity === 'team') {
      const team = await Utility.getStorage('team');
      getReservationList(team.group_id, 'team').then((response) => {
        if (response.status) {
          setloading(false);
          console.log('TEAM DETAIL :', response.payload);
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
      });
    } else if (switchEntity === 'club') {
      const club = await Utility.getStorage('club');
      getReservationList(club.group_id, 'club').then((response) => {
        if (response.status) {
          setloading(false);
          console.log('CLUB DETAIL :', response.payload);
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <TCScrollableTabs>
        <View tabLabel='Upcoming' style={{ flex: 1 }}>{upcoming.length === 0
          ? <TCNoDataView title={strings.noReservationFountText}/>
          : <FlatList
                    data={upcoming }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <MatchReservation
                            data={item}
                            onPressButon={() => {
                              navigation.navigate('ReservationDetailScreen');
                            }}
                       />
                    )}
                />
                }</View>
        <View tabLabel='Past' style={{ flex: 1 }}>{past.length === 0 ? (
          <TCNoDataView title={strings.noReservationFountText}/>
        ) : (
          <FlatList
                      data={past}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <MatchReservation
                            data={item}
                            onPressButon={() => {
                              navigation.navigate('ReservationDetailScreen');
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
