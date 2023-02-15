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

const challengeSettingMenu = [
  {key: strings.sport},
  {key: strings.availability},
  {key: strings.gameType},
  {key: strings.gameFee},
  {key: strings.refundPolicy},
  // {key: strings.setGamesDuration},
  {key: strings.venue},
  {key: strings.gameRules},
  {key: strings.refereesTitle},
  {key: strings.scorekeeperTitle},
];

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

  useEffect(() => {
    if (settingType === 'Set') {
      challengeSettingMenu.push({key: strings.setGamesDuration});
    }
  }, [settingType]);

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
            currency: authContext.entity.obj?.currency_type ?? Verbs.usd,
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

        case strings.refereesTitle:
          setModalObj({
            title: option,
            settingsObj: settingObject,
          });
          setShowModal(true);
          break;

        case strings.scorekeeperTitle:
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

        default:
          break;
      }
    }
  };

  const onSave = () => {
    if (settingObject.game_fee.fee === 0 && !isAlreadyWarned) {
      setShowMatchFeeReminderModal(true);
      setIsAlreadyWarned(true);
    } else {
      const registerdPlayerData = playerObject.registered_sports.map((item) => {
        if (item.sport_name === sportName && item.sport_type === sportType) {
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
            const entity = authContext.entity;
            entity.auth.user = response.payload;
            entity.obj = response.payload;
            authContext.setEntity({...entity});
            authContext.setUser(response.payload);
            await Utility.setStorage('authContextUser', response.payload);
            await Utility.setStorage('authContextEntity', {...entity});
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
      <View
        style={[
          styles.headerRow,
          Platform.OS === 'android' ? {paddingTop: 8} : {},
        ]}>
        <Pressable
          style={styles.backIconContainer}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.image} />
        </Pressable>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>
            {strings.registerAsPlayerTitle}
          </Text>
          <Text style={styles.subHeading}>{sportName}</Text>
        </View>
        {loading ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <Pressable
            style={styles.buttonContainer}
            onPress={() => {
              onSave();
            }}>
            <Text style={styles.buttonText}>{strings.done}</Text>
          </Pressable>
        )}
      </View>
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

                <TouchableOpacity style={{alignSelf: 'flex-end'}}>
                  <Text style={styles.linkButtonText}>
                    Who are the match host and challenger?
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

      <CongratulationsModal
        isVisible={congratulationsModal}
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
        onChanllenge={(filters) => {
          navigation.navigate('LookingForChallengeScreen', {
            filters,
          });
        }}
        searchPlayer={() => {
          const sports = sportsData.map((item) => ({
            label: item?.sport_name,
            value: item?.sport_name.toLowerCase(),
          }));

          navigation.navigate('EntitySearchScreen', {
            sportsList: sports,
            sportsArray: sportsData,
          });
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
        searchTeam={() => {
          let sportsData = [];
          authContext.sports.map((item) =>
            item.format.map((innerObj) => {
              const sportList = [{...item, ...innerObj}];
              sportArr = [...sportArr, ...sportList];
              return null;
            }),
          );
          const sports = sportsData.map((item) => ({
            label: item?.sport_name,
            value: item?.sport_name.toLowerCase(),
          }));

          navigation.navigate('EntitySearchScreen', {
            sportsList: sports,
            sportsArray: sportsData,
            activeTab: 1,
          });
        }}
        joinTeam={(filters) => {
          navigation.navigate('LookingTeamScreen', {
            filters,
          });
        }}
        createTeam={() => {
          navigation.navigate('CreateTeamForm1');
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
        onChangeCurrency={() => {
          console.log({DataSource});
        }}
      />
    </SafeAreaView>
  );
}
