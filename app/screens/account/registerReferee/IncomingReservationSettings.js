// @flow
/* eslint-disable */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import {getCountry} from 'country-currency-map';
import {useIsFocused} from '@react-navigation/native';
import {strings} from '../../../../Localization/translation';

import {patchRegisterRefereeDetails} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import WrapperModal from '../../../components/IncomingChallengeSettingsModals/WrapperModal';
import ScreenHeader from '../../../components/ScreenHeader';
import TCFormProgress from '../../../components/TCFormProgress';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {getTCDate, setAuthContextData} from '../../../utils';
import MatchFeeReminder from '../registerPlayer/modals/MatchFeeReminder';
import MenuItem from './components/MenuItem';
import RefereeCongratulationsModal from './components/RefereeCongratulationsModal';

import {currencyList} from '../../../Constants/GeneralConstants';

const IncomingReservationSettings = ({navigation, route}) => {
  const [settingsObject, setSettingObject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalObj, setModalObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMatchFeeReminderModal, setShowMatchFeeReminderModal] =
    useState(false);
  const [isAlreadyWarned, setIsAlreadyWarned] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);

  const {bodyParams, settingObj, sportName, entityType, sport} = route.params;
  const authContext = useContext(AuthContext);

  const reservationSettingMenu = [
    {key: strings.sport},
    {key: strings.availability},
    {
      key:
        entityType === Verbs.entityTypeReferee
          ? strings.refereeFee
          : strings.scorekeeperFee,
    },
    {key: strings.refundPolicy},
    {key: strings.servicableAreas},
  ];
  const [currency, setCurrency] = useState();
  const Focused = useIsFocused();

  useEffect(() => {
    const gettingCurrency = getCountry(authContext.entity.obj.country);

    if (!currencyList.some((i) => i.currency === gettingCurrency.currency)) {
      setCurrency(Verbs.usd);
    } else {
      setSettingObject({
        ...settingObj,
        game_fee: {
          ...settingObj.game_fee,
          currency_type: gettingCurrency.currency,
          fee: 0,
        },
      });
    }
  }, [Focused]);

  const handleEditOption = (section) => {
    switch (section) {
      case strings.availability:
        setModalObj({
          title: section,
          settingsObj: settingsObject,
          sportName,
        });
        setShowModal(true);
        break;

      case strings.refundPolicy:
      case strings.refereeFee:
      case strings.scorekeeperFee:
        setModalObj({
          title: section,
          settingsObj: settingsObject,
        });
        setShowModal(true);
        break;

      case strings.servicableAreas:
        break;

      default:
        break;
    }
  };

  const onSave = () => {
    if (
      (settingsObject.game_fee?.fee === 0 ||
        settingsObject.game_fee?.fee === '') &&
      !isAlreadyWarned
    ) {
      setShowMatchFeeReminderModal(true);
      setIsAlreadyWarned(true);
    } else {
      setLoading(true);
      const updatedData = bodyParams.map((item) => {
        if (item.sport_name === sportName) {
          return {
            ...item,
            setting: {
              ...settingsObject,
            },
            created_at: getTCDate(new Date()),
          };
        }
        return item;
      });

      const refereeBody = {
        ...authContext.entity.obj,
        referee_data: updatedData,
      };

      const scorekeeperBody = {
        ...authContext.entity.obj,
        scorekeeper_data: updatedData,
      };

      const body =
        entityType === Verbs.entityTypeReferee ? refereeBody : scorekeeperBody;

      patchRegisterRefereeDetails(body, authContext)
        .then(async (response) => {
          if (response.status === true) {
            await setAuthContextData(response.payload, authContext);
            setShowCongratulationsModal(true);
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
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={
          entityType === Verbs.entityTypeReferee
            ? strings.registerRefereeTitle
            : strings.registerScorekeeperTitle
        }
        isFullTitle
        leftIconStyle={{width: 40}}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        containerStyle={{paddingBottom: 14}}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={onSave}
        loading={loading}
      />
      <TCFormProgress totalSteps={2} curruentStep={2} />
      <View style={{flex: 1}}>
        <FlatList
          data={reservationSettingMenu}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={() => (
            <>
              <View style={styles.container}>
                <Text style={[styles.title, {marginBottom: 10}]}>
                  {strings.incomingReservationSettings}
                </Text>
                <Text style={styles.description}>
                  {entityType === Verbs.entityTypeReferee
                    ? strings.incomingReservationSettingsDescription
                    : strings.incomingReservationSettingsScoreKeeper}
                </Text>
              </View>
              <View style={styles.separator} />
            </>
          )}
          renderItem={({item}) => (
            <MenuItem
              item={item}
              settingsObj={settingsObject}
              sportName={sportName}
              handleEditOption={handleEditOption}
            />
          )}
        />
      </View>
      <WrapperModal
        isVisible={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        {...modalObj}
        onSave={(settings) => {
          setShowModal(false);
          setSettingObject({...settingsObject, ...settings});
        }}
        entityType={entityType}
      />

      <MatchFeeReminder
        isVisible={showMatchFeeReminderModal}
        onAddMatchFee={() => {
          setShowMatchFeeReminderModal(false);
          if (entityType === Verbs.entityTypeReferee) {
            handleEditOption(strings.refereeFee);
          } else if (entityType === Verbs.entityTypeScorekeeper) {
            handleEditOption(strings.scorekeeperFee);
          }
        }}
        onContinue={() => {
          setShowMatchFeeReminderModal(false);
          onSave();
        }}
        entityType={entityType}
        onCloseModal={() => setShowMatchFeeReminderModal(false)}
      />

      <RefereeCongratulationsModal
        isVisible={showCongratulationsModal}
        closeModal={() => {
          setShowCongratulationsModal(false);
          if (route.params?.comeFrom) {
            navigation.navigate(route.params.comeFrom, {
              ...route.params.routeParams,
            });
          } else {
            navigation.navigate('AccountScreen', {
              createdSportName: sportName,
              // eslint-disable-next-line
              // sportType: sportType,
            });
          }
        }}
        sportName={sportName}
        entityType={entityType}
        sport={settingObj.sport}
        goToSportActivityHome={() => {
          setShowCongratulationsModal(false);
          navigation.navigate('SportActivityHome', {
            sport,
            entityType,
            uid: authContext.entity.uid,
            selectedTab: strings.infoTitle,
            backScreen: 'AccountScreen',
            backScreenParams: {
              createdSportName: sport,
              // sportType: selectedSport?.sport_type,
            },
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  separator: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
});
export default IncomingReservationSettings;
