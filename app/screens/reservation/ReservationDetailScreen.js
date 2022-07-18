import React from 'react';
import {SafeAreaView, StyleSheet, Image} from 'react-native';

import ReservationNumber from '../../components/reservations/ReservationNumber';
import ChallengerInOutView from '../../components/reservations/ChallengerInOutView';
import ReservationDetailStatusView from '../../components/reservations/ReservationDetailStatusView';
import images from '../../Constants/ImagePath';

export default function ReservationDetailScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Image style={styles.dottedLine} source={images.dottedLine} />
      <ReservationNumber />
      <ChallengerInOutView />
      <ReservationDetailStatusView />
      <ReservationDetailStatusView />
      <ReservationDetailStatusView />
      <ReservationDetailStatusView />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  dottedLine: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    bottom: 0,
    left: 50,
    width: 1,
  },
});
