/* eslint-disable object-shorthand */

import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Pressable,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import AuthContext from '../../../../auth/context';

import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCFormProgress from '../../../../components/TCFormProgress';

import Verbs from '../../../../Constants/Verbs';
import ScreenHeader from '../../../../components/ScreenHeader';
import HostChallengerInfoModal from '../../registerPlayer/modals/HostChallengerInfoModal';

import WrapperModal from '../../../../components/IncomingChallengeSettingsModals/WrapperModal';
import SettingsMenuItem from '../../registerPlayer/components/SettingsMenuItem';
import MatchFeeReminder from '../../registerPlayer/modals/MatchFeeReminder';
import uploadImages from '../../../../utils/imageAction';
import {createGroup} from '../../../../api/Groups';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

export default function CreateTeamForm2({navigation, route}) {
  const authContext = useContext(AuthContext);

  // const [searchFollowers] = useState(followersList);

  const [settingObject, setSettingObject] = useState({});
  const [showSwitchScreen, setShowSwitchScreen] = useState(false);
  const [loading, setloading] = useState(false);
  const [showMatchFeeReminderModal, setShowMatchFeeReminderModal] =
    useState(false);
  const [isAlreadyWarned, setIsAlreadyWarned] = useState(false);
  const {
    teamData,
    sportName,
    sportType,
    sport,
    settingType,
    thumbnail,
    backgroundThumbnail,
  } = route?.params;

  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState({});
  const [showHostChallengerModal, setShowHosChallengerModal] = useState(false);
  const challengeSettingMenu = [
    {key: strings.sport},
    {key: strings.availability},
    {key: strings.gameTypeTitle},
    {key: strings.gameFee},
    {key: strings.refundPolicy},
    {key: settingType === 'Set' ? strings.setGamesDuration : ''},
    {key: strings.venue},
    {key: strings.gameRulesTitle},
    {key: strings.Referee},
    {key: strings.scorekeeperText},
  ];
  const entity = authContext.entity;

  const animProgress = React.useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (route?.params?.settingObj) {
      setSettingObject({...settingObject, ...route.params.settingObj});
    }
  }, [route?.params?.settingObj]);

  const handleOpetions = (option) => {
    if (settingObject) {
      switch (option) {
        case strings.availability:
          setModalObj({
            title: option,
            settingsObj: settingObject,
            sportName: sportName,
          });
          setShowModal(true);
          break;

        case strings.gameTypeTitle:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.gameFee:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.refundPolicy:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.Referee:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.scorekeeperText:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.setGamesDuration:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.venue:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.gameRulesTitle:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        default:
          break;
      }
    }
  };

  const onANimate = (val) => {
    Animated.timing(animProgress, {
      useNativeDriver: false,
      toValue: val,
      duration: 600,
    }).start();
  };

  const onSave = () => {
    if (settingObject.game_fee?.fee === 0 && !isAlreadyWarned) {
      setShowMatchFeeReminderModal(true);
      setIsAlreadyWarned(true);
    } else {
      setShowSwitchScreen(true);
      onANimate(20);

      settingObject.sport = sport;
      settingObject.sport_type = sportType;
      teamData.setting = settingObject;

      const bodyParams = {
        ...teamData,
        entity_type: Verbs.entityTypeTeam,
      };

      if (thumbnail) {
        bodyParams.thumbnail = thumbnail;
      }
      if (backgroundThumbnail) {
        bodyParams.background_thumbnail = backgroundThumbnail;
      }
      console.log('bodyPARAMS:: ', bodyParams);

      if (bodyParams?.thumbnail || bodyParams?.background_thumbnail) {
        const imageArray = [];
        if (bodyParams?.thumbnail) {
          imageArray.push({path: bodyParams?.thumbnail});
        }
        if (bodyParams?.background_thumbnail) {
          imageArray.push({path: bodyParams?.background_thumbnail});
        }

        uploadImages(imageArray, authContext)
          .then((responses) => {
            const attachments = responses.map((item) => ({
              type: 'image',
              url: item.fullImage,
              thumbnail: item.thumbnail,
            }));
            if (bodyParams?.thumbnail) {
              bodyParams.thumbnail = attachments[0].thumbnail;
              bodyParams.full_image = attachments[0].url;
            }

            if (bodyParams?.background_thumbnail) {
              let bgInfo = attachments[0];
              if (attachments.length > 1) {
                bgInfo = attachments[1];
              }
              bodyParams.background_thumbnail = bgInfo.thumbnail;
              bodyParams.background_full_image = bgInfo.url;
            }
            onANimate(100);
            createGroup(bodyParams, entity.uid, entity.obj.role, authContext)
              .then((response) => {
                setloading(false);
                setShowSwitchScreen(true);

                navigation.navigate('HomeScreen', {
                  uid: response.payload.group_id,
                  role: response.payload.entity_type,
                  backButtonVisible: true,
                  menuBtnVisible: false,
                  isEntityCreated: true,
                  groupName: response.payload.group_name,
                  entityObj: response.payload,
                });
              })
              .catch((e) => {
                setloading(false);
                setShowSwitchScreen(false);
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 10);
              });
          })
          .catch((e) => {
            setShowSwitchScreen(false);
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          });
      } else {
        onANimate(100);
        createGroup(bodyParams, entity.uid, entity.obj.role, authContext)
          .then((response) => {
            setloading(false);
            setShowSwitchScreen(true);

            navigation.navigate('HomeScreen', {
              uid: response.payload.group_id,
              role: response.payload.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
              isEntityCreated: true,
              groupName: response.payload.group_name,
              entityObj: response.payload,
            });
          })
          .catch((e) => {
            setloading(false);
            setShowSwitchScreen(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    }
  };

  // const nextOnPress = () => {
  //   if (
  //     createTeamForm1.sport === Verbs.tennisSport &&
  //     createTeamForm1.sport_type === Verbs.doubleSport &&
  //     authContext?.entity?.role ===
  //       (Verbs.entityTypeUser || Verbs.entityTypePlayer)
  //   ) {
  //     const obj = {
  //       player1: authContext?.entity?.obj,
  //       player2: follower,
  //       language: selectedLanguages,
  //     };
  //     if (description !== '') {
  //       obj.descriptions = description;
  //     }

  //     navigation.navigate('CreateTeamForm3', {
  //       createTeamForm2: {
  //         ...createTeamForm1,
  //         ...obj,
  //         // can_join_everyone: canJoinEveryone,
  //         // join_membership_acceptedadmin: joinMembershipAcceptedadmin,
  //         // can_join_invited_person: canJoinInvitedPerson,
  //       },
  //     });
  //   } else {
  //     const obj = {
  //       gender: gender.toLowerCase(),
  //       language: selectedLanguages,
  //     };
  //     if (description !== '') {
  //       obj.descriptions = description;
  //     }
  //     if (minAge !== 0) {
  //       obj.min_age = minAge;
  //     }
  //     if (maxAge !== 0) {
  //       obj.max_age = maxAge;
  //     }
  //     navigation.navigate('CreateTeamForm3', {
  //       createTeamForm2: {
  //         ...createTeamForm1,
  //         ...obj,
  //       },
  //     });
  //   }

  // };

  const animWidthPrecent = animProgress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['0%', '50%', '100%'],
  });

  const placeHolder = images.teamPlaceholderSmall;

  return (
    <SafeAreaView style={styles.parent}>
      {showSwitchScreen && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.whiteColor,
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.whiteColor,
              opacity: 0.8,
              justifyContent: 'center',
              alignItems: 'center',
              ...StyleSheet.absoluteFillObject,
              marginTop: 300,
              zIndex: 1000,
            }}>
            <ActivityLoader visible={false} />
            <Pressable
              style={styles.profileImageContainer}
              onPress={() => onANimate(56)}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: 100,
                  alignSelf: 'center',
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: '#DDDDDD',
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
                    {teamData.group_name.charAt(0)}
                  </Text>
                </View>
              </View>
            </Pressable>
            <View
              style={{
                marginTop: 15,
              }}>
              <Text
                style={{
                  lineHeight: 24,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Switching to
              </Text>
              <Text
                style={{
                  lineHeight: 24,
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {teamData.group_name}
              </Text>
            </View>

            <Animated.View
              style={{
                width: 135,
                height: 5,
                backgroundColor: '#F2F2F2',
                borderRadius: 20,

                marginTop: 279,
              }}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: animWidthPrecent,
                  },
                ]}>
                <LinearGradient
                  style={styles.progressBar}
                  colors={['rgba(170, 216, 64, 0.6)', 'rgba(0, 193, 104, 0.6)']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}></LinearGradient>
              </Animated.View>
            </Animated.View>
          </View>
          {/* PRogree Bar */}
        </View>
      )}

      <ScreenHeader
        title={strings.createTeamText}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          onSave();
        }}
        loading={loading}
        containerStyle={{
          paddingLeft: 10,
          paddingRight: 17,
          paddingTop: 8,
          paddingBottom: 13,
          borderBottomWidth: 0,
        }}
      />
      <ActivityLoader visible={loading} />

      <TCFormProgress totalSteps={2} curruentStep={2} />

      <View style={{flex: 1}}>
        <FlatList
          data={challengeSettingMenu}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              <View style={{paddingHorizontal: 15}}>
                <Text style={styles.title}>
                  {strings.incomingChallengeSettingsTitle}
                </Text>
                <Text style={styles.info}>
                  {strings.incomingChallengeSettingsTitleTeam}
                </Text>

                <TouchableOpacity
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => setShowHosChallengerModal(true)}>
                  <Text style={styles.linkButtonText}>
                    {strings.hostAndChallengerText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
            </>
          )}
          renderItem={({item}) => (
            <SettingsMenuItem
              sportName={sportName}
              item={item}
              handleOpetions={handleOpetions}
              settingObject={settingObject}
            />
          )}
        />
      </View>

      <HostChallengerInfoModal
        isVisible={showHostChallengerModal}
        closeModal={() => setShowHosChallengerModal(false)}
      />

      <MatchFeeReminder
        isVisible={showMatchFeeReminderModal}
        onAddMatchFee={() => {
          setShowMatchFeeReminderModal(false);
          handleOpetions(strings.gameFee);
        }}
        onContinue={() => {
          setShowMatchFeeReminderModal(false);
          onSave();
        }}
      />

      <WrapperModal
        isVisible={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        {...modalObj}
        onSave={(settings) => {
          setShowModal(false);
          setSettingObject({...settingObject, ...settings});
        }}
        entityType={Verbs.entityTypePlayer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },

  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 15,
    marginTop: 20,
  },
  info: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    marginBottom: 25,
  },
  linkButtonText: {
    fontSize: 14,
    lineHeight: 21,
    textDecorationLine: 'underline',
    color: colors.googleColor,
  },
  divider: {
    height: 7,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },

  progressBar: {
    width: '100%',
    height: 5,
  },
});
