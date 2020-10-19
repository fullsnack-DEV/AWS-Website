import React, {
  useState, useContext,
} from 'react';
import {
  View,
  Text,
  Image,

  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import firebase from '@react-native-firebase/app';

import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import constants from '../../../../config/constants';
import PATH from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';

const { colors } = constants;

export default function ChangePasswordScreen() {
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
  }

  // Confirm Password Hide/Show function for setState
  const hideShowConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  }

  const checkValidation = () => {
    if (oldPassword === '') {
      Alert.alert('Towns Cup', 'Old password cannot be blank');
      return false
    } if (newPassword === '') {
      Alert.alert('Towns Cup', 'New password cannot be blank');
      return false
    } if (confirmPassword === '') {
      Alert.alert('Towns Cup', 'Confirm password cannot be blank');
      return false
    } if (newPassword.length < 8) {
      Alert.alert('Towns Cup', 'Password should be atleast 8 characters');
      return false
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Towns Cup', 'New password and confirm password should be same');
      return false
    }

    return true
  };

  // changePassword = (currentPassword, newPassword) => {
  //   this.reauthenticate(currentPassword).then(() => {
  //     var user = firebase.auth().currentUser;
  //     user.updatePassword(newPassword).then(() => {
  //       console.log("Password updated!");
  //     }).catch((error) => { console.log(error); });
  //   }).catch((error) => { console.log(error); });
  // }

  return (
      <ScrollView style={ styles.mainContainer }>
          <ActivityLoader visible={ loading } />

          <TextInput
            placeholder={ strings.oldPassword }
            secureTextEntry={ true }
            style={ styles.matchFeeTxt }
            onChangeText={ (text) => setOldPassword(text) }
            value={ oldPassword }></TextInput>

          <View style={ styles.separatorLine }></View>
          <View style={ styles.passwordView }>
              <TextInput
            placeholder={ strings.newPassword + strings.atLeastText }
            secureTextEntry={ hideNewPassword }
            style={ styles.textInput }
            onChangeText={ (text) => setNewPassword(text) }
            value={ newPassword }></TextInput>
              <TouchableWithoutFeedback onPress={ () => hideShowNewPassword() }>
                  {hideNewPassword ? <Image source={ PATH.showPassword } style={ styles.passwordEyes } /> : <Image source={ PATH.hidePassword } style={ styles.passwordEyes } />}
              </TouchableWithoutFeedback>
          </View>

          <View style={ styles.passwordView }>
              <TextInput
            placeholder={ strings.confirmPassword }
            secureTextEntry={ hideConfirmPassword }
            style={ styles.textInput }
            onChangeText={ (text) => setConfirmPassword(text) }
            value={ confirmPassword }></TextInput>
              <TouchableWithoutFeedback onPress={ () => hideShowConfirmPassword() }>
                  {hideConfirmPassword ? <Image source={ PATH.showPassword } style={ styles.passwordEyes } /> : <Image source={ PATH.hidePassword } style={ styles.passwordEyes } />}
              </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={ () => {
            setloading(true);
            if (checkValidation()) {
              const credential = firebase.auth.EmailAuthProvider.credential(authContext.user.email, oldPassword);
              firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
                firebase.auth().currentUser.updatePassword(newPassword).then(() => {
                  setNewPassword('');
                  setOldPassword('');
                  setConfirmPassword('');
                  setloading(false);
                  Alert.alert('Towns Cup', 'Your new password has beed set succesfully');
                })
              }).catch((error) => {
                if (error.code === 'auth/wrong-password') {
                  Alert.alert('Towns Cup', 'The password is invalid or the user does not have a password.');
                }
              });
              setloading(false);
            }
          } }>
              <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
                  <Text style={ styles.nextButtonText }>{strings.saveTitle}</Text>
              </LinearGradient>
          </TouchableWithoutFeedback>
      </ScrollView>
  );
}
