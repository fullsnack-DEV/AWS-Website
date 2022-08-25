import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCKeyboardView from '../../../components/TCKeyboardView';
import Header from '../../../components/Home/Header';

export default function ChangePasswordScreen({navigation}) {
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const authContext = useContext(AuthContext);

  // New Password Hide/Show function for setState
  const hideShowNewPassword = () => {
    setHideNewPassword(!hideNewPassword);
  };

  // Confirm Password Hide/Show function for setState
  const hideShowConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };
  const checkValidation = () => {
    if (oldPassword === '') {
      Alert.alert(strings.appName, 'Old Password cannot be blank.');
      return false;
    }
    if (newPassword === '') {
      Alert.alert(strings.appName, 'New Password cannot be blank.');
      return false;
    }
    if (confirmPassword === '') {
      Alert.alert(strings.appName, strings.cofirmpPswCanNotBlank);
      return false;
    }
    if (newPassword.length < 6) {
      Alert.alert(strings.appName, strings.passwordWarningMessage);
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        strings.appName,
        'New Password and Confirm Password should be same.',
      );
      return false;
    }
    if (newPassword === oldPassword) {
      Alert.alert(
        strings.appName,
        'New Password and Old Password cannot be same.',
      );
      return false;
    }

    return true;
  };

  // changePassword = (currentPassword, newPassword) => {
  //   this.reauthenticate(currentPassword).then(() => {
  //     var user = firebase.auth().currentUser;
  //     user.updatePassword(newPassword).then(() => {
  //       console.log("Password updated!");
  //     }).catch((error) => { console.log(error); });
  //   }).catch((error) => { console.log(error); });
  // }

  const onSavePress = () => {
    if (checkValidation()) {
      setloading(true);
      console.log('EMAIL::', authContext?.entity?.obj?.email);
      const credential = firebase.auth.EmailAuthProvider.credential(
        authContext?.entity?.obj?.email,
        oldPassword,
      );
      console.log('CREDENTIAL::', credential);
      firebase
        .auth()
        .currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          firebase
            .auth()
            .currentUser.updatePassword(newPassword)
            .then(() => {
              setNewPassword('');
              setOldPassword('');
              setConfirmPassword('');
              setloading(false);
              // Alert.alert(
              //   strings.appName,
              //   'Your new password has beed set successfully',
              // );
              navigation.goBack();
            });
        })
        .catch((error) => {
          setloading(false);
          if (error.code === 'auth/wrong-password') {
            setTimeout(() => {
              Alert.alert(
                'TownsCup',
                'The email and password you entered dont match',
              );
            }, 10);
          }
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
            Change Password
          </Text>
        }
        rightComponent={
          <TouchableOpacity onPress={onSavePress}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RMedium,
                color: colors.lightBlackColor,
              }}>
              Save
            </Text>
          </TouchableOpacity>
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
        <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            placeholder={strings.oldPassword}
            secureTextEntry={true}
            style={styles.matchFeeTxt}
            onChangeText={(text) => setOldPassword(text)}
            value={oldPassword}
          />

          <View style={styles.separatorLine}></View>
          <View style={styles.passwordView}>
            <TextInput
              placeholderTextColor={colors.userPostTimeColor}
              placeholder={strings.newPassword + strings.atLeastText}
              secureTextEntry={hideNewPassword}
              style={styles.textInput}
              onChangeText={(text) => setNewPassword(text)}
              value={newPassword}
            />
            <TouchableOpacity
              onPress={() => hideShowNewPassword()}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: colors.userPostTimeColor,
                  fontSize: 10,
                  fontFamily: fonts.RLight,
                }}>
                {hideNewPassword ? 'SHOW' : 'HIDE'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordView}>
            <TextInput
              placeholderTextColor={colors.userPostTimeColor}
              placeholder={strings.confirmPassword}
              secureTextEntry={hideConfirmPassword}
              style={styles.textInput}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
            <TouchableOpacity
              onPress={() => hideShowConfirmPassword()}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.userPostTimeColor,
                  fontSize: 10,
                  fontFamily: fonts.RLight,
                }}>
                {hideConfirmPassword ? 'SHOW' : 'HIDE'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TCKeyboardView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.whiteColor,
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    height: 40,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,

    width: wp('92%'),
  },
  passwordView: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,

    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    width: wp('92%'),
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    marginBottom: 25,
    marginTop: 40,
    width: wp('92%'),
  },
  textInput: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    height: 40,
    paddingLeft: 17,

    width: wp('80%'),
  },
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
});
