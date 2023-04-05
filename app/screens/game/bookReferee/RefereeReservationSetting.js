import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import {
  getEntitySport,
  getSportDefaultSettings,
  getSportDetails,
} from '../../../utils/sportsActivityUtils';
import WrapperModal from '../../../components/IncomingChallengeSettingsModals/WrapperModal';
import {getTCDate, setAuthContextData} from '../../../utils';
import {patchRegisterRefereeDetails} from '../../../api/Users';

const layout = Dimensions.get('window');
export default function RefereeReservationSetting({navigation, route}) {
  const [settingObject, setSettingObject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState({});
  const [sportObj, setSportObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [sportName] = useState(route.params.sportName);

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const getSettings = useCallback(
    (user) => {
      const sport = getEntitySport({
        user,
        role: Verbs.entityTypeReferee,
        sportType: '',
        sport: sportName,
      });

      if (sport?.setting) {
        setSettingObject(sport.setting);
      } else {
        const setting = getSportDefaultSettings(sportName, authContext.sports);
        setSettingObject(setting);
      }
    },
    [sportName, authContext.sports],
  );

  useEffect(() => {
    if (isFocused) {
      getSettings(authContext.entity.obj);
    }
  }, [
    authContext,
    getSettings,
    isFocused,
    route?.params?.settingObj,
    sportName,
  ]);

  useEffect(() => {
    const sportDetails = getSportDetails(
      sportName,
      '',
      authContext.sports,
      Verbs.entityTypeReferee,
    );
    setSportObj(sportDetails);
  }, [authContext.sports, sportName]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const challengeSettingMenu = [
    {key: strings.availability},
    {key: strings.refereeFee},
    {key: strings.refundPolicy},
    {key: strings.servicableAreas},
  ];

  const getSettingValue = (item) => {
    if (settingObject) {
      switch (item) {
        case strings.availability:
          return settingObject.referee_availibility ?? Verbs.on;

        case strings.refereeFee:
          return `${settingObject.game_fee?.fee || 0} ${
            settingObject?.game_fee?.currency_type || Verbs.cad
          }`;

        case strings.refundPolicy:
          return settingObject.refund_policy;

        case strings.servicableAreas:
          if (settingObject?.available_area) {
            return strings.completedTitleText;
          }
          return null;

        default:
          return null;
      }
    }
    return null;
  };

  const handleEditOption = (section) => {
    switch (section) {
      case strings.availability:
        setModalObj({
          title: section,
          settingsObj: settingObject,
          sportName,
        });
        setShowModal(true);
        break;

      case strings.refundPolicy:
      case strings.refereeFee:
        setModalObj({
          title: section,
          settingsObj: settingObject,
        });
        setShowModal(true);
        break;

      case strings.servicableAreas:
        break;

      default:
        break;
    }
  };

  const onSave = (settings) => {
    setLoading(true);
    const updatedSettings = {...settingObject, ...settings};
    const updatedData = authContext.entity.obj.referee_data.map((item) => {
      if (item.sport === sportName) {
        return {
          ...item,
          setting: {
            ...updatedSettings,
          },
          created_at: getTCDate(new Date()),
        };
      }
      return item;
    });

    const body = {
      ...authContext.entity.obj,
      referee_data: updatedData,
    };
    patchRegisterRefereeDetails(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          getSettings(response.payload);
          await setAuthContextData(response.payload, authContext);
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setLoading(false);
      })
      .catch((e) => {
        Alert.alert(strings.alertmessagetitle, e.message);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const renderMenu = ({item}) => (
    <>
      <Pressable
        style={[styles.row, styles.menuItem]}
        onPress={() => {
          handleEditOption(item.key);
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
    </>
  );

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
      <View>
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
            <Text style={styles.headerText}>
              {strings.Referee} · {sportObj.sport_name}
            </Text>
          </View>
          <View style={styles.backIcon} />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={colors.whiteColor} />
          </View>
        ) : null}
        <View style={styles.greyContainer}>
          <Text style={styles.greyContainerText}>
            {strings.refereeSettingHeading}
          </Text>
        </View>
        <FlatList
          data={challengeSettingMenu}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          contentContainerStyle={{paddingHorizontal: 15}}
        />
      </View>
      <View style={{paddingHorizontal: 15, paddingBottom: 6}}>
        <Text style={styles.label}>
          {format(strings.reservationScreenBottomText, strings.referee)}
        </Text>
      </View>

      <WrapperModal
        isVisible={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        {...modalObj}
        onSave={(settings) => {
          setShowModal(false);
          onSave(settings);
        }}
        entityType={Verbs.entityTypeReferee}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  greyContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: colors.textFieldBackground,
    margin: 15,
    borderRadius: 5,
    marginBottom: 25,
  },
  greyContainerText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },

  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  nextArrow: {
    width: 8,
    height: 14,
    marginLeft: 15,
  },
  separatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    marginVertical: 15,
  },
  backIcon: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 6,
    paddingTop: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  loadingContainer: {
    width: layout.width,
    height: layout.height,
    position: 'absolute',
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
