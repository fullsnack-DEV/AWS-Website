/* eslint-disable no-unused-expressions */
import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
// import TCBorderButton from '../../components/TCBorderButton';
// import { getGameHomeScreen } from '../../utils/gameUtils';

export default function ScorekeeperAcceptDeclineScreen({navigation, route}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.popToTop();
    }, 3000);
  });
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />

      {route && route.params && route.params.status && route.params.teamObj && (
        <View style={styles.mailContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                route.params.status === 'accept'
                  ? images.emailSent1
                  : images.declineChallenge
              }
              style={styles.rotateImage}
            />
          </View>
          <Text style={styles.invitationText}>
            {(route.params.status === 'accept' && strings.reservationAccepted) ||
              (route.params.status === 'decline' && strings.reservationDeclined2) ||
              (route.params.status === 'cancel' && strings.reservationCancelled3) ||
              (route.params.status === 'restored' && strings.reservationRestored2)}
          </Text>
          <Text style={styles.infoText}>
            {(route.params.status === 'accept' &&
              `${strings.aReservationBetween} ${
                route.params.teamObj.group_name ||
                `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`
              } ${strings.andYouScheduled}`) ||
              (route.params.status === 'decline' &&
                `${strings.reservationRequest} ${
                  route.params.teamObj.group_name ||
                  `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`
                } ${strings.matchDeclined}`) ||
              (route.params.status === 'cancel' &&
                `${strings.reservationFrom} ${
                  route.params.teamObj.group_name ||
                  `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`
                } ${strings.matchCancelled}`) ||
              (route.params.status === 'restored' &&
                strings.requestRestored)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  mailContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  invitationText: {
    fontSize: 25,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 3,
    marginTop: 15,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,

    textAlign: 'center',
    lineHeight: 25,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    width: 146,
    height: 146,
    resizeMode: 'contain',
  },
});
