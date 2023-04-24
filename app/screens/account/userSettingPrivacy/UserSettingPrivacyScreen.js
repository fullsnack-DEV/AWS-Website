import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';

export default function UserSettingPrivacyScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const userSetting = [
    strings.accountInfo,
    strings.profileText,
    strings.basicInfoText,
    strings.sportActivityText,
    strings.team,
    strings.club,
    strings.event,
    strings.privacyText,
    strings.timezoneText,
    strings.appLanguage,
    strings.deactivateAccountText,
    strings.terminateAccountText,
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (
      isFocused &&
      (authContext.entity.obj?.is_pause ||
        authContext.entity.obj?.is_deactivate)
    ) {
      setIsAccountDeactivated(true);
      setPointEvent('none');
    }
  }, [authContext, isFocused]);

  const handleOptions = (options) => {
    switch (options) {
      case strings.accountInfo:
        navigation.navigate('AccountInfoScreen');
        break;

      case strings.profileText:
        navigation.navigate('PersonalInformationScreen');
        break;

      case strings.basicInfoText:
        navigation.navigate('BasicInfoScreen');
        break;

      case strings.sportActivityText:
        navigation.navigate('SportActivityScreen');
        break;

      case strings.team:
        navigation.navigate('GroupInviteSettingPrivacyScreen', {
          type: Verbs.entityTypeTeam,
        });
        break;

      case strings.club:
        navigation.navigate('GroupInviteSettingPrivacyScreen', {
          type: Verbs.entityTypeClub,
        });
        break;

      case strings.event:
        // navigation.navigate('UserEventSettingPrivacyScreen');
        navigation.navigate('GroupInviteSettingPrivacyScreen', {
          type: Verbs.eventVerb,
        });
        break;

      case strings.privacyText:
        break;

      case strings.timezoneText:
        navigation.navigate('TimeZoneScreen');
        break;

      case strings.appLanguage:
        navigation.navigate('LanguageSettingScreen');
        break;

      case strings.deactivateAccountText:
        navigation.navigate('DeactivateAccountScreen');
        break;

      case strings.terminateAccountText:
        navigation.navigate('TerminateAccountScreen');
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        title={strings.settingsTitleText}
      />

      <View style={styles.container}>
        <FlatList
          data={userSetting}
          keyExtractor={(index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          renderItem={({item, index}) => (
            <>
              <Pressable
                style={[
                  styles.listContainer,
                  {opacity: isAccountDeactivated && index <= 3 ? 0.3 : 1},
                  index === 0 ? {marginTop: 10} : {},
                ]}
                onPress={() => {
                  handleOptions(item);
                }}
                pointerEvents={
                  isAccountDeactivated && index <= 3 ? pointEvent : 'auto'
                }>
                <View>
                  <Text style={styles.listItems}>{item}</Text>
                </View>
                <View style={styles.nextArrow}>
                  <Image source={images.nextArrow} style={styles.image} />
                </View>
              </Pressable>
              <View style={styles.separatorLine} />
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 5,
  },
  listItems: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  nextArrow: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
});
