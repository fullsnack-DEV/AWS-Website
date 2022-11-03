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

import firebase from '@react-native-firebase/app';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';

import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function UserSettingPrivacyScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [userSetting, setUserSetting] = useState();
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
    checkUserIsRegistratedOrNotWithFirebase(authContext.entity.obj.email)
      .then(async (providerData) => {
        if ((providerData || []).includes('password')) {
          setUserSetting([
            {key: strings.accountInfo, id: 1},
            {key: strings.profileText, id: 2},
            {key: strings.basicInfoText, id: 3},
            {key: strings.sportActivityText, id: 4},
            {key: strings.team, id: 5},
            {key: strings.club, id: 6},
            {key: strings.event, id: 7},
            {key: strings.timezoneText, id: 8},
            {key: strings.appLanguage, id: 12},
            {key: strings.currencyText, id: 9},
            // {key: 'Change Password', id: 7},
            {key: strings.deactivateAccountText, id: 10},
            {key: strings.terminateAccountText, id: 11},
            // {key: strings.privacySettingText,id:3}
          ]);
        } else {
          setUserSetting([
            {key: strings.accountInfo, id: 1},
            {key: strings.profileText, id: 2},
            {key: strings.basicInfoText, id: 3},
            {key: strings.sportActivityText, id: 4},
            {key: strings.team, id: 5},
            {key: strings.club, id: 6},
            {key: strings.event, id: 7},
            {key: strings.timezoneText, id: 8},
            {key: strings.appLanguage, id: 10},
            {key: strings.currencyText, id: 9},

            // {key: strings.privacySettingText,id:3}
          ]);
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  }, [authContext.entity.obj.email]);

  useEffect(() => {
    getUserSettingMenu();
  }, [getUserSettingMenu]);

  const checkUserIsRegistratedOrNotWithFirebase = (email) =>
    new Promise((resolve, reject) => {
      firebase
        .auth()
        .fetchSignInMethodsForEmail(email)
        .then((isAccountThereInFirebase) => {
          if (isAccountThereInFirebase?.length > 0) {
            resolve(isAccountThereInFirebase);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });

  const handleOpetions = async (opetions) => {
    if (opetions === strings.accountInfo) {
      navigation.navigate('AccountInfoScreen');
    } else if (opetions === strings.profileText) {
      navigation.navigate('PersonalInformationScreen');
    } else if (opetions === strings.basicInfoText) {
      navigation.navigate('BasicInfoScreen');
    } else if (opetions === strings.sportActivityText) {
      navigation.navigate('SportActivityScreen');
    } else if (opetions === strings.currencyText) {
      navigation.navigate('CurrencySettingScreen');
    } else if (opetions === strings.appLanguage) {
      navigation.navigate('LanguageSettingScreen');
    } else if (opetions === strings.privacySettingText) {
      // groupOpetionActionSheet.show();
    } else if (opetions === strings.deactivateAccountText) {
      navigation.navigate('DeactivateAccountScreen');
    } else if (opetions === strings.terminateAccountText) {
      navigation.navigate('TerminateAccountScreen');
    } else if (opetions === strings.team) {
      navigation.navigate('GroupInviteSettingPrivacyScreen', {
        type: Verbs.entityTypeTeam,
      });
    } else if (opetions === strings.club) {
      navigation.navigate('GroupInviteSettingPrivacyScreen', {
        type: Verbs.entityTypeClub,
      });
    } else if (opetions === strings.event) {
      navigation.navigate('UserEventSettingPrivacyScreen');
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
