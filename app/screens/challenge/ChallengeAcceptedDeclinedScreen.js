/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, {useContext} from 'react';
import {View, StyleSheet, Image, Text, Alert, SafeAreaView} from 'react-native';

import {format} from 'react-string-format';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCBorderButton from '../../components/TCBorderButton';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';

// import TCBorderButton from '../../components/TCBorderButton';
import {getGameHomeScreen} from '../../utils/gameUtils';
import Verbs from '../../Constants/Verbs';

export default function ChallengeAcceptedDeclinedScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const entity = authContext.entity.obj;

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
            {(route.params.status === Verbs.acceptVerb &&
              strings.challengeAccepted) ||
              (route.params.status === Verbs.declineVerb &&
                strings.challengeDeclined) ||
              (route.params.status === Verbs.cancelVerb &&
                strings.challengeCancelled) ||
              (route.params.status === Verbs.restoredVerb &&
                strings.challengeRestored)}
          </Text>

          {route.params.status === Verbs.acceptVerb && (
            <Text style={styles.infoText}>
              A match between{' '}
              <Text style={styles.entityNameBoldText}>
                {route.params.teamObj.group_name
                  ? route.params.teamObj.group_name
                  : route.params.teamObj.first_name +
                    route.params.teamObj.last_name}
              </Text>{' '}
              and{' '}
              {route?.params?.teamObj?.group_name
                ? strings.yourTeamText
                : strings.you}{' '}
              has been scheduled.
            </Text>
          )}

          {route.params.status === Verbs.declineVerb && (
            <Text style={styles.infoText}>
              {strings.reservationRequestFrom}{' '}
              <Text style={styles.entityNameBoldText}>
                {route.params.teamObj.group_name
                  ? route.params.teamObj.group_name
                  : route.params.teamObj.first_name +
                    route.params.teamObj.last_name}
              </Text>{' '}
              {strings.hasBeenDeclined}
            </Text>
          )}

          {route.params.status === Verbs.cancelVerb && (
            <Text style={styles.infoText}>
              {strings.reservationRequestFrom}{' '}
              <Text style={styles.entityNameBoldText}>
                {route.params.teamObj.group_name
                  ? route.params.teamObj.group_name
                  : route.params.teamObj.first_name +
                    route.params.teamObj.last_name}
              </Text>{' '}
              {strings.hasBeenCancelled}
            </Text>
          )}

          {route.params.status === Verbs.restoredVerb && (
            <Text style={styles.infoText}>
              {strings.reservationRestoredText}
            </Text>
          )}

          <View style={styles.entityViewContainer}>
            <Image
              source={
                entity?.thumbnail
                  ? {uri: entity?.thumbnail}
                  : entity?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              style={styles.rotateImage}
            />
            <Text style={styles.vsText}>{strings.VS}</Text>
            <Image
              source={
                route.params.teamObj.thumbnail
                  ? {uri: route.params.teamObj.thumbnail}
                  : images.teamPlaceholder
              }
              style={[styles.rotateImage, {opacity: 1.0}]}
            />
          </View>
        </View>
      )}

      <SafeAreaView>
        <View style={{height: 95, justifyContent: 'space-between'}}>
          <TCBorderButton
            title={format(
              strings.GOTOButtonTitle,
              route.params.teamObj.group_name?.toUpperCase() ||
                `${route.params.teamObj.first_name?.toUpperCase()} ${route.params.teamObj.last_name?.toUpperCase()}`,
            )}
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
                  route?.params?.teamObj?.group_id ||
                  route?.params?.teamObj?.user_id,
                backButtonVisible: true,
                menuBtnVisible: false,
                role:
                  route.params.teamObj.entity_type === Verbs.entityTypePlayer
                    ? Verbs.entityTypeUser
                    : route.params.teamObj.entity_type,
              });
            }}
          />

          {route?.params?.teamObj?.game_id && (
            <TCBorderButton
              title={strings.goToGameHome}
              textColor={colors.themeColor}
              borderColor={'transparent'}
              height={40}
              shadow={true}
              // marginBottom={55}
              onPress={() => {
                if (route?.params?.teamObj) {
                  const gameHome = getGameHomeScreen(
                    route?.params?.teamObj?.sport,
                  );

                  if (route?.params?.teamObj?.game_id) {
                    navigation.push(gameHome, {
                      gameId: route?.params?.teamObj?.game_id,
                    });
                  } else {
                    Alert.alert(strings.gameIDNotExitsTitle);
                  }
                }
              }}
            />
          )}
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
    shadowOffset: {width: 0, height: 2},
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
