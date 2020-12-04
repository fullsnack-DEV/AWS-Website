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

export default function ReservationScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const authContext = useContext(AuthContext)

  useEffect(() => {
    setloading(true);
    getReservationListByCaller();
  }, [isFocused]);

  const getReservationListByCaller = async () => {
    getReservationList(authContext).then((response) => {
      setloading(false);
      const upcomingData = [];
      const pastData = [];
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
    }).catch((error) => {
      setloading(false)
      Alert.alert(error)
    })
  };

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
                              navigation.navigate('ReservationDetailScreen');
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
