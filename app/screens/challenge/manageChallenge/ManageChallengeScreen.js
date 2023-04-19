import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import {
  getEntitySport,
  getSportDefaultSettings,
  getSportDetails,
} from '../../../utils/sportsActivityUtils';
import HostChallengerInfoModal from '../../account/registerPlayer/modals/HostChallengerInfoModal';
import styles from './MangeChallengeStyles';
import colors from '../../../Constants/Colors';
import WrapperModal from '../../../components/IncomingChallengeSettingsModals/WrapperModal';
import {patchPlayer} from '../../../api/Users';
import {setAuthContextData} from '../../../utils';
import {patchGroup} from '../../../api/Groups';

export default function ManageChallengeScreen({navigation, route}) {
  const [settingObject, setSettingObject] = useState();
  const [showHostChallengerModal, setShowHosChallengerModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState({});
  const [sportObj, setSportObj] = useState({});
  const [loading, setloading] = useState(false);

  const authContext = useContext(AuthContext);
  const {sportName, sportType, groupObj} = route.params;

  const getSettings = useCallback(
    (entity = {}) => {
      if (
        entity.entity_type === Verbs.entityTypePlayer ||
        entity.entity_type === Verbs.entityTypeUser
      ) {
        const sport = getEntitySport({
          user: entity,
          role: Verbs.entityTypePlayer,
          sportType,
          sport: sportName,
        });

        if (sport?.setting) {
          setSettingObject(sport.setting);
        } else {
          const setting = getSportDefaultSettings(
            sportName,
            authContext.sports,
          );
          setSettingObject(setting);
        }
      } else {
        setSettingObject(entity.setting ?? {});
      }
    },
    [sportName, sportType, authContext.sports],
  );

  useEffect(() => {
    getSettings(groupObj);
  }, [getSettings, groupObj]);

  useEffect(() => {
    const sportDetails = getSportDetails(
      sportName,
      sportType,
      authContext.sports,
    );
    setSportObj(sportDetails);
  }, [authContext.sports, sportName, sportType]);

  const challengeSettingMenu = [
    {key: strings.availability},
    {key: strings.gameTypeTitle},
    {key: strings.gameFee},
    {key: strings.refundPolicy},
    {
      key:
        getSportDefaultSettings(sportName, authContext.sports)
          ?.default_setting_key === Verbs.setText
          ? strings.setGamesDuration
          : strings.gameDuration,
    },
    {key: strings.venue},
    {key: strings.gameRulesTitle},
    {key: strings.Referee},
    {key: strings.scorekeeperText},
  ];

  const getSettingValue = (option) => {
    if (settingObject) {
      switch (option) {
        case strings.availability:
          return settingObject.availability ?? Verbs.on;

        case strings.gameTypeTitle:
          return settingObject.game_type ?? Verbs.friendly;

        case strings.gameFee:
          return `${settingObject.game_fee?.fee || 0} ${
            settingObject.game_fee?.currency_type || Verbs.cad
          }`;

        case strings.refundPolicy:
          return settingObject.refund_policy || Verbs.flexibleText;

        case strings.setGamesDuration:
          return `${settingObject.score_rules?.match_duration}`;

        case strings.gameDuration:
          return `${settingObject?.game_duration?.totalHours}h ${settingObject?.game_duration?.totalMinutes}m`;

        case strings.venue:
          if (settingObject.venue?.length > 0) {
            if (settingObject.venue.length === 1) {
              return settingObject.venue[0].address;
            }
            return format(strings.nVenues, settingObject.venue.length);
          }
          return format(strings.nVenues, 0);

        case strings.gameRulesTitle:
          return strings.completedTitleText;

        case strings.Referee:
          return settingObject.responsible_for_referee?.who_secure?.length > 0
            ? format(
                settingObject.responsible_for_referee.who_secure?.length > 1
                  ? strings.nReferees
                  : strings.nRefereeText,
                settingObject.responsible_for_referee.who_secure?.length,
              )
            : null;

        case strings.scorekeeperText:
          return settingObject?.responsible_for_scorekeeper?.who_secure
            ?.length > 0
            ? format(
                settingObject.responsible_for_scorekeeper.who_secure?.length > 1
                  ? strings.nScorekeepers
                  : strings.nScorekeeperText,
                settingObject.responsible_for_scorekeeper.who_secure?.length,
              )
            : null;

        default:
          return null;
      }
    }
    return null;
  };

  const handleOptions = (option) => {
    if (settingObject) {
      switch (option) {
        case strings.availability:
          setModalObj({
            title: option,
            settingsObj: settingObject,
            sportName,
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
        case strings.gameDuration:
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

  const renderMenu = ({item}) => (
    <View style={{paddingHorizontal: 15}}>
      <Pressable
        style={[styles.row, styles.menuItem]}
        onPress={() => {
          handleOptions(item.key);
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.label}>{item.key}</Text>
        </View>
        <View style={[styles.row, {flex: 1}]}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text
              style={[
                styles.label,
                getSettingValue(item.key)
                  ? {color: colors.greenColorCard}
                  : {color: colors.redColor},
              ]}
              numberOfLines={1}>
              {getSettingValue(item.key) ?? strings.incomplete}
            </Text>
          </View>

          <Image source={images.nextArrow} style={styles.nextArrow} />
        </View>
      </Pressable>

      <View style={styles.separatorLine} />
    </View>
  );

  const updateUser = (settings) => {
    if (!groupObj?.user_id) {
      return;
    }
    const updatedSettings = {...settingObject, ...settings};
    const registerdPlayerData = groupObj.registered_sports.map((item) => {
      if (item.sport === sportName && item.sport_type === sportType) {
        if (item.sport === Verbs.tennisSport) {
          return {
            ...item,
            setting: {
              ...updatedSettings,
              ntrp: updatedSettings.ntrp ?? '5.0',
            },
          };
        }

        return {
          ...item,
          setting: {
            ...updatedSettings,
          },
        };
      }
      return item;
    });

    const body = {
      ...groupObj,
      registered_sports: registerdPlayerData,
    };

    setloading(true);
    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          getSettings(response.payload);
          await setAuthContextData(response.payload, authContext);
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
  };

  const updateGroup = (settings) => {
    if (!groupObj?.group_id) {
      return;
    }
    const updatedSettings = {...settingObject, ...settings};
    const body = {
      ...groupObj,
      setting: {...updatedSettings},
    };

    setloading(true);
    patchGroup(groupObj.group_id, body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          getSettings(response.payload);
          await setAuthContextData(response.payload, authContext);
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
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.image} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.headerTitle}>
            {strings.incomingChallengeSettingsTitle}
          </Text>
          <Text style={styles.headerText}>{sportObj.sport_name}</Text>
        </View>
        <View style={styles.backIcon} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={colors.whiteColor} />
        </View>
      ) : null}
      <FlatList
        data={challengeSettingMenu}
        keyExtractor={(index) => index.toString()}
        ListHeaderComponent={() => (
          <>
            <View style={styles.greyContainer}>
              <Text style={styles.greyContainerText}>
                {strings.challengeSettingTitle}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.textButtonContainer}
              onPress={() => setShowHosChallengerModal(true)}>
              <Text style={styles.textButton}>
                {strings.hostAndChallengerText}
              </Text>
            </TouchableOpacity>
          </>
        )}
        renderItem={renderMenu}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <View
            style={{marginTop: 25, marginBottom: 15, paddingHorizontal: 15}}>
            <Text style={styles.label}>
              {strings.challengeScreenBottomText}
            </Text>
          </View>
        )}
      />

      <HostChallengerInfoModal
        isVisible={showHostChallengerModal}
        closeModal={() => setShowHosChallengerModal(false)}
      />
      <WrapperModal
        isVisible={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        {...modalObj}
        onSave={(settings) => {
          setShowModal(false);
          if (
            groupObj.entity_type === Verbs.entityTypePlayer ||
            groupObj.entity_type === Verbs.entityTypeUser
          ) {
            updateUser(settings);
          } else {
            updateGroup(settings);
          }
        }}
        entityType={Verbs.entityTypePlayer}
      />
    </SafeAreaView>
  );
}
