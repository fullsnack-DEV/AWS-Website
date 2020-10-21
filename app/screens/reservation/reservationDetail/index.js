import React from 'react';
import {
  SafeAreaView,

  Image,
} from 'react-native';

import styles from './style';

import ReservationNumber from '../../../components/reservations/ReservationNumber';
import ChallengerInOutView from '../../../components/reservations/ChallengerInOutView';
import ReservationDetailStatusView from '../../../components/reservations/ReservationDetailStatusView';
import images from '../../../Constants/ImagePath';

export default ReservationDetailScreen = () => (
  <SafeAreaView style={styles.mainContainer}>
    <Image style={styles.dottedLine} source={images.dottedLine} />
    <ReservationNumber/>
    <ChallengerInOutView/>
    <ReservationDetailStatusView/>
    <ReservationDetailStatusView/>
    <ReservationDetailStatusView/>
    <ReservationDetailStatusView/>

  </SafeAreaView>
)
