import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StackActions} from '@react-navigation/native';

import moment from 'moment';

import {Tooltip} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-date-picker';
import TCButton from '../../components/TCButton';
import * as Utility from '../../utils/index';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {updateUserProfile} from '../../api/Users';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';

export default function AddBirthdayScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  console.log(
    'auth birthday',
    new Date(authContext?.entity?.obj?.birthday * 1000),
  );
  const [dateValue, setDateValue] = useState(
    authContext?.entity?.obj?.birthday
      ? new Date(authContext?.entity?.obj?.birthday * 1000)
      : new Date(),
  );
  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());

  const [loading, setLoading] = useState(false);

  const onChange = (selectedDate) => {
    setDateValue(selectedDate);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            const userParams = {birthday: new Date(dateValue).getTime() / 1000};
            navigateToGenderScreen(userParams);
          }}>
          Next
        </Text>
      ),
    });
  });
  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);
  }, []);
  const navigateToGenderScreen = (userParams) => {
    console.log('route?.params?.signupInfo', route?.params?.signupInfo);
    console.log('userParams', userParams);

    const profileData = {
      ...route?.params?.signupInfo,
      birthday: userParams.birthday,
    };
    console.log('Profile data gender ', profileData);
    navigation.navigate('ChooseGenderScreen', {
      signupInfo: {...profileData},
    });
  };
  const updateProfile = async (params, callback) => {
    setLoading(true);
    updateUserProfile(params, authContext)
      .then(async (userResoponse) => {
        const userData = userResoponse?.payload;
        const entity = {...authContext?.entity};
        entity.auth.user = userData;
        entity.obj = userData;
        await Utility.setStorage('loggedInEntity', {...entity});
        await Utility.setStorage('authContextEntity', {...entity});
        await Utility.setStorage('authContextUser', {...userData});
        await authContext.setUser({...userData});
        await authContext.setEntity({...entity});
        setLoading(false);
        callback();
      })
      .catch(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        <FastImage
          resizeMode={'stretch'}
          style={styles.background}
          source={images.loginBg}
        />

        <Text style={styles.checkEmailText}>{strings.addBirthdayText}</Text>
        <Text style={styles.resetText}>{strings.notDisplayText}</Text>

        <Tooltip
          popover={
            <Text style={{color: colors.themeColor, fontSize: 14}}>
              {strings.birthdatText}
            </Text>
          }
          backgroundColor={colors.parrotColor}
          height={hp('40%')}
          width={wp('75%')}
          overlayColor={'transparent'}
          skipAndroidStatusBar={true}>
          <Text style={styles.whyAskingText}>{strings.whyAskingText}</Text>
        </Tooltip>

        {/* Date.parse(dateValue) */}

        <View style={styles.matchFeeTxt}>
          <Text style={styles.dateText}>
            {moment(dateValue).format('MMM DD, YYYY')}
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <DatePicker
            textColor={colors.whiteColor}
            fadeToColor={'none'}
            mode={'date'}
            maximumDate={minDateValue}
            minimumDate={maxDateValue}
            testID={'startsDateDateTimePicker'}
            style={{marginTop: 15}}
            date={dateValue}
            onDateChange={onChange}
          />
        </View>
      </View>
      <SafeAreaView>
        <View
          style={{
            bottom: 16,
          }}>
          <Text style={styles.birthDateChangeNote}>
            {strings.birthDateChangeNote}
          </Text>
          {/* <TCButton
          title={strings.continueCapTitle}
          onPress={() => {
            const userParams = {birthday: new Date(dateValue).getTime() / 1000};
            updateProfile(userParams, () => {
              navigation.navigate('ChooseGenderScreen');
            });
          }}
          extraStyle={{marginTop: 50}}
        /> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: 20,
    marginTop: wp('25%'),
    textAlign: 'left',
  },
  dateText: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  matchFeeTxt: {
    height: 40,
    width: wp('90%'),
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 30,
    fontSize: wp('3.8%'),
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingLeft: 20,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    elevation: 3,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
  birthDateChangeNote: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'left',
  },
  quitText: {
    height: 25,
    width: 60,
    marginLeft: 20,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
});
