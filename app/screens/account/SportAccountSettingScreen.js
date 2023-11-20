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
  SafeAreaView,
  Pressable,
  BackHandler,
} from 'react-native';

import {format} from 'react-string-format';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import {
  getEntityTpeLabel,
  getSportDetails,
} from '../../utils/sportsActivityUtils';
import ScreenHeader from '../../components/ScreenHeader';

export default function SportAccountSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const {sport, type} = route.params;

  const [pointEvent] = useState('auto');
  const [userSetting, setUserSetting] = useState();
  const [sportObj, setSportObj] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const sportDetails = getSportDetails(
      sport.sport,
      sport.sport_type,
      authContext.sports,
      type,
    );
    setSportObj(sportDetails);
  }, [authContext.sports, sport, type]);

  const getUserSettingMenu = useCallback(() => {
    const list = [strings.deactivateActivityText];
    if (type === Verbs.entityTypePlayer) {
      if (sport?.sport_type === Verbs.singleSport) {
        list.splice(
          0,
          0,
          format(strings.challengeSetting, Verbs.incomingChallenge),
        );
        list.splice(1, 0, strings.lookingForClubText);
      } else {
        list.splice(0, 0, strings.lookingForTeamText);
      }
    } else {
      list.splice(0, 0, format(strings.challengeSetting, Verbs.reservation));
      list.splice(1, 0, strings.lookingForTeamText);
    }

    setUserSetting(list);
  }, [sport?.sport_type, type]);

  useEffect(() => {
    getUserSettingMenu();
  }, [getUserSettingMenu]);

  const handleOptions = (options) => {
    if (
      options.toLowerCase() === strings.challengeSettingText.toLowerCase() ||
      options.toLowerCase() ===
        strings.incomingChallengeSettingsTitle.toLowerCase()
    ) {
      navigation.navigate('ManageChallengeScreen', {
        groupObj: authContext.entity.obj,
        sportName: sport.sport,
        sportType: sport.sport_type,
      });
    } else if (
      options.toLowerCase() === strings.reservationSettingText.toLowerCase()
    ) {
      if (type === Verbs.entityTypeReferee) {
        navigation.navigate('RefereeReservationSetting', {
          sportName: sport.sport,
        });
      } else {
        navigation.navigate('ScorekeeperReservationSetting', {
          sportName: sport.sport,
        });
      }
    } else if (
      options === strings.lookingForClubText ||
      options === strings.lookingForTeamText
    ) {
      navigation.navigate('LookingForSettingScreen', {
        entityType: type,
        sport,
        comeFrom: 'SportAccountSettingScreen',
        routeParams: {...route.params},
      });
    } else if (options === strings.deactivateActivityText) {
      navigation.navigate('DeactivateSportScreen', {
        sportObj: sport,
      });
    }
  };

  const renderMenu = ({item, index}) => (
    <>
      <Pressable
        style={[
          styles.row,
          styles.menuItem,
          {opacity: authContext.isAccountDeactivated && index <= 3 ? 0.5 : 1},
        ]}
        onPress={() => {
          handleOptions(item);
        }}
        pointerEvents={
          authContext.isAccountDeactivated && index <= 3 ? pointEvent : 'auto'
        }>
        <View style={{flex: 1}}>
          <Text style={styles.label}>{item}</Text>
        </View>
        <View style={styles.row}>
          {item === strings.lookingForClubText ||
          item === strings.lookingForTeamText ? (
            <Text style={[styles.label, {color: colors.greenColorCard}]}>
              {sport?.lookingForTeamClub ? strings.yes : strings.no}
            </Text>
          ) : null}

          <Image source={images.nextArrow} style={styles.nextArrow} />
        </View>
      </Pressable>

      <View style={styles.separatorLine} />
    </>
  );

  const handleBackPress = useCallback(() => {
    if (route.params?.isFromSettings) {
      navigation.navigate('HomeStack', {
        screen: 'SportActivityScreen',
        params: {
          parentStack: 'AccountStack',
          screen: 'UserSettingPrivacyScreen',
        },
      });
    } else {
      navigation.goBack();
    }
  }, [route.params?.isFromSettings, navigation]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={`${getEntityTpeLabel(type)} • ${sportObj.sport_name}`}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
      />

      <FlatList
        data={userSetting}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 25,
        }}
        renderItem={renderMenu}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
});
