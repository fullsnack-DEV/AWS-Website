/* eslint-disable */
/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Animated,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';

import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import {patchPlayer} from '../../../api/Users';
import LinearGradient from 'react-native-linear-gradient';
import * as Utility from '../../../utils';
import TCFormProgress from '../../../components/TCFormProgress';
import styles from './IncomingChallengeSettingsStyles';
import CongratulationsModal from './modals/CongratulationsModal';
import MatchFeeReminder from './modals/MatchFeeReminder';
import SettingsMenuItem from './components/SettingsMenuItem';
import WrapperModal from '../../../components/IncomingChallengeSettingsModals/WrapperModal';
import DataSource from '../../../Constants/DataSource';
import HostChallengerInfoModal from './modals/HostChallengerInfoModal';
import ScreenHeader from '../../../components/ScreenHeader';
import uploadImages from '../../../utils/imageAction';

import fonts from '../../../Constants/Fonts';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {createGroup, createGroupRequest} from '../../../api/Groups';
import colors from '../../../Constants/Colors';

import Modal from 'react-native-modal';

import SendRequestModal from '../../../components/SendRequestModal/SendRequestModal';

export default function IncomingChallengeSettings({navigation, route}) {
  const [settingObject, setSettingObject] = useState({});
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [congratulationsModal, setCongratulationsModal] = useState(false);
  const [showMatchFeeReminderModal, setShowMatchFeeReminderModal] =
    useState(false);
  const [isAlreadyWarned, setIsAlreadyWarned] = useState(false);
  const [showSwitchScreen, setShowSwitchScreen] = useState(false);
  const animProgress = React.useState(new Animated.Value(0))[0];
  const [visibleRequestModal, setVisibleRequestModal] = useState(false);

  const {
    playerData,
    sportName,
    sportType,
    sport,
    settingType,
    fromCreateTeam,
    groupData,
    thumbnail,
    backgroundThumbnail,
    show_Double,
  } = route.params;
  const [playerObject] = useState(playerData);
  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState({});
  const [showHostChallengerModal, setShowHosChallengerModal] = useState(false);
  const entity = authContext.entity;
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

  useEffect(() => {
    if (route.params.settingObj) {
      setSettingObject({...settingObject, ...route.params.settingObj});
    }
  }, [route.params.settingObj]);

  const RequestModal = () => {
    return (
      <Modal
        isVisible={visibleRequestModal}
        onBackdropPress={() => setVisibleRequestModal(false)}
        onRequestClose={() => setVisibleRequestModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <ActivityLoader visible={loading} />
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.07,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
          }}>
          <View
            style={{
              flexDirection: 'row',
              // paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={Utility.getHitSlop(15)}
              style={[
                styles.closeButton,
                {marginTop: 20, marginBottom: 10},
              ]}></TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                //  marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                textAlign: 'center',
                marginTop: 20,
                marginLeft: 20,
                marginBottom: 14,
              }}>
              {strings.sendrequestToCreateTeam}
            </Text>
            <TouchableOpacity
              hitSlop={Utility.getHitSlop(15)}
              style={[
                styles.closeButton,
                {marginTop: 20, marginBottom: 10, marginRight: 28},
              ]}
              onPress={() => setVisibleRequestModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <Pressable>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 80,
                  borderRadius: 100,
                  alignSelf: 'center',
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: colors.greyBorderColor,
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
                    {groupData.group_name.charAt(0)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: 15,
                  marginBottom: 60,
                }}>
                <Text
                  style={{
                    lineHeight: 37,
                    fontFamily: fonts.RBold,
                    fontSize: 25,
                    textAlign: 'center',
                  }}>
                  {groupData.group_name}
                </Text>
              </View>
            </Pressable>
          </View>
          <View>
            <View
              style={{
                // marginTop: 272,
                marginLeft: 31,
                marginRight: 12,
              }}>
              <Text
                style={{
                  lineHeight: 24,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: '#333333',
                }}>
                {strings.sendRequesttxt1}
              </Text>
              <Text
                style={{
                  lineHeight: 24,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: '#333333',
                  marginTop: 25,
                }}>
                {strings.sendRequesttxt2}
              </Text>
              <Text
                style={{
                  lineHeight: 24,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: '#333333',
                  marginTop: 25,
                }}>
                {strings.sendRequesttxt3}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              marginTop: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                onCreateTeam();
              }}
              style={{
                width: 345,
                marginBottom: 15,
                backgroundColor: colors.reservationAmountColor,
                borderRadius: 25,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.whiteColor,
                  fontFamily: fonts.RBold,
                }}>
                {strings.sendRequestBtnTxt}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleOptions = (option) => {
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

  const onCreateDoubleTeamPress = () => {
    if (settingObject.game_fee?.fee === 0 && !isAlreadyWarned) {
      setShowMatchFeeReminderModal(true);
      setVisibleRequestModal(false);
      setIsAlreadyWarned(true);
    } else {
      onCreateTeam();
    }
  };

  const onCreateTeam = () => {
    onANimate(20);

    if (settingObject.game_fee?.fee === 0 && !isAlreadyWarned) {
      setShowMatchFeeReminderModal(true);
      setVisibleRequestModal(false);
      setIsAlreadyWarned(true);
    } else {
      if (show_Double) {
        setloading(true);
      } else {
        setShowSwitchScreen(true);
      }

      settingObject.sport = sport;
      delete settingObject.entity_type;
      settingObject.sport_type = sportType;
      groupData.setting = settingObject;

      const bodyParams = {
        ...groupData,
        entity_type: Verbs.entityTypeTeam,
      };

      if (thumbnail) {
        bodyParams.thumbnail = thumbnail;
      }
      if (backgroundThumbnail) {
        bodyParams.background_thumbnail = backgroundThumbnail;
      }

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
            setTimeout(() => {
              onANimate(50);
            }, 30);

            if (show_Double) {
              createGroupRequest(bodyParams, authContext)
                .then((response) => {
                  setloading(false);
                  Alert.alert(
                    strings.requestSent,
                    '',
                    [
                      {
                        text: strings.okTitleText,
                        onPress: () => navigation.navigate('AccountScreen'),
                      },
                    ],
                    {cancelable: false},
                  );
                })
                .catch((e) => {
                  setShowSwitchScreen(false);
                  setTimeout(() => {
                    Alert.alert(strings.appName, e.messages);
                  }, 0.1);
                });
            } else {
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
          })
          .catch((e) => {
            setShowSwitchScreen(false);
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          });
      } else {
        onANimate(100);

        if (show_Double) {
          createGroupRequest(bodyParams, authContext)
            .then(() => {
              setloading(false);

              Alert.alert(
                strings.requestSent,
                '',
                [
                  {
                    text: strings.okTitleText,
                    onPress: () => navigation.navigate('AccountScreen'),
                  },
                ],
                {cancelable: false},
              );
            })
            .catch((e) => {
              setShowSwitchScreen(false);
              setTimeout(() => {
                Alert.alert(strings.appName, e.messages);
              }, 0.1);
            });
        } else {
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
    }
  };

  const onSave = () => {
    if (settingObject.game_fee?.fee === 0 && !isAlreadyWarned) {
      setShowMatchFeeReminderModal(true);
      setIsAlreadyWarned(true);
    } else {
      const registerdPlayerData = playerObject.registered_sports.map((item) => {
        if (item.sport_name === sportName && item.sport_type === sportType) {
          if (item.sport === Verbs.tennisSport) {
            return {
              ...item,
              setting: {
                ...settingObject,
                ntrp: '1.0',
              },
            };
          }
          return {
            ...item,
            setting: {
              ...settingObject,
            },
          };
        } else {
          return item;
        }
      });
      const body = {
        ...playerObject,
        registered_sports: registerdPlayerData,
      };
      setloading(true);
      patchPlayer(body, authContext)
        .then(async (response) => {
          if (response.status === true) {
            await Utility.setAuthContextData(response.payload, authContext);
            setCongratulationsModal(true);
          } else {
            Alert.alert(strings.appName, response.messages);
          }
          setloading(false);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const onANimate = (val) => {
    Animated.timing(animProgress, {
      useNativeDriver: false,
      toValue: val,
      duration: 600,
    }).start();
  };

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

            zIndex: 1000,
          }}>
          <ActivityLoader visible={false} />
          <Pressable
            style={{
              marginBottom: 89,
              position: 'absolute',
              marginTop: 300,
            }}
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
                  {groupData.group_name.charAt(0)}
                </Text>
              </View>
            </View>
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
                {groupData.group_name}
              </Text>
            </View>
          </Pressable>

          <Animated.View
            style={{
              width: 135,
              height: 5,
              backgroundColor: '#F2F2F2',
              borderRadius: 20,

              marginTop: Dimensions.get('screen').height * 0.8,
            }}>
            <Animated.View
              style={{
                width: '100%',
                height: 5,

                width: animWidthPrecent,
              }}>
              <LinearGradient
                style={{width: '100%', height: 5}}
                colors={['rgba(255, 138, 1, 0.6)', 'rgba(255, 88, 0, 0.6) ']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
              />
            </Animated.View>
          </Animated.View>

          {/* PRogree Bar */}
        </View>
      )}
      {/* {RequestModal()} */}

      <SendRequestModal
        onNextPress={() => onCreateDoubleTeamPress()}
        visibleRequestModal={visibleRequestModal}
        onClosePress={() => setVisibleRequestModal(false)}
        groupData={groupData}
        loading={loading}
        textstring1={strings.sendRequesttxt1}
        textstring2={strings.sendRequesttxt2}
        textstring3={strings.sendRequesttxt3}
        btntext={strings.sendRequestBtnTxt}
      />

      <ScreenHeader
        title={
          fromCreateTeam
            ? strings.createTeamText
            : strings.registerAsPlayerTitle
        }
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          if (fromCreateTeam) {
            if (show_Double) {
              onCreateDoubleTeamPress();
            } else {
              onCreateTeam();
            }
          } else {
            onSave();
          }
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
                  {fromCreateTeam
                    ? strings.incomingChallengeSettingsTitleTeam
                    : strings.incomingChallengeSettingsInfo}
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
              handleOptions={handleOptions}
              settingObject={settingObject}
              o
            />
          )}
        />
      </View>

      <HostChallengerInfoModal
        isVisible={showHostChallengerModal}
        closeModal={() => setShowHosChallengerModal(false)}
      />

      <CongratulationsModal
        isVisible={congratulationsModal}
        settingsObj={settingObject}
        closeModal={() => {
          setCongratulationsModal(false);
          if (route.params?.comeFrom) {
            navigation.navigate(route.params.comeFrom);
          } else {
            navigation.navigate('AccountScreen', {
              createdSportName: sportName,
              // eslint-disable-next-line
              sportType: sportType,
            });
          }
        }}
        sportName={sportName}
        sport={sport}
        sportType={sportType}
        onChanllenge={(type, payload) => {
          const obj = {
            setting: payload.setting,
            sportName: payload.sport,
            sportType: payload.sport_type,
            groupObj: payload.groupObj,
          };
          if (type === strings.challenge) {
            navigation.navigate('ChallengeScreen', {
              ...obj,
            });
          }

          if (type === strings.inviteToChallenge) {
            navigation.navigate('InviteChallengeScreen', {
              ...obj,
            });
          }
        }}
        searchPlayer={(filters) => {
          if (filters.sport_type === Verbs.sportTypeSingle) {
            navigation.navigate('LookingForChallengeScreen', {
              filters,
            });
          }
          if (filters.sport_type === Verbs.sportTypeDouble) {
            //
          }
        }}
        onUserClick={(userData) => {
          if (!userData) return;
          navigation.navigate('HomeScreen', {
            uid:
              userData.entity_type === Verbs.entityTypePlayer ||
              userData.entity_type === Verbs.entityTypeUser
                ? userData.user_id
                : userData.group_id,
            role: ['user', 'player']?.includes(userData.entity_type)
              ? 'user'
              : userData.entity_type,
            backButtonVisible: true,
            menuBtnVisible: false,
          });
        }}
        searchTeam={(filters) => {
          navigation.navigate('RecruitingPlayerScreen', {
            filters: {
              ...filters,
              groupTeam: strings.teamstitle,
            },
          });
        }}
        joinTeam={() => {
          // navigation.navigate('LookingTeamScreen', {
          //   filters,
          // });
        }}
        createTeam={() => {
          navigation.navigate('CreateTeamForm1');
        }}
        goToSportActivityHome={({sport, sportType}) => {
          setCongratulationsModal(false);
          // navigation.navigate('HomeScreen', {
          //   uid: authContext.entity.uid,
          //   role: authContext.entity.role,
          //   backButtonVisible: true,
          //   menuBtnVisible: false,
          //   comeFrom: 'IncomingChallengeSettings',
          // });
          navigation.navigate('SportActivityHome', {
            sport,
            sportType,
            uid: authContext.entity.uid,
            selectedTab: strings.infoTitle,
            backScreen: 'AccountScreen',
            backScreenParams: {
              createdSportName: sport,
              sportType,
            },
          });
        }}
      />
      <MatchFeeReminder
        isVisible={showMatchFeeReminderModal}
        onAddMatchFee={() => {
          setShowMatchFeeReminderModal(false);
          handleOptions(strings.gameFee);
        }}
        onContinue={() => {
          setShowMatchFeeReminderModal(false);
          if (fromCreateTeam) {
            if (show_Double) {
              setVisibleRequestModal(true);
            } else {
              onCreateTeam();
            }
          } else {
            onSave();
          }
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
