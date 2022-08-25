import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import firebase from '@react-native-firebase/app';
import {uploadImageOnPreSignedUrls} from '../../utils/imageAction';
import TCKeyboardView from '../../components/TCKeyboardView';
import ActivityLoader from '../../components/loader/ActivityLoader';

import * as Utility from '../../utils/index';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import TCButton from '../../components/TCButton';
import TCTextField from '../../components/TCTextField';
import AuthContext from '../../auth/context';
import apiCall from '../../utils/apiCall';

export default function SignupFromLoginScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email] = useState(route?.params?.email);
  const [password] = useState(route?.params?.password);
  const [profilePic, setProfilePic] = useState(null);
  // For activity indigator
  const [loading, setloading] = useState(false);

  const validate = () => {
    if (fName === '') {
      Alert.alert(strings.appName, 'First name cannot be blank');
      return false;
    }
    if (lName === '') {
      Alert.alert(strings.appName, 'Last name cannot be blank');
      return false;
    }
    return true;
  };
  const saveUserDetails = async (user) => {
    const storedUser = await Utility.getStorage('userInfo');
    if (user) {
      user
        .getIdTokenResult()
        .then(async (idTokenResult) => {
          const token = {
            token: idTokenResult.token,
            expirationTime: idTokenResult.expirationTime,
          };
          const userDetail = {
            ...storedUser,
            first_name: fName,
            last_name: lName,
          };
          const uploadImageConfig = {
            method: 'get',
            url: `${Config.BASE_URL}/pre-signed-url?count=2`,
            headers: {Authorization: `Bearer ${token?.token}`},
          };
          const entity = {
            auth: {user_id: user.uid},
            uid: user.uid,
            role: 'user',
          };
          await authContext.setTokenData(token);
          if (profilePic) {
            const apiResponse = await apiCall(uploadImageConfig);
            const preSignedUrls = apiResponse?.payload?.preSignedUrls ?? [];
            Promise.all([
              uploadImageOnPreSignedUrls({
                url: preSignedUrls?.[0],
                uri: profilePic.path,
                type: profilePic.path.split('.')[1] || 'jpeg',
              }),
              uploadImageOnPreSignedUrls({
                url: preSignedUrls?.[1],
                uri: profilePic?.path,
                type: profilePic?.path.split('.')[1] || 'jpeg',
              }),
            ])
              .then(async ([fullImage, thumbnail]) => {
                userDetail.full_image = fullImage;
                userDetail.thumbnail = thumbnail;
                await authContext.setEntity({...entity});
                await Utility.setStorage('userInfo', userDetail);
                await Utility.setStorage('loggedInEntity', entity);
              })
              .catch(async () => {
                await authContext.setEntity({...entity});
                await Utility.setStorage('userInfo', userDetail);
                await Utility.setStorage('loggedInEntity', entity);
              });
          } else {
            await authContext.setEntity({...entity});
            await Utility.setStorage('userInfo', userDetail);
            await Utility.setStorage('loggedInEntity', entity);
          }
          setloading(false);
          navigation.replace('AddBirthdayScreen');
        })
        .catch(() => setloading(false));
    }
  };

  const signupUser = async () => {
    setloading(true);
    const user = await firebase.auth().currentUser;
    await saveUserDetails(user);
  };
  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <TCKeyboardView>
        <View style={{marginVertical: 20}}>
          <FastImage
            source={
              profilePic?.path
                ? {uri: profilePic?.path}
                : images.profilePlaceHolder
            }
            style={styles.profile}
          />
          <TouchableOpacity
            style={styles.profileCameraButtonStyle}
            onPress={() => {
              ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                cropperCircleOverlay: true,
              }).then((pickImages) => {
                setProfilePic(pickImages);
              });
            }}>
            <FastImage
              source={images.certificateUpload}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>
        <TCTextField
          placeholderTextColor={colors.darkYellowColor}
          style={styles.textFieldStyle}
          placeholder={strings.fnameText}
          onChangeText={(text) => setFName(text)}
          value={fName}
        />
        <TCTextField
          placeholderTextColor={colors.darkYellowColor}
          style={styles.textFieldStyle}
          placeholder={strings.lnameText}
          onChangeText={(text) => setLName(text)}
          value={lName}
        />

        <TCButton
          title={'CONTINUE'}
          extraStyle={{marginTop: hp('10%')}}
          onPress={() => {
            if (validate()) {
              if (authContext.networkConnected) {
                signupUser(fName, lName, email, password);
              } else {
                authContext.showNetworkAlert();
              }
            }
          }}
        />
      </TCKeyboardView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  profile: {
    alignContent: 'center',
    alignSelf: 'center',
    height: 100,
    marginTop: 40,
    marginBottom: 20,
    width: 100,
    borderRadius: 50,
  },
  textFieldStyle: {
    marginVertical: 5,
    alignSelf: 'center',
    width: wp('85%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -40,
    marginLeft: 60,
    alignSelf: 'center',
  },
  cameraIcon: {
    height: 22,
    width: 22,
  },
});
