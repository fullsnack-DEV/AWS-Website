import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
} from 'react-native';

import styles from './style';

import ActivityLoader from '../../components/loader/ActivityLoader';
import { getReservationList } from '../../api/Reservationapi';
import * as Utility from '../../utils/index';

import MatchReservation from '../../components/reservations/MatchReservation';
import colors from '../../Constants/Colors'

export default function ReservationScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
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
      <View style={styles.tabContainer}>
        <TouchableWithoutFeedback
          style={styles.upcomingTab}
          onPress={() => {
            setSelectedTab(0);
          }}>
          <View style={styles.upcomingTab}>
            {selectedTab === 0 ? (
              <View>
                <Text style={[styles.upcomingText, { color: colors.themeColor }]}>
                  Upcoming
                </Text>
                <View style={styles.selectedLine} />
              </View>
            ) : (
              <View>
                <Text style={styles.upcomingText}>Upcoming</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          style={styles.pastTab}
          onPress={() => {
            setSelectedTab(1);
          }}>
          <View style={styles.pastTab}>
            {selectedTab === 1 ? (
              <View>
                <Text style={[styles.pastText, { color: colors.themeColor }]}>
                  Past
                </Text>
                <View style={styles.selectedLine} />
              </View>
            ) : (
              <View>
                <Text style={styles.pastText}>Past</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>

      {(upcoming.length === 0 && selectedTab === 0)
      || (past.length === 0 && selectedTab === 1) ? (
        <View style={styles.noDataPlaceholderView}>
          <Text style={styles.noDataPlaceholder}>No Reservations Found</Text>
        </View>
        ) : (
          <FlatList
          data={selectedTab === 0 ? upcoming : past}
          keyExtractor={(item) => item.activity_id}
          renderItem={({ item }) => (
            <MatchReservation
              data={item}
              onPressButon={() => {
                navigation.navigate('ReservationDetailScreen');
              }}
            />
          )}
        />
        )}
    </View>
  );
}
