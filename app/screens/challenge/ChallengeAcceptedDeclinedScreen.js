/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, { useContext } from 'react';
import {
 View, StyleSheet, Image, Text, Alert, SafeAreaView,
 } from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCBorderButton from '../../components/TCBorderButton';
import strings from '../../Constants/String';
import AuthContext from '../../auth/context';

// import TCBorderButton from '../../components/TCBorderButton';
// import strings from '../../Constants/String';
 import { getGameHomeScreen } from '../../utils/gameUtils';

export default function ChallengeAcceptedDeclinedScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const entity = authContext.entity.obj

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.popToTop()
  //   }, 3000);
  // })
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.entityCreatedBG} />

      {route && route.params && route.params.status && route.params.teamObj && (
        <View style={styles.mailContainer}>
          <Text style={styles.invitationText}>
            {(route.params.status === 'accept' && 'Challenge accepted')
              || (route.params.status === 'decline' && 'Challenge declined')
              || (route.params.status === 'cancel' && 'Challenge cancelled')
              || (route.params.status === 'restored' && 'Challenge Restored')}
          </Text>
          {/* <Text style={styles.infoText}>
            {(route.params.status === 'accept'
              && `A match between ${
                route.params.teamObj.group_name
                || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`
              } and ${
                route?.params?.teamObj?.group_name ? 'your team' : 'you'
              } has been scheduled.`)
              || (route.params.status === 'decline'
                && `The match reservation request from ${
                  route.params.teamObj.group_name
                  || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`
                } has been declined.`)
              || (route.params.status === 'cancel'
                && `The match reservation from ${
                  route.params.teamObj.group_name
                  || `${route.params.teamObj.first_name} ${route.params.teamObj.last_name}`
                } has been cancelled.`)
              || (route.params.status === 'restored'
                && 'Reservation alteration request restored.')}
          </Text> */}

          {route.params.status === 'accept' && <Text style={styles.infoText}>
            A match between <Text style={styles.entityNameBoldText}>{route.params.teamObj.group_name ? route.params.teamObj.group_name : route.params.teamObj.first_name + route.params.teamObj.last_name}</Text> and {route?.params?.teamObj?.group_name ? 'your team' : 'you'} has been scheduled.
          </Text>}

          {route.params.status === 'decline' && <Text style={styles.infoText}>
            A match reservation request from <Text style={styles.entityNameBoldText}>{route.params.teamObj.group_name ? route.params.teamObj.group_name : route.params.teamObj.first_name + route.params.teamObj.last_name}</Text> has been declined.
          </Text>}

          {route.params.status === 'cancel' && <Text style={styles.infoText}>
            A match reservation from <Text style={styles.entityNameBoldText}>{route.params.teamObj.group_name ? route.params.teamObj.group_name : route.params.teamObj.first_name + route.params.teamObj.last_name}</Text> has been cancelled.
          </Text>}

          {route.params.status === 'restored' && <Text style={styles.infoText}>
            Reservation alteration request restored.
          </Text>}

          <View style={styles.entityViewContainer}>
            <Image
            source={entity?.thumbnail ? { uri: entity?.thumbnail } : entity?.full_name ? images.profilePlaceHolder : images.teamPlaceholder}
            style={styles.rotateImage}
          />
            <Text style={styles.vsText}>VS</Text>
            <Image
            source={route.params.teamObj.thumbnail ? { uri: route.params.teamObj.thumbnail } : images.teamPlaceholder}
            style={[styles.rotateImage, { opacity: 1.0 }]}
          />
          </View>

        </View>
      )}

      <SafeAreaView>
        <View style={{ height: 95, justifyContent: 'space-between' }}>
          <TCBorderButton
            title={`GO TO ${
              route.params.teamObj.group_name?.toUpperCase()
              || `${route.params.teamObj.first_name?.toUpperCase()} ${route.params.teamObj.last_name?.toUpperCase()}`
            }`}
            textColor={colors.whiteColor}
            borderColor={colors.whiteColor}
            backgroundColor={'transparent'}
            height={40}
            shadow={true}
            // marginBottom={15}// route?.params?.status === 'accept' ? 34 : 55
            onPress={() => {
              navigation.push('HomeScreen', {
                sourceScreen: 'orangeScreen',
                uid:
                  route?.params?.teamObj?.group_id
                  || route?.params?.teamObj?.user_id,
                backButtonVisible: true,
                menuBtnVisible: false,
                role:
                  route.params.teamObj.entity_type === 'player'
                    ? 'user'
                    : route.params.teamObj.entity_type,
              });
            }}
          />

          {route.params.status !== 'decline' && <TCBorderButton
            title={strings.goToGameHome}
            textColor={colors.themeColor}
            borderColor={'transparent'}
            height={40}
            shadow={true}
            // marginBottom={55}
            onPress={() => {
              if (route?.params?.teamObj) {
                console.log('route?.params?.teamObj?.sport', route?.params?.teamObj);

                const gameHome = getGameHomeScreen(route?.params?.teamObj?.sport);
                console.log('gameHome', gameHome);

                if (route?.params?.teamObj?.game_id) {
                  navigation.push(gameHome, {
                    gameId: route?.params?.teamObj?.game_id,
                  })
                } else {
                    Alert.alert('Game ID does not exist.');
                }
            }
            }}
          />}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    flex: 1,
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
    marginTop: 15,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,

    textAlign: 'center',
    lineHeight: 25,
  },
  rotateImage: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    borderRadius: 150,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
  },
  entityViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 40,
    width: 250,
  },
  vsText: {
    fontSize: 20,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
  },
  entityNameBoldText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
});
