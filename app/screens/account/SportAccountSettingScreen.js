import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';

import {format} from 'react-string-format';
import fonts from '../../Constants/Fonts';
import Header from '../../components/Home/Header';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import {firstLetterCapital, getSportName} from '../../utils';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

export default function SportAccountSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [userSetting, setUserSetting] = useState();
  const [sport] = useState(route?.params?.sport);
  const [type] = useState(route?.params?.type);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      if (authContext?.entity?.obj?.is_pause === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
      if (authContext?.entity?.obj?.is_deactivate === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [
    authContext.entity?.obj.entity_type,
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    isFocused,
    pointEvent,
  ]);

  const getUserSettingMenu = useCallback(() => {
    if (
      sport?.sport_type === 'single' ||
      ![Verbs.entityTypePlayer, Verbs.entityTypeUser].includes(type)
    ) {
      setUserSetting([
        {
          key: format(
            strings.challengeSetting,
            [Verbs.entityTypePlayer, Verbs.entityTypeUser].includes(type)
              ? strings.challenge
              : strings.reservation,
          ),
          id: 1,
        },
        {key: strings.deactivateActivityText, id: 2},
      ]);
    } else {
      setUserSetting([{key: strings.deactivateActivityText, id: 1}]);
    }
  }, [sport?.sport_type, type]);

  useEffect(() => {
    getUserSettingMenu();
  }, [getUserSettingMenu]);

  const handleOpetions = (opetions) => {
    if (opetions.toLowerCase() === strings.challengeSettingText.toLowerCase()) {
      navigation.navigate('ManageChallengeScreen', {
        groupObj: authContext.entity.obj,
        sportName: sport.sport,
        sportType: sport.sport_type,
      });
    } else if (
      opetions.toLowerCase() === strings.reservationSettingText.toLowerCase()
    ) {
      if (type === Verbs.entityTypeReferee) {
        console.log('opetions:=>', opetions);
        navigation.navigate('RefereeReservationSetting', {
          sportName: sport.sport,
        });
      } else {
        navigation.navigate('ScorekeeperReservationSetting', {
          sportName: sport.sport,
        });
      }
    } else if (
      opetions === strings.lookingForClubText ||
      opetions === strings.lookingForTeamText
    ) {
      navigation.navigate('LookingForSettingScreen', {
        type,
        sport,
      });
    } else if (opetions === strings.deactivateActivityText) {
      navigation.navigate('DeactivateSportScreen', {
        sportObj: sport,
      });
    }
  };

  const renderMenu = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View
        style={{
          flexDirection: 'row',
          opacity: isAccountDeactivated && index <= 3 ? 0.5 : 1,
        }}
        pointerEvents={
          isAccountDeactivated && index <= 3 ? pointEvent : 'auto'
        }>
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === 'Currency' && authContext?.entity?.obj?.currency_type && (
          <Text style={styles.currencyTypeStyle}>
            {authContext?.entity?.obj?.currency_type}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text
            style={{
              fontSize: 16,
              color: colors.lightBlackColor,
              textAlign: 'center',
              fontFamily: fonts.RBold,
            }}>
            {strings.settingsTitleText}
            {'\n'}
            <Text
              style={{
                fontSize: 12,
                color: colors.lightBlackColor,
                textAlign: 'center',
                fontFamily: fonts.RRegular,
              }}>
              {type === Verbs.entityTypeReferee ||
              type === Verbs.entityTypeScorekeeper
                ? firstLetterCapital(sport.sport)
                : getSportName(sport, authContext)}
            </Text>
          </Text>
        }
      />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: colors.writePostSepratorColor,
        }}
      />
      <ScrollView style={styles.mainContainer}>
        <FlatList
          data={userSetting}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
});
