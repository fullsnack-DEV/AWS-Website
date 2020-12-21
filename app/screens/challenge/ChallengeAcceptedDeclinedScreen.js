import React from 'react';
import {
  View, StyleSheet, Image, Text,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCBorderButton from '../../components/TCBorderButton';
import strings from '../../Constants/String';

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
              && `A match between ${route.params.teamObj.group_name || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`} and your team has been scheduled.`)
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
          title={`Go to ${route.params.teamObj.group_name || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`}`}
          textColor={colors.whiteColor}
          borderColor={colors.whiteColor}
          backgroundColor={'transparent'}
          height={40}
          shadow={true}
          marginBottom={20}
          onPress={() => navigation.navigate('Account', {
            screen: 'HomeScreen',
            params: {
              uid: route.params.teamObj.group_id || route.params.teamObj.user_id,
              backButtonVisible: true,
              role: route.params.teamObj.entity_type === 'player' ? 'user' : route.params.teamObj.entity_type,
            },
          })}
        />

      )}
      {route?.params?.status === 'accept' && (
        <TCBorderButton
          title={strings.goToGameHome}
          textColor={colors.themeColor}
          borderColor={'transparent'}
          height={40}
          shadow={true}
          marginBottom={20}
          onPress={() => {
            if (`${route?.params?.teamObj?.sport}`.toLowerCase() === 'soccer') {
              navigation.navigate('SoccerHome', {
                gameId: route?.params?.teamObj?.game_id,
              })
            } else {
              navigation.navigate('TennisHome', {
                gameId: route?.params?.teamObj?.game_id,
              })
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
