import React, {
  useState, useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import firebase from '@react-native-firebase/app';

import LinearGradient from 'react-native-linear-gradient';

import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCKeyboardView from '../../../components/TCKeyboardView';

export default function ChangePasswordScreen({ navigation }) {
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

  const onSavePress = () => {
    if (checkValidation()) {
      setloading(true);
      console.log('EMAIL::', authContext?.entity?.obj?.email);
      const credential = firebase.auth.EmailAuthProvider.credential(authContext?.entity?.obj?.email, oldPassword);
      console.log('CREDENTIAL::', credential);
      firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
        firebase.auth().currentUser.updatePassword(newPassword).then(() => {
          setNewPassword('');
          setOldPassword('');
          setConfirmPassword('');
          setloading(false);
          setTimeout(() => {
            Alert.alert('Towns Cup', 'Your new password has beed set successfully');
          }, 0.7);
          navigation.goBack()
        })
      }).catch((error) => {
        setloading(false);
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Towns Cup', 'The password is invalid or the user does not have a password.');
        }
      });
    }
  }
  return (
    <TCKeyboardView>
      <View style={ styles.mainContainer }>
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
            {hideNewPassword ? <Image source={ images.showPassword } style={ styles.passwordEyes } /> : <Image source={ images.hidePassword } style={ styles.passwordEyes } />}
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
            {hideConfirmPassword ? <Image source={ images.showPassword } style={ styles.passwordEyes } /> : <Image source={ images.hidePassword } style={ styles.passwordEyes } />}
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity onPress={onSavePress}>
          <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.saveTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',

  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '92%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
  passwordEyes: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    width: 22,
  },
  passwordView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,

    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
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

    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    height: 40,
    paddingLeft: 17,

    width: wp('85%'),
  },
});
