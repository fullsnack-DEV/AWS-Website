import React, {
  useState,
  // useEffect,
  useLayoutEffect,
  useContext,
  // useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  // Alert,
  // TextInput,
  // Platform,
} from 'react-native';

// import firebase from '@react-native-firebase/app';

// import {useIsFocused} from '@react-navigation/native';
// import {QBLogout} from '../../../utils/QuickBlox';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
// import {clearStorage} from '../../../utils';
// import {updateUserProfile} from '../../../api/Users';
import ScreenHeader from '../../../components/ScreenHeader';

export default function AccountInfoScreen({navigation}) {
  const [loading] = useState(false);
  const [showEmailBox] = useState(false);

  const authContext = useContext(AuthContext);
  // const isFocused = useIsFocused();

  const [userInfo] = useState(authContext.entity.obj);
  // const [oldPassword, setOldPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, userInfo]);

  // useEffect(() => {
  //   const user = authContext.entity.obj;
  //   if (isFocused && user?.email) {
  //     checkUserIsRegistratedOrNotWithFirebase(user.email);
  //   }
  // }, [isFocused, authContext]);

  // const checkUserIsRegistratedOrNotWithFirebase = (email) => {
  //   console.log({email});
  //   firebase
  //     .auth()
  //     .fetchSignInMethodsForEmail(email)
  //     .then((res) => {
  //       console.log({res});
  //       // if (isAccountThereInFirebase?.length > 0) {
  //       //   // resolve(isAccountThereInFirebase);
  //       // } else {
  //       //   // resolve(false);
  //       // }
  //     })
  //     .catch((error) => {
  //       // reject(error);
  //       console.log(error);
  //     });
  // };

  // const checkValidation = () => {
  //   if (userInfo.email === '') {
  //     Alert.alert(strings.appName, strings.emailNotBlankText);
  //     return false;
  //   }
  //   if (oldPassword === '') {
  //     Alert.alert(strings.appName, strings.passwordCanNotBlank);
  //     return false;
  //   }
  //   if (authContext?.entity?.obj?.email === userInfo.email) {
  //     Alert.alert(strings.appName, strings.addNewEmailValidation);
  //     return false;
  //   }

  //   return true;
  // };

  // const onLogout = useCallback(async () => {
  //   QBLogout();
  //   await firebase.auth().signOut();
  //   await clearStorage();
  //   await authContext.setUser(null);
  //   await authContext.setEntity(null);
  // }, [authContext]);

  // const onSavePress = () => {

  //   if (checkValidation()) {
  //     setloading(true);
  //     const credential = firebase.auth.EmailAuthProvider.credential(
  //       authContext?.entity?.obj?.email,
  //       oldPassword,
  //     );
  //     firebase
  //       .auth()
  //       .currentUser.reauthenticateWithCredential(credential)
  //       .then(() => {
  //         firebase
  //           .auth()
  //           .currentUser.updateEmail(userInfo.email)
  //           .then(() => {
  //             updateUserProfile(
  //               {
  //                 ...authContext.entity.auth.user,
  //                 email: userInfo.email,
  //               },
  //               authContext,
  //             )
  //               .then((response) => {
  //                 console.log(response);
  //                 setloading(false);
  //                 setTimeout(() => {
  //                   Alert.alert(
  //                     strings.checkInboxText,
  //                     '',
  //                     [
  //                       {
  //                         text: strings.okTitleText,
  //                         onPress: () => onLogout(),
  //                       },
  //                     ],
  //                     {cancelable: false},
  //                   );
  //                 }, 300);
  //               })
  //               .catch((e) => {
  //                 setloading(false);
  //                 setTimeout(() => {
  //                   Alert.alert(strings.alertmessagetitle, e.message);
  //                 }, 10);
  //               });
  //           })
  //           .catch((error) => {
  //             setloading(false);
  //             setTimeout(() => {
  //               Alert.alert(strings.alertmessagetitle, error.message);
  //             }, 10);
  //           });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setloading(false);
  //         setTimeout(() => {
  //           Alert.alert(strings.alertmessagetitle, error.message);
  //         }, 10);
  //       });
  //   }
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        title={strings.accountInfo}
        containerStyle={styles.headerRow}
        isRightIconText={showEmailBox}
        rightButtonText={strings.update}
        // onRightButtonPress={onSavePress}
      />
      <ActivityLoader visible={loading} />
      <View style={{paddingTop: 31, paddingHorizontal: 15}}>
        <Text style={styles.inputLabel}>{strings.emailText}</Text>
        <View style={styles.row}>
          <View>
            <Text
              style={[
                styles.inputLabel,
                {marginBottom: 0, fontFamily: fonts.RRegular},
              ]}>
              {userInfo.email}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              // setShowEmailBox(true);
              Alert.alert(strings.functionNotAvailable, '', [
                {text: strings.okTitleText},
              ]);
            }}>
            <Text style={styles.buttonText}>{strings.editEmail}</Text>
          </TouchableOpacity>
        </View>

        {/* {showEmailBox && (
          <>
            <TextInput
              style={styles.textFieldStyle}
              placeholder={strings.emailPlaceHolder}
              keyboardType="email-address"
              onChangeText={(text) => setUserInfo({...userInfo, email: text})}
              value={userInfo.email}
            />

            <TextInput
              style={[styles.textFieldStyle, {marginBottom: 35}]}
              placeholder={strings.passwordPlaceHolder}
              secureTextEntry
              onChangeText={(text) => setOldPassword(text)}
              value={oldPassword}
            />
          </>
        )} */}

        <TouchableOpacity
          style={{alignSelf: 'baseline'}}
          onPress={() => {
            navigation.navigate('ChangePasswordScreen');
          }}>
          <Text style={styles.textButton}>{strings.changePassword}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  buttonContainer: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  // textFieldStyle: {
  //   backgroundColor: colors.textFieldBackground,
  //   paddingVertical: Platform.OS === 'android' ? 5 : 12,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   marginBottom: 15,
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  // },
  textButton: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textDecorationLine: 'underline',
  },
});
