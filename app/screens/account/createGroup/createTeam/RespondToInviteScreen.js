import React, {useState, useContext, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

import {format} from 'react-string-format';
import FastImage from 'react-native-fast-image';
import TCInfoField from '../../../../components/TCInfoField';
import {actionOnGroupRequest} from '../../../../api/Groups';

import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCThinDivider from '../../../../components/TCThinDivider';
import TCPlayerImageInfo from '../../../../components/TCPlayerImageInfo';
import TCSmallButton from '../../../../components/TCSmallButton';
import {getSportName} from '../../../../utils';
import TeamStatus from './TeamStatus';

import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';

export default function RespondToInviteScreen({navigation, route}) {
  const [teamObject, SetteamObject] = useState(route.params.teamObject);

  const authContext = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const entity = authContext.entity;
  const [loading, setloading] = useState(false);
  const [sportsetting, Setsportsetting] = useState(
    route.params?.incomingchallengeSettings,
  );

  useEffect(() => {
    SetteamObject(route.params.teamObject);

    Setsportsetting(teamObject.setting);
  }, []);

  useEffect(() => {
    Setsportsetting({
      ...teamObject.setting,
      ...route?.params?.incomingchallengeSettings,
    });
  }, [route.params?.incomingchallengeSettings]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const onAcceptDecline = (type, groupId) => {
    const setting = {...sportsetting};

    setloading(true);
    actionOnGroupRequest(type, groupId, authContext, {setting})
      .then((response) => {
        setloading(false);

        if (type === 'accept') {
          navigation.push('HomeScreen', {
            uid: response.payload.group_id,
            role: response.payload.entity_type,
            backButtonVisible: false,
            menuBtnVisible: false,
            isEntityCreated: true,
            groupName: response.payload.group_name,
            entityObj: response.payload,
          });
        } else {
          Alert.alert(
            strings.requestWasDeclined,
            '',
            [
              {
                text: strings.OkText,
                onPress: () => navigation.goBack(),
              },
            ],
            {cancelable: false},
          );
        }

        // }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getStatusMessage = () => {
    if (teamObject?.status === TeamStatus.declined) {
      return strings.thisRequestIsCancelled;
    }
    if (teamObject?.status === TeamStatus.cancelled) {
      return strings.requestDeletedText;
    }
    if (teamObject?.status === TeamStatus.accepted) {
      return strings.requestAcceptedText;
    }
    if (teamObject?.status === TeamStatus.invalid) {
      return strings.requestNotValidText;
    }
    return strings.requestStatusNotText;
  };

  const placeHolder = images.teamPlaceholderSmall;

  const onReviewIncomingSetting = () => {
    navigation.navigate('IncomingChallengeSettings', {
      playerData: {},
      sportName: getSportName(teamObject, authContext),

      sportType: teamObject.sport_type,
      sport: teamObject.sport,
      settingObj: sportsetting,

      settingType: teamObject.setting.default_setting_key,
      fromRespondToInvite: true,
      teamgrpId: teamObject.group_id,
      fromCreateTeam: true,
    });
  };

  return (
    <>
      {/* <TCFormProgress totalSteps={3} curruentStep={2} /> */}

      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 20,

            marginBottom: 20,
          }}>
          {teamObject?.status !== TeamStatus.new ? (
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RMedium,
                lineHeight: 30,
              }}>
              {getStatusMessage()}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RMedium,
                lineHeight: 30,
              }}>
              {format(strings.sentYouaRequest, teamObject.player1.full_name)}
            </Text>
          )}
        </View>

        <View style={{marginLeft: 10, marginRight: 10, marginBottom: 25}}>
          <FastImage
            source={{uri: route.params.teamObject?.background_thumbnail}}
            resizeMode={'cover'}
            style={styles.bgImageStyle}
          />

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.whiteColor,
              borderRadius: 100,
              alignSelf: 'center',
              width: 60,
              height: 60,
              position: 'absolute',
              top: 110,
              left: 15,

              shadowColor: '#000',
              shadowOffset: {height: 0.4},
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 15,
            }}>
            <View>
              <Image
                source={images.teamPatch}
                style={{
                  height: 15,
                  width: 15,
                  resizeMode: 'cover',
                  position: 'absolute',
                  left: 10,
                  top: 45,
                }}
              />
            </View>
            <Image
              source={placeHolder}
              style={{
                height: 50,
                width: 50,

                borderRadius: 25,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginTop: 5,
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
              }}>
              <Text
                style={{
                  marginTop: -5,
                  textAlign: 'center',
                  color: colors.whiteColor,
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                }}>
                {route?.params?.teamObject?.group_name?.charAt(0)}
              </Text>
            </View>
          </View>
        </View>

        <ActivityLoader visible={loading} />

        <TCInfoField
          title={strings.sportsEventsTitle}
          value={getSportName(teamObject, authContext)}
          marginLeft={25}
          marginTop={30}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        {teamObject?.sport_type === Verbs.doubleSport && (
          <View>
            <TCPlayerImageInfo
              title={strings.playerTitle}
              player1Image={teamObject.player1.thumbnail}
              player2Image={teamObject.player2.thumbnail}
              player1Name={teamObject.player1.full_name}
              player2Name={teamObject.player2.full_name}
              player1City={teamObject.player1?.city}
              player2City={teamObject.player2?.city}
              marginLeft={25}
              marginRight={25}
              marginTop={10}
              titlecolor={colors.veryLightBlack}
              fontstyle={fonts.RMedium}
            />
            <TCThinDivider marginTop={10} marginBottom={5} />
          </View>
        )}

        <TCInfoField
          title={strings.teamName}
          value={teamObject?.group_name}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={strings.homeCityTitleText}
          value={teamObject?.city}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />
        {/* 
        {teamObject?.sport?.toLowerCase() !== 'Tennis Double'.toLowerCase() && (
          <View>
            <TCInfoField
              title={strings.membersgender}
              value={
                teamObject?.gender?.charAt(0)?.toUpperCase() +
                teamObject?.gender?.slice(1)
              }
              marginLeft={25}
            />
            <TCThinDivider marginTop={5} marginBottom={3} />

            <TCInfoField
              title={strings.membersage}
              value={format(
                strings.minMaxText_dy,
                teamObject?.min_age ?? '-',
                teamObject?.max_age ?? '-',
              )}
              marginLeft={25}
            />
            <TCThinDivider marginTop={5} marginBottom={3} />
          </View>
        )} */}

        <TCInfoField
          title={strings.language}
          value={teamObject?.language.join(', ')}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <Text style={styles.describeTitle} numberOfLines={2}>
          {strings.describeText}
        </Text>
        <Text style={styles.describeText} numberOfLines={50}>
          {teamObject?.descriptions}
        </Text>

        <Pressable
          onPress={() => onReviewIncomingSetting()}
          style={{
            alignSelf: 'flex-end',
            marginRight: 24,
            marginBottom: 40,
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: fonts.RMedium,
              textDecorationLine: 'underline',
            }}>
            {strings.reviewIncomingchallengetitle}
          </Text>
        </Pressable>

        {teamObject?.status !== TeamStatus.new ? null : (
          <View style={styles.bottomButtonContainer}>
            <TCSmallButton
              title={strings.acceptTitle}
              onPress={() => {
                onAcceptDecline('accept', teamObject?.group_id);
              }}
              isBorderButton={true}
              textStyle={{fontSize: 16}}
              style={{
                width: 345,
                marginBottom: 15,
                backgroundColor: colors.reservationAmountColor,
              }}
            />
            <TCSmallButton
              isBorderButton={true}
              borderstyle={{
                borderColor: colors.userPostTimeColor,
                borderWidth: 1,
                borderRadius: 22,
              }}
              textStyle={{color: colors.userPostTimeColor, fontSize: 16}}
              title={strings.declineTitle}
              onPress={() => {
                Alert.alert(
                  strings.areYouSureDeclineRequest,
                  '',
                  [
                    {
                      text: strings.cancel,
                      onPress: () => console.log('PRessed'),
                    },
                    {
                      text: strings.decline.toLowerCase(),
                      onPress: () =>
                        onAcceptDecline(
                          Verbs.decline,

                          teamObject.group_id,
                        ),
                    },
                  ],
                  {cancelable: false},
                );
              }}
              style={{width: 345, backgroundColor: colors.textFieldBackground}}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  describeTitle: {
    fontSize: 16,
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  describeText: {
    fontSize: 16,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
  bgImageStyle: {
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
