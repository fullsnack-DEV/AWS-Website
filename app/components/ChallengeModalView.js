/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import TCBorderButton from './TCBorderButton';
import strings from '../Constants/String';
import {getGameHomeScreen} from '../utils/gameUtils';

// import TCBorderButton from '../../../components/TCBorderButton';

export default function ChallengeModalView({
  navigation,
  modalVisible,
  //   backdropPress,

  groupObj,
  teamObj = {},
  entity,
  status,
}) {
  return (
    <Modal
      isVisible={modalVisible}
      backdropColor="black"
      //   onBackdropPress={backdropPress}
      //   onRequestClose={onClose}
      backdropOpacity={0.5}
      style={{
        margin: 0,
        marginTop: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
    >
      <View style={styles.mainContainer}>
        <Image style={styles.background} source={images.orangeLayer} />
        <Image style={styles.background} source={images.entityCreatedBG} />

        {status === 'sent' && (
          <View style={styles.mailContainer}>
            <Text style={styles.invitationText}>Challenge sent</Text>
            <Text style={styles.infoText}>
              When{' '}
              {groupObj?.group_name ??
                `${groupObj?.first_name} ${groupObj?.last_name}`}{' '}
              accepts your match reservation request, you will be notified.
            </Text>
            <View style={styles.imageContainer}>
              <Image
                source={images.challengeSentPlane}
                style={styles.rotateImage}
              />
            </View>
          </View>
        )}

        {status !== 'sent' && (
          <View style={styles.mailContainer}>
            <Text style={styles.invitationText}>
              {(status === 'accept' && 'Challenge accepted') ||
                (status === 'decline' && 'Challenge declined') ||
                (status === 'cancel' && 'Challenge cancelled') ||
                (status === 'restored' && 'Challenge Restored')}
            </Text>

            {status === 'accept' && (
              <Text style={styles.infoText}>
                A match between{' '}
                <Text style={styles.entityNameBoldText}>
                  {teamObj?.group_name
                    ? teamObj?.group_name
                    : teamObj?.first_name + teamObj?.last_name}
                </Text>{' '}
                and {teamObj?.group_name ? 'your team' : 'you'} has been
                scheduled.
              </Text>
            )}

            {status === 'decline' && (
              <Text style={styles.infoText}>
                A match reservation request from{' '}
                <Text style={styles.entityNameBoldText}>
                  {teamObj?.group_name
                    ? teamObj?.group_name
                    : teamObj?.first_name + teamObj?.last_name}
                </Text>{' '}
                has been declined.
              </Text>
            )}

            {status === 'cancel' && (
              <Text style={styles.infoText}>
                A match reservation from{' '}
                <Text style={styles.entityNameBoldText}>
                  {teamObj?.group_name
                    ? teamObj?.group_name
                    : teamObj?.first_name + teamObj?.last_name}
                </Text>{' '}
                has been cancelled.
              </Text>
            )}

            {status === 'restored' && (
              <Text style={styles.infoText}>
                Reservation alteration request restored.
              </Text>
            )}

            {status !== 'sent' && (
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
                <Text style={styles.vsText}>VS</Text>
                <Image
                  source={
                    teamObj?.thumbnail
                      ? {uri: teamObj?.thumbnail}
                      : images.teamPlaceholder
                  }
                  style={[
                    styles.rotateImage,
                    {opacity: 1.0},
                    teamObj?.thumbnail
                      ? {
                          height: 82,
                          width: 82,
                        }
                      : {
                          height: 75,
                          width: 75,
                        },
                  ]}
                />
              </View>
            )}
          </View>
        )}
        {status === 'sent' ? (
          <SafeAreaView>
            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                navigation.popToTop();
              }}
            >
              <Text style={styles.goToProfileTitle}>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>
        ) : (
          <SafeAreaView>
            <View style={{height: 95, justifyContent: 'space-between'}}>
              <TCBorderButton
                title={`GO TO ${
                  teamObj?.group_name?.toUpperCase() ||
                  `${teamObj?.first_name?.toUpperCase()} ${teamObj?.last_name?.toUpperCase()}`
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
                    uid: teamObj?.group_id || teamObj?.user_id,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                    role:
                      teamObj?.entity_type === 'player'
                        ? 'user'
                        : teamObj?.entity_type,
                  });
                }}
              />

              {status !== 'decline' && (
                <TCBorderButton
                  title={strings.goToGameHome}
                  textColor={colors.themeColor}
                  borderColor={'transparent'}
                  height={40}
                  shadow={true}
                  // marginBottom={55}
                  onPress={() => {
                    const gameHome = getGameHomeScreen(teamObj?.sport);
                    if (teamObj?.game_id) {
                      navigation.navigate(gameHome, {
                        gameId: teamObj?.game_id,
                      });
                    } else {
                      Alert.alert('Game ID does not exist.');
                    }
                  }}
                />
              )}
            </View>
          </SafeAreaView>
        )}
      </View>
    </Modal>
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,

    width: '92%',
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
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
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 25,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    resizeMode: 'contain',
    borderRadius: 150,
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
