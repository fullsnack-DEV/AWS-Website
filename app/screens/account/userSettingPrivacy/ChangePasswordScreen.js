import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';

import firebase from '@react-native-firebase/app';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {clearStorage} from '../../../utils';
import {QBLogout} from '../../../utils/QuickBlox';
import ScreenHeader from '../../../components/ScreenHeader';

export default function ChangePasswordScreen({navigation}) {
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const authContext = useContext(AuthContext);

  const hideShowNewPassword = () => {
    setHideNewPassword(!hideNewPassword);
  };

  const hideShowConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };
  const checkValidation = () => {
    if (oldPassword === '') {
      Alert.alert(strings.appName, strings.oldPasswordCanNotBlankValidation);
      return false;
    }
    if (newPassword === '') {
      Alert.alert(strings.appName, strings.newPasswordCanNotBlankValidation);
      return false;
    }
    if (confirmPassword === '') {
      Alert.alert(strings.appName, strings.cofirmpPswCanNotBlank);
      return false;
    }
    if (newPassword.length < 8) {
      Alert.alert(strings.appName, strings.passwordWarningMessage);
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(strings.appName, strings.passwordSamevalidation);
      return false;
    }
    if (newPassword === oldPassword) {
      Alert.alert(strings.appName, strings.passwordMustSameValidation);
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
        authContext.entity.obj.email,
        oldPassword,
      );
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

              Alert.alert(
                strings.appName,
                strings.youWillLogout,
                [
                  {
                    text: 'OK',
                    onPress: () => onLogout(),
                  },
                ],
                {cancelable: false},
              );
            });
        })
        .catch((error) => {
          setloading(false);
          if (error.code === 'auth/wrong-password') {
            setTimeout(() => {
              Alert.alert(strings.townsCupTitle, strings.emailPasswordWrong);
            }, 10);
          }
        });
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        title={strings.changePassword}
        containerStyle={styles.headerRow}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={onSavePress}
      />
      <ActivityLoader visible={loading} />

      <View style={styles.mainContainer}>
        <TextInput
          placeholderTextColor={colors.userPostTimeColor}
          placeholder={strings.oldPassword}
          secureTextEntry
          style={[
            styles.textFieldStyle,
            {fontSize: 16, fontFamily: fonts.RRegular, paddingHorizontal: 10},
          ]}
          onChangeText={(text) => setOldPassword(text)}
          value={oldPassword}
        />

        <View style={styles.separatorLine} />
        <View style={styles.passwordView}>
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            placeholder={`${strings.newPassword} ${strings.atLeastText}`}
            secureTextEntry={hideNewPassword}
            style={[styles.textFieldStyle, {flex: 1}]}
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
          />
          <TouchableOpacity onPress={() => hideShowNewPassword()} style={{}}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: colors.userPostTimeColor,
                fontSize: 10,
                fontFamily: fonts.RLight,
              }}>
              {hideNewPassword ? strings.SHOW : strings.HIDE}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordView}>
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            placeholder={strings.confirmPassword}
            secureTextEntry={hideConfirmPassword}
            style={[styles.textFieldStyle, {flex: 1}]}
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
                textDecorationLine: 'underline',
                color: colors.userPostTimeColor,
                fontSize: 10,
                fontFamily: fonts.RLight,
              }}>
              {hideConfirmPassword ? strings.SHOW : strings.HIDE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingLeft: 10,
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 14,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  textFieldStyle: {
    backgroundColor: colors.textFieldBackground,
    paddingVertical: Platform.OS === 'android' ? 5 : 12,
    borderRadius: 5,
  },

  passwordView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 14,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 35,
  },
});
