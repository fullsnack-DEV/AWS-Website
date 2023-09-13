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
} from 'react-native';

import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import {patchPlayer} from '../../../api/Users';

import * as Utility from '../../../utils';
import TCFormProgress from '../../../components/TCFormProgress';
import styles from './IncomingChallengeSettingsStyles';
import CongratulationsModal from './modals/CongratulationsModal';
import MatchFeeReminder from './modals/MatchFeeReminder';
import SettingsMenuItem from './components/SettingsMenuItem';
import WrapperModal from '../../../components/IncomingChallengeSettingsModals/WrapperModal';

import HostChallengerInfoModal from './modals/HostChallengerInfoModal';
import ScreenHeader from '../../../components/ScreenHeader';
import uploadImages from '../../../utils/imageAction';

import {createGroup, createGroupRequest} from '../../../api/Groups';

import SendRequestModal from '../../../components/SendRequestModal/SendRequestModal';
import {DEFAULT_NTRP, currencyList} from '../../../Constants/GeneralConstants';
import {getUnreadNotificationCount} from '../../../utils/accountUtils';
import useSwitchAccount from '../../../hooks/useSwitchAccount';
import SwitchAccountLoader from '../../../components/account/SwitchAccountLoader';
import {getCountry} from 'country-currency-map';
import {useIsFocused} from '@react-navigation/native';

export default function IncomingChallengeSettings({navigation, route}) {
  const [settingObject, setSettingObject] = useState({});
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [congratulationsModal, setCongratulationsModal] = useState(false);
  const [showMatchFeeReminderModal, setShowMatchFeeReminderModal] =
    useState(false);
  const [isAlreadyWarned, setIsAlreadyWarned] = useState(false);
  const [showSwitchScreen, setShowSwitchScreen] = useState(false);

  const [visibleRequestModal, setVisibleRequestModal] = useState(false);
  const {onSwitchProfile} = useSwitchAccount();

  const Focused = useIsFocused();

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
    fromRespondToInvite,
    teamgrpId,
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

  const [currency, setCurrency] = useState();

  useEffect(() => {
    const gettingCurrency = getCountry(authContext.entity.obj.country);

    if (!currencyList.some((i) => i.currency === gettingCurrency.currency)) {
      setCurrency(Verbs.usd);
    } else {
      setSettingObject({
        ...settingObject,
        game_fee: {
          ...settingObject.game_fee,
          currency_type: gettingCurrency.currency,
          fee: 0,
        },
      });
    }
  }, [Focused]);

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
    } else if (fromRespondToInvite) {
      navigation.navigate('RespondToInviteScreen', {
        incomingchallengeSettings: settingObject,
      });
    } else {
      onCreateTeam();
    }
  };

  const onCreateTeam = () => {
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
                .then(async (response) => {
                  setloading(false);
                  setShowSwitchScreen(false);
                  await onSwitchProfile(response.payload);

                  navigation.navigate('HomeScreen', {
                    uid: response.payload.group_id,
                    role: response.payload.entity_type,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                    isEntityCreated: true,
                    groupName: response.payload.group_name,
                    entityObj: response.payload,
                    comeFrom: Verbs.INCOMING_CHALLENGE_SCREEN,
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
        if (show_Double) {
          createGroupRequest(bodyParams, authContext)
            .then(() => {
              setloading(false);
              setShowSwitchScreen(false);

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
            .then(async (response) => {
              setloading(false);
              setShowSwitchScreen(false);
              await onSwitchProfile(response.payload);

              getUnreadNotificationCount(authContext);
              navigation.navigate('HomeScreen', {
                uid: response.payload.group_id,
                role: response.payload.entity_type,
                backButtonVisible: true,
                menuBtnVisible: false,
                isEntityCreated: true,
                groupName: response.payload.group_name,
                entityObj: response.payload,
                comeFrom: Verbs.INCOMING_CHALLENGE_SCREEN,
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
                ntrp: settingObject.ntrp ?? DEFAULT_NTRP,
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

  const placeHolder = images.teamPlaceholderSmall;

  return (
    <SafeAreaView style={styles.parent}>
      <SwitchAccountLoader
        isVisible={showSwitchScreen}
        entityName={groupData?.group_name}
        entityType={Verbs.entityTypeTeam}
        entityImage={placeHolder}
        stopLoading={() => {}}
        forCreateTeam={true}
      />

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
        rightButtonText={fromRespondToInvite ? strings.save : strings.done}
        onRightButtonPress={() => {
          if (fromCreateTeam) {
            if (show_Double) {
              onCreateDoubleTeamPress();
            } else if (fromRespondToInvite) {
              navigation.navigate('RespondToInviteScreen', {
                incomingchallengeSettings: settingObject,
              });
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
                <Text style={styles.title} numberOfLines={1}>
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
            navigation.navigate(route.params.comeFrom, {
              ...route.params.routeParams,
            });
          } else {
            navigation.navigate('AccountScreen', {
              createdSportName: sportName,
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
            navigation.navigate('AccountScreen', {
              createdSportName: sportName,
              sportType: sportType,
              isSearchPlayerForDoubles: true,
            });
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
        onCloseModal={() => setShowMatchFeeReminderModal(false)}
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
        isDoubleSport={sportType === Verbs.doubleSport}
      />

      <WrapperModal
        isVisible={showModal}
        show_Double={show_Double}
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
