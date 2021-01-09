/* eslint-disable no-unused-expressions */
import React from 'react';
import {
  View, StyleSheet, Image, Text, Alert,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCBorderButton from '../../components/TCBorderButton';
import strings from '../../Constants/String';
import { getGameHomeScreen } from '../../utils/gameUtils';

export default function ChallengeAcceptedDeclinedScreen({ navigation, route }) {
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
            {(route.params.status === 'accept' && 'Challenge accepted')
              || (route.params.status === 'decline' && 'Challenge declined')
              || (route.params.status === 'cancel' && 'Challenge cancelled')
              || (route.params.status === 'restored' && 'Challenge Restored')}
          </Text>
          <Text style={styles.infoText}>
            {(route.params.status === 'accept'
              && `A match between ${route.params.teamObj.group_name || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`} and ${route?.params?.teamObj?.group_name ? 'your team' : 'you'} has been scheduled.`)
              || (route.params.status === 'decline'
                && `The match reservation request from ${route.params.teamObj.group_name || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`} has been declined.`)
              || (route.params.status === 'cancel'
                && `The match reservation from ${route.params.teamObj.group_name || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`} has been cancelled.`)
              || (route.params.status === 'restored'
                && 'Reservation alteration request restored.')}
          </Text>
        </View>
      )}

      {route && route.params && route.params.teamObj && (
        <TCBorderButton
          title={`GO TO ${(route.params.teamObj.group_name?.toUpperCase()) || `${route.params.teamObj.first_name?.toUpperCase()} ${route.params.teamObj.last_name?.toUpperCase()}`}`}
          textColor={colors.whiteColor}
          borderColor={colors.whiteColor}
          backgroundColor={'transparent'}
          height={40}
          shadow={true}
          marginBottom={route?.params?.status === 'accept' ? 15 : 55}
          onPress={() => {
            navigation.push('HomeScreen', {
              sourceScreen: 'orangeScreen',
              uid: route?.params?.teamObj?.group_id || route?.params?.teamObj?.user_id,
              backButtonVisible: true,
              menuBtnVisible: false,
              role: route.params.teamObj.entity_type === 'player' ? 'user' : route.params.teamObj.entity_type,
            })
          }}
        />

      )}
      {route?.params?.status === 'accept' && (
        <TCBorderButton
          title={strings.goToGameHome}
          textColor={colors.themeColor}
          borderColor={'transparent'}
          height={40}
          shadow={true}
          marginBottom={55}
          onPress={() => {
            if (route?.params?.teamObj) {
              const gameHome = getGameHomeScreen(route?.params?.teamObj?.sport);
              navigation.navigate(gameHome, {
                gameId: route?.params?.teamObj?.game_id,
              })
            } else {
              Alert.alert('Game ID not exist');
            }
          }
          }
        />
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
