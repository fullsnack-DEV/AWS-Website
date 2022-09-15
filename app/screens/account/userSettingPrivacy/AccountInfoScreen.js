/* eslint-disable default-case */
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

import firebase from '@react-native-firebase/app';

import {useIsFocused} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {QBLogout} from '../../../utils/QuickBlox';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCLabel from '../../../components/TCLabel';
import Header from '../../../components/Home/Header';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCTextField from '../../../components/TCTextField';
import {clearStorage} from '../../../utils';
import {updateUserProfile} from '../../../api/Users';

export default function AccountInfoScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  // For activity indigator
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState(authContext.entity.obj);
  const [oldPassword, setOldPassword] = useState('');

  const [city, setCity] = useState(
    route?.params?.city ? route?.params?.city : authContext?.entity?.obj?.city,
  );
  const [state, setState] = useState(
    route?.params?.state
      ? route?.params?.state
      : authContext?.entity?.obj?.state_abbr,
  );
  const [country, setCountry] = useState(
    route?.params?.country
      ? route?.params?.country
      : authContext?.entity?.obj?.country,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, userInfo, city, state, country]);

  useEffect(() => {
    if (isFocused) {
      if (
        route?.params?.city &&
        route?.params?.state &&
        route?.params?.country
      ) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
      }
    }
  }, [
    isFocused,
    route?.params?.city,
    route?.params?.country,
    route?.params?.state,
  ]);

  const checkValidation = () => {
    if (userInfo.email === '') {
      Alert.alert(strings.appName, strings.emailNotBlankText);
      return false;
    }
    if (oldPassword === '') {
      Alert.alert(strings.appName, strings.passwordCanNotBlank);
      return false;
    }
    if (authContext?.entity?.obj?.email === userInfo.email) {
      Alert.alert(strings.appName, strings.addNewEmailValidation);
      return false;
    }

    return true;
  };

  const onLogout = useCallback(async () => {
    QBLogout();
    await firebase.auth().signOut();
    await clearStorage();
    await authContext.setUser(null);
    await authContext.setEntity(null);
  }, [authContext]);

  const onSavePress = () => {
    if (checkValidation()) {
      setloading(true);
      const credential = firebase.auth.EmailAuthProvider.credential(
        authContext?.entity?.obj?.email,
        oldPassword,
      );
      firebase
        .auth()
        .currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(userInfo.email)
            .then(() => {
              updateUserProfile(
                {
                  ...authContext.entity.auth.user,
                  email: userInfo.email,
                },
                authContext,
              )
                .then((response) => {
                  console.log(response);
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(
                      strings.checkInboxText,
                      '',
                      [
                        {
                          text: strings.okTitleText,
                          onPress: () => onLogout(),
                        },
                      ],
                      {cancelable: false},
                    );
                  }, 300);
                })
                .catch((e) => {
                  setloading(false);
                  setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, e.message);
                  }, 10);
                });
            })
            .catch((error) => {
              setloading(false);
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, error.message);
              }, 10);
            });
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    }
  };

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
            {strings.accountInfo}
          </Text>
        }
        rightComponent={
          <Text
            style={styles.headerRightButton}
            onPress={() => {
              onSavePress();
            }}>
            {strings.update}
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
      <TCKeyboardView>
        <ActivityLoader visible={loading} />
        <TCLabel title={strings.email} />

        <TCTextField
          style={styles.textFieldStyle}
          placeholder={strings.emailPlaceHolder}
          placeholderTextColor={colors.darkYellowColor}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => setUserInfo({...userInfo, email: text})}
          value={userInfo.email}
        />

        <TCTextField
          style={styles.textFieldStyle}
          placeholder={strings.passwordPlaceHolder}
          // placeholderTextColor={colors.darkYellowColor}
          autoCapitalize="none"
          secureText={true}
          onChangeText={(text) => setOldPassword(text)}
          value={oldPassword}
          textStyle={{color: colors.lightBlackColor}}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChangePasswordScreen');
          }}>
          <TCLabel
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              textDecorationLine: 'underline',
            }}
            title={strings.changePassword}></TCLabel>
        </TouchableOpacity>
      </TCKeyboardView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
  textFieldStyle: {
    marginTop: 15,
    width: wp('92%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerRightButton: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    width: 52,
  },
});
