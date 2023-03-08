/* eslint-disable */
/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Platform,
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
import DataSource from '../../../Constants/DataSource';
import HostChallengerInfoModal from './modals/HostChallengerInfoModal';
import ScreenHeader from '../../../components/ScreenHeader';

export default function IncomingChallengeSettings({navigation, route}) {
  const [settingObject, setSettingObject] = useState({});
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [congratulationsModal, setCongratulationsModal] = useState(false);
  const [showMatchFeeReminderModal, setShowMatchFeeReminderModal] =
    useState(false);
  const [isAlreadyWarned, setIsAlreadyWarned] = useState(false);
  const {playerData, sportName, sportType, sport, settingType} = route.params;
  const [playerObject] = useState(playerData);
  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState({});
  const [showHostChallengerModal, setShowHosChallengerModal] = useState(false);
  const challengeSettingMenu = [
    {key: strings.sport},
    {key: strings.availability},
    {key: strings.gameType},
    {key: strings.gameFee},
    {key: strings.refundPolicy},
    {key: settingType === 'Set' ? strings.setGamesDuration : ''},
    {key: strings.venue},
    {key: strings.gameRules},
    {key: strings.Referee},
    {key: strings.scorekeeperText},
  ];

  useEffect(() => {
    if (route.params.settingObj) {
      setSettingObject({...settingObject, ...route.params.settingObj});
    }
  }, [route.params.settingObj]);

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

        case strings.gameType:
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

        case strings.gameRules:
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

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.registerAsPlayerTitle}
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
                  {strings.incomingChallengeSettingsInfo}
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

      <CongratulationsModal
        isVisible={congratulationsModal}
        settingsObj={settingObject}
        closeModal={() => {
          setCongratulationsModal(false);
          navigation.navigate('AccountScreen', {
            createdSportName: sportName,
            // eslint-disable-next-line
            sportType: sportType,
          });
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
      />
    </SafeAreaView>
  );
}
