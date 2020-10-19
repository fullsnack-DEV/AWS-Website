import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableWithoutFeedback,
} from 'react-native';

import styles from './style';
import constants from '../../config/constants';

import MatchReservation from '../../components/reservations/MatchReservation';

const { colors } = constants;

export default function ReservationScreen() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
      <View style={ styles.mainContainer }>
          <View style={ styles.tabContainer }>
              <TouchableWithoutFeedback style={ styles.upcomingTab } onPress={ () => {
                setSelectedTab(0);
              } }><View style={ styles.upcomingTab }>
                  {selectedTab === 0 ? <View><Text style={ [styles.upcomingText, { color: colors.themeColor }] }>Upcoming</Text>
                      <View style={ styles.selectedLine }/></View> : <View><Text style={ styles.upcomingText }>Upcoming</Text>
                      </View>}
              </View>

              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback style={ styles.pastTab } onPress={ () => {
                setSelectedTab(1);
              } }>
                  <View style={ styles.pastTab }>
                      {selectedTab === 1 ? <View>
                          <Text style={ [styles.pastText, { color: colors.themeColor }] }>Past</Text>
                          <View style={ styles.selectedLine }/>
                      </View> : <View>
                          <Text style={ styles.pastText }>Past</Text>
                      </View>}
                  </View>

              </TouchableWithoutFeedback>
          </View>
          <ScrollView>
              {/* <Loader visible={true} /> */}
              <MatchReservation/>
              <MatchReservation/>
              <MatchReservation/>
              <MatchReservation/>
              <MatchReservation/>
              <MatchReservation/>
          </ScrollView>
      </View>
  );
}
